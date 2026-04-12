<script setup>
import { capitalize } from 'vue'

const props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: 'Sélectionner',
  },
  options: {
    type: Array,
    default: () => [],
  },
  modelValue: String,
})

const emit = defineEmits(['update:modelValue', 'close'])
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click="emit('close')"
  >
    <div class="flex flex-col gap-6 bg-slate-800 p-4 rounded-xl w-72 border border-slate-400">
      <!-- TITLE -->
      <h3 class="text-white text-center font-semibold">
        {{ title }}
      </h3>

      <!-- OPTIONS -->
      <div class="flex flex-col gap-2">
        <button
          v-for="option in options"
          :key="option"
          @click="
            () => {
              emit('update:modelValue', option)
              emit('close')
            }
          "
          class="px-3 py-2 rounded text-sm transition"
          :class="
            option === modelValue ? 'bg-blue-500 text-slate-50' : 'bg-slate-700/50  text-gray-300'
          "
        >
          {{ capitalize(option) }}
        </button>
      </div>

      <!-- CANCEL -->
      <button
        @click="emit('close')"
        class="w-full bg-slate-600 text-slate-50 text-sm px-3 py-2 rounded"
      >
        Annuler
      </button>
    </div>
  </div>
</template>
