export const upsert = <T extends { id?: EntityID }>(arr: T[], item: T) => {
  const newItem = { ...item }
  if (!newItem.id || newItem.id < 0) {
    newItem.id = nextID(arr)
    console.log(newItem.id)
    return [...arr, newItem]
  }
  return arr.map(i => {
    if (i.id === item.id) {
      return item
    }
    return i
  })
}

export const remove = <T extends { id?: EntityID }>(arr: T[], item: T) =>
  arr.filter(i => i.id !== item.id)

export const nextID = <T extends { id?: EntityID }>(arr: T[]) =>
  arr.reduce((acc, i) => {
    return Math.max(i.id || 0, acc)
  }, 0) + 1
