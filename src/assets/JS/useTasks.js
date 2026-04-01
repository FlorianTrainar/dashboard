import { Timestamp } from 'firebase/firestore'

export function useTasks() {
  const getTodayDate = () => {
    return Timestamp.fromDate(new Date())
  }

  const createTask = () => {
    return {
      id: crypto.randomUUID(),
      text: '',
      done: false,

      deadline: getTodayDate(), // 🔥 aujourd’hui direct
      recurrence: null,
    }
  }

  const updateTaskText = (task, text) => {
    task.text = text
  }

  const updateTaskDate = (task, dateValue) => {
    task.deadline = Timestamp.fromDate(new Date(dateValue))
  }

  const deleteTask = (tasks, index) => {
    tasks.splice(index, 1)
  }

  const toggleTask = (task) => {
    task.done = !task.done

    // 🔥 si on réactive → remettre aujourd’hui
    if (!task.done && !task.deadline) {
      task.deadline = getTodayDate()
    }
  }

  const shiftTask = (task) => {
    if (!task.deadline || !task.recurrence) return

    let nextDate = new Date(task.deadline.seconds * 1000)

    if (task.recurrence === 'jours') {
      nextDate.setDate(nextDate.getDate() + 1)
    }

    if (task.recurrence === 'semaines') {
      nextDate.setDate(nextDate.getDate() + 7)
    }

    if (task.recurrence === 'mois') {
      nextDate.setMonth(nextDate.getMonth() + 1)
    }
    if (task.recurrence === 'trimestres') {
      nextDate.setMonth(nextDate.getMonth() + 3)
    }

    if (task.recurrence === 'années') {
      nextDate.setFullYear(nextDate.getFullYear() + 1)
    }

    task.deadline = Timestamp.fromDate(nextDate)
    task.done = false
  }

  return {
    createTask,
    updateTaskText,
    updateTaskDate,
    deleteTask,
    toggleTask,
    shiftTask,
  }
}
