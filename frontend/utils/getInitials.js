export default (name = '') => {
  const [first, ...rest] = name.split(' ')
  if (!first) return '-'
  if (!rest || rest.length === 0) return first[0]
  return `${first[0]}${rest.pop()[0]}`
}
