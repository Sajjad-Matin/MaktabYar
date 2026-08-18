-- Add package/account billing state and admin access
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

ALTER TABLE "User"
  ADD COLUMN "schoolName" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER',
  ADD COLUMN "packageName" TEXT NOT NULL DEFAULT 'Trial',
  ADD COLUMN "generationLimit" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "remainingGenerations" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "packageActivatedAt" TIMESTAMP(3),
  ADD COLUMN "packageExpiresAt" TIMESTAMP(3);

ALTER TABLE "Package"
  ADD COLUMN "generations" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "validityDays" INTEGER NOT NULL DEFAULT 7,
  ADD COLUMN "unlimited" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "PurchaseRequest"
  ADD COLUMN "packageId" TEXT,
  ADD COLUMN "schoolName" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "paymentMethod" TEXT;

CREATE INDEX "PurchaseRequest_userId_idx" ON "PurchaseRequest"("userId");
CREATE INDEX "PurchaseRequest_status_idx" ON "PurchaseRequest"("status");

ALTER TABLE "PurchaseRequest"
  ADD CONSTRAINT "PurchaseRequest_packageId_fkey"
  FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Existing users receive the current default package state.
UPDATE "User"
SET "packageName" = CASE "plan"
    WHEN 'PREMIUM' THEN 'A3'
    WHEN 'STANDARD' THEN 'A2'
    ELSE 'Trial'
  END,
  "generationLimit" = CASE "plan"
    WHEN 'PREMIUM' THEN -1
    WHEN 'STANDARD' THEN 15
    ELSE 1
  END,
  "remainingGenerations" = CASE "plan"
    WHEN 'PREMIUM' THEN -1
    WHEN 'STANDARD' THEN 15
    ELSE 1
  END;
