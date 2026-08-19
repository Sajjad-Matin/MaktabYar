import { Request, Response } from "express";
import prisma from "../prisma";

export const createPeriod = async (req: Request, res: Response) => {
  try {
    const { number } = req.body;

    if (!number) {
      return res.status(400).json({ message: "Period number is required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const exists = await prisma.period.findUnique({
      where: {
        number_userId: {
          number,
          userId: req.user.userId,
        },
      },
    });

    if (exists) {
      return res.status(400).json({ message: "Period already exists" });
    }

    const period = await prisma.period.create({
      data: {
        number,
        userId: req.user.userId,
      },
    });

    res.status(201).json(period);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create period",
      error,
    });
  }
};

export const getPeriods = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const periods = await prisma.period.findMany({
    where: { userId: req.user.userId },
    orderBy: { number: "asc" },
  });

  res.json(periods);
};

export const deletePeriod = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existing = await prisma.period.findFirst({
      where: { id: Number(id), userId: req.user.userId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Period not found" });
    }

    await prisma.period.delete({ where: { id: Number(id) } });
    res.json({ message: "Period deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete period" });
  }
};
