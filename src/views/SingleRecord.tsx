'use client';

import Result from '@/components/Result';

interface SingleRecordProps {
  data: { domain: string; totalScore: number; averageScore: number }[];
  date: string;
  perceivedSpidergramData?: any; // Replace 'any' with a proper type if available
  patientName?: string;
}

const SingleRecord = ({ data, date, perceivedSpidergramData, patientName }: SingleRecordProps) => {
  // Convert to the expected format
  const formattedData = data.map(({ domain, averageScore }) => ({
    subject: domain,
    [date]: averageScore
  }));

  return (
    <Result
      data={formattedData}
      domainData={data}
      date={date}
      perceivedSpidergramData={perceivedSpidergramData}
      patientName={patientName}
    />
  );
};

export default SingleRecord;
