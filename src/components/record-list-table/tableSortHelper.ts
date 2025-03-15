export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const valueA = a[orderBy]
  const valueB = b[orderBy]

  // Convert Date objects to timestamps for proper sorting
  const numA = valueA instanceof Date ? valueA.getTime() : Number(valueA)
  const numB = valueB instanceof Date ? valueB.getTime() : Number(valueB)

  if (isNaN(numA) || isNaN(numB)) {
    throw new Error(`Invalid value for sorting: ${valueA}, ${valueB}`)
  }

  if (numB < numA) return -1
  if (numB > numA) return 1
  
return 0
}

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (a: Record<Key, string | number | Date>, b: Record<Key, string | number | Date>) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}
