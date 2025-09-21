// /assets/JS/useAuth.js
import { ref } from 'vue'
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/firebase.js' // ✅ On importe l'instance déjà initialisée

// === ÉTAT LOCAL ===
const user = ref(null)
const isLoading = ref(true)
const error = ref(null)

// === OBSERVATEUR D'ÉTAT AUTH ===
onAuthStateChanged(auth, (firebaseUser) => {
  user.value = firebaseUser
  isLoading.value = false
})

// === FONCTION DE CONNEXION ===
const login = async (email, password) => {
  error.value = null
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (err) {
    error.value = err.message || 'Erreur lors de la connexion'
    throw err // Pour permettre le catch côté appelant si besoin
  }
}

// === FONCTION DE DECONNEXION ===
const logout = async () => {
  try {
    await signOut(auth)
  } catch (err) {
    console.error('Erreur de déconnexion :', err)
  }
}

// === EXPORTS ===
export function useAuth() {
  return {
    user,
    isLoading,
    error,
    login,
    logout,
  }
}
