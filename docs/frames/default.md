---
layout: false
---

<script setup>
import { ref, onMounted } from 'vue'
import { createApp } from 'whyframe:app'
import { TOKENS as APP, services as application } from '@/app/application'
import { TOKENS as VUE, services as vue } from '@/app/vue'
import { services as kuma } from '@/app/kuma'
import { build, token } from '@/services/utils'
import Kongponents from '@kong/kongponents'
import CliEnv from '@/services/env/CliEnv'
import i18nEnUs from '@/locales/en-us'

const el = ref()
const $ = {
  ...VUE,
  ...APP,
  globals: token('vue.globals'),
}

onMounted(async () => {
  createApp(el.value, {
    enhanceApp: (app) => {
      const get = build(
        vue($),
        application($),
        kuma($),
        [
          // temporary $.app replacement
          [$.app, {
            service: (
              components,
              plugins,
              globals,
            ) => {
              return async (app) => {
                components.forEach(([name, component]) => {
                  app.component(name, component)
                })

                plugins.forEach(([...args]) => {
                  app.use(...args)
                })

                globals.forEach(([name, obj]) => {
                  app.config.globalProperties[name] = obj
                })

                return app
              }
            },
            arguments: [
              $.components,
              $.plugins,
              $.globals,
            ],
          }],
          [token('application.routes.navigation.guards'), {
            service: () => {
              return []
            },
            labels: [
              $.routesLabel,
            ],
          }],

          [token('kong.plugins'), {
            service: () => {
              return [
                [Kongponents],
              ]
            },
            labels: [
              $.plugins,
            ],
          }],
          [token('docs.globals'), {
            service: (i18n) => {
              return [
                ['t', i18n.t],
              ]
            },
            arguments: [
              $.i18n
            ],
            labels: [
              $.globals,
            ],
          }],
          [$.Env, {
            service: CliEnv,
            arguments: [
              $.EnvVars,
            ],
          }],

          [$.EnvVars, {
            constant: {
              KUMA_PRODUCT_NAME: '',
              KUMA_FEEDBACK_URL: '',
              KUMA_CHAT_URL: '',
              KUMA_INSTALL_URL: '',
              KUMA_VERSION_URL: '',
              KUMA_DOCS_URL: '',
              KUMA_MOCK_API_ENABLED: '',
              KUMA_ZONE_CREATION_FLOW: '',
            },
          }],
          [token('kuma.i18n.en-us'), {
            constant: i18nEnUs,
            labels: [
              $.enUs,
            ],
          }],
        ],
      )
      get($.app)(app)
    }
  })
})
</script>

<div id="sandboxed-component" ref="el"></div>

<style scoped>
#sandboxed-component {
  width: 100%;
  height: 100vh;
  padding: 0.5rem;
}
</style>

