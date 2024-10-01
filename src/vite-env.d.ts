/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_APPEARANCES_SHOW_IMPORT_PROJECT?: 'true' | 'false'
  readonly VITE_APPEARANCES_SHOW_TUTORIALS?: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
