export const sleep = (s) =>
  new Promise((resolve) => setTimeout(resolve, s * 1000))

export const getElementPosition = (el) => {
  const rect = el.getBoundingClientRect()
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  }
}
