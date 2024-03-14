<template>
  <AccordionList
    :initially-open="[]"
    multiple-open
  >
    <template
      v-for="policies in [Object.groupBy(props.rules, (item, i) => item.type)]"
      :key="policies"
    >
      <template
        v-for="(items, type) in policies"
        :key="type"
      >
        <AccordionItem
          v-if="items"
        >
          <template #accordion-header>
            <h3 class="policy-type-heading">
              <PolicyTypeTag :policy-type="type">
                {{ type }}
              </PolicyTypeTag>
            </h3>
          </template>

          <template #accordion-content>
            <template
              v-for="hasMatchers in [items.some((item) => item.matchers.length > 0)]"
              :key="hasMatchers"
            >
              <div class="policy-list">
                <AppCollection
                  class="policy-type-table"
                  :class="{
                    'has-matchers': hasMatchers,
                  }"
                  :total="items.length"
                  :items="items"
                  :headers="[
                    ...(hasMatchers ? [{ label: 'Matchers', key: 'matchers' }] : []),
                    { label: 'Origin policies', key: 'origins' },
                    { label: 'Conf', key: 'config' },
                  ]"
                >
                  <template
                    #matchers="{ row }"
                  >
                    <span
                      v-if="row.matchers.length > 0"
                      class="matcher"
                    >
                      <template
                        v-for="({ key, value, not }, matcherIndex) in row.matchers"
                        :key="matcherIndex"
                      >
                        <span
                          v-if="matcherIndex > 0"
                          class="matcher__and"
                        > and<br></span><span
                          v-if="not"
                          class="matcher__not"
                        >!</span><span class="matcher__term">{{ `${key}:${value}` }}</span>
                      </template>
                    </span>

                    <template v-else>
                      <i>{{ t('data-planes.routes.item.matches_everything') }}</i>
                    </template>
                  </template>

                  <template #origins="{ row }">
                    <ul v-if="row.origins.length > 0">
                      <li
                        v-for="(origin, originIndex) in row.origins"
                        :key="`${type}-${originIndex}`"
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
                      {{ t('common.collection.none') }}
                    </template>
                  </template>

                  <template #config="{ row }">
                    <template v-if="row.config">
                      <CodeBlock
                        :code="toYaml(row.config)"
                        language="yaml"
                        :show-copy-button="false"
                      />
                    </template>

                    <template v-else>
                      {{ t('common.collection.none') }}
                    </template>
                  </template>
                </AppCollection>
              </div>
            </template>
          </template>
        </AccordionItem>
      </template>
    </template>
  </AccordionList>
</template>

<script lang="ts" setup>
import type { Rule } from '../data'
import { useI18n } from '@/app/application'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import type { PolicyType } from '@/types/index.d'
import { toYaml } from '@/utilities/toYaml'
const { t } = useI18n()

const props = defineProps<{
  rules: Rule[]
  policyTypesByName: Record<string, PolicyType | undefined>
}>()

</script>

<style lang="scss" scoped>
:deep(.app-collection .k-table.is-clickable tr) {
  cursor: default;
}
:deep(.app-collection .k-table.has-hover tr:hover) {
  background-color: transparent;
}

.policy-type-heading {
  font-size: inherit;
  font-weight: $kui-font-weight-regular;
}

.policy-list {
  display: flex;
  flex-direction: column;
  gap: $kui-space-40;
}

.policy-type-table {
  :deep(table){
    table-layout: fixed;
  }

  :deep(td) {
    vertical-align: top;
  }

  &:not(.has-matchers) {
    :deep(th:nth-child(1)),
    :deep(td:nth-child(1)) {
      width: 65%;
    }

    :deep(th:nth-child(2)),
    :deep(td:nth-child(2)) {
      width: 35%;
    }
  }

  &.has-matchers {
    :deep(th:nth-child(1)),
    :deep(td:nth-child(1)) {
      width: 50%;
    }

    :deep(th:nth-child(2)),
    :deep(td:nth-child(2)) {
      width: 15%;
    }

    :deep(th:nth-child(3)),
    :deep(td:nth-child(3)) {
      width: 35%;
    }
  }
}

.policy-type-table :deep(td > *) {
  white-space: normal;
  word-break: break-word;
}

.app-collection :deep(td:first-child *) {
  font-weight: $kui-font-weight-regular;
  .matcher__not {
    color: $kui-color-text-danger;
  }
  .matcher__and {
    font-weight: $kui-font-weight-semibold;
  }
  .matcher__not,
  .matcher__term {
    font-family: $kui-font-family-code;
  }
}

</style>
