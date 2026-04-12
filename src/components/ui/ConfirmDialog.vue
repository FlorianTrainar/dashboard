<script setup>
const props = defineProps({
  message: String,
  visible: Boolean,
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
  >
    <div
      class="bg-slate-800 text-white rounded-xl p-6 w-[300px] text-center shadow-xl border border-slate-400"
    >
      <p class="text-base mb-4">
        {{ message }}
      </p>

      <div class="flex justify-around gap-4">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 text-sm font-semibold transition"
        >
          Annuler
        </button>

        <button
          @click="$emit('confirm')"
          class="px-4 py-2 rounded-md bg-red-500 text-sm font-semibold transition"
        >
          Confirmer
        </button>
      </div>
    </div>
  </div>
</template>
