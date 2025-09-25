<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/assets/JS/useAuth'

const { login, isLoading } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref(null)

async function handleLogin() {
  error.value = null
  try {
    await login(email.value, password.value)
    router.push({ name: 'floboard' })
  } catch (e) {
    error.value = e.message || 'Erreur lors de la connexion'
  }
}
</script>

<template>
  <main>
    <h2>Connexion</h2>
    <form @submit.prevent="handleLogin" v-if="!isLoading">
      <label>Email</label>
      <input v-model="email" type="email" required />

      <label>Mot de passe</label>
      <input v-model="password" type="password" required />

      <button type="submit">Se connecter</button>
    </form>
    <p v-if="error" style="color: red">{{ error }}</p>
  </main>
</template>
