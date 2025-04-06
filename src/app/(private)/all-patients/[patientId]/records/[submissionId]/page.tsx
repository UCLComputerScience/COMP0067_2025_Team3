// action
import { getSingleRecordProps } from '@/actions/records/recordAction'

// component
import SingleRecord from '@/views/SingleRecord'

interface PageProps {
  params: Promise<{
    submissionId: string
  }>
}

const Page = async ({ params }: PageProps) => {
  const { submissionId } = await params

  const { scores, formattedDate, patientName, perceivedSpidergramValues } = await getSingleRecordProps(submissionId)

  return (
    <SingleRecord
      data={scores}
      date={formattedDate}
      patientName={patientName}
      perceivedSpidergramData={perceivedSpidergramValues}
    />
  )
}

export default Page
