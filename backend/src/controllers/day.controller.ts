import { Request, Response } from "express";
import prisma from "../prisma";

export const createDay = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Day name is required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const exists = await prisma.day.findUnique({
      where: { name_userId: { name, userId: req.user.userId } },
    });

    if (exists) {
      return res.status(400).json({ message: "Day already exists" });
    }

    const day = await prisma.day.create({
      data: { name, userId: req.user.userId },
    });

    res.status(201).json(day);
  } catch (error) {
    res.status(500).json({ message: "Failed to create day" });
  }
};

export const getDays = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const days = await prisma.day.findMany({
    where: { userId: req.user.userId },
    orderBy: { name: "asc" },
  });

  res.json(days);
};

export const deleteDay = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existing = await prisma.day.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Day not found" });
    }

    await prisma.day.delete({ where: { id } });
    res.json({ message: "Day deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete day" });
  }
};
