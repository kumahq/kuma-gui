---
layout: false
---
<script setup>
import { ref, onMounted } from 'vue'
import { createApp } from 'whyframe:app'
import { TOKENS as APP, services as application } from '@/app/application'
import { services as applicationDebug } from '@/app/application/debug'
import { TOKENS as VUE, services as vue } from '@/app/vue'
import { TOKENS } from '@/app/kuma'
import { build, token } from '@/services/utils'
import '../../src/assets/styles/main.scss'
const el = ref()
const $ = {
  ...VUE,
  ...APP,
  ...TOKENS,
}

onMounted(async () => {
  createApp(el.value, {
    enhanceApp: (app) => {
      const get = build(
        vue($),
        application($),
        applicationDebug($),
        [
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

