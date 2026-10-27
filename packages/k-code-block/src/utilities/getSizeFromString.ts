export const getSizeFromString = (sizeStr: string): string => {
  const numeric = Number(sizeStr)
  return !Number.isNaN(numeric) ? `${numeric}px` : sizeStr
}
