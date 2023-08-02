<template>
  <RouteView name="diagnostics">
    <DataSource
      v-slot="{ data, error }: ConfigSource"
      :src="`/config`"
    >
      <AppView
        :breadcrumbs="[
          {
            to: {
              name: 'diagnostics',
            },
            text: t('diagnostics.routes.item.breadcrumbs')
          },
        ]"
      >
        <template #title>
          <h1>
            <RouteTitle
              :title="t('diagnostics.routes.item.title')"
              :render="true"
            />
          </h1>
        </template>

        <KCard>
          <template #body>
            <LoadingBlock v-if="data === undefined" />

            <ErrorBlock
              v-else-if="error"
              :error="error"
            />

            <CodeBlock
              v-else
              id="code-block-diagnostics"
              data-testid="code-block-diagnostics"
              language="json"
              :code="JSON.stringify(data, null, 2)"
              is-searchable
              query-key="diagnostics"
            />
          </template>
        </KCard>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'

import type { ConfigSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import CodeBlock from '@/app/common/CodeBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()
</script>
