/*
  Warnings:

  - You are about to drop the column `hostipalNumber` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RelationshipStatus" AS ENUM ('PENDING', 'CONNECTED');

-- AlterTable
ALTER TABLE "ClinicianPatient" ADD COLUMN     "agreedToShareData" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "RelationshipStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hostipalNumber",
ADD COLUMN     "hospitalNumber" TEXT;
