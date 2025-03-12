import { object, string, minLength, email, optional, pipe, nonEmpty, regex } from 'valibot';

// User Profile Validation
export const userProfileSchema = object({
  firstName: pipe(string(),minLength(2, 'First name must be at least 2 characters long')),
  lastName: pipe(string(), minLength(2, 'Last name must be at least 2 characters long')),
  email: pipe(string(), nonEmpty('Please enter your email.'), email('Invalid email address')),
});

// Password Change Validation
export const passwordSchema = object({
  currentPassword: pipe(string(), nonEmpty('Please enter your current password.')),
  newPassword: pipe(string(), nonEmpty('Please enter your new password.'),
    minLength(8, 'New password must be at least 8 characters long'),
    regex(/[a-z]/, 'Must contain at least one lowercase letter'),
    regex(/[A-Z]/, 'Must contain at least one uppercase letter'),
    regex(/[0-9!@#$%^&*]/, 'Must contain at least one number or symbol')
  ),
  confirmPassword: pipe(string(), nonEmpty('Please confirm your new password.'),),
});