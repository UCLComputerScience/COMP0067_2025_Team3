import { useState } from 'react'

import { useSession } from 'next-auth/react'

import { Toolbar, alpha, Typography, Button, CircularProgress } from '@mui/material'
import { Role } from '@prisma/client'

interface EnhancedTableToolbarProps {
  numSelected: number
  handleDisplayDataOnClick: (numSelected: number) => void
  selectedRecords: any[]
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { data: session } = useSession()
  const { numSelected, handleDisplayDataOnClick, selectedRecords } = props
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const userRole = session?.user.role

  const handleDownloadReport = async () => {
    if (numSelected === 0 || isExporting) return

    setIsExporting(true)
    setExportProgress(0)

    try {
      const jsPDF = (await import('jspdf')).default
      const html2canvas = (await import('html2canvas')).default

      const mainPdf = new jsPDF('portrait', 'mm', 'a4')

      for (let i = 0; i < selectedRecords.length; i++) {
        const record = selectedRecords[i]

        setExportProgress(Math.round((i / selectedRecords.length) * 100))

        try {
          const iframe = document.createElement('iframe')

          iframe.style.width = '1200px'
          iframe.style.height = '800px'
          iframe.style.position = 'absolute'
          iframe.style.top = '-9999px'
          iframe.style.left = '-9999px'

          document.body.appendChild(iframe)

          await new Promise<void>((resolve, reject) => {
            iframe.onload = () => resolve()
            iframe.onerror = () => reject(new Error(`Failed to load record ${record.submissionId}`))
            iframe.src = (() => {
              if (userRole === Role.PATIENT) {
                return `/my-records/${record.submissionId}`
              } else if (userRole === Role.CLINICIAN) {
                if (!record.patientId) {
                  const currentPath = window.location.pathname
                  const patientPathMatch = currentPath.match(/\/all-patients\/([^\/]+)/)

                  if (patientPathMatch) {
                    return `/all-patients/${patientPathMatch[1]}/records/${record.submissionId}`
                  } else {
                    console.error('Cannot determine patientId for record:', record)
                    throw new Error('Patient ID not found for record')
                  }
                }
                return `/all-patients/${record.patientId}/records/${record.submissionId}`
              } else {
                console.error('Unsupported user role for PDF generation:', userRole)
                throw new Error('Unsupported user role for PDF generation')
              }
            })()
          })

          await new Promise(r => setTimeout(r, 1500))

          const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document

          if (!iframeDocument) throw new Error('Could not access iframe document')

          const mainStyles = document.querySelectorAll('link[rel="stylesheet"], style')

          mainStyles.forEach(style => {
            const styleClone = style.cloneNode(true)

            iframeDocument.head.appendChild(styleClone)
          })

          const fontStyle = document.createElement('style')

          fontStyle.textContent = `
            /* Ensure fonts are properly loaded in the iframe */
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
            
            * {
              font-family: Outfit, Arial, sans-serif !important;
            }
            
            /* Force apply MUI styles if needed */
            .MuiTypography-h2, h2 {
              font-family: Outfit, Arial, sans-serif !important;
              font-weight: 600 !important;
            }
            
            .MuiTypography-body1, p {
              font-family: Outfit, Arial, sans-serif !important;
            }
          `
          iframeDocument.head.appendChild(fontStyle)

          await new Promise(r => setTimeout(r, 200))

          const contentElement = iframeDocument.querySelector('.p-8.space-y-6') as HTMLElement

          if (!contentElement) throw new Error('Content element not found')

          const noPrintElements = contentElement.querySelectorAll('.no-print')

          noPrintElements.forEach(el => {
            ;(el as HTMLElement).style.display = 'none'
          })

          const pdfBackground =
            getComputedStyle(document.documentElement).getPropertyValue('--mui-palette-background-default').trim() ||
            '#ffffff'

          const boxBackground =
            getComputedStyle(document.documentElement).getPropertyValue('--mui-palette-customColors-bodyBg').trim() ||
            '#ffffff'

          if (selectedRecords.length > 1) {
            const header = document.createElement('div')

            header.style.padding = '10px'
            header.style.marginBottom = '15px'
            header.style.backgroundColor = boxBackground
            header.style.borderRadius = '4px'
            header.style.fontFamily = 'Outfit, Arial, sans-serif' // Explicitly set font
            header.innerHTML = `
              <h3 style="margin: 0; font-family: Outfit, Arial, sans-serif !important; font-weight: 500;">Record ${i + 1} of ${selectedRecords.length}</h3>
              <p style="margin: 5px 0 0 0; font-family: Outfit, Arial, sans-serif !important;">ID: ${record.submissionId}</p>
            `
            contentElement.insertBefore(header, contentElement.firstChild)
          }

          const allElements = contentElement.querySelectorAll('*')

          allElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.fontFamily = 'Outfit, Arial, sans-serif'
            }
          })

          const canvas = await html2canvas(contentElement, {
            scale: 2,
            backgroundColor: pdfBackground,
            logging: false,
            useCORS: true,
            allowTaint: true,
            onclone: clonedDoc => {
              const elements = clonedDoc.querySelectorAll('*')

              elements.forEach(el => {
                if (el instanceof HTMLElement) {
                  el.style.fontFamily = 'Outfit, Arial, sans-serif'
                }
              })
            }
          })

          noPrintElements.forEach(el => {
            ;(el as HTMLElement).style.display = ''
          })

          if (i > 0) {
            mainPdf.addPage()
          }

          const imgData = canvas.toDataURL('image/jpeg', 0.95)
          const pdfWidth = mainPdf.internal.pageSize.getWidth()
          const pdfHeight = mainPdf.internal.pageSize.getHeight()
          const imgWidth = canvas.width
          const imgHeight = canvas.height
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
          const imgX = (pdfWidth - imgWidth * ratio) / 2
          const imgY = 0

          mainPdf.setFillColor(pdfBackground)
          mainPdf.rect(0, 0, pdfHeight, pdfHeight, 'F')

          mainPdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)

          if (selectedRecords.length > 1 && contentElement.firstChild) {
            contentElement.removeChild(contentElement.firstChild)
          }

          document.body.removeChild(iframe)
        } catch (error) {
          console.error(`Error exporting record ${record.submissionId}:`, error)
        }
      }

      mainPdf.save(`selected-records-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (error) {
      console.error('Failed to export records:', error)
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 }
        },
        numSelected > 0 && {
          bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        }
      ]}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%', ml: 2 }} color='inherit' variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%', ml: 2 }} variant='h6' id='tableTitle' component='div'>
          Records
        </Typography>
      )}

      {
        <>
          <Button
            sx={{
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              display: 'flex',
              alignItems: 'center',
              mr: 2
            }}
            variant='outlined'
            color='primary'
            startIcon={<i className='ri-pie-chart-line' />}
            onClick={() => handleDisplayDataOnClick(numSelected)}
          >
            Display Data
          </Button>
          <Button
            sx={{
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              display: 'flex',
              alignItems: 'center',
              mr: 2
            }}
            variant='contained'
            color='primary'
            startIcon={
              isExporting ? <CircularProgress size={20} color='inherit' /> : <i className='ri-download-2-line' />
            }
            onClick={handleDownloadReport}
            disabled={numSelected === 0 || isExporting}
          >
            {isExporting ? (exportProgress > 0 ? `Exporting ${exportProgress}%` : 'Exporting...') : 'Download Report'}
          </Button>
        </>
      }
    </Toolbar>
  )
}

export default EnhancedTableToolbar
