<script setup>
defineProps({
  label: String,
})

const emit = defineEmits(['click'])
</script>

<template>
  <button @click="emit('click')">
    <i-heroicons-folder-plus-solid class="text-4xl" />
  </button>
</template>
