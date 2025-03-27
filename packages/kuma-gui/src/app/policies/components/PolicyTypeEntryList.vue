<template>
  <AccordionList
    :initially-open="[]"
    multiple-open
  >
    <AccordionItem
      v-for="(policyTypeEntry, index) in items"
      :key="index"
    >
      <template #accordion-header>
        <h3 class="policy-type-heading">
          <PolicyTypeTag :policy-type="policyTypeEntry.type">
            {{ policyTypeEntry.type }} ({{ policyTypeEntry.connections.length }})
          </PolicyTypeTag>
        </h3>
      </template>

      <template #accordion-content>
        <div class="policy-list">
          <KTableView
            class="policy-type-table"
            :data="policyTypeEntry.connections"
            :headers="[
              { label: 'From', key: 'sourceTags' },
              { label: 'To', key: 'destinationTags' },
              { label: 'On', key: 'name' },
              { label: 'Conf', key: 'config' },
              { label: 'Origin policies', key: 'origins' },
            ]"
            :cell-attrs="getCellAttributes"
            hide-pagination
            is-clickable
          >
            <template #sourceTags="{ row }: { row: PolicyTypeEntryConnection }">
              <TagList
                v-if="row.sourceTags.length > 0"
                class="tag-list"
                should-truncate
                :tags="row.sourceTags"
              />

              <template v-else>
                —
              </template>
            </template>

            <template #destinationTags="{ row }: { row: PolicyTypeEntryConnection }">
              <TagList
                v-if="row.destinationTags.length > 0"
                class="tag-list"
                should-truncate
                :tags="row.destinationTags"
              />

              <template v-else>
                —
              </template>
            </template>

            <template #name="{ row }: { row: PolicyTypeEntryConnection }">
              <template v-if="row.name !== null">
                {{ row.name }}
              </template>

              <template v-else>
                —
              </template>
            </template>

            <template #origins="{ row }: { row: PolicyTypeEntryConnection }">
              <ul v-if="row.origins.length > 0">
                <li
                  v-for="(origin, originIndex) in row.origins"
                  :key="`${index}-${originIndex}`"
                >
                  <XAction
                    :to="{
                      name: 'policy-detail-view',
                      params: {
                        mesh: origin.mesh,
                        policyPath: props.types[origin.type]?.path ?? '',
                        policy: origin.name,
                      },
                    }"
                  >
                    {{ origin.name }}
                  </XAction>
                </li>
              </ul>

              <template v-else>
                —
              </template>
            </template>

            <template #config="{ row }: { row: PolicyTypeEntryConnection, rowKey: number }">
              <template v-if="row.config">
                <XCodeBlock
                  :code="YAML.stringify(row.config)"
                  language="yaml"
                  :show-copy-button="false"
                />
              </template>

              <template v-else>
                —
              </template>
            </template>
          </KTableView>
        </div>
      </template>
    </AccordionItem>
  </AccordionList>
</template>

<script lang="ts" setup>

import { KTableView } from '@kong/kongponents'

import type { PolicyResourceType } from '../data'
import { YAML } from '@/app/application'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import TagList from '@/app/common/TagList.vue'
import type { PolicyTypeEntry, PolicyTypeEntryConnection } from '@/types/index.d'

const props = defineProps<{
  items: PolicyTypeEntry[]
  types: Partial<Record<string, PolicyResourceType>>
}>()

function getCellAttributes({ headerKey }: any): Record<string, string> {
  return { class: `cell-${headerKey}` }
}
</script>

<style lang="scss" scoped>
.policy-type-heading {
  font-size: inherit;
  font-weight: $kui-font-weight-regular;
}

.policy-list {
  display: flex;
  flex-direction: column;
  gap: $kui-space-40;
}

.tag-list {
  display: flex;
  margin-top: $kui-space-20;
}
</style>

<style lang="scss">
.policy-type-table.policy-type-table td {
  vertical-align: top;
}

.cell-sourceTags {
  width: 15%;
}

.cell-destinationTags {
  width: 20%;
}

.cell-name {
  width: 15%;
}

.cell-config {
  width: 35%;
}

.cell-origins {
  width: 15%;
}
</style>
