'use server';

import sgMail from '@sendgrid/mail';

import { prisma } from '@/prisma/client'


export interface User {
  firstName: string
  lastName: string
}

const getPatientName = async (id: string): Promise<User | null> => {
  return await prisma.user.findFirst({
    where: { id },
    select: {
      firstName: true,
      lastName: true,
    }
  })
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Send invite email after login (with uid)
export async function sendInviteEmail(name: string, email: string, patientId: string) {
  const patient = await getPatientName(patientId);
  const patientName = patient ? `${patient.firstName} ${patient.lastName}` : '';

  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL!,
      subject: 'You’ve been invited to join our platform!',
      html: `
        <p>Dear ${name},</p>
        <p>Your patient ${patientName} would like to share their symptoms data with you on our platform. </p>
        <p>Register your account to view their spidergrams and track their data.</p>
        <p>Here is a link to our website: https://team3.uksouth.cloudapp.azure.com</p>
        <p>Kind regards,</p>
        <p>The Spider team</p>
      `,
    };

    await sgMail.send(msg);
    
return { success: true };
  } catch (error: any) {
    console.error('[Invite Email Error]', error);
    
return { success: false, error: error.message };
  }
}

// Send invite email before login (without uid)
export async function sendInviteEmailDuringRegistration(clinicianName: string, email: string) {
  try {
    const msg = {  
        to: email,
        from: process.env.SENDGRID_SENDER_EMAIL!,
        subject: 'You\'ve been invited to join our platform!',
        html: `
          <p>Dear ${clinicianName},</p>
          <p>A new patient would like to share their symptoms data with you on our platform.</p>
          <p>Register your account to view their spidergrams and track their data.</p>
          <p>Here is a link to our website: https://team3.uksouth.cloudapp.azure.com</p>
          <p>Kind regards,</p>
          <p>The Spider team</p>
        `,
      };
    
    await sgMail.send(msg);
    
    return { success: true };
  } catch (error: any) {
    console.error('[Invite Email Error]', error);
    
    return { success: false, error: error.message };
  }
}
