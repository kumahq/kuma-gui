<template>
  <RouteView
    v-slot="{ t }"
    name="diagnostics"
  >
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
            <ErrorBlock
              v-if="error"
              :error="error"
            />

            <LoadingBlock v-else-if="data === undefined" />

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
import type { ConfigSource } from '../sources'
import CodeBlock from '@/app/common/CodeBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
</script>
