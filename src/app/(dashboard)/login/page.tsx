import React from "react";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import LoginClient from '@/views/Login';
import { getCurrentUser } from '@/actions/userActions';

// Check user authentication status
const checkAuthenticated = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    return null;
  }
};

export default async function LoginPage() {
  const user = await checkAuthenticated();

  if (user && user.role) {
    let role = String(user.role).toLowerCase();
    let redirectPath = '/dashboard';

    switch (role) {
      case 'clinician':
        redirectPath = '/clinician-allpatients';
        break;
      case 'admin':
        redirectPath = '/admin-allusers';
        break;
      case 'researcher':
        redirectPath = '/researcher-download';
        break;
      case 'patient':
        redirectPath = '/my-records';
        break;
      default:
        redirectPath = '/dashboard';
    }

    console.log('User Data:', user);
    console.log('User Role:', user?.role);
    console.log('🔄 Redirecting to:', redirectPath);
    
    redirect(redirectPath);
  }

  return <LoginClient />;
}
