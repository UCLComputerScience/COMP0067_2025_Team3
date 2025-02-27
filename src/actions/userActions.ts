'use server';

import bcrypt from 'bcryptjs'
import { prisma } from '@/prisma/client'

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
                hostipalNumber: formData.hostipallNumber === "" ? null : formData.hostipallNumber,
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
                hostipalNumber: true,
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
    // Get the current user from the database (replace `userId` with the actual user ID)
    const user = await prisma.user.findUnique({ where: { id: userId } })
  
    if (!user) {
      return false // User not found
    }
  
    // Verify the current password with bcrypt
    const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword)
    
    if (!isMatch) {
      return false // Current password doesn't match
    }
  
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
  
    // Update the password in the database
    await prisma.user.update({
      where: { id: 'userId' },
      data: { hashedPassword: hashedPassword }
    })
  
    return true // Password updated successfully
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
