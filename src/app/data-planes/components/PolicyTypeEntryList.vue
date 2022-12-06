<template>
  <AccordionList
    :initially-open="[]"
    multiple-open
  >
    <AccordionItem
      v-for="(policyEntry, index) in props.policyTypeEntries"
      :key="index"
    >
      <template #accordion-header>
        <h3>
          <PolicyTypeTag :policy-type="policyEntry.type">
            {{ policyEntry.type }} ({{ policyEntry.connections.length }})
          </PolicyTypeTag>
        </h3>
      </template>

      <template #accordion-content>
        <div class="policy-list">
          <KTable
            class="policy-type-table"
            :fetcher="() => ({ data: policyEntry.connections, total: policyEntry.connections.length })"
            :headers="tableHeaders"
            :cell-attrs="getCellAttributes"
            disable-pagination
            is-clickable
          >
            <template #sourceTags="{ rowValue }">
              <TagList
                v-if="Array.isArray(rowValue) && rowValue.length > 0"
                class="tag-list"
                :tags="rowValue"
              />

              <template v-else>
                —
              </template>
            </template>

            <template #destinationTags="{ rowValue }">
              <TagList
                v-if="Array.isArray(rowValue) && rowValue.length > 0"
                class="tag-list"
                :tags="rowValue"
              />

              <template v-else>
                —
              </template>
            </template>

            <template #name="{ rowValue }">
              <template v-if="rowValue !== null">
                {{ rowValue }}
              </template>

              <template v-else>
                —
              </template>
            </template>

            <template #origins="{ rowValue }">
              <div
                v-if="rowValue.length > 0"
                class="origin-list"
              >
                <router-link
                  v-for="(origin, originIndex) in rowValue"
                  :key="`${index}-${originIndex}`"
                  :to="origin.route"
                >
                  {{ origin.name }}
                </router-link>
              </div>

              <template v-else>
                —
              </template>
            </template>

            <template #config="{ rowValue, rowKey }">
              <template v-if="rowValue !== null">
                <CodeBlock
                  :id="`${props.id}-${index}-${rowKey}-code-block`"
                  :code="rowValue"
                  language="yaml"
                  :show-copy-button="false"
                />
              </template>

              <template v-else>
                —
              </template>
            </template>
          </KTable>
        </div>
      </template>
    </AccordionItem>
  </AccordionList>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { KTable } from '@kong/kongponents'

import AccordionList from '@/app/common/AccordionList.vue'
import AccordionItem from '@/app/common/AccordionItem.vue'
import CodeBlock from '@/app/common/CodeBlock.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import TagList from '@/app/common/TagList.vue'
import { PolicyTypeEntry, TableHeader } from '@/types/index'

const tableHeaders: TableHeader[] = [
  { label: 'From', key: 'sourceTags' },
  { label: 'To', key: 'destinationTags' },
  { label: 'On', key: 'name' },
  { label: 'Conf', key: 'config' },
  { label: 'Origins', key: 'origins' },
]

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: 'entry-list',
  },

  policyTypeEntries: {
    type: Object as PropType<PolicyTypeEntry[]>,
    required: true,
  },
})

function getCellAttributes({ headerKey }: any): Record<string, string> {
  return { class: `cell-${headerKey}` }
}
</script>

<style lang="scss" scoped>
.policy-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.tag-list {
  display: flex;
  margin-top: var(--spacing-xxs);
}

.origin-list {
  display: flex;
  flex-direction: column;
}
</style>

<style lang="scss">
.policy-type-table.policy-type-table td {
  vertical-align: top;
}

.cell-sourceTags { width: 25%; }
.cell-destinationTags { width: 25%; }
.cell-name { width: 15%; }
.cell-config { width: 20%; }
.cell-origins { width: 15%; }
</style>
