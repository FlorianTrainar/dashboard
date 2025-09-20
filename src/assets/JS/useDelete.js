import { ref } from 'vue'

export function useDelete() {
  const showConfirm = ref(false)
  const confirmMessage = ref('')
  const onConfirmAction = ref(() => {})

  function askConfirmation(message, action) {
    confirmMessage.value = message
    onConfirmAction.value = action
    showConfirm.value = true
  }

  function handleConfirm() {
    if (typeof onConfirmAction.value === 'function') {
      onConfirmAction.value()
    }
    showConfirm.value = false
  }

  function handleCancel() {
    showConfirm.value = false
  }

  return {
    showConfirm,
    confirmMessage,
    askConfirmation,
    handleConfirm,
    handleCancel,
  }
}
