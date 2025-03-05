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
    // Get the current user from the database (replace userId with the actual user ID)
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

// register clinician function
export async function registerClinician(formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profession: string;
    customProfession: string;
    registrationNumber: string;
    institution: string;
  }): Promise<{
    success: boolean;
    error?: string;
    userId?: string;
  }> {
    try {     
      const existingUser = await prisma.user.findUnique({
        where: { email: formData.email },
      });
      
      if (existingUser) {
        return { success: false, error: "This email address is already registered" };
      }
      
      // hashed password
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      
      // final profession
      const finalProfession = formData.profession === 'Other'
        ? formData.customProfession
        : formData.profession;
      
      // new user
      const newUser = await prisma.user.create({
        data: {
          email: formData.email,
          hashedPassword,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: Role.CLINICIAN,
          profession: finalProfession,
          registrationNumber: formData.registrationNumber,
          institution: formData.institution
        }
      });
      
      console.log('Successful user creation:', newUser.id);
      
      return {
        success: true,
        userId: newUser.id
      };
    } catch (error) {
      console.error('registration error:', error);
      return {
        success: false,
        error: "An error occurred during the registration process: " + (error instanceof Error ? error.message : String(error))
      };
    }
  }

export async function loginUser(formData: {email: string; password: string; rememberMe: boolean; }): Promise<{ success: boolean; error?: string; user?: {   id: string; email: string;  firstName?: string;lastName?: string;role: Role; }}> {
    try {
      if (!formData.email || !formData.password) {
        return {
          success: false,
          error: 'Email and password cannot be empty'
        };
      }

      const user = await prisma.user.findUnique({
        where: { email: formData.email },
        select: {  id: true,  email: true,  hashedPassword: true,  firstName: true,  lastName: true,  role: true }});
      if (!user || !(await bcrypt.compare(formData.password, user.hashedPassword))) {
        console.log('Login failed: Invalid email or password');
        return {
          success: false,
          error: 'Incorrect email or password'
        };
      }
  
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: formData.rememberMe ? '7d' : '24h' }
      );
  
      const cookieStore = await cookies(); 
      cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: formData.rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60,
      path: '/'
    });
  
      console.log('Login Successful:', user.id);
  
      return {
        success: true,
        user: { id: user.id, email: user.email, firstName: user.firstName || undefined, lastName: user.lastName || undefined, role: user.role}};
    } catch (error) {
      console.error('Login Error:', error);
      return {
        success: false,
        error: 'An error occurred during login: ' + (error instanceof Error ? error.message : String(error))
      };
    }
  }
  
  export async function logoutUser() {
    const cookieStore = await cookies(); 
    cookieStore.set("auth-token", "", { expires: new Date(0), path: "/" })
    console.log("User logged out, auth-token cleared.");
  

    return { success: true };
}
  
  export async function getCurrentUser() {
    const cookieStore = await cookies(); 
    const token = cookieStore.get('auth-token')?.value;
  
    if (!token) {
        console.log("Token not found, user not logged in.");
      return null;
    }
  
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback-secret-key'
      ) as { id: string };      
      const user = await prisma.user.findUnique({ where: { id: decoded.id }, select: {   id: true, email: true, firstName: true, lastName: true, role: true, phoneNumber: true, address: true, hospitalNumber: true, dateOfBirth: true, profession: true, registrationNumber: true, institution: true, agreedForResearch: true } });
      if (!user) {
        console.log(" User not found");
        return null;
      }
  
      return {
        ...user,
        role: user?.role ? String(user.role) : "unknown", 
      };
      
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  const verificationCodes = new Map<string, string>();

  // Function to send email with verification code
  async function sendVerificationEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Verification Code',
      text: `Your verification code is: ${code}`,
    };
  
    await transporter.sendMail(mailOptions);
  }
  
  // Request Password Reset
  export async function requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: 'Email not registered' };
    }
  
    const code = Math.floor(100000 + Math.random() * 900000).toString(); 
    verificationCodes.set(email, code);
    
    try {
      await sendVerificationEmail(email, code);
      return { success: true, message: 'Verification code sent to email' };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: 'Failed to send email' };
    }
  }
  
  // Verify Code
  export async function verifyResetCode(email: string, code: string) {
    if (verificationCodes.get(email) === code) {
      verificationCodes.delete(email);
      return { success: true };
    }
    return { success: false, error: 'Invalid or expired verification code' };
  }
  
  //  Reset Password
  export async function resetPassword(email: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: 'User not found' };
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { email }, data: { hashedPassword } });
    return { success: true, message: 'Password reset successful. Redirecting to login...' };
  }
  