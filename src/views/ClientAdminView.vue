<script setup>
import { initClient } from '@/firebaseClients'
import { useRouter } from 'vue-router'

const router = useRouter()

const openClient = async (client) => {
  localStorage.setItem('activeClient', JSON.stringify(client))

  const { db, auth } = await initClient(client)

  window.clientDb = db
  window.clientAuth = auth

  router.push('/ddcoreen-admin')
}
</script>

<template>
  <main class="wrapper">
    <h1>Admin Clients</h1>

    <div class="space-y-3">
      <div
        v-for="client in clients"
        :key="client.name"
        class="flex items-center justify-between bg-slate-800 p-3 rounded-lg"
      >
        <span class="text-white">{{ client.name }}</span>

        <button @click="openClient(client)">
          <i-heroicons-arrow-right-circle class="text-2xl" />
        </button>
      </div>
    </div>
  </main>
</template>
