'use server'

import bcrypt from 'bcryptjs'

import { prisma } from '@/prisma/client'
import { AccountStatus, Role } from '@prisma/client'

export const updateUserPassword = async (
  userId: string,
  { currentPassword, newPassword }: { currentPassword: string; newPassword: string }
) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) throw new Error('User not found')

    const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword)

    if (!isMatch) return { success: false, message: 'Current password is incorrect' }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword: hashedPassword }
    })

    return { success: true, message: 'Password updated successfully.' }
  } catch (error) {
    console.error('Error updating password:', error)

    return { success: false, message: 'Failed to update password' }
  }
}

// Define types for user profile data
export interface UserProfileData {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string | null
  address?: string | null
  institution?: string | null
  registrationNumber?: string | null
  profession?: string | null
  hospitalNumber?: string | null
  dateOfBirth?: Date | null
  role?: Role | string
  status?: AccountStatus | string
}

// Get User Profile
export const getUserProfile = async (userId: string): Promise<UserProfileData | null> => {
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
        registrationNumber: true,
        profession: true,
        hospitalNumber: true,
        dateOfBirth: true,
        role: true,
        status: true
      }
    })

    if (!user) {
      console.error('User not found:', userId)

      return null
    }

    return user
  } catch (error) {
    console.error('Error fetching user profile:', error)

    return null
  }
}

// Update User Profile
export const updateUserProfile = async (formData: UserProfileData): Promise<{ success: boolean; message?: string }> => {
  try {
    // Validate that ID exists
    if (!formData.id) {
      return { success: false, message: 'User ID is required' }
    }

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: formData.id }
    })

    if (!existingUser) {
      return { success: false, message: 'User not found' }
    }

    // Prepare update data - convert empty strings to null
    const updateData: any = {}

    // Process required fields
    updateData.firstName = formData.firstName
    updateData.lastName = formData.lastName
    updateData.email = formData.email

    // Process optional fields
    updateData.phoneNumber = formData.phoneNumber === '' ? null : formData.phoneNumber
    updateData.address = formData.address === '' ? null : formData.address
    updateData.institution = formData.institution === '' ? null : formData.institution
    updateData.registrationNumber = formData.registrationNumber === '' ? null : formData.registrationNumber
    updateData.profession = formData.profession === '' ? null : formData.profession
    updateData.hospitalNumber = formData.hospitalNumber === '' ? null : formData.hospitalNumber
    updateData.dateOfBirth = formData.dateOfBirth || null

    console.log(updateData)

    // Update the user in the database
    await prisma.user.update({
      where: { id: formData.id },
      data: updateData
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating user profile:', error)

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update profile'
    }
  }
}

export const updateUserStatusAndRoleById = async (
  userId: string,
  { role, status }: { role: string; status: string }
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      return { success: false, message: 'User not found' }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        role: role as Role,
        status: status as AccountStatus
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true
      }
    })

    return {
      success: true,
      message: 'User status and role updated successfully',
      user: updatedUser
    }
  } catch (error) {
    console.error('Error updating user status and role:', error)

    if (error instanceof Error) {
      return {
        success: false,
        message: `Error updating user: ${error.message}`
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while updating user status and role'
    }
  }
}
