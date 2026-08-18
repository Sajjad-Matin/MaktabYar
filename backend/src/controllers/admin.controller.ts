import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma";

const planForPackage = (name: string) => {
  const normalized = name.trim().toUpperCase();
  if (normalized === "A3" || normalized === "PREMIUM") return "PREMIUM" as const;
  if (normalized === "A2" || normalized === "STANDARD") return "STANDARD" as const;
  return "BASIC" as const;
};

export const getAdminOverview = async (_req: Request, res: Response) => {
  try {
    const [users, pendingRequests, packages] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          schoolName: true,
          phone: true,
          role: true,
          plan: true,
          packageName: true,
          generationLimit: true,
          remainingGenerations: true,
          packageActivatedAt: true,
          packageExpiresAt: true,
          createdAt: true,
        },
      }),
      prisma.purchaseRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, schoolName: true, phone: true } }, package: true },
      }),
      prisma.package.findMany({ orderBy: { price: "asc" } }),
    ]);

    res.json({ users, purchaseRequests: pendingRequests, packages });
  } catch (error) {
    console.error("Admin overview error:", error);
    res.status(500).json({ message: "Failed to load administrator data" });
  }
};

export const createUserWithPackage = async (req: Request, res: Response) => {
  try {
    const { email, password, schoolName, phone, packageId } = req.body;

    if (!email || !password || !packageId) {
      return res.status(400).json({ message: "Email, password and package are required" });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const [existing, pkg] = await Promise.all([
      prisma.user.findUnique({ where: { email: normalizedEmail } }),
      prisma.package.findUnique({ where: { id: packageId } }),
    ]);
    if (existing) return res.status(409).json({ message: "A user with this email already exists" });
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const passwordHash = await bcrypt.hash(String(password), 12);
    const now = new Date();
    const expires = pkg.unlimited ? null : new Date(now.getTime() + pkg.validityDays * 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: passwordHash,
        schoolName: schoolName ? String(schoolName).trim() : null,
        phone: phone ? String(phone).trim() : null,
        plan: planForPackage(pkg.name),
        packageName: pkg.name,
        generationLimit: pkg.unlimited ? -1 : pkg.generations,
        remainingGenerations: pkg.unlimited ? -1 : pkg.generations,
        packageActivatedAt: now,
        packageExpiresAt: expires,
      },
      select: {
        id: true, email: true, schoolName: true, phone: true, role: true,
        packageName: true, generationLimit: true, remainingGenerations: true,
        packageActivatedAt: true, packageExpiresAt: true,
      },
    });

    res.status(201).json({ message: `${pkg.name} user created and activated successfully`, user });
  } catch (error) {
    console.error("Create admin user error:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const activatePackage = async (req: Request, res: Response) => {
  try {
    const { userId, packageId, purchaseRequestId } = req.body;

    if (!userId || !packageId) {
      return res.status(400).json({ message: "userId and packageId are required" });
    }

    const [user, pkg] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.package.findUnique({ where: { id: packageId } }),
    ]);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const now = new Date();
    const expires = pkg.unlimited
      ? null
      : new Date(now.getTime() + pkg.validityDays * 24 * 60 * 60 * 1000);

    const updated = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          plan: planForPackage(pkg.name),
          packageName: pkg.name,
          generationLimit: pkg.unlimited ? -1 : pkg.generations,
          remainingGenerations: pkg.unlimited ? -1 : pkg.generations,
          packageActivatedAt: now,
          packageExpiresAt: expires,
        },
        select: {
          id: true,
          email: true,
          schoolName: true,
          plan: true,
          packageName: true,
          generationLimit: true,
          remainingGenerations: true,
          packageActivatedAt: true,
          packageExpiresAt: true,
        },
      });

      if (purchaseRequestId) {
        await tx.purchaseRequest.update({
          where: { id: purchaseRequestId },
          data: { status: "COMPLETED" },
        });
      }

      return updatedUser;
    });

    res.json({ message: `${pkg.name} activated successfully`, user: updated });
  } catch (error) {
    console.error("Activate package error:", error);
    res.status(500).json({ message: "Failed to activate package" });
  }
};

export const cancelPurchaseRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = await prisma.purchaseRequest.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
    res.json(request);
  } catch (error) {
    console.error("Cancel purchase request error:", error);
    res.status(500).json({ message: "Failed to cancel purchase request" });
  }
};

export const updateUserCredits = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const remainingGenerations = Number(req.body.remainingGenerations);

    if (!Number.isInteger(remainingGenerations) || remainingGenerations < -1) {
      return res.status(400).json({ message: "remainingGenerations must be an integer >= -1" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { remainingGenerations },
      select: {
        id: true,
        email: true,
        packageName: true,
        generationLimit: true,
        remainingGenerations: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Update credits error:", error);
    res.status(500).json({ message: "Failed to update user credits" });
  }
};
