import { Request, Response } from 'express';
import prisma from '../prisma';

export const saveTimetableHistory = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { classId } = req.params;

    // Verify class belongs to user
    const cls = await prisma.class.findFirst({
      where: { id: classId, userId: req.user.userId },
    });

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Get current timetable data
    const timetable = await prisma.timetable.findMany({
      where: { classId },
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
      orderBy: [{ dayId: 'asc' }, { periodId: 'asc' }],
    });

    // Get next version number
    const lastHistory = await prisma.timetableHistory.findFirst({
      where: { classId },
      orderBy: { version: 'desc' },
    });

    const nextVersion = (lastHistory?.version || 0) + 1;

    // Save history
    const history = await prisma.timetableHistory.create({
      data: {
        classId,
        version: nextVersion,
        data: timetable,
        userId: req.user.userId,
      },
      include: {
        class: true,
      },
    });

    res.json(history);
  } catch (error) {
    console.error("Failed to save timetable history:", error);
    res.status(500).json({ message: "Failed to save timetable history" });
  }
};

export const getTimetableHistory = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { classId } = req.params;

    // Verify class belongs to user
    const cls = await prisma.class.findFirst({
      where: { id: classId, userId: req.user.userId },
    });

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    const history = await prisma.timetableHistory.findMany({
      where: { classId },
      orderBy: { version: 'desc' },
      include: {
        class: true,
      },
    });

    res.json(history);
  } catch (error) {
    console.error("Failed to get timetable history:", error);
    res.status(500).json({ message: "Failed to get timetable history" });
  }
};

export const getTimetableHistoryById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    const history = await prisma.timetableHistory.findFirst({
      where: { id, userId: req.user.userId },
      include: {
        class: true,
      },
    });

    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    res.json(history);
  } catch (error) {
    console.error("Failed to get timetable history:", error);
    res.status(500).json({ message: "Failed to get timetable history" });
  }
};

export const compareTimetableHistory = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id1, id2 } = req.params;

    const history1 = await prisma.timetableHistory.findFirst({
      where: { id: id1, userId: req.user.userId },
    });

    const history2 = await prisma.timetableHistory.findFirst({
      where: { id: id2, userId: req.user.userId },
    });

    if (!history1 || !history2) {
      return res.status(404).json({ message: "History not found" });
    }

    if (history1.classId !== history2.classId) {
      return res.status(400).json({ message: "Only versions of the same class can be compared." });
    }

    // Compare the two timetables
    const data1 = history1.data as any[];
    const data2 = history2.data as any[];

    const changes = [];

    // Find added entries
    const added = data2.filter((entry2) => {
      return !data1.find((entry1) => 
        entry1.dayId === entry2.dayId && 
        entry1.periodId === entry2.periodId
      );
    });

    // Find removed entries
    const removed = data1.filter((entry1) => {
      return !data2.find((entry2) => 
        entry1.dayId === entry2.dayId && 
        entry1.periodId === entry2.periodId
      );
    });

    // Find modified entries
    const modified = data1.filter((entry1) => {
      const entry2 = data2.find((e) => 
        e.dayId === entry1.dayId && 
        e.periodId === entry1.periodId
      );
      return entry2 && entry1.teacherSubjectId !== entry2.teacherSubjectId;
    }).map((entry1) => {
      const entry2 = data2.find((e) => 
        e.dayId === entry1.dayId && 
        e.periodId === entry1.periodId
      );
      return {
        dayId: entry1.dayId,
        periodId: entry1.periodId,
        from: entry1.teacherSubject,
        to: entry2?.teacherSubject,
      };
    });

    res.json({
      history1: {
        id: history1.id,
        version: history1.version,
        generatedAt: history1.generatedAt,
      },
      history2: {
        id: history2.id,
        version: history2.version,
        generatedAt: history2.generatedAt,
      },
      changes: {
        added,
        removed,
        modified,
      },
    });
  } catch (error) {
    console.error("Failed to compare timetable history:", error);
    res.status(500).json({ message: "Failed to compare timetable history" });
  }
};
