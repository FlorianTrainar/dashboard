<script setup>
import { computed } from 'vue'

const props = defineProps({
  categories: Array,
  index: Number,
})

const emit = defineEmits(['update:index'])

const currentIndex = computed(() => props.index ?? 0)

const prevCategory = () => {
  const i = currentIndex.value
  const nextIndex = (i - 1 + props.categories.length) % props.categories.length
  emit('update:index', nextIndex)
}

const nextCategory = () => {
  const i = currentIndex.value
  const nextIndex = (i + 1) % props.categories.length
  emit('update:index', nextIndex)
}

const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <div class="flex flex-col items-center gap-1">
    <!-- NAV -->
    <div class="flex items-center gap-3">
      <button @click="prevCategory">
        <i-heroicons-chevron-left class="w-5 h-5 text-gray-300" />
      </button>

      <Transition name="slide" mode="out-in">
        <span
          :key="categories[currentIndex]"
          class="text-xl text-white font-medium min-w-[100px] text-center"
        >
          {{ capitalize(categories[currentIndex]) }}
        </span>
      </Transition>

      <button @click="nextCategory">
        <i-heroicons-chevron-right class="w-5 h-5 text-gray-300" />
      </button>
    </div>

    <!-- DOTS -->
    <div class="flex gap-1">
      <span
        v-for="(cat, i) in categories"
        :key="cat"
        class="w-2 h-2 rounded-full transition-all cursor-pointer"
        :class="i === currentIndex ? 'bg-white scale-125' : 'bg-slate-500'"
      />
    </div>
  </div>
</template>
<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
