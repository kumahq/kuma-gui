interface ImportMetaEnv {
  readonly VITE_VERSION_URL: string
  readonly VITE_NAMESPACE: string
  readonly VITE_KUMA_API_SERVER_URL: string
  readonly VITE_DOCS_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
