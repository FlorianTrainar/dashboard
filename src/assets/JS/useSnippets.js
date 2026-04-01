// useSnippets.js

export function useSnippets() {
  const createSnippet = () => {
    return {
      id: crypto.randomUUID(),
      title: '',
      content: '',
    }
  }

  const updateSnippetTitle = (snippet, value) => {
    snippet.title = value
  }

  const updateSnippetContent = (snippet, value) => {
    snippet.content = value
  }

  const deleteSnippet = (snippets, index) => {
    snippets.splice(index, 1)
  }

  return {
    createSnippet,
    updateSnippetTitle,
    updateSnippetContent,
    deleteSnippet,
  }
}
