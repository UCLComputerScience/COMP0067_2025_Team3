export const extractFileName = (filePath: string) => {
  if (process.env.NODE_ENV === 'development') {
    return filePath.split('\\').pop() || ''
  } else if (process.env.NODE_ENV === 'production') {
    return filePath.split('/').pop() || ''
  }

  return ''
}

// TODO: not allowed to open local files so find other solutions later
export const openFile = (filePath: string) => {
  console.log(filePath)
}
