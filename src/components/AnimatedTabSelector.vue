<!-- components/AnimatedTabSelector.vue -->
<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  categories: {
    type: Array, // tableau d'objets { key, label, icon }
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const catButtons = ref([])
const highlightStyle = ref({})

// === Met à jour la position du highlight ===
function updateHighlight() {
  const index = props.categories.findIndex((cat) => cat.key === props.modelValue)
  const btn = catButtons.value[index]
  if (!btn) return

  highlightStyle.value = {
    width: `${btn.offsetWidth}px`,
    transform: `translateX(${btn.offsetLeft}px)`,
  }
}

onMounted(() => {
  nextTick(() => {
    updateHighlight()
  })
  window.addEventListener('resize', updateHighlight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHighlight)
})

watch(
  () => props.modelValue,
  async () => {
    await nextTick()
    updateHighlight()
  },
)
</script>

<template>
  <div class="cat-selector">
    <div class="cat-highlight" :style="highlightStyle"></div>

    <button
      v-for="(cat, i) in categories"
      :key="cat.key"
      ref="catButtons"
      class="cat-btn"
      :class="{ active: modelValue === cat.key }"
      @click="emit('update:modelValue', cat.key)"
    >
      <p v-if="modelValue === cat.key">{{ cat.label }}</p>
      <div v-else><font-awesome-icon :icon="cat.icon" /></div>
    </button>
  </div>
</template>
<style scoped>
.cat-selector {
  position: relative;
  display: flex;
  background-color: var(--back-color1-);
  border-radius: 20px;
  overflow: hidden;
  width: 95%;
  margin: 0 auto 40px;
}
.cat-highlight {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  background-color: var(--back-color3-);
  border-radius: 20px;
  z-index: 0;
  transition:
    transform 0.3s ease,
    width 0.3s ease;
}
.cat-selector > .cat-btn {
  flex: 1;
  font-size: 1.2rem;
  padding: 6px;
  position: relative;
  z-index: 1;
  background: none;
  border: none;
  color: var(--font-color2-);
  transition: color 0.3s ease;
}
.cat-btn.active {
  color: var(--selected-color-);
}
</style>
