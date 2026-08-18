/*
  Warnings:

  - The `start_time` column on the `Period` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `end_time` column on the `Period` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Period" DROP COLUMN "start_time",
ADD COLUMN     "start_time" TIMESTAMP(3),
DROP COLUMN "end_time",
ADD COLUMN     "end_time" TIMESTAMP(3);
