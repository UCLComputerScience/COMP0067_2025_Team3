-- CreateTable
CREATE TABLE "PatientDataConsent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientId" UUID NOT NULL,
    "dataAccessPermissionId" INTEGER NOT NULL,
    "hasConsented" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PatientDataConsent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientDataConsent_patientId_dataAccessPermissionId_key" ON "PatientDataConsent"("patientId", "dataAccessPermissionId");

-- AddForeignKey
ALTER TABLE "PatientDataConsent" ADD CONSTRAINT "PatientDataConsent_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientDataConsent" ADD CONSTRAINT "PatientDataConsent_dataAccessPermissionId_fkey" FOREIGN KEY ("dataAccessPermissionId") REFERENCES "DataAccessPermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
