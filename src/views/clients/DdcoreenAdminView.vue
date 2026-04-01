<script setup>
import { ref, computed, onMounted, watch } from 'vue'

import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { initClient } from '@/firebaseClients'

let db = null
let auth = null

const email = ref('')
const password = ref('')
const isLogged = ref(false)

const login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    isLogged.value = true
    await loadCourses()
  } catch (e) {
    alert('Erreur login')
  }
}

let courseRef = null
const levels = ref([])
const selectedLevelId = ref('')
const selectedVideoId = ref('')

const videoTitle = ref('')
const videoDescription = ref('')
const bunnyId = ref('')
const thumbnailUrl = ref('')
const supportCourseUrl = ref('')
const supportExerciseUrl = ref('')
const supportCorrectionUrl = ref('')
const videoOrder = ref('')

/**
 * Load courses
 */
const loadCourses = async () => {
  const snap = await getDoc(courseRef)
  levels.value = snap.data()?.levels || []
}

/**
 * Computed
 */

const selectedLevel = computed(() => levels.value.find((l) => l.id === selectedLevelId.value))

const videos = computed(() => {
  if (!selectedLevel.value) return []

  return [...selectedLevel.value.videos].sort((a, b) => a.order - b.order)
})

const selectedVideo = computed(() => videos.value.find((v) => v.id === selectedVideoId.value))

/**
 * Auto fill form
 */

watch(selectedVideo, (video) => {
  if (!video) return

  videoTitle.value = video.title || ''
  videoDescription.value = video.description || ''
  bunnyId.value = video.videoId || ''
  thumbnailUrl.value = video.thumbnailUrl || ''
  supportCourseUrl.value = video.supportCourseUrl || ''
  supportExerciseUrl.value = video.supportExerciseUrl || ''
  supportCorrectionUrl.value = video.supportCorrectionUrl || ''
  videoOrder.value = video.order || ''
})

/**
 * Save video
 */

const saveVideo = async () => {
  const level = levels.value.find((l) => l.id === selectedLevelId.value)
  const video = level?.videos.find((v) => v.id === selectedVideoId.value)

  if (!video) return

  video.title = videoTitle.value
  video.description = videoDescription.value
  video.videoId = bunnyId.value
  video.thumbnailUrl = thumbnailUrl.value
  video.supportCourseUrl = supportCourseUrl.value
  video.supportExerciseUrl = supportExerciseUrl.value
  video.supportCorrectionUrl = supportCorrectionUrl.value
  video.order = Number(videoOrder.value)

  await updateDoc(courseRef, { levels: levels.value })

  await loadCourses()

  alert('Vidéo sauvegardée')
}

/**
 * Create video
 */

const createVideo = async () => {
  const level = levels.value.find((l) => l.id === selectedLevelId.value)

  if (!level) {
    alert('Choisir un niveau')
    return
  }

  const id = `video${videoOrder.value}`

  level.videos.push({
    id,
    order: Number(videoOrder.value),
    title: '',
    description: '',
    videoId: '',
    thumbnailUrl: '',
    supportCourseUrl: '',
    supportExerciseUrl: '',
    supportCorrectionUrl: '',
  })

  await updateDoc(courseRef, { levels: levels.value })

  await loadCourses()

  selectedVideoId.value = id
}

/**
 * Select video
 */

const selectVideo = (levelId, videoId) => {
  selectedLevelId.value = levelId
  selectedVideoId.value = videoId
}

onMounted(async () => {
  if (window.clientDb && window.clientAuth) {
    db = window.clientDb
    auth = window.clientAuth
  } else {
    const savedClient = localStorage.getItem('activeClient')

    if (!savedClient) {
      alert('Aucun client sélectionné')
      return
    }

    const client = JSON.parse(savedClient)

    const res = await initClient(client)

    db = res.db
    auth = res.auth

    window.clientDb = db
    window.clientAuth = auth
  }

  courseRef = doc(db, 'courses', 'course')

  if (auth.currentUser) {
    isLogged.value = true
    await loadCourses()
  }
})
</script>

<template>
  <main class="wrapper flex gap-10">
    <!-- LOGIN -->
    <div v-if="!isLogged" class="flex flex-col gap-2 max-w-sm">
      <h2>Connexion admin</h2>

      <input v-model="email" placeholder="Email" class="p-2 bg-slate-800 text-white" />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="p-2 bg-slate-800 text-white"
      />

      <button @click="login" class="bg-blue-600 p-2 rounded">Se connecter</button>
    </div>

    <div v-else class="flex gap-10 items-center justify-center w-full">
      <!-- CMS SIDEBAR -->
      <div class="px-2 flex flex-col gap-4">
        <h3>Structure cours</h3>

        <div v-for="level in levels" :key="level.id" class="border rounded p-2">
          <div class="font-bold mb-2">
            {{ level.title }}
          </div>

          <div class="flex flex-col gap-1">
            <button
              v-for="video in [...(level.videos || [])].sort((a, b) => a.order - b.order)"
              :key="video.id"
              @click="selectVideo(level.id, video.id)"
              class="text-left hover:text-blue-600"
            >
              {{ video.order }} — {{ video.title || 'Sans titre' }}
            </button>
          </div>
        </div>
      </div>

      <!-- EDITOR -->

      <div class="flex-1 flex flex-col gap-3">
        <h3>Edition vidéo</h3>

        <input v-model="videoTitle" placeholder="Titre" />

        <textarea v-model="videoDescription" placeholder="Description" />

        <input v-model="bunnyId" placeholder="Bunny video ID" />

        <input v-model="thumbnailUrl" placeholder="Thumbnail" />

        <input v-model="videoOrder" placeholder="Ordre vidéo" />

        <input v-model="supportCourseUrl" placeholder="Support cours" />

        <input v-model="supportExerciseUrl" placeholder="Support exercice" />

        <input v-model="supportCorrectionUrl" placeholder="Support correction" />

        <button @click="saveVideo">Sauvegarder</button>

        <h4 class="mt-6">Créer vidéo</h4>

        <input v-model="videoOrder" placeholder="Ordre vidéo" />

        <button @click="createVideo">Créer vidéo</button>
      </div>
    </div>
  </main>
</template>
