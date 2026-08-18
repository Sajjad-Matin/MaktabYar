import { Request, Response } from "express";
import prisma from "../prisma";

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const teacher = await prisma.teacher.create({
      data: {
        name,
        userId: req.user.userId,
      },
    });
    res.status(201).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create teacher" });
  }
};

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const teachers = await prisma.teacher.findMany({
      where: { userId: req.user.userId },
      include: {
        subjects: {
          include: {
            subject: true,
            classes: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get teachers" });
  }
};

export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const teacher = await prisma.teacher.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
      include: {
        subjects: {
          include: {
            subject: true,
            classes: {
              include: {
                class: true,
              },
            },
          },
        },
      },
    });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get teacher" });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existing = await prisma.teacher.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const teacher = await prisma.teacher.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update teacher" });
  }
};

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existing = await prisma.teacher.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const teacher = await prisma.teacher.delete({
      where: {
        id,
      },
    });
    res.status(200).json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete teacher" });
  }
};

export const deleteAllTeachers = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const teachers = await prisma.teacher.deleteMany({
      where: { userId: req.user.userId },
    });
    res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete teachers" });
  }
};
