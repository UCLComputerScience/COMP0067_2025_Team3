'use server';

import crypto from 'crypto';

import sgMail from '@sendgrid/mail';


import bcrypt from 'bcryptjs';

import { prisma } from '@/prisma/client';



sgMail.setApiKey(process.env.SENDGRID_API_KEY!);


export async function sendPasswordReset(email: string) {
  try {
    console.log('Checking for user with email:', email);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.warn('No user found with that email.');

      return { success: false, error: 'No user found with that email.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
      await prisma.user.update({
        where: { email },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpires: new Date(Date.now() + 1000 * 60 * 15),
        },
      });

    } catch (updateError: any) {
      console.error('Prisma update failed:', updateError);
      
      return { success: false, error: 'Failed to update user in database.' };
    }

    const resetLink = `localhost:3000/reset-password/${token}`;

    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL!,
      subject: 'Reset Your Password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 15 minutes.</p>`,
    };

    await sgMail.send(msg);
    
return { success: true };
  } catch (error: any) {
    console.error('Error in sendPasswordReset:', error);
    
return { success: false, error: error.message };
  }
}

export async function checkValidityToken(token: string) {
  // Hash the token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: { passwordResetToken: hashedToken },
    select: { passwordResetExpires: true }
  });


  // Check if the user exists and if the token has expired
  if (!user || !user.passwordResetExpires) {
    throw new Error('Invalid or expired token');
  }

  // Compare expiration date with current time
  const currentTime = new Date().toISOString(); 
  const expirationTime = user.passwordResetExpires.toISOString(); 
  
  if (currentTime > expirationTime) {
    throw new Error('Token has expired');
  }

  // If token is still valid, return true or user object
  return true;
}

export async function handleResetPassword(token: string, newPassword: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
    },
  });

  if (!user) {
    return { success: false, error: 'Invalid or expired token.' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return { success: true };
}
