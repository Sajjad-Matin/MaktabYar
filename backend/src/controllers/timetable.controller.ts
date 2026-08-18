import { Request, Response } from "express";
import {
  createTimetableEntry,
  deleteTimetableEntry,
  generateTimetableForAllClasses,
  moveTimetableEntry,
} from "../services/timetable.service";
import prisma from "../prisma";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

export const generateTimetable = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const now = new Date();
    if (
      user.role !== "ADMIN" &&
      user.packageExpiresAt &&
      user.packageExpiresAt < now
    ) {
      return res.status(402).json({
        message:
          "Your package has expired. Please activate a package to generate a timetable.",
      });
    }

    // -1 is the internal representation of unlimited generations.
    if (user.role !== "ADMIN" && user.remainingGenerations !== -1) {
      const consumed = await prisma.user.updateMany({
        where: {
          id: user.id,
          remainingGenerations: { gt: 0 },
        },
        data: {
          remainingGenerations: { decrement: 1 },
        },
      });

      if (consumed.count !== 1) {
        return res.status(402).json({
          message:
            "You have no remaining timetable generations. Please activate a package.",
        });
      }
    }

    let result;
    try {
      result = await generateTimetableForAllClasses(req.user.userId);
    } catch (generationError) {
      if (user.role !== "ADMIN" && user.remainingGenerations !== -1) {
        await prisma.user.update({
          where: { id: user.id },
          data: { remainingGenerations: { increment: 1 } },
        });
      }
      throw generationError;
    }

    // Save history for each class
    const classes = await prisma.class.findMany({
      where: { userId: req.user.userId },
    });

    for (const cls of classes) {
      const timetable = await prisma.timetable.findMany({
        where: { classId: cls.id },
        include: {
          class: true,
          day: true,
          period: true,
          teacherSubject: {
            include: {
              teacher: true,
              subject: true,
            },
          },
        },
        orderBy: [{ dayId: "asc" }, { periodId: "asc" }],
      });

      const lastHistory = await prisma.timetableHistory.findFirst({
        where: { classId: cls.id, userId: req.user.userId },
        orderBy: { version: "desc" },
      });

      const nextVersion = (lastHistory?.version || 0) + 1;

      await prisma.timetableHistory.create({
        data: {
          classId: cls.id,
          version: nextVersion,
          data: timetable,
          userId: req.user.userId,
        },
      });
    }

    res.status(201).json({
      message:
        result.unscheduled === 0
          ? "Timetable generated successfully."
          : "Timetable generated with some unscheduled lessons.",
      ...result,
      remainingGenerations:
        user.role === "ADMIN" || user.remainingGenerations === -1
          ? -1
          : Math.max(0, user.remainingGenerations - 1),
    });
  } catch (error: any) {
    console.error("Timetable generation error:", error);

    res.status(400).json({
      message: error?.message || "Failed to generate timetable",
    });
  }
};

export const getTimetable = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { classId } = req.query;

    // If classId is provided, verify it belongs to user
    if (classId) {
      const cls = await prisma.class.findFirst({
        where: { id: String(classId), userId: req.user.userId },
      });

      if (!cls) {
        return res.status(404).json({ message: "Class not found" });
      }
    }

    const timetable = await prisma.timetable.findMany({
      where: {
        ...(classId ? { classId: String(classId) } : {}),
        class: { userId: req.user.userId },
      },
      include: {
        class: true,
        day: true,
        period: true,
        teacherSubject: {
          include: {
            teacher: true,
            subject: true,
          },
        },
      },
      orderBy: [{ classId: "asc" }, { dayId: "asc" }, { periodId: "asc" }],
    });

    res.json(timetable);
  } catch (error) {
    console.error("Failed to fetch timetable:", error);
    res.status(500).json({ message: "Failed to fetch timetable" });
  }
};

export const createEntry = async (req: Request, res: Response) => {
  try {
    const { classId, teacherId, subjectId, dayId, periodId } = req.body;

    if (
      !classId ||
      !teacherId ||
      !subjectId ||
      !dayId ||
      periodId === undefined
    ) {
      return res.status(400).json({
        message:
          "classId, teacherId, subjectId, dayId and periodId are required.",
      });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const entry = await createTimetableEntry({
      classId,
      teacherId,
      subjectId,
      dayId,
      periodId: Number(periodId),
      userId: req.user.userId,
    });

    res.status(201).json(entry);
  } catch (error: any) {
    console.error("Create timetable entry error:", error);
    res.status(400).json({
      message: error?.message || "Failed to create timetable entry",
    });
  }
};

export const deleteEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Entry ID is required." });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify entry belongs to user
    const entry = await prisma.timetable.findFirst({
      where: { id },
      include: { class: true },
    });

    if (!entry || entry.class.userId !== req.user.userId) {
      return res.status(404).json({ message: "Entry not found" });
    }

    await deleteTimetableEntry(id, req.user.userId);
    res.json({ message: "Timetable entry deleted." });
  } catch (error: any) {
    console.error("Delete timetable entry error:", error);
    res.status(404).json({
      message: error?.message || "Timetable entry not found",
    });
  }
};

export const moveEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { dayId, periodId } = req.body;

    if (!id || !dayId || periodId === undefined) {
      return res.status(400).json({
        message: "Entry ID, dayId and periodId are required.",
      });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await moveTimetableEntry({
      entryId: id,
      dayId: String(dayId),
      periodId: Number(periodId),
      userId: req.user.userId,
    });

    return res.json(result);
  } catch (error: any) {
    console.error("Move timetable entry error:", error);

    return res.status(400).json({
      message: error?.message || "Unable to move timetable entry.",
    });
  }
};

export const exportTimetable = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const exportFormat = String(req.query.format || "xlsx").toLowerCase();
    const rawView = Array.isArray(req.query.view)
      ? req.query.view[0]
      : req.query.view;
    const view = String(rawView || "class").toLowerCase();

    // Exports intentionally contain the COMPLETE timetable for the account.
    // The selected class in the UI never limits a downloaded export.
    const timetable = await prisma.timetable.findMany({
      where: { class: { userId: req.user.userId } },
      include: {
        class: true,
        day: true,
        period: true,
        teacherSubject: {
          include: {
            teacher: true,
            subject: true,
          },
        },
      },
      orderBy: [
        { class: { name: "asc" } },
        { day: { name: "asc" } },
        { period: { number: "asc" } },
      ],
    });

    const days = await prisma.day.findMany({
      where: { userId: req.user.userId },
      orderBy: { name: "asc" },
    });

    const periods = await prisma.period.findMany({
      where: { userId: req.user.userId },
      orderBy: { number: "asc" },
    });

    const classes = await prisma.class.findMany({
      where: { userId: req.user.userId },
      orderBy: { name: "asc" },
    });

    if (view === "teacher") {
      const teachers = await prisma.teacher.findMany({
        where: { userId: req.user.userId },
        orderBy: { name: "asc" },
      });
      if (exportFormat === "pdf") {
        await exportTeacherTimetableToPDF(
          timetable,
          teachers,
          days,
          periods,
          res,
        );
      } else {
        await exportTeacherTimetableToExcel(
          timetable,
          teachers,
          days,
          periods,
          res,
        );
      }
      return;
    }

    if (exportFormat === "pdf") {
      await exportToPDF(timetable, classes, days, periods, res);
    } else {
      await exportToExcel(timetable, classes, days, periods, res);
    }
  } catch (error: any) {
    console.error("Failed to export timetable:", error);
    if (error?.stack) {
      console.error(error.stack);
    }
    res.status(500).json({ message: "Failed to export timetable" });
  }
};

const TEACHER_COLORS = [
  { bg: "FFF3F4F6", text: "FF334155", border: "FFE5E7EB" },
  { bg: "FFE0F2FE", text: "FF0369A1", border: "FF7DD3FC" },
  { bg: "FFDCFCE7", text: "FF166534", border: "FF86EFAC" },
  { bg: "FFFEF3C7", text: "FF92400E", border: "FFFCD34D" },
  { bg: "FFFCE7F3", text: "FF9D174D", border: "FFF9A8D4" },
  { bg: "FFEDE9FE", text: "FF5B21B6", border: "FFC4B5FD" },
  { bg: "FFCFFAFE", text: "FF155E75", border: "FF67E8F9" },
  { bg: "FFFEE2E2", text: "FF991B1B", border: "FFFCA5A5" },
];

function createTeacherColorMap(timetable: any[]) {
  const names = [
    ...new Set(
      timetable
        .map((entry) =>
          String(entry.teacherSubject?.teacher?.name || "")
            .trim()
            .toLowerCase(),
        )
        .filter(Boolean),
    ),
  ];

  const map = new Map<string, (typeof TEACHER_COLORS)[number]>();
  names.forEach((name, index) =>
    map.set(name, TEACHER_COLORS[index % TEACHER_COLORS.length]),
  );
  return map;
}

function getSheetName(name: string, used: Set<string>) {
  const base =
    (name || "Class").replace(/[\\/*?:[\]]/g, " ").slice(0, 31) || "Class";
  let result = base;
  let i = 2;
  while (used.has(result)) {
    const suffix = ` (${i++})`;
    result = `${base.slice(0, 31 - suffix.length)}${suffix}`;
  }
  used.add(result);
  return result;
}

async function exportTeacherTimetableToExcel(
  timetable: any[],
  teachers: any[],
  days: any[],
  periods: any[],
  res: Response,
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "TimeTable Generator";
  const usedSheets = new Set<string>();

  for (const teacher of teachers) {
    const worksheet = workbook.addWorksheet(
      getSheetName(teacher.name, usedSheets),
    );
    const entries = timetable.filter(
      (entry) => entry.teacherSubject?.teacher?.id === teacher.id,
    );
    worksheet.columns = [
      { header: "Time / Day", key: "period", width: 18 },
      ...days.map((day) => ({ header: day.name, key: day.id, width: 24 })),
    ];
    const header = worksheet.getRow(1);
    header.height = 32;
    header.font = { bold: true, size: 10, color: { argb: "FF334155" } };
    header.alignment = { horizontal: "center", vertical: "middle" };
    header.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF3F4F6" },
    };

    for (const period of periods) {
      const row = worksheet.addRow({ period: `Period ${period.number}` });
      row.height = 52;
      const periodCell = row.getCell(1);
      periodCell.font = { bold: true, size: 10, color: { argb: "FF64748B" } };
      periodCell.alignment = { horizontal: "center", vertical: "middle" };
      periodCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF3F4F6" },
      };

      days.forEach((day, index) => {
        const entry = entries.find(
          (item) => item.dayId === day.id && item.periodId === period.id,
        );
        const cell = row.getCell(index + 2);
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFE5E7EB" } },
          left: { style: "thin", color: { argb: "FFE5E7EB" } },
          bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
          right: { style: "thin", color: { argb: "FFE5E7EB" } },
        };
        cell.value = entry
          ? `${entry.teacherSubject?.subject?.name || ""}\n${entry.class?.name || ""}`
          : "";
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: entry ? "FFE0F2FE" : "FFFFFFFF" },
        };
        cell.font = {
          size: 10,
          color: { argb: entry ? "FF0369A1" : "FF334155" },
        };
      });
    }
    header.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });
    worksheet.views = [{ showGridLines: false }];
    worksheet.pageSetup.orientation = "landscape";
    worksheet.pageSetup.fitToPage = true;
    worksheet.pageSetup.fitToWidth = 1;
    worksheet.pageSetup.fitToHeight = 1;
    worksheet.pageSetup.paperSize = worksheet.PAPERSIZE_A4;
    worksheet.headerFooter.oddHeader = `&C&B${teacher.name} — Teacher Timetable`;
  }

  if (teachers.length === 0)
    workbook.addWorksheet("Timetables").addRow(["No teachers found"]);
  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=teacher-timetables-${Date.now()}.xlsx`,
  );
  res.send(buffer);
}

async function exportTeacherTimetableToPDF(
  timetable: any[],
  teachers: any[],
  days: any[],
  periods: any[],
  res: Response,
) {
  const doc = new PDFDocument({
    margin: 32,
    size: "A4",
    layout: "landscape",
    autoFirstPage: false,
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=teacher-timetables-${Date.now()}.pdf`,
    );
    res.send(Buffer.concat(chunks));
  });

  for (const teacher of teachers) {
    doc.addPage();
    const entries = timetable.filter(
      (entry) => entry.teacherSubject?.teacher?.id === teacher.id,
    );
    const left = 32;
    const top = 34;
    const width = doc.page.width - 64;
    const cols = days.length + 1;
    const colWidth = width / Math.max(cols, 1);
    const rowHeight = Math.min(
      44,
      (doc.page.height - 90) / Math.max(periods.length + 1, 1),
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("#334155")
      .text(teacher.name, left, 14, { width, align: "center" });

    const drawCell = (
      x: number,
      y: number,
      w: number,
      h: number,
      bg: string,
      border = "#E5E7EB",
    ) => {
      doc.save().roundedRect(x, y, w, h, 6).fillAndStroke(bg, border).restore();
    };

    drawCell(left, top, colWidth, rowHeight, "#F3F4F6");
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor("#64748B")
      .text("Time / Day", left + 4, top + rowHeight / 2 - 5, {
        width: colWidth - 8,
        align: "center",
      });

    days.forEach((day, index) => {
      const x = left + (index + 1) * colWidth;
      drawCell(x, top, colWidth, rowHeight, "#F3F4F6");
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#334155")
        .text(day.name, x + 4, top + rowHeight / 2 - 5, {
          width: colWidth - 8,
          align: "center",
        });
    });

    periods.forEach((period, rowIndex) => {
      const y = top + (rowIndex + 1) * rowHeight;
      drawCell(left, y, colWidth, rowHeight, "#F3F4F6");
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#64748B")
        .text(`Period ${period.number}`, left + 4, y + rowHeight / 2 - 5, {
          width: colWidth - 8,
          align: "center",
        });

      days.forEach((day, colIndex) => {
        const x = left + (colIndex + 1) * colWidth;
        const entry = entries.find(
          (item) => item.dayId === day.id && item.periodId === period.id,
        );

        if (!entry) {
          drawCell(x, y, colWidth, rowHeight, "#FFFFFF");
          doc
            .font("Helvetica")
            .fontSize(7)
            .fillColor("#94A3B8")
            .text("Free", x + 4, y + rowHeight / 2 - 4, {
              width: colWidth - 8,
              align: "center",
            });
          return;
        }

        const subject = String(entry.teacherSubject?.subject?.name || "");
        const className = String(entry.class?.name || "");
        drawCell(x, y, colWidth, rowHeight, "#E0F2FE");
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor("#0369A1")
          .text(subject, x + 4, y + 7, {
            width: colWidth - 8,
            align: "center",
            height: rowHeight - 14,
          });
        doc
          .font("Helvetica")
          .fontSize(7)
          .fillColor("#0369A1")
          .text(className, x + 4, y + rowHeight / 2 + 3, {
            width: colWidth - 8,
            align: "center",
            height: rowHeight / 2 - 5,
          });
      });
    });
  }

  doc.end();
}

async function exportToExcel(
  timetable: any[],
  classes: any[],
  days: any[],
  periods: any[],
  res: Response,
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "TimeTable Generator";
  const usedSheets = new Set<string>();

  for (const cls of classes) {
    const worksheet = workbook.addWorksheet(getSheetName(cls.name, usedSheets));
    const classEntries = timetable.filter((entry) => entry.classId === cls.id);
    const teacherColors = createTeacherColorMap(classEntries);

    worksheet.columns = [
      { header: "Time / Day", key: "period", width: 18 },
      ...days.map((day) => ({ header: day.name, key: day.id, width: 24 })),
    ];

    const header = worksheet.getRow(1);
    header.height = 32;
    header.font = { bold: true, size: 10, color: { argb: "FF334155" } };
    header.alignment = { horizontal: "center", vertical: "middle" };
    header.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF3F4F6" },
    };

    for (const period of periods) {
      const row = worksheet.addRow({ period: `Period ${period.number}` });
      row.height = 52;

      const periodCell = row.getCell(1);
      periodCell.font = { bold: true, size: 10, color: { argb: "FF64748B" } };
      periodCell.alignment = { horizontal: "center", vertical: "middle" };
      periodCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF3F4F6" },
      };

      days.forEach((day, index) => {
        const entry = classEntries.find(
          (item) => item.dayId === day.id && item.periodId === period.id,
        );
        const cell = row.getCell(index + 2);
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFE5E7EB" } },
          left: { style: "thin", color: { argb: "FFE5E7EB" } },
          bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
          right: { style: "thin", color: { argb: "FFE5E7EB" } },
        };

        if (entry) {
          const teacher = String(entry.teacherSubject?.teacher?.name || "");
          const subject = String(entry.teacherSubject?.subject?.name || "");
          const color =
            teacherColors.get(teacher.trim().toLowerCase()) ||
            TEACHER_COLORS[0];
          cell.value = `${subject}\n${teacher}`;
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: color.bg },
          };
          cell.font = { size: 10, color: { argb: color.text } };
        } else {
          cell.value = "";
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFFFF" },
          };
        }
      });
    }

    header.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });

    worksheet.views = [{ showGridLines: false }];
    worksheet.pageSetup.orientation = "landscape";
    worksheet.pageSetup.fitToPage = true;
    worksheet.pageSetup.fitToWidth = 1;
    worksheet.pageSetup.fitToHeight = 1;
    worksheet.pageSetup.paperSize = worksheet.PAPERSIZE_A4;
    worksheet.headerFooter.oddHeader = `&C&B${cls.name} — TimeTable`;
  }

  if (classes.length === 0) {
    workbook.addWorksheet("Timetable").addRow(["No classes found"]);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=timetable-all-${Date.now()}.xlsx`,
  );
  res.send(buffer);
}

async function exportToPDF(
  timetable: any[],
  classes: any[],
  days: any[],
  periods: any[],
  res: Response,
) {
  const doc = new PDFDocument({
    margin: 32,
    size: "A4",
    layout: "landscape",
    autoFirstPage: false,
  });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=timetable-all-${Date.now()}.pdf`,
    );
    res.send(Buffer.concat(chunks));
  });

  for (const cls of classes) {
    doc.addPage();
    const classEntries = timetable.filter((entry) => entry.classId === cls.id);
    const teacherColors = createTeacherColorMap(classEntries);
    const left = 32;
    const top = 34;
    const width = doc.page.width - 64;
    const cols = days.length + 1;
    const colWidth = width / Math.max(cols, 1);
    const rowHeight = Math.min(
      44,
      (doc.page.height - 90) / Math.max(periods.length + 1, 1),
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("#334155")
      .text(cls.name, left, 14, { width, align: "center" });

    const drawCell = (
      x: number,
      y: number,
      w: number,
      h: number,
      bg: string,
      border = "#E5E7EB",
    ) => {
      doc.save().roundedRect(x, y, w, h, 6).fillAndStroke(bg, border).restore();
    };

    drawCell(left, top, colWidth, rowHeight, "#F3F4F6");
    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor("#64748B")
      .text("Time / Day", left + 4, top + rowHeight / 2 - 5, {
        width: colWidth - 8,
        align: "center",
      });

    days.forEach((day, i) => {
      const x = left + (i + 1) * colWidth;
      drawCell(x, top, colWidth, rowHeight, "#F3F4F6");
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#334155")
        .text(day.name, x + 4, top + rowHeight / 2 - 5, {
          width: colWidth - 8,
          align: "center",
        });
    });

    periods.forEach((period, rowIndex) => {
      const y = top + (rowIndex + 1) * rowHeight;
      drawCell(left, y, colWidth, rowHeight, "#F3F4F6");
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#64748B")
        .text(`Period ${period.number}`, left + 4, y + rowHeight / 2 - 5, {
          width: colWidth - 8,
          align: "center",
        });

      days.forEach((day, colIndex) => {
        const x = left + (colIndex + 1) * colWidth;
        const entry = classEntries.find(
          (item) => item.dayId === day.id && item.periodId === period.id,
        );

        if (!entry) {
          drawCell(x, y, colWidth, rowHeight, "#FFFFFF");
          doc
            .font("Helvetica")
            .fontSize(7)
            .fillColor("#94A3B8")
            .text("Free", x + 4, y + rowHeight / 2 - 4, {
              width: colWidth - 8,
              align: "center",
            });
          return;
        }

        const teacher = String(entry.teacherSubject?.teacher?.name || "");
        const subject = String(entry.teacherSubject?.subject?.name || "");
        const color =
          teacherColors.get(teacher.trim().toLowerCase()) || TEACHER_COLORS[0];
        const bg = `#${color.bg.slice(2)}`;
        const text = `#${color.text.slice(2)}`;

        drawCell(x, y, colWidth, rowHeight, bg);
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(text)
          .text(subject, x + 4, y + 7, {
            width: colWidth - 8,
            align: "center",
            height: rowHeight - 14,
          });
        doc
          .font("Helvetica")
          .fontSize(7)
          .fillColor(text)
          .text(teacher, x + 4, y + rowHeight / 2 + 3, {
            width: colWidth - 8,
            align: "center",
            height: rowHeight / 2 - 5,
          });
      });
    });
  }

  if (classes.length === 0) doc.addPage();
  doc.end();
}
