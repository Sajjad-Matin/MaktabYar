import { Request, Response } from "express";
import prisma from "../prisma";

const getWhatsAppNumber = () => (process.env.WHATSAPP_NUMBER || "93764040363").replace(/\D/g, "");

export const getPackages = async (_req: Request, res: Response) => {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { price: "asc" },
    });
    res.json(packages);
  } catch (error) {
    console.error("Get packages error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPurchaseRequest = async (req: Request, res: Response) => {
  try {
    const { packageId, schoolName, phone, paymentMethod } = req.body;

    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    const userId = req.user?.userId || null;

    const purchaseRequest = await prisma.purchaseRequest.create({
      data: {
        userId,
        packageId: pkg.id,
        packageName: pkg.name,
        price: pkg.price,
        schoolName: schoolName || undefined,
        phone: phone || undefined,
        paymentMethod: paymentMethod || undefined,
      },
    });

    // WhatsApp opens in the user's account with this exact message pre-filled.
    // WhatsApp does not allow a website to silently press Send on the user's behalf.
    const text = `سلام و علیکم. وقت بخیر. درخواست فعال سازی ${pkg.name} را دارم`;
    const whatsappUrl = `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(text)}`;

    res.status(201).json({
      request: purchaseRequest,
      whatsappUrl,
      whatsappMessage: text,
    });
  } catch (error) {
    console.error("Create purchase request error:", error);
    res.status(500).json({ message: "Failed to create purchase request" });
  }
};

export const getMyPurchaseRequests = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const requests = await prisma.purchaseRequest.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
      include: { package: true },
    });
    res.json(requests);
  } catch (error) {
    console.error("Get purchase requests error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
