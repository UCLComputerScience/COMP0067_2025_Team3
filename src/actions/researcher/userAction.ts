'use server'

import { prisma } from '@/prisma/client'

export const getDataAccessData = async (id: string) => {
  try {
    const dataAccess = await prisma.dataAccessPermission.findMany({
      where: {
        researcherId: id
      },
      select: {
        dataFields: true,
        hasAccess: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true
      }
    })

    if (!dataAccess) {
      console.log('No data access found for this user')

      return null
    }

    return dataAccess[0]
  } catch (error) {
    console.error('get data access error:', error)

    return null
  }
}
