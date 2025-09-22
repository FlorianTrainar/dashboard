// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'

// ⚠️ Remplace par TA config perso (copiée depuis la console Firebase)
const firebaseConfig = {
  apiKey: 'AIzaSyAqhRo79xNPppltcN9-Er8Ddj3zY-OB85c',
  authDomain: 'floboard-75568.firebaseapp.com',
  projectId: 'floboard-75568',
  storageBucket: 'floboard-75568.firebasestorage.app',
  messagingSenderId: '674207583130',
  appId: '1:674207583130:web:be910b4721cf3e5331c823',
}

// Initialise Firebase
const app = initializeApp(firebaseConfig)

// Accès à Firestore
export const db = getFirestore(app)

// Accès à l'authentification (si besoin plus tard)
export const auth = getAuth(app)

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Persistance activée avec succès (facultatif : console.log)
  })
  .catch((error) => {
    console.error('Erreur de persistance Firebase Auth :', error)
  })
