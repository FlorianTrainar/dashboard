import { ref } from 'vue'

export function useEdit() {
  const editIndex = ref(null)
  const editData = ref({
    title: '',
    description: '',
    content: '',
    tags: [],
  })

  function startEdit(snippet, index) {
    editIndex.value = index

    editData.value = {
      title: snippet.title,
      description: snippet.description || '',
      content: snippet.content,
      tags: snippet.tags || [],
    }
  }

  function cancelEdit() {
    editIndex.value = null
    editData.value = {
      title: '',
      description: '',
      content: '',
      tags: [],
    }
  }

  return {
    editIndex,
    editData,
    startEdit,
    cancelEdit,
  }
}
