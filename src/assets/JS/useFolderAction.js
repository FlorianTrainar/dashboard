import { ref } from 'vue'
import { selectedFolderIdGlobal } from '@/assets/JS/useDashboardState'

export function useFolderActions(deleteFolderFn) {
  const showConfirm = ref(false)
  const folderToDelete = ref(null)
  const openMenuId = ref(null)

  // OPEN
  const openFolder = (folder) => {
    openMenuId.value = null
    selectedFolderIdGlobal.value = folder.id
  }

  const closeFolder = () => {
    selectedFolderIdGlobal.value = null
  }

  // MENU
  const toggleMenu = (id) => {
    openMenuId.value = openMenuId.value === id ? null : id
  }

  // DELETE
  const askDelete = (id) => {
    folderToDelete.value = id
    showConfirm.value = true
  }

  const confirmDelete = async () => {
    if (folderToDelete.value) {
      await deleteFolderFn(folderToDelete.value)
    }

    showConfirm.value = false
    folderToDelete.value = null
    openMenuId.value = null
  }

  const cancelDelete = () => {
    showConfirm.value = false
    folderToDelete.value = null
  }

  return {
    // state
    showConfirm,
    folderToDelete,
    openMenuId,

    // actions
    openFolder,
    closeFolder,
    toggleMenu,
    askDelete,
    confirmDelete,
    cancelDelete,
  }
}
