<script setup>
import { useTaskUtils } from '@/assets/JS/useTaskUtils'
import { formatSmartDate } from '@/utils/formatDate'

const props = defineProps({
  title: String,
  reminders: Array,
  type: String, // 'overdue' | 'today' | 'upcoming'
  formatDate: Function,
  getDaysRemaining: Function,
})

const { getTaskClass } = useTaskUtils()

const emit = defineEmits(['open'])
</script>

<template>
  <div v-if="reminders.length">
    <!-- TITLE -->
    <h2 class="text-lg font-semibold text-center text-white mb-2">
      {{ title }}
    </h2>

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
              <div class="flex items-end text-slate-200">
                <i-heroicons-folder-open-solid class="text-sm" />
                <p class="text-xs">{{ r.folderTitle }}</p>
              </div>
              <div class="flex items-end ml-1 text-slate-300">
                <i-heroicons-arrow-turn-down-right class="text-sm" />
                <p class="text-xs">{{ r.projectTitle }}</p>
              </div>
            </div>

            <!-- DATE -->
            <div class="flex flex-col items-end">
              <span v-if="getDaysRemaining(r.deadline)" class="text-xs">
                {{ getDaysRemaining(r.deadline) }}
              </span>
              <span class="text-xs">
                {{ formatSmartDate(r.deadline) }}
              </span>
            </div>
          </div>

          <!-- TEXT -->
          <p class="text-sm my-2 px-2">
            {{ r.text }}
          </p>
        </div>
      </button>
    </div>
  </div>
</template>
