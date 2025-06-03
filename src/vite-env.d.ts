/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_APPEARANCES_SHOW_IMPORT_PROJECT?: 'true' | 'false'
  readonly VITE_BASE_URL?: string
  readonly VITE_API_NAMESPACE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
