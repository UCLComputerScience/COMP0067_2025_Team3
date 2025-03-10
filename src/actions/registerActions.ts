"use server";

import bcrypt from 'bcryptjs';
import { prisma } from '@/prisma/client';
import { Role } from '@prisma/client';

// **Register Patient function**
export async function registerPatient(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  agreedForResearch: boolean;
  clinicians: Array<{ id: string }>;
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "Email already exists" };
    }

    // hashpassword
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const dateOfBirth = new Date(data.dateOfBirth);

    const user = await prisma.user.create({ data: { email: data.email, hashedPassword, firstName: data.firstName, lastName: data.lastName, dateOfBirth, agreedForResearch: data.agreedForResearch, role: Role.PATIENT, status: "ACTIVE", },});

    if (data.clinicians && data.clinicians.length > 0) {
      for (const clinician of data.clinicians) {
        await prisma.clinicianPatient.create({
          data: {  patientId: user.id,  clinicianId: clinician.id,  agreedToShareData: true,  status: "PENDING", 
          },
        });
      }
    }

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "Failed to register patient: " + (error instanceof Error ? error.message : String(error)),
    };
  }
}

// **Search Clinicians function**
export async function searchClinicians(searchParams: {
  firstName?: string;
  lastName?: string;
  institution?: string;
  email?: string;
}) {
  try {
    const clinicians = await prisma.user.findMany({
      where: {
        role: "CLINICIAN",
        firstName: searchParams.firstName ? { contains: searchParams.firstName, mode: "insensitive" } : undefined,
        lastName: searchParams.lastName ? { contains: searchParams.lastName, mode: "insensitive" } : undefined,
        institution: searchParams.institution ? { contains: searchParams.institution, mode: "insensitive" } : undefined,
        email: searchParams.email ? { contains: searchParams.email, mode: "insensitive" } : undefined,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        institution: true,
        email: true,
      },
    });

    return { success: true, clinicians: clinicians || [] };
  } catch (error: any) {
    console.error("Error searching clinicians:", error);
    return { success: false, clinicians: [], error: (error as Error).message || "Unknown error" };
  }
}
