export const downloadFile = async (
  exportResult: { data: string; mimeType: string; fileExtension: string },
  fileName: string
) => {
  let blob: Blob

  if (exportResult.fileExtension === 'xlsx') {
    const byteCharacters = atob(exportResult.data)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    blob = new Blob([byteArray], { type: exportResult.mimeType })
  } else {
    blob = new Blob([exportResult.data], { type: exportResult.mimeType })
  }

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return new Promise(resolve => setTimeout(resolve, 500))
}
