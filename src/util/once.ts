export const once = (fn: (...args: any[]) => void) => {
  let done = false
  return (...args: any[]) => {
    if (!done) {
      done = true
      fn(...args)
    }
  }
}

export default once
