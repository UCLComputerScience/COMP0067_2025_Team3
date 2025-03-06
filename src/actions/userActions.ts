'use server';

import bcrypt from 'bcryptjs'
import { prisma } from '@/prisma/client'
import select from '@/@core/theme/overrides/select';

// Save User Profile Settings
export async function saveUserProfile(formData: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    address?: string | null;
    hostipallNumber?: string | null;
    dateOfBirth?: Date | null;
}) {
    try {
        await prisma.user.update({
            where: { id: formData.id },
            data: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber === "" ? null : formData.phoneNumber,
                address: formData.address === "" ? null : formData.address,
                hospitalNumber: formData.hostipallNumber === "" ? null : formData.hostipallNumber,
                dateOfBirth: formData.dateOfBirth ? null : formData.dateOfBirth,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Error saving user profile:', error);
        return { success: false, message: 'Failed to update profile' };
    }
}

// Reset User Profile (Fetch Latest Data)
export async function resetUserProfile(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true, 
                address: true,
                hospitalNumber: true,
                agreedForResearch: false,
                dateOfBirth: true,
            },
        });

        if (!user) throw new Error('User not found');

        return {
            ...user,
            dateOfBirth: user.dateOfBirth ?? new Date(),
        };
    } catch (error) {
        console.error('Error resetting user profile:', error);
        return null;
    }
}

// Change password
export const changeUserPassword = async (userId: string, { currentPassword, newPassword }: { currentPassword: string, newPassword: string }) => {
    try {
    // Get the current user from the database (replace `userId` with the actual user ID)
        const user = await prisma.user.findUnique({ where: { id: userId } })
    
        if (!user) throw new Error('User not found');
    
        // Verify the current password with bcrypt
        const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword)
        
        if (!isMatch) throw new Error('Current password is incorrect');
    
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
    
        // Update the password in the database
        await prisma.user.update({
        where: { id: 'userId' },
        data: { hashedPassword: hashedPassword }
        })
    
        return { success: true }
    } catch (error) {
        console.error('Error changing password:', error)
        return {success: false, message: 'Failed to change password'}
    }
    }


// Save User Profile Settings
export async function saveResearch(agreedForResearch: {agreedForResearch: boolean}, formData: {id: string}) {
    try {
        await prisma.user.update({
            where: { id: formData.id },
            data: {
                agreedForResearch: agreedForResearch.agreedForResearch
            },
        });
        return { success: true, value : agreedForResearch };
    } catch (error) {
        console.error('Error saving user profile:', error);
        return { success: false, message: 'Failed to update profile' };
    }
}

// Save change to sharing data with clinician
export async function saveShareData(agreedToShareData: boolean, formData: {id: string}, clinicianId: string) {
    try {
        await prisma.clinicianPatient.update({
            where: {patientId_clinicianId: { patientId: formData.id, clinicianId: clinicianId } 
        },
            data: {
                agreedToShareData: agreedToShareData
            },
        });
        return { success: true, value : agreedToShareData };
    } catch (error) {
        console.error('Error saving user profile:', error);
        return { success: false, message: 'Failed to update profile' };
    }
}


//Save selected clinician 
export async function saveNewClinician (selectedClinician:string, patientId:string) {
    try{
        const newRelationship = await prisma.clinicianPatient.create({
            data: {
                clinicianId: selectedClinician,
                patientId: patientId
            }
        })
        console.log('New relationship created:', newRelationship);
        return {success : true, newRelationship} ;
    } catch (error) {
        console.error ('Error adding new clinician:', error);
        return {success : false};
    }
}
