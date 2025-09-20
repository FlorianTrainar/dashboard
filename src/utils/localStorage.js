const STORAGE_KEY = 'my-snippets-by-tech'

export function loadSnippets() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : {}
}

export function saveSnippets(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
