<script setup>
import { useTaskUtils } from '@/assets/JS/useTaskUtils'
import { formatSmartDate } from '@/utils/formatDate'

const props = defineProps({
  reminders: Array,
  type: String, // 'overdue' | 'today' | 'upcoming'
  formatDate: Function,
  getDaysRemaining: Function,
})

const { getTaskClass } = useTaskUtils()

const emit = defineEmits(['open'])
</script>

<template>
  <!-- EMPTY STATE -->
  <div v-if="!reminders.length" class="flex flex-col items-center gap-2 py-2 text-lime-400/70">
    <i-heroicons-check-circle class="w-8 h-8 opacity-50" />
    <p v-if="type === 'today'">Tout est fait pour aujourd’hui !</p>
    <p v-else>Aucune tâche à venir !</p>
  </div>
  <div v-if="reminders.length">
    <!-- LIST -->
    <div class="flex flex-col items-center gap-2">
      <button
        v-for="r in reminders"
        :key="r.id"
        @click="emit('open', r)"
        class="w-[95%] text-left rounded-lg bg-slate-800 border border-slate-400/50 hover:bg-slate-700 transition"
      >
        <div class="flex flex-col gap-1">
          <!-- HEADER -->
          <div
            class="flex justify-between items-center px-2 py-1 border-b border-slate-400/50 rounded-t-lg"
            :class="getTaskClass(r.deadline)"
          >
            <div class="flex flex-col">
              <div class="flex items-center gap-1 text-slate-200">
                <i-heroicons-folder-open-solid />
                <p>{{ r.folderTitle }}</p>
              </div>
              <div
                v-if="r.projectTitle"
                class="flex items-center gap-1 ml-1 text-slate-300 text-xs"
              >
                <i-heroicons-arrow-turn-down-right />
                <p class="text-sm">{{ r.projectTitle }}</p>
              </div>
            </div>

            <!-- DATE -->
            <div class="flex flex-col items-end">
              <span v-if="getDaysRemaining(r.deadline)" class="text-sm">
                {{ getDaysRemaining(r.deadline) }}
              </span>
              <span class="text-sm">
                {{ formatSmartDate(r.deadline) }}
              </span>
            </div>
          </div>

          <!-- TEXT -->
          <p class="my-2 px-2">
            {{ r.text }}
          </p>
        </div>
      </button>
    </div>
  </div>
</template>
