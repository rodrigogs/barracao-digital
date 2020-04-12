export default (perc) => {
  let r
  const g = 0
  let b

  const normalizedPerc = perc < 100 ? perc : 100
  if (normalizedPerc < 50) {
    r = 255
    b = Math.round(5.1 * normalizedPerc)
  } else {
    b = 255
    r = Math.round(510 - 5.1 * normalizedPerc)
  }

  const h = r * 0x10000 + g * 0x100 + b * 0x1
  return `#000000${h.toString(16)}`.slice(-6)
}
