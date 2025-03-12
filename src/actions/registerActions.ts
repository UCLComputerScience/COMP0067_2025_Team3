'use server';

import { hash } from 'bcrypt';
import { prisma } from '@/prisma/client';
import { revalidatePath } from 'next/cache';


export interface Clinician { id: string;firstName: string;lastName: string;institution: string;email: string;}

interface DataPrivacyFormData {researchConsent: boolean;clinicianAccess: boolean;selectedClinicians: Clinician[];}

export interface RegisterUserData { firstName: string; lastName: string; email: string; password: string; dateOfBirth?: string; address?: string;       phoneNumber?: string;   profession?: string; registrationNumber?: string;  institution?: string;    accountType: string;}

export interface RegisterResult { success: boolean; userId?: string;  error?: string; }


export async function registerUser(data: RegisterUserData): Promise<RegisterResult> {
    try {
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      return { success: false, error: 'Missing required fields'
      };
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email: data.email }});
    if (existingUser) {
      return { success: false, error: 'Email already in use'
      };
    }

    const hashedPassword = await hash(data.password, 10);

    // Determine the user role based on account type
    const role = data.accountType === 'patient' 
      ? 'PATIENT' 
      : data.accountType === 'clinician' 
        ? 'CLINICIAN' 
        : data.accountType === 'researcher' 
          ? 'RESEARCHER' 
          : 'PATIENT'; // Default to patient

    // Create the user with all provided fields
    const user = await prisma.user.create({ data: { email: data.email, hashedPassword, firstName: data.firstName, lastName: data.lastName, dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined, address: data.address,   phoneNumber: data.phoneNumber,      profession: data.profession,  registrationNumber: data.registrationNumber,  institution: data.institution,       role, status: 'PENDING',  }});
    return { success: true, userId: user.id};
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Failed to register user. Please try again.'
    };
  }
}


export async function saveDataPrivacyPreferences(
  userId: string,
  data: DataPrivacyFormData
) {
  try {
    // Update the user's research consent preference
    await prisma.user.update({ where: { id: userId }, data: {  agreedForResearch: data.researchConsent,},});

    // Create clinician relationships if clinician access is granted
    if (data.clinicianAccess && data.selectedClinicians.length > 0) {
      // Create an array of clinician relationship objects
      const clinicianRelationships = data.selectedClinicians.map((clinician) => ({ patient: { connect: { id: userId } },  clinician: { connect: { id: clinician.id } },  agreedToShareData: true, status: 'CONNECTED', }));
      
      await prisma.$transaction(
        clinicianRelationships.map((relationship) =>
          prisma.clinicianPatient.upsert({
            where: {  patientId_clinicianId: {patientId: userId, clinicianId: relationship.clinician.connect!.id,  },},
            update: { agreedToShareData: relationship.agreedToShareData, status: 'CONNECTED',},
            create: { patient: { connect: { id: userId } }, clinician: { connect: { id: relationship.clinician.connect!.id } }, agreedToShareData: relationship.agreedToShareData, status: 'CONNECTED',},
          })
        )
      );
    } else if (!data.clinicianAccess) {
      await prisma.clinicianPatient.updateMany({
        where: { patientId: userId, },
        data: {agreedToShareData: false,},
      });
    }

    revalidatePath(`/user/${userId}`);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to save data privacy preferences:', error);
    return { success: false, error: 'Failed to save data privacy preferences. Please try again.',};
  }
}


export async function completeRegistration( userId: string, data: DataPrivacyFormData, accountType: string) {
  try {
    const result = await saveDataPrivacyPreferences(userId, data);
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to save data privacy preferences'
      };
    }

    // upadate status or not based on accounttype
    if (accountType === 'Clinician') {
      await prisma.user.update({ where: { id: userId }, data: { status: 'ACTIVE', },});
    } else if (accountType === 'Researcher') {
    }

    return { success: true, message: 'Registration step completed successfully'};

  } catch (error) {
    console.error('Error completing registration:', error);
    return {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : 'Failed to complete registration. Please try again.',
    };
  }
}


export async function searchClinicians(searchParams: Record<string, string>) {
  try {
    const { firstName, lastName, institution, email } = searchParams;
    
    // Create a filter object for the Prisma query
    const filter: any = { role: 'CLINICIAN', status: 'ACTIVE',};
    
    // Add optional filters if provided
    if (firstName) { filter.firstName = { contains: firstName, mode: 'insensitive' };}
    if (lastName) {filter.lastName = { contains: lastName, mode: 'insensitive' };}
    if (institution) { filter.institution = { contains: institution, mode: 'insensitive' };}
    if (email) { filter.email = { contains: email, mode: 'insensitive' };}
    
    // Execute the search query
    const clinicians = await prisma.user.findMany({
      where: filter,
      select: { id: true, firstName: true, lastName: true, institution: true, email: true,},
      take: 50, 
    });
    
    return { success: true, clinicians,};
  } catch (error) {
    console.error('Error searching for clinicians:', error);
    return { success: false, error: 'Failed to search for clinicians. Please try again.', clinicians: []};
  }
}

export async function checkUserDuplicates(email: string, phoneNumber?: string, registrationNumber?: string) {
  try { const emailExists = await prisma.user.findUnique({ where: { email }, }) !== null;

    const phoneExists = phoneNumber
      ? await prisma.user.findFirst({  where: { phoneNumber },}) !== null
      : false;

    const registrationNumberExists = registrationNumber
      ? await prisma.user.findFirst({ where: { registrationNumber },}) !== null
      : false;

    return { emailExists, phoneExists, registrationNumberExists };
  } catch (error) {
    console.error("Error checking duplicates:", error);
    return { emailExists: false, phoneExists: false, registrationNumberExists: false };
  }
}
