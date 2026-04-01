export function useTaskUtils() {
  const getDateStatus = (timestamp) => {
    if (!timestamp) return 'none'

    const now = new Date()
    const today = new Date(now.toDateString())

    const d = new Date(timestamp.seconds * 1000)
    const dDay = new Date(d.toDateString())

    const diffTime = dDay - today
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    if (diffDays < 0) return 'overdue'
    if (diffDays === 0) return 'today'
    if (diffDays <= 3) return 'soon'
    if (diffDays <= 7) return 'week'
    if (diffDays <= 30) return 'mounth'

    return 'normal'
  }

  const getTaskClass = (timestamp, type = 'bg') => {
    if (!timestamp) return type === 'text' ? 'text-slate-500' : 'bg-slate-500/80'

    const status = getDateStatus(timestamp)

    const map = {
      overdue: {
        bg: 'bg-red-600/70',
        text: 'text-red-500 ',
      },
      today: {
        bg: 'bg-amber-600/70',
        text: 'text-amber-400',
      },
      soon: {
        bg: 'bg-lime-600/60',
        text: 'text-lime-500',
      },
      week: {
        bg: 'bg-teal-600/60',
        text: 'text-teal-400',
      },
      mounth: {
        bg: 'bg-blue-600/60',
        text: 'text-blue-400',
      },
    }

    return map[status]?.[type] || map.default?.[type]
  }

  return {
    getDateStatus,
    getTaskClass,
  }
}
