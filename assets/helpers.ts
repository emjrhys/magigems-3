export const sleep = (s) =>
  new Promise((resolve) => setTimeout(resolve, s * 1000))

export const getElementPosition = (el) => {
  const rect = el.getBoundingClientRect()
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  }
}

export const hexToRgbA = (hex, a = 1) => {
  let c
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('')
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x' + c.join('')
    return (
      'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `,${a})`
    )
  }
  throw new Error('Bad Hex')
}
