declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VUE_APP_DATA_TIMEOUT: string
      VUE_APP_INSTALL_URL: string
      VUE_APP_VERSION_URL: string
      VUE_APP_NAMESPACE: string
      VUE_APP_SHOW_ENTERPRISE_BUTTON: string
      VUE_APP_KUMA_DP_SERVER_URL: string
      VUE_APP_AMCHARTS_LICENSE?: string
      VUE_APP_UTM: string
      VUE_APP_MOCK_API_ENABLED: string
      VUE_APP_KUMA_CONFIG: string
      VUE_APP_FAKE_MULTIZONE?: string
      VUE_APP_DATADOG_SITE: string
      VUE_APP_DATADOG_LOGS_CLIENT_TOKEN: string
      VUE_APP_DATADOG_RUM_CLIENT_TOKEN: string
      VUE_APP_DATADOG_RUM_APPLICATION_ID: string
      NODE_ENV: 'development' | 'production'
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
