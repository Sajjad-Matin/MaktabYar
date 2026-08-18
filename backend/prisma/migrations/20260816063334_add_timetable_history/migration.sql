-- AlterTable
ALTER TABLE "PurchaseRequest" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TimetableHistory" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TimetableHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimetableHistory_classId_idx" ON "TimetableHistory"("classId");

-- CreateIndex
CREATE INDEX "TimetableHistory_userId_idx" ON "TimetableHistory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TimetableHistory_classId_version_key" ON "TimetableHistory"("classId", "version");

-- AddForeignKey
ALTER TABLE "TimetableHistory" ADD CONSTRAINT "TimetableHistory_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableHistory" ADD CONSTRAINT "TimetableHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
