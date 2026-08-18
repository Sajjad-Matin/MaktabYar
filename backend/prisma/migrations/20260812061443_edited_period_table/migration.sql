/*
  Warnings:

  - Made the column `start_time` on table `Period` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Period" ALTER COLUMN "start_time" SET NOT NULL,
ALTER COLUMN "start_time" SET DATA TYPE TEXT,
ALTER COLUMN "end_time" SET DATA TYPE TEXT;
