"use server";


import bcrypt from 'bcryptjs'

import { prisma } from '@/prisma/client'
import { Role } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { hash } from "bcrypt";
import nodemailer from 'nodemailer';

// Save User Profile Settings
export async function saveUserProfile(formData: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    address?: string | null;
    institution?: string | null;
    registrationNumber?: string | null;
    profession?: string | null;
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
                institution: formData.institution === "" ? null : formData.institution,
                registrationNumber: formData.registrationNumber === "" ? null : formData.registrationNumber,
                profession: formData.profession === "" ? null : formData.profession,
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
                institution: true,
                registrationNumber: false,
                profession: true,
            },
        });

        if (!user) throw new Error('User not found');

        return {
            ...user
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
        
        if (!isMatch) return { success: false, message: "Current password is incorrect" };
    
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
    
        // Update the password in the database
        await prisma.user.update({
        where: { id: userId },
        data: { hashedPassword: hashedPassword }
        })
    
        return { success: true, message: "Password changed successfully." }
    } catch (error) {
        // console.error('Error changing password:', error)
        return {success: false, message: 'Failed to change password'}
    }
    }

