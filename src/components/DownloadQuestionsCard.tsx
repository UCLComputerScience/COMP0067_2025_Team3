'use client'

import { Button, Card, CardActions, CardHeader } from '@mui/material'

import { toast } from 'react-toastify'

import { generateQuestionsExport } from '@/actions/researcher/downloadActions'
import { downloadFile } from '@/utils/downloadUtils'

const DownloadQuestionsCard = () => {
  const handleDownloadOnClick = async () => {
    const questionsResult = await generateQuestionsExport()

    await downloadFile(questionsResult, `spider_questionnaire_questions.${questionsResult.fileExtension}`)
    toast.success('Questions downloaded successfully!')
  }

  return (
    <Card className='w-full'>
      <CardHeader
        title='Download Questions'
        subheader='Download the 31-question Spider questionnaire in CSV format for your research purposes.'
        className='pbe-4'
      />
      <CardActions>
        <Button type='submit' variant='outlined' color='primary' size='large' onClick={() => handleDownloadOnClick()}>
          <i className='ri-download-2-line mr-4' />
          Download
        </Button>
      </CardActions>
    </Card>
  )
}

export default DownloadQuestionsCard
