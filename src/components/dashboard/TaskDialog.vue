<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  visible: Boolean,
  task: Object,
})

const emit = defineEmits(['close', 'update', 'delete'])

const localTask = ref(null)

watch(
  () => props.task,
  (t) => {
    if (t) {
      localTask.value = { ...t }
    }
  },
  { immediate: true },
)

const save = () => {
  emit('update', localTask.value)
  emit('close')
}

const remove = () => {
  emit('delete', localTask.value)
  emit('close')
}
</script>

<template>
  <div
    v-if="visible"
    @click="emit('close')"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm text-black"
  >
    <div @click.stop class="bg-slate-800 p-4 rounded-xl w-80 space-y-4 border border-slate-400">
      <h3 class="text-white text-center font-semibold">Modifier la tâche</h3>

      <!-- DATE -->
      <input type="date" v-model="localTask.date" class="w-full px-2 py-1 rounded cursor-pointer" />

      <!-- RECURRENCE -->
      <select v-model="localTask.recurrence" class="w-full px-2 py-1 rounded">
        <option :value="null">Ponctuel</option>
        <option value="jours">Quotidien</option>
        <option value="semaines">Hebdo</option>
        <option value="mois">Mensuel</option>
        <option value="trimestres">Trimestriel</option>
        <option value="années">Annuel</option>
      </select>

      <!-- ACTIONS -->
      <div class="flex justify-between gap-2 mt-4">
        <button @click="remove" class="flex-1 bg-red-500 text-white py-1 rounded">Supprimer</button>

        <button @click="save" class="flex-1 bg-green-500 text-white py-1 rounded">Valider</button>
      </div>

      <button @click="emit('close')" class="w-full text-gray-400 text-sm mt-2">Annuler</button>
    </div>
  </div>
</template>
