'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

// MUI imports
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'

// Utilities & validation
import { toast } from 'react-toastify'
import { object, pipe, string, nonEmpty } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { capitalize } from 'lodash'

// Types & API calls
import { AccountStatus, Role } from '@prisma/client'
import { UserProfileData } from '@/actions/all-users/userAction'
import { updateUserStatusAndRoleById } from '@/actions/all-users/userAction'
import DialogsAlert from './DialogsAlert'

// Define props correctly
interface Props {
  user: UserProfileData
}

// Using string-based validation
const userSchema = object({
  role: pipe(string(), nonEmpty('Role is required')),
  status: pipe(string(), nonEmpty('Status is required'))
})

// Using string-based form values
type UserFormValues = {
  role: string
  status: string
}

const AccountSettingsCardAdminView = ({ user }: Props) => {
  const [loading, setLoading] = useState(false)

  // Get initial values as strings
  const getInitialValues = () => {
    return {
      role: user.role?.toString() || 'USER',
      status: user.status?.toString() || 'ACTIVE'
    }
  }

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty }
  } = useForm<UserFormValues>({
    resolver: valibotResolver(userSchema),
    defaultValues: getInitialValues()
  })

  // Handle form submission
  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true)

      const result = await updateUserStatusAndRoleById(user.id, {
        role: data.role,
        status: data.status
      })

      if (result.success) {
        toast.success(result.message || 'User role and status updated successfully!')

        if (result.user) {
          reset(
            {
              role: result.user.role.toString(),
              status: result.user.status.toString()
            },
            { keepDirty: false }
          )
        } else {
          reset(data, { keepDirty: false })
        }
      } else {
        toast.error(result.message || 'Failed to update user role and status')
      }
    } catch (error) {
      console.error('Error updating role and status:', error)
      toast.error('An error occurred while updating user role and status')
    } finally {
      setLoading(false)
    }
  }

  // Reset form handler
  const handleReset = () => {
    reset(getInitialValues())
  }

  return (
    <Card className='w-full'>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!isValid) toast.error('Please check the form for errors')
          handleSubmit(onSubmit)()
        }}
      >
        <CardHeader title='Account Settings' />

        <CardContent className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2'>
            <Typography>
              <strong className='mr-2'>UID</strong> {user.id}
            </Typography>
            <Typography>
              <strong className='mr-2'>Full Name</strong> {user.firstName} {user.lastName}
            </Typography>
            <Typography>
              <strong className='mr-2'>Email</strong> {user.email}
            </Typography>
          </div>

          <div className='flex flex-col items-start gap-4 mt-4'>
            {/* Role Selection */}
            <FormControl fullWidth error={!!errors.role} disabled={loading}>
              <InputLabel id='role-select-label'>Role</InputLabel>
              <Controller
                name='role'
                control={control}
                render={({ field }) => (
                  <Select {...field} label='Role' labelId='role-select-label'>
                    {Object.values(Role).map(role => (
                      <MenuItem key={role} value={role}>
                        {capitalize(role.toLowerCase())}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            {/* Status Selection */}
            <FormControl fullWidth error={!!errors.status} disabled={loading}>
              <InputLabel id='status-select-label'>Status</InputLabel>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <Select {...field} label='Status' labelId='status-select-label'>
                    {Object.values(AccountStatus).map(status => (
                      <MenuItem key={status} value={status}>
                        {capitalize(status.toLowerCase())}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </div>
        </CardContent>

        <CardActions>
          <Button type='submit' variant='contained' disabled={loading || !isDirty}>
            Save Changes
          </Button>

          <DialogsAlert
            triggerButtonLabel='Reset'
            dialogTitle='Confirm Form Reset'
            dialogText='Resetting the form will revert all changes. Continue?'
            confirmButtonLabel='Yes, Reset'
            cancelButtonLabel='Cancel'
            onConfirm={handleReset}
          />
        </CardActions>
      </form>
    </Card>
  )
}

export default AccountSettingsCardAdminView
