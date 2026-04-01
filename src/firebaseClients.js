import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'

export const initClient = async (client) => {
  let app

  const existingApp = getApps().find((a) => a.name === client.name)

  if (existingApp) {
    app = existingApp
  } else {
    app = initializeApp(client.firebaseConfig, client.name)
  }

  const auth = getAuth(app)
  const db = getFirestore(app)

  // 🔥 persistance login
  await setPersistence(auth, browserLocalPersistence)

  return { app, db, auth }
}
