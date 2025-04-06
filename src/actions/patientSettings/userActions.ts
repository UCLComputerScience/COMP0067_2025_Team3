'use server'

import { prisma } from '@/prisma/client'

// Save change to sharing data with clinician
export async function saveShareData(clinicianId: string, agreedToShareData: boolean, patientId: string) {
  try {
    await prisma.clinicianPatient.update({
      where: { patientId_clinicianId: { patientId: patientId, clinicianId: clinicianId } },
      data: {
        agreedToShareData: agreedToShareData
      }
    })

    return { success: true, value: agreedToShareData }
  } catch (error) {
    console.error('Error saving user profile:', error)

    return { success: false, message: 'Failed to update profile' }
  }
}

//Save selected clinician
export async function saveNewClinician(selectedClinician: string, patientId: string) {
  try {
    // Check if the clinician is already linked to the patient
    const existingRelationship = await prisma.clinicianPatient.findFirst({
      where: {
        clinicianId: selectedClinician,
        patientId: patientId
      }
    })

    if (existingRelationship) {
      // console.log('This clinician is already linked to your account.');
      return { success: false, message: 'This clinician is already linked to your account.' }
    }

    const newRelationship = await prisma.clinicianPatient.create({
      data: {
        clinicianId: selectedClinician,
        patientId: patientId
      }
    })

    // console.log('New relationship created:', newRelationship);
    return { success: true, newRelationship, message: null }
  } catch (error) {
    console.error('Error adding new clinician:', error)

    return { success: false, message: 'Error adding new clinician.' }
  }
}

export async function deleteClinician(clinicianId: string, patientId: string) {
  try {
    const deleteRelationship = await prisma.clinicianPatient.deleteMany({
      where: { patientId: patientId, clinicianId: clinicianId }
    })

    if (deleteRelationship.count === 0) {
      return { success: false, message: 'Clinician relationship not found' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting clinician:', error)

    return { success: false, message: 'Failed to delete clinician' }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function sendInvitation(email: string, message: string) {
  try {
    console.log('Action to send email here.')

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
