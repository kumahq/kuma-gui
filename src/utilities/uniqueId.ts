let i = 0
export default (prefix = 'unique') => {
  i++
  return `${prefix}-${i}`
}
