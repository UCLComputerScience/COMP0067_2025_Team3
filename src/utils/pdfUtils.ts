import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

interface ExportToPdfOptions {
  filename?: string
  orientation?: 'portrait' | 'landscape'
  unit?: 'pt' | 'mm' | 'cm' | 'in'
  format?: 'a4' | 'letter' | 'legal' | [number, number]
  quality?: number
  background?: string
  scale?: number
  onProgress?: (progress: number) => void
  onComplete?: () => void
}

/**
 * Exports a specified DOM element to PDF
 *
 * @param elementSelector - CSS selector for the element to export or the actual DOM element
 * @param options - Configuration options for the PDF export
 */
export const exportToPdf = async (
  elementSelector: string | HTMLElement,
  options: ExportToPdfOptions = {}
): Promise<void> => {
  try {
    const {
      filename = 'export.pdf',
      orientation = 'portrait',
      unit = 'mm',
      format = 'a4',
      quality = 0.95,
      background = '#ffffff',
      scale = 2,
      onProgress,
      onComplete
    } = options

    const element =
      typeof elementSelector === 'string' ? (document.querySelector(elementSelector) as HTMLElement) : elementSelector

    if (!element) {
      throw new Error(`Element ${elementSelector} not found`)
    }

    onProgress?.(0.1)

    const noPrintElements = element.querySelectorAll('.no-print')

    noPrintElements.forEach(el => {
      ;(el as HTMLElement).style.display = 'none'
    })

    const canvas = await html2canvas(element, {
      scale: scale,
      backgroundColor: background,
      logging: false,
      useCORS: true
    })

    noPrintElements.forEach(el => {
      ;(el as HTMLElement).style.display = ''
    })

    onProgress?.(0.5)

    const imgData = canvas.toDataURL('image/jpeg', quality)
    const pdf = new jsPDF(orientation, unit, format)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 0

    onProgress?.(0.75)

    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)

    pdf.save(filename)

    onProgress?.(1)
    onComplete?.()

    return Promise.resolve()
  } catch (error) {
    console.error('PDF export failed:', error)

    return Promise.reject(error)
  }
}
