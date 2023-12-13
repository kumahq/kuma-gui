<template>
  <AccordionList
    :initially-open="[]"
    multiple-open
  >
    <AccordionItem
      v-for="(policyTypeEntry, index) in props.policyTypeEntries"
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
          <KTable
            class="policy-type-table"
            :fetcher="() => ({ data: policyTypeEntry.connections, total: policyTypeEntry.connections.length })"
            :headers="[
              { label: 'From', key: 'sourceTags' },
              { label: 'To', key: 'destinationTags' },
              { label: 'On', key: 'name' },
              { label: 'Conf', key: 'config' },
              { label: 'Origin policies', key: 'origins' },
            ]"
            :cell-attrs="getCellAttributes"
            disable-pagination
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
                  <RouterLink
                    :to="{
                      name: 'policy-detail-view',
                      params: {
                        mesh: origin.mesh,
                        policyPath: props.policyTypesByName[origin.type]!.path,
                        policy: origin.name,
                      },
                    }"
                  >
                    {{ origin.name }}
                  </RouterLink>
                </li>
              </ul>

              <template v-else>
                —
              </template>
            </template>

            <template #config="{ row, rowKey }: { row: PolicyTypeEntryConnection, rowKey: number }">
              <template v-if="row.config">
                <CodeBlock
                  :id="`${props.id}-${index}-${rowKey}-code-block`"
                  :code="toYaml(row.config)"
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
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import CodeBlock from '@/app/common/CodeBlock.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import TagList from '@/app/common/TagList.vue'
import type { PolicyType, PolicyTypeEntry, PolicyTypeEntryConnection } from '@/types/index.d'
import { toYaml } from '@/utilities/toYaml'

const props = defineProps<{
  id: string
  policyTypeEntries: PolicyTypeEntry[]
  policyTypesByName: Record<string, PolicyType | undefined>
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

.cell-sourceTags { width: 15%; }
.cell-destinationTags { width: 20%; }
.cell-name { width: 15%; }
.cell-config { width: 35%; }
.cell-origins { width: 15%; }
</style>
