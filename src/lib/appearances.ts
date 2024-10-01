import { safeJSONParse } from '@/lib/utils'

export const getAppearances = () => {
  const appearances = {
    showImportProject: safeJSONParse(import.meta.env.VITE_APPEARANCES_SHOW_IMPORT_PROJECT, false),
    showTutorials: safeJSONParse(import.meta.env.VITE_APPEARANCES_SHOW_TUTORIALS, false),
  }
  // console.log('import.meta.env', import.meta.env.MODE)
  // console.log('appearances', appearances)

  return appearances
}
