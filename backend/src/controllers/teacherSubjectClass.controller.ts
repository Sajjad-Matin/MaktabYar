import { Request, Response } from "express";
import prisma from "../prisma";

export const assignTeacherSubjectToClass = async (
  req: Request,
  res: Response
) => {
  try {
    const { teacherSubjectId, classId, classIds } = req.body;

    if (!teacherSubjectId) {
      return res
        .status(400)
        .json({ message: "Teacher Subject ID is required!" });
    }

    if (!classId && (!classIds || classIds.length === 0)) {
      return res.status(400).json({ message: "Class ID(s) are required!" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify teacherSubject belongs to user
    const teacherSubject = await prisma.teacherSubject.findFirst({
      where: { id: teacherSubjectId },
      include: { teacher: true },
    });

    if (!teacherSubject || teacherSubject.teacher.userId !== req.user.userId) {
      return res.status(404).json({ message: "Teacher subject not found" });
    }

    // Normalize to array
    const targets: string[] =
      classIds || (classId === "all" ? ["all"] : [classId]);

    if (targets.includes("all")) {
      const classes = await prisma.class.findMany({
        where: { userId: req.user.userId },
      });
      let createdCount = 0;

      for (const cls of classes) {
        const exists = await prisma.teacherSubjectClass.findFirst({
          where: {
            teacherSubjectId,
            classId: cls.id,
          },
        });

        if (!exists) {
          await prisma.teacherSubjectClass.create({
            data: {
              teacherSubjectId,
              classId: cls.id,
            },
          });
          createdCount++;
        }
      }
      return res
        .status(201)
        .json({ message: `Assigned to ${createdCount} classes.` });
    }

    let createdCount = 0;
    for (const id of targets) {
      // Verify class belongs to user
      const cls = await prisma.class.findFirst({
        where: { id, userId: req.user.userId },
      });

      if (!cls) {
        continue;
      }

      const exists = await prisma.teacherSubjectClass.findFirst({
        where: {
          teacherSubjectId,
          classId: id,
        },
      });

      if (!exists) {
        await prisma.teacherSubjectClass.create({
          data: {
            teacherSubjectId,
            classId: id,
          },
        });
        createdCount++;
      }
    }

    res.status(201).json({ message: `Assigned to ${createdCount} classes.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to assign subject to class" });
  }
};

export const getClassesByTeacherSubject = async (
  req: Request,
  res: Response
) => {
  try {
    const { teacherSubjectId } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify teacherSubject belongs to user
    const teacherSubject = await prisma.teacherSubject.findFirst({
      where: { id: teacherSubjectId },
      include: { teacher: true },
    });

    if (!teacherSubject || teacherSubject.teacher.userId !== req.user.userId) {
      return res.status(404).json({ message: "Teacher subject not found" });
    }

    const data = await prisma.teacherSubjectClass.findMany({
      where: { teacherSubjectId },
      include: {
        class: true,
        teacherSubject: {
          include: {
            teacher: true,
            subject: true,
          },
        },
      },
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeTeacherSubjectFromClass = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the assignment belongs to user
    const assignment = await prisma.teacherSubjectClass.findFirst({
      where: { id },
      include: {
        teacherSubject: { include: { teacher: true } },
        class: true,
      },
    });

    if (!assignment || assignment.teacherSubject.teacher.userId !== req.user.userId) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    await prisma.teacherSubjectClass.delete({
      where: { id },
    });

    res.json({ message: "Assignment removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mesage: "Internal Server Error" });
  }
};

export const getAllTeacherSubjectClasses = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = await prisma.teacherSubjectClass.findMany({
      where: {
        teacherSubject: {
          teacher: { userId: req.user.userId },
        },
      },
      include: {
        class: true,
        teacherSubject: {
          include: {
            teacher: true,
            subject: true,
          },
        },
      },
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAllTeacherSubjectClasses = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await prisma.teacherSubjectClass.deleteMany({
      where: {
        teacherSubject: {
          teacher: { userId: req.user.userId },
        },
      },
    });
    res.json({ message: "All class assignments deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
