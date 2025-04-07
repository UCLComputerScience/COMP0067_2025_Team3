'use server';

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendInviteEmail(email: string) {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL!,
      subject: 'You’ve been invited to join our platform!',
      html: `
        <p>Dear clinician,</p>
        <p>Your patient would like to share their symptom data with you on our platform. </p>
        <p>Register your account to view their spider grams and track their data.</p>
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
