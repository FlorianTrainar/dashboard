import { ref } from 'vue'

export function useModal() {
  const isVisible = ref(false)

  function open() {
    isVisible.value = true
  }

  function close() {
    isVisible.value = false
  }

  return {
    isVisible,
    open,
    close,
  }
}
