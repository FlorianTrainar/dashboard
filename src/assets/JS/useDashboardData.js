import { computed } from 'vue'
import { useFirebaseFolders } from './useFirebaseFolders'

export function useDashboardData() {
  const { folders } = useFirebaseFolders('taskFolders')

  const allTasks = computed(() => {
    if (!folders.value) return []

    return folders.value.flatMap((folder) =>
      (folder.projects || []).flatMap((project) =>
        (project.tasks || []).map((task) => ({
          ...task,

          // 🔥 enrichissement pour Home
          folderId: folder.id,
          folderTitle: folder.title,

          projectId: project.id,
          projectTitle: project.title,
        })),
      ),
    )
  })

  return {
    folders,
    allTasks,
  }
}
