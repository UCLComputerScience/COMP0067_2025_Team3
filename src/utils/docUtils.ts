export const extractFileName = (filePath: string) => {
  try {
    const fileNameWithNumbers = filePath.split('/').pop() || ''

    const fileName = fileNameWithNumbers.replace(/^\d+(-\d+)*-/, '')

    return fileName
  } catch (error) {
    console.error('Error extracting file name:', error)

    return ''
  }
}
