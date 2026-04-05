<script setup>
import PageHeader from '@/components/ui/PageHeader.vue'
import ReminderSection from '@/components/home/ReminderSection.vue'

import { selectedFolderIdGlobal, selectedProjectIdGlobal } from '@/assets/JS/useDashboardState'

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/assets/JS/useAuth'

import { useDashboardData } from '@/assets/JS/useDashboardData'

const { allTasks } = useDashboardData()

const { login, isLoading, user } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref(null)

async function handleLogin() {
  error.value = null
  try {
    await login(email.value, password.value)
    router.push({ name: 'home' })
  } catch (e) {
    error.value = e.message || 'Erreur lors de la connexion'
  }
}

const todayTasks = computed(() => {
  const today = new Date()
  const todayStart = new Date(today.toDateString())

  return allTasks.value
    .filter((t) => {
      if (!t.deadline) return false
      const d = new Date(t.deadline.seconds * 1000)
      const dStart = new Date(d.toDateString())

      return dStart <= todayStart && !t.done
    })
    .sort((a, b) => a.deadline.seconds - b.deadline.seconds)
})

const upcomingTasks = computed(() => {
  const today = new Date()

  return allTasks.value
    .filter((t) => {
      if (!t.deadline) return false
      const d = new Date(t.deadline.seconds * 1000)

      return d > today && !t.done
    })
    .sort((a, b) => a.deadline.seconds - b.deadline.seconds)
})

const getDaysRemaining = (timestamp) => {
  if (!timestamp) return ''

  const today = new Date()
  const todayStart = new Date(today.toDateString())

  const d = new Date(timestamp.toDate())
  const dStart = new Date(d.toDateString())

  const diff = Math.round((dStart - todayStart) / (1000 * 60 * 60 * 24))

  if (diff < -1) return `Retard : ${Math.abs(diff)} jrs `

  if (diff <= 1) return ''
  return `${diff} jrs`
}

const openFolder = (r) => {
  selectedFolderIdGlobal.value = r.folderId
  selectedProjectIdGlobal.value = r.projectId
  router.push('/dashboard')
}
</script>

<template>
  <main class="wrapper">
    <PageHeader title="Floboard" />
    <!-- Login -->
    <div v-if="!user" class="flex flex-col gap-2 items-center">
      <h2>Connexion</h2>
      <form @submit.prevent="handleLogin" v-if="!isLoading" class="flex flex-col gap-2">
        <label>Email</label>
        <input v-model="email" type="email" required />

        <label>Mot de passe</label>
        <input v-model="password" type="password" required />

        <button type="submit" class="bg-green-700 rounded-lg mt-6">Se connecter</button>
      </form>
      <p v-if="error" style="color: red">{{ error }}</p>
    </div>

    <!-- Board -->
    <div v-else class="space-y-6 mt-4">
      <ReminderSection
        :reminders="todayTasks"
        type="today"
        :getDaysRemaining="getDaysRemaining"
        @open="openFolder"
      />

      <div class="w-1/2 mx-auto border border-dotted border-slate-300/30"></div>

      <ReminderSection
        :reminders="upcomingTasks"
        type="upcoming"
        :getDaysRemaining="getDaysRemaining"
        @open="openFolder"
      />
    </div>
  </main>
</template>
