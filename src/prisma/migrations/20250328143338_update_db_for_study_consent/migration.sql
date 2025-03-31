/*
  Warnings:

  - You are about to drop the `PatientDataConsent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PatientDataConsent" DROP CONSTRAINT "PatientDataConsent_dataAccessPermissionId_fkey";

-- DropForeignKey
ALTER TABLE "PatientDataConsent" DROP CONSTRAINT "PatientDataConsent_patientId_fkey";

-- DropTable
DROP TABLE "PatientDataConsent";

-- CreateTable
CREATE TABLE "StudyConsent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientId" UUID NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "hasConsented" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StudyConsent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyConsent_patientId_applicationId_key" ON "StudyConsent"("patientId", "applicationId");

-- AddForeignKey
ALTER TABLE "StudyConsent" ADD CONSTRAINT "StudyConsent_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyConsent" ADD CONSTRAINT "StudyConsent_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
