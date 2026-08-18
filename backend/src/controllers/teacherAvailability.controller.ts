import { Request, Response } from "express";
import prisma from "../prisma";

export const setTeacherAvailability = async (req: Request, res: Response) => {
  try {
    const { teacherId, dayId, periodId, isAvailable } = req.body;

    if (!teacherId || !dayId || !periodId || isAvailable === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify teacher belongs to user
    const teacher = await prisma.teacher.findFirst({
      where: { id: teacherId, userId: req.user.userId },
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Verify day belongs to user
    const day = await prisma.day.findFirst({
      where: { id: dayId, userId: req.user.userId },
    });

    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }

    // Verify period belongs to user
    const period = await prisma.period.findFirst({
      where: { id: periodId, userId: req.user.userId },
    });

    if (!period) {
      return res.status(404).json({ message: "Period not found" });
    }

    const availability = await prisma.teacherAvailability.upsert({
      where: {
        teacherId_dayId_periodId: {
          teacherId,
          dayId,
          periodId,
        },
      },
      update: {
        isAvailable: isAvailable ?? true,
      },
      create: {
        teacherId,
        dayId,
        periodId,
        isAvailable: isAvailable ?? true,
      },
    });

    res.status(201).json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to set teacher availability",
    });
  }
};

export const getTeacherAvailability = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({ message: "teacherId is required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify teacher belongs to user
    const teacher = await prisma.teacher.findFirst({
      where: { id: teacherId, userId: req.user.userId },
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const availability = await prisma.teacherAvailability.findMany({
      where: { teacherId },
      include: {
        day: true,
        period: true,
      },
      orderBy: [{ dayId: "asc" }, { periodId: "asc" }],
    });

    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to get teacher availability",
    });
  }
};
