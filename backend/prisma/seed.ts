import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const seedDataPath = __dirname;

function loadJson<T>(filename: string): T {
  return JSON.parse(fs.readFileSync(path.join(seedDataPath, filename), "utf8"));
}

const classes = loadJson<any[]>("Class.json");
const days = loadJson<any[]>("Day.json");
const periods = loadJson<any[]>("Period.json");
const subjects = loadJson<any[]>("Subject.json");
const teachers = loadJson<any[]>("Teacher.json");
const teacherSubjects = loadJson<any[]>("teacher_subjects.json");
const teacherSubjectClasses = loadJson<any[]>("TeacherSubjectClass.json");

const packages = [
  {
    name: "Trial",
    description: "Free trial for new users",
    price: 0,
    features: ["1 Timetable Generation", "7 Days Validity"],
    generations: 1,
    validityDays: 7,
    unlimited: false,
  },
  {
    name: "A1",
    description: "Basic package for small schools",
    price: 500,
    features: ["5 Timetable Generations", "2 Months Validity"],
    generations: 5,
    validityDays: 60,
    unlimited: false,
  },
  {
    name: "A2",
    description: "Standard package for medium schools",
    price: 1200,
    features: ["15 Timetable Generations", "4 Months Validity"],
    generations: 15,
    validityDays: 120,
    unlimited: false,
  },
  {
    name: "A3",
    description: "Premium package for large schools",
    price: 2500,
    features: ["Unlimited Timetable Generations", "6 Months Validity"],
    generations: -1,
    validityDays: 180,
    unlimited: true,
  },
];

async function ensureSeedUser() {
  const adminEmail = (
    process.env.ADMIN_EMAIL || "admin@example.com"
  ).toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    return existing;
  }

  const hashed = await bcrypt.hash(adminPassword, 12);

  return prisma.user.create({
    data: {
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
      plan: "PREMIUM",
      packageName: "A3",
      generationLimit: -1,
      remainingGenerations: -1,
    },
  });
}

async function seedSchoolData() {
  console.log("Seeding school data...");

  const seedUser = await ensureSeedUser();
  const userId = seedUser.id;

  // 1. Classes
  for (const item of classes) {
    await prisma.class.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        userId,
      },
      create: {
        id: item.id,
        name: item.name,
        userId,
        ...(item.createdAt ? { createdAt: new Date(item.createdAt) } : {}),
      },
    });
  }

  // 2. Days
  for (const item of days) {
    await prisma.day.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        userId,
      },
      create: {
        id: item.id,
        name: item.name,
        userId,
      },
    });
  }

  // 3. Periods
  for (const item of periods) {
    await prisma.period.upsert({
      where: { id: item.id },
      update: {
        number: item.number,
        userId,
      },
      create: {
        id: item.id,
        number: item.number,
        userId,
      },
    });
  }

  // 4. Subjects
  for (const item of subjects) {
    await prisma.subject.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        userId,
      },
      create: {
        id: item.id,
        name: item.name,
        userId,
        ...(item.createdAt ? { createdAt: new Date(item.createdAt) } : {}),
      },
    });
  }

  // 5. Teachers
  for (const item of teachers) {
    await prisma.teacher.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        userId,
      },
      create: {
        id: item.id,
        name: item.name,
        userId,
        ...(item.createdAt ? { createdAt: new Date(item.createdAt) } : {}),
      },
    });
  }

  // 6. Teacher → Subject
  for (const item of teacherSubjects) {
    await prisma.teacherSubject.upsert({
      where: { id: item.id },
      update: {
        teacherId: item.teacherId,
        subjectId: item.subjectId,
        periodsPerWeek: item.periodsPerWeek,
      },
      create: {
        id: item.id,
        teacherId: item.teacherId,
        subjectId: item.subjectId,
        periodsPerWeek: item.periodsPerWeek,
        ...(item.createdAt ? { createdAt: new Date(item.createdAt) } : {}),
      },
    });
  }

  // 7. TeacherSubject → Class
  for (const item of teacherSubjectClasses) {
    await prisma.teacherSubjectClass.upsert({
      where: { id: item.id },
      update: {
        teacherSubjectId: item.teacherSubjectId,
        classId: item.classId,
      },
      create: {
        id: item.id,
        teacherSubjectId: item.teacherSubjectId,
        classId: item.classId,
        ...(item.createdAt ? { createdAt: new Date(item.createdAt) } : {}),
      },
    });
  }

  console.log("School data seeded successfully.");
}

async function seedPackages() {
  for (const pkg of packages) {
    await prisma.package.upsert({
      where: {
        name: pkg.name,
      },
      update: {
        description: pkg.description,
        price: pkg.price,
        features: pkg.features,
        generations: pkg.generations,
        validityDays: pkg.validityDays,
        unlimited: pkg.unlimited,
      },
      create: pkg,
    });
  }

  console.log("Packages seeded successfully.");
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log(
      "ADMIN_EMAIL or ADMIN_PASSWORD not configured. Skipping admin seed.",
    );
    return;
  }

  const email = adminEmail.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 12);

    await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "ADMIN",
        plan: "PREMIUM",
        packageName: "A3",
        generationLimit: -1,
        remainingGenerations: -1,
      },
    });

    console.log(`Admin created: ${email}`);
  } else if (existing.role !== "ADMIN") {
    await prisma.user.update({
      where: {
        id: existing.id,
      },
      data: {
        role: "ADMIN",
        plan: "PREMIUM",
        packageName: "A3",
        generationLimit: -1,
        remainingGenerations: -1,
      },
    });

    console.log(`Existing account promoted to admin: ${email}`);
  }
}

async function main() {
  console.log("Starting database seed...");

  await seedSchoolData();
  await seedPackages();
  await seedAdmin();

  console.log("Database seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
