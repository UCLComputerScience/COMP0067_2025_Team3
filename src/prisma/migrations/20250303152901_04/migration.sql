/*
  Warnings:

  - You are about to drop the column `ethicalFilePath` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `otherFilePaths` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `dataField` on the `DataAccessPermission` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "DataField" ADD VALUE 'SINGLEEPISODE';

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "ethicalFilePath",
DROP COLUMN "otherFilePaths",
ADD COLUMN     "demographicDataAccess" "DataField"[],
ADD COLUMN     "questionnaireAccess" "DataField"[];

-- AlterTable
ALTER TABLE "DataAccessPermission" DROP COLUMN "dataField",
ADD COLUMN     "dataFields" "DataField"[];

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationId" INTEGER NOT NULL,
    "documentPath" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
