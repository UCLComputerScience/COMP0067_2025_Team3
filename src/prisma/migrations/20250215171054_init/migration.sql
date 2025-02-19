-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PATIENT', 'CLINICIAN', 'RESEARCHER');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DataField" AS ENUM ('AGE', 'SEX', 'GENDER', 'ISSEXMATCHINGGENDER', 'ETHNICITY', 'RESIDENCECOUNTRY', 'DIAGNOSIS', 'DIAGNOSEDBY', 'MEDICATIONS', 'OTHERCONDITIONS', 'ACTIVITYLEVEL', 'EDUCATION', 'EMPLOYMENT', 'EXERCISELEVEL', 'LONGITUDINAL');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "profession" TEXT,
    "registrationNumber" TEXT,
    "institution" TEXT,
    "agreedForResearch" BOOLEAN,
    "dateOfBirth" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'PATIENT',
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientInfo" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submissionId" TEXT NOT NULL,
    "age" INTEGER,
    "sex" TEXT,
    "gender" TEXT,
    "isSexMatchingGender" BOOLEAN,
    "ethnicity" TEXT,
    "residenceCountry" TEXT,
    "employment" TEXT,
    "education" TEXT,
    "activityLevel" TEXT,
    "weeklyExerciseMinutes" INTEGER,
    "diagnosis" TEXT,
    "diagnosedBy" TEXT,
    "medications" TEXT,
    "otherConditions" TEXT,

    CONSTRAINT "PatientInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicianPatient" (
    "patientId" UUID NOT NULL,
    "clinicianId" UUID NOT NULL,

    CONSTRAINT "ClinicianPatient_pkey" PRIMARY KEY ("patientId","clinicianId")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "note" TEXT,
    "domain" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "questionId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "institution" TEXT,
    "expectedStartDate" TIMESTAMP(3) NOT NULL,
    "expectedEndDate" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "ethicalFilePath" TEXT NOT NULL,
    "otherFilePaths" JSONB NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataAccessPermission" (
    "id" SERIAL NOT NULL,
    "researcherId" UUID NOT NULL,
    "dataField" "DataField" NOT NULL,
    "hasAccess" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataAccessPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "PatientInfo" ADD CONSTRAINT "PatientInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicianPatient" ADD CONSTRAINT "ClinicianPatient_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicianPatient" ADD CONSTRAINT "ClinicianPatient_clinicianId_fkey" FOREIGN KEY ("clinicianId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataAccessPermission" ADD CONSTRAINT "DataAccessPermission_researcherId_fkey" FOREIGN KEY ("researcherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
