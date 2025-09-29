export function sortItems(items, activeKey = 'active') {
  const sortByTitle = (a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })

  const activeItems = items.filter((item) => item[activeKey]).sort(sortByTitle)
  const inactiveItems = items.filter((item) => !item[activeKey]).sort(sortByTitle)

  return [...activeItems, ...inactiveItems]
}
