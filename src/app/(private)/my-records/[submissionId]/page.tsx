// MUI
import { notFound } from 'next/navigation'

// Prisma
import { prisma } from '@/prisma/client'

import Record from '@/views/SingleRecord'

interface PageProps {
  params: {
    submissionId: string
  }
}

const getRecords = async (submissionId: string) => {   
  const records = await prisma.response.findMany({
    where: { submissionId },
    select: {
      score: true,
      domain: true,
      createdAt: true
    }
  })

  return records
}

const calculateScores = (records: { score: number; domain: string }[]) => {
  const domainScores: Record<string, { total: number; count: number }> = {}

  records.forEach(({ score, domain }) => {
    if (!domainScores[domain]) {
      domainScores[domain] = { total: 0, count: 0 }
    }

    domainScores[domain].total += score
    domainScores[domain].count += 1
  })

  return Object.entries(domainScores).map(([domain, { total, count }]) => ({
    domain,
    totalScore: total,
    averageScore: total / count
  }))
}

const Page = async ({ params }: PageProps) => {
  const { submissionId } = params
  const records = await getRecords(submissionId)

  if (!records || records.length === 0) {
    notFound()
  }

  const scores = calculateScores(records)
  const submissionDate = records[0].createdAt

  const formattedDate = new Date(submissionDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Pass user data to the client component
  return <Record data={scores} date={formattedDate} />
}

export default Page

  // return (
  //   <div>
  //     <h1>Submission Summary</h1>
  //     {scores.map(({ domain, totalScore, averageScore }) => (
  //       <div key={domain}>
  //         <h2>{domain}</h2>
  //         <p>Total Score: {totalScore}</p>
  //         <p>Average Score: {averageScore.toFixed(2)}</p>
  //       </div>
  //     ))}
  //   </div>
  // )







// import { Card, CardContent, Button, Switch, Typography, Box, FormGroup, FormControlLabel } from "@mui/material";
// import RechartsRadarChart from '@/components/charts/recharts/RechartsRadarChart'
  


// interface DataEntry {
//     subject: string
//     [date: string]: string | number
//   }
  
//   // Props for the radar chart component
//   interface Props {
//     data?: DataEntry[]
//   }
// const demoData = [
//     { subject: "Neuromusculoskeletal", "29 April 2025": 50 },
//     { subject: "Pain", "29 April 2025": 40 },
//     { subject: "Fatigue", "29 April 2025": 70 },
//     { subject: "Gastrointestinal", "29 April 2025": 45 },
//     { subject: "Cardiac Dysautonomia", "29 April 2025": 40 },
//     { subject: "Urogenital", "29 April 2025": 20 },
//     { subject: "Anxiety", "29 April 2025": 90 },
//     { subject: "Depression", "29 April 2025": 10 }
//   ];

// //   const convertToDomainData = (data: DataEntry) => {
// //     return Object.entries(data)
// //       .filter(([key]) => key !== 'subject')
// //       .map(([date, total]) => ({
// //         date,
// //         total: total as number
// //       }))
// //   }

//   const Dashboard = ({ data = demoData }: Props) => {
//   return (
//     <div className="p-8 space-y-6">
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
//             {/* Left side (Title & Subtitle) */}
//             <Box>
//                 <h1 className="text-2xl font-semibold">29 April 2025</h1>
//                 <h2 className="text-4xl font-bold">Total Score: 98</h2>
//             </Box>

//             {/* Right side (Button & Switch) */}
//             <Box sx={{ display: 'flex',flexDirection: 'column', alignItems: 'flex-end', gap: 1}}>
//                 <Button variant="contained" color="primary" startIcon={<i className="ri-download-2-fill" />}>
//                     Export
//                 </Button>
//                 <FormGroup>
//                     <FormControlLabel
//                         control={
//                         <Switch/>
//                         }
//                         label='Display perceived spidergram'
//                     />
//                 </FormGroup>
//             </Box>
//         </Box>
    
//       <Card className="p-4">
//         <CardContent>
//             <RechartsRadarChart legend={false} data={data} />
//         </CardContent>
//       </Card>
      
//       <Card>
//         <CardContent>
//             <Typography variant='h5' gutterBottom>
//                 Domain Scores
//             </Typography>
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b">
//                 <th className="py-2">Domain</th>
//                 <th className="py-2">Total</th>
//                 <th className="py-2">Average</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="py-2">{item.subject}</td>
//                   <td className="py-2">xx</td>
//                   <td className="py-2">yy</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
// export default Dashboard
