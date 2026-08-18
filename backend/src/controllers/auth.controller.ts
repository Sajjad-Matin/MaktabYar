import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma";
import { generateToken } from "../utils/jwt";

const publicUser = (user: any) => ({
  id: user.id,
  email: user.email,
  schoolName: user.schoolName,
  phone: user.phone,
  plan: user.plan,
  role: user.role,
  packageName: user.packageName,
  generationLimit: user.generationLimit,
  remainingGenerations: user.remainingGenerations,
  packageActivatedAt: user.packageActivatedAt,
  packageExpiresAt: user.packageExpiresAt,
});

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, schoolName, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        schoolName: schoolName || name || null,
        phone: phone || null,
        plan: "BASIC",
        packageName: "Trial",
        generationLimit: 1,
        remainingGenerations: 1,
        packageActivatedAt: new Date(),
        packageExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({ user: publicUser(user), token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({ user: publicUser(user), token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Keep the account state fresh in the UI.
    if (
      user.role !== "ADMIN" &&
      user.packageExpiresAt &&
      user.packageExpiresAt < new Date() &&
      user.remainingGenerations !== 0
    ) {
      await prisma.user.update({
        where: { id: user.id },
        data: { remainingGenerations: 0 },
      });
      user.remainingGenerations = 0;
    }

    res.json(publicUser(user));
  } catch (error) {
    console.error("Me error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
