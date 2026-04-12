<script setup>
import { computed } from 'vue'
const props = defineProps({
  title: String,
  showBack: Boolean,
  showCreate: Boolean,
  showSort: Boolean,
  size: {
    type: String,
    default: 'normal',
  },
})

const emit = defineEmits(['back', 'create', 'sort'])

const titleClass = computed(() => {
  return props.size === 'xl' ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
})
</script>

<template>
  <div
    class="min-h-[80px] fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/80 shadow-sm shadow-slate-950"
  >
    <div class="min-h-[80px] max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
      <button
        v-if="showBack"
        @click="emit('back')"
        class="rounded-lg hover:bg-slate-800/60 transition"
      >
        <i-heroicons-arrow-left-circle class="text-2xl text-gray-300" />
      </button>
      <button
        v-if="showSort"
        @click="emit('sort')"
        class="rounded-lg hover:bg-slate-800/60 transition"
      >
        <i-heroicons-bars-arrow-up class="w-5 h-5 text-gray-300" />
      </button>

      <div class="press-start flex-1 flex justify-center px-1">
        <slot name="center">
          <div class="flex items-center gap-2">
            <!-- <slot name="icon" class="text-2xl" /> -->
            <h1 v-if="title" :class="['font-semibold text-center', titleClass]">
              {{ title }}
            </h1>
          </div>
        </slot>
      </div>

      <button v-if="showCreate" @click="emit('create')">
        <i-heroicons-folder-plus-solid class="w-8 h-8 text-green-600" />
      </button>
    </div>
  </div>
</template>
