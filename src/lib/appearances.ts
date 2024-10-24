import { safeJSONParse } from '@/lib/utils'

export const getAppearances = () => {
  const appearances = {
    showImportProject: safeJSONParse(import.meta.env.VITE_APPEARANCES_SHOW_IMPORT_PROJECT, false),
    showTutorials: safeJSONParse(import.meta.env.VITE_APPEARANCES_SHOW_TUTORIALS, false),
  }

  return appearances
}
