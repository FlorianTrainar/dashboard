<!-- src/components/DraggableModal.vue -->
<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  title: String,
  closeOnOutside: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

const pos = ref({ x: 350, y: 60 })
let offset = { x: 0, y: 0 }
let dragging = false

const modal = ref(null)

function startDrag(e) {
  dragging = true
  offset = {
    x: e.clientX - modal.value.getBoundingClientRect().left,
    y: e.clientY - modal.value.getBoundingClientRect().top,
  }
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

function onDrag(e) {
  if (dragging) {
    pos.value = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    }
  }
}

function stopDrag() {
  dragging = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

function close() {
  emit('close')
}
</script>

<template>
  <div v-if="visible" class="modal-overlay" @mousedown.self="closeOnOutside ? close() : null">
    <div class="modal" ref="modal" :style="{ top: pos.y + 'px', left: pos.x + 'px' }">
      <div class="modal-header" @mousedown="startDrag">
        <button class="close-btn" @click="close">×</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.488);
  z-index: 10;
}

.modal-header {
  background-color: var(--back-color2-);
  padding: 10px;
  cursor: move;
}
.modal {
  position: absolute;
  width: 500px;
  background-color: var(--back-color2-);
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-title {
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: var(--font-color2-);
}

.modal-body {
  padding: 15px;
}
</style>
