// src/composables/useSnippets.js
import { ref, computed } from 'vue'
import { loadSnippets, saveSnippets } from '@/utils/localStorage.js'

export function useSnippets(tech) {
  const snippetsByCategory = ref(loadSnippets()[tech] || {})
  const currentCategory = ref(Object.keys(snippetsByCategory.value)[0] || '')

  const filteredSnippets = computed(() => {
    const snippets = snippetsByCategory.value[currentCategory.value] || []
    return [...snippets].sort((a, b) => a.title.localeCompare(b.title))
  })

  function addSnippet(snippet) {
    const cat = snippet.category
    if (!snippetsByCategory.value[cat]) {
      snippetsByCategory.value[cat] = []
    }

    snippetsByCategory.value[cat].push({
      ...snippet,
      show: false,
    })

    save()
  }

  function deleteSnippet(index) {
    const cat = currentCategory.value
    const snippets = snippetsByCategory.value[cat]

    if (snippets && index >= 0 && index < snippets.length) {
      snippets.splice(index, 1)
      save()
    }
  }

  function toggleContent(index) {
    filteredSnippets.value[index].show = !filteredSnippets.value[index].show
    save()
  }

  function editSnippet(index, updatedData) {
    Object.assign(filteredSnippets.value[index], updatedData)
    save()
  }

  function save() {
    const all = loadSnippets()
    all[tech] = snippetsByCategory.value
    saveSnippets(all)
  }

  function deleteCategory(categoryName) {
    if (snippetsByCategory.value[categoryName]) {
      delete snippetsByCategory.value[categoryName]

      // Recalculer la catégorie actuelle
      const remaining = Object.keys(snippetsByCategory.value)
      currentCategory.value = remaining[0] || ''

      save()
    }
  }

  return {
    currentCategory,
    snippetsByCategory,
    filteredSnippets,
    addSnippet,
    deleteSnippet,
    toggleContent,
    editSnippet,
    save,
    deleteCategory,
  }
}
