import { nextTick } from 'vue'

export function useTextareaAutoResize(selector = '.auto-resize-textarea') {
  function resize(el) {
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }

  function resizeAll() {
    nextTick(() => {
      const els = document.querySelectorAll(selector)
      els.forEach(resize)
    })
  }

  return {
    resize,
    resizeAll,
  }
}
