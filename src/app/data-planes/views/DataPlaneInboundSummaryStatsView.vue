<template>
  <RouteView
    v-slot="{ route }"
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      mesh: '',
      dataPlane: '',
      service: '',
    }"
    name="data-plane-inbound-summary-stats-view"
  >
    <AppView>
      <template #title>
        <h3>
          <RouteTitle
            :title="`Stats`"
          />
        </h3>
      </template>
      <div>
        <DataSource
          v-slot="{ data, error, refresh }: StatsSource"
          :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/stats/${route.params.service}`"
        >
          <ErrorBlock
            v-if="error"
            :error="error"
          />

          <LoadingBlock v-else-if="data === undefined" />
          <CodeBlock
            v-else
            language="json"
            :code="(() => {
              if(props.gateway) {
                const parts = route.params.service.split(':')
                return data.raw.split('\n')
                  .filter((item) => item.includes(`.${parts[0]}.`))
                  .filter((item) => {
                    return !item.startsWith('listener.') || item.includes(`_${parts[1]}.`)
                  })
                  .filter((item) => {
                    return !item.includes('.rds.') || item.includes(`_${parts[1]}_*.`)
                  })
                  .map((item) => item.replace(`${parts[0]}.`, ''))
                  .map((item) => item.replace(`_${parts[1]}.`, '.'))
                  .map((item) => {
                    if(item.includes('.rds.')) {
                      const tmp = item.split('.')
                      tmp.splice(2, 1)
                      return tmp.join('.')
                    } else {
                      return item;
                    }
                  })
                  .join('\n')

              } else {
                const name = `localhost_${route.params.service.split(':')[1]}`
                return data.raw.split('\n')
                  .filter((item) => item.includes(`.${name}.`))
                  .map((item) => item.replace(`${name}.`, ''))
                  .join('\n')
              }
            })()"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          >
            <template #primary-actions>
              <KButton
                appearance="primary"
                @click="refresh"
              >
                <RefreshIcon :size="KUI_ICON_SIZE_30" />
                Refresh
              </KButton>
            </template>
          </CodeBlock>
        </DataSource>
      </div>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { RefreshIcon } from '@kong/icons'

import type { DataplaneInbound, DataplaneGateway } from '../data'
import { StatsSource } from '../sources'
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
const props = defineProps<{
  inbound?: DataplaneInbound
  gateway?: DataplaneGateway
}>()
</script>
