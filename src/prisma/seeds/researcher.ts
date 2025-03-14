import { Role, DataField } from '@prisma/client'

import { prisma } from '../client'

const getRandomDataFields = (fields: DataField[], count: number) => {
  const shuffled = [...fields].sort(() => 0.5 - Math.random()) // Shuffle array

  
return shuffled.slice(0, count) // Select `count` random elements
}

const createRandomDataAccessForResearcher = async () => {
  try {
    // Find a random researcher
    const researcher = await prisma.user.findFirst({
      where: { role: Role.RESEARCHER },
      select: { id: true }
    })

    if (!researcher) {
      console.error('No researcher found')
      
return null
    }

    // Define available DataFields
    const allDataFields = Object.values(DataField)

    // Randomly select data fields (between 3 to 6 fields for variety)
    const selectedFields = getRandomDataFields(allDataFields, Math.floor(Math.random() * 4) + 3)

    // Create a random expiration date (between 3 to 12 months from now)
    const expiresAt = new Date()

    expiresAt.setMonth(expiresAt.getMonth() + Math.floor(Math.random() * 10) + 3)

    // Create the DataAccessPermission entry
    const dataAccessPermission = await prisma.dataAccessPermission.create({
      data: {
        researcherId: researcher.id,
        dataFields: { set: selectedFields },
        hasAccess: true,
        expiresAt
      }
    })

    console.log('Created DataAccessPermission:', dataAccessPermission)
    
return dataAccessPermission
  } catch (error) {
    console.error('Error creating random data access:', error)
    
return null
  }
}

export { createRandomDataAccessForResearcher }
