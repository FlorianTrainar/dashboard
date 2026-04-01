export function formatDate(timestamp) {
  if (!timestamp) return ''

  const date = typeof timestamp?.toDate === 'function' ? timestamp.toDate() : new Date(timestamp)

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric', // 🔥 toujours affichée
  })
}

export function formatSmartDate(timestamp) {
  if (!timestamp) return ''

  const date = typeof timestamp?.toDate === 'function' ? timestamp.toDate() : new Date(timestamp)

  const today = new Date()
  const todayStart = new Date(today.toDateString())
  const dateStart = new Date(date.toDateString())

  const diff = Math.round((dateStart - todayStart) / (1000 * 60 * 60 * 24))

  if (diff === 0) return 'Aujourd’hui'
  if (diff === 1) return 'Demain'
  if (diff === -1) return 'Hier'

  // 👉 fallback toujours avec année
  return formatDate(timestamp)
}
