'use client'  

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'


// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// Component Imports

// Form validation
import { useForm, Controller } from 'react-hook-form'
import type { InferInput } from 'valibot'
import { object, string, pipe, nonEmpty, minLength, regex } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'

import Logo from '@components/layout/shared/Logo'
import Link from '@components/Link'
import { handleResetPassword, checkValidityToken } from '@/actions/email/sendReset';

export type FormValues = InferInput<typeof passwordSchema>

const passwordSchema = object({
    newPassword: pipe(
      string(),
      nonEmpty('Please enter your new password.'),
      minLength(8, 'New password must be at least 8 characters long'),
      regex(/[a-z]/, 'Must contain at least one lowercase letter'),
      regex(/[A-Z]/, 'Must contain at least one uppercase letter'),
      regex(/[0-9!@#$%^&*]/, 'Must contain at least one number or symbol')
    ),
    confirmNewPassword: pipe(string(), nonEmpty('Please confirm your new password.'))
})

const emptyFormDefaultValue = {
    newPassword: '',
    confirmNewPassword: ''
}

interface ResetPasswordPageProps {
    token: string;
}
  
const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ token }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)
    const [isConfirmNewPasswordShown, setIsConfirmNewPasswordShown] = useState(false)

  const {
      control,
      handleSubmit,
      formState: { errors }
    } = useForm<FormValues>({
      resolver: valibotResolver(passwordSchema),
      defaultValues: emptyFormDefaultValue
    })

  useEffect(() => {
    const checkToken = async () => {
        if (typeof token !== 'string') {  
          setIsTokenValid(false);
          return;
        }

        try {
            await checkValidityToken(token);
            setIsTokenValid(true);
        } catch (error) {
            setIsTokenValid(false);
        }
    };

    checkToken();
    }, [token]);


  const onSubmit = async ( token: string, newPassword: string, confirmNewPassword: string ) => {
    setLoading(true)

    if (!token || !newPassword || !confirmNewPassword) {
      toast.error('Please fill out both fields.');
      
return;
    }


    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
        toast.error('New password and confirmation do not match')

        return
      }

    try {
      const result = await handleResetPassword(token, newPassword);

      if (result.success) {
        toast.success('Password changed successfully');
        router.push('/login')
      } else {
        toast.error(result.error || 'Something went wrong.');
      }
    } catch (error) {
      toast.error('Server error. Please try again.');
    }
  };


  if (isTokenValid === null) {
    return <div>Loading...</div>; // Show loading while checking token validity
    }

    if (!isTokenValid) {
        return (
            <div className='flex bs-full justify-center'>
            <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
                    <Link className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'>
                        <Logo />
                    </Link>
                    <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] border border-divider rounded-lg p-6 shadow-sm bg-backgroundPaper'>
                        <Typography variant='h4' className='text-center'>
                            The reset link is invalid or has expired. Please resend the reset email and try again.
                        </Typography>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex bs-full justify-center'>
        <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
            <Link className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'>
            {' '}
            <Logo />
            </Link>
            <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] border border-divider rounded-lg p-6 shadow-sm bg-backgroundPaper'>
            <Typography variant='h4' className='text-center'>{`Reset password`}</Typography>
            <Controller
                name='newPassword'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='New Password'
                    type={isNewPasswordShown ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={() => setIsNewPasswordShown(!isNewPasswordShown)}
                          >
                            <i className={isNewPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    disabled={loading}
                  />
                )}
              />

            <Controller
                name='confirmNewPassword'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Confirm New Password'
                    type={isConfirmNewPasswordShown ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={() => setIsConfirmNewPasswordShown(!isConfirmNewPasswordShown)}
                          >
                            <i className={isConfirmNewPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={!!errors.confirmNewPassword}
                    helperText={errors.confirmNewPassword?.message}
                    disabled={loading}
                  />
                )}
              />

                <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit(data => onSubmit(token, data.newPassword, data.confirmNewPassword))}
                >
                Reset password
                </Button>

              <Typography variant='h6' color='text.secondary'>
                Password Requirements:
              </Typography>
              <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-2.5 text-textSecondary'>
                  <i className='ri-checkbox-blank-circle-fill text-[8px]' />
                  Minimum 8 characters long - the more, the better
                </div>
                <div className='flex items-center gap-2.5 text-textSecondary'>
                  <i className='ri-checkbox-blank-circle-fill text-[8px]' />
                  At least one lowercase & one uppercase character
                </div>
                <div className='flex items-center gap-2.5 text-textSecondary'>
                  <i className='ri-checkbox-blank-circle-fill text-[8px]' />
                  At least one number, symbol, or whitespace character
                </div>
              </div>
            </div>
        </div>
        </div>
    )
};

export default ResetPasswordPage;
