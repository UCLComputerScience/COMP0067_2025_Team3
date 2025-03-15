
import { getServerSession } from 'next-auth'

import { prisma } from '@/prisma/client'
import ClinicianLinkPage from '@/views/AddClinician'
import { authOptions } from '@/libs/auth'


export interface PatientId {
  id: string;
}

export interface AllClinicians {
  id: string
  email: string
  firstName: string
  lastName: string
  profession?: string | null
  institution?: string | null
}


const getCurrentUser = async (session: any): Promise<PatientId[]> => {
  if (!session?.user.id) {
    return []; 
  }

  
return [{ id: session.user.id }];
}


const getAllClinicians = async (): Promise<AllClinicians[]> => {
  const allClinicians = await prisma.user.findMany({
    where: { role: 'CLINICIAN' },
    select: { id: true, email: true, firstName: true, lastName: true, profession: true, institution: true }
  });

  return allClinicians.map(clinician => ({
    id: clinician.id,
    firstName: clinician.firstName,
    lastName: clinician.lastName,
    email: clinician.email,
    institution: clinician.institution ?? null,
    profession: clinician.profession ?? null
  }));
}

// Server component (for Next.js 13+ app directory)
const Clinicians = async () => {
  // Get session server-side
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return <p>Unauthorized</p>;  // Handle unauthorized access
  }
  
  // Fetch user ID and clinicians list
  const userId = await getCurrentUser(session);
  const allClinicians = await getAllClinicians();

  const userIdValue = userId[0]?.id;

  return (

    // Pass user data to the client component
    <ClinicianLinkPage id={{id: userIdValue}} cliniciansList={allClinicians} />
  );
}

export default Clinicians;

