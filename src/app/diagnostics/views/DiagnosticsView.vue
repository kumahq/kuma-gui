<template>
  <RouteView
    v-slot="{route: _route}"
  >
    <RouteTitle
      :title="t('diagnostics.routes.item.title')"
    />
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'diagnostics',
            params: _route.params
          },
          text: t('diagnostics.routes.item.breadcrumbs')
        },
      ]"
    >
      <KCard>
        <template #body>
          <LoadingBlock v-if="code === null" />

          <CodeBlock
            v-else
            id="code-block-diagnostics"
            language="json"
            :code="code"
            is-searchable
            query-key="diagnostics"
          />
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import { computed } from 'vue'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import CodeBlock from '@/app/common/CodeBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'

const store = useStore()
const { t } = useI18n()

const code = computed(() => {
  const config = store.getters['config/getConfig']

  if (config) {
    return JSON.stringify(config, null, 2)
  } else {
    return null
  }
})
</script>
