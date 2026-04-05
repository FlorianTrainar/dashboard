import { ref } from 'vue'

export function useSwipe({ onLeft, onRight, threshold = 50 }) {
  const startX = ref(0)

  const getX = (e) => {
    return e.changedTouches ? e.changedTouches[0].clientX : e.clientX
  }

  const onTouchStart = (e) => {
    startX.value = getX(e)
  }

  const onTouchEnd = (e) => {
    const endX = getX(e)
    const diff = startX.value - endX

    if (Math.abs(diff) < threshold) return

    if (diff > 0) {
      onLeft?.()
    } else {
      onRight?.()
    }
  }

  return {
    onTouchStart,
    onTouchEnd,
  }
}
