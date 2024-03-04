<template>
  <div class="stack">
    <DataCollection
      v-slot="{ items }"
      :items="props.rules"
      :predicate="(item) => item.ruleType === 'proxy'"
      :comparator="(a, b) => a.type.localeCompare(b.type)"
      :empty="false"
    >
      <KCard>
        <h3>
          {{ t('data-planes.routes.item.proxy_rule') }}
        </h3>

        <RuleEntryList
          class="mt-2"
          :rules="items"
          :policy-types-by-name="props.policyTypesByName"
          data-testid="proxy-rule-list"
        />
      </KCard>
    </DataCollection>

    <DataCollection
      v-slot="{ items }"
      :items="props.rules"
      :predicate="(item) => item.ruleType === 'to'"
      :comparator="(a, b) => a.type.localeCompare(b.type)"
      :empty="false"
    >
      <KCard>
        <h3>
          {{ t('data-planes.routes.item.to_rules') }}
        </h3>

        <RuleEntryList
          class="mt-2"
          :rules="items"
          :policy-types-by-name="props.policyTypesByName"
          data-testid="to-rule-list"
        />
      </KCard>
    </DataCollection>

    <DataCollection
      v-slot="{ items }"
      :items="props.rules"
      :predicate="(item) => item.ruleType === 'from'"
      :comparator="(a, b) => a.type.localeCompare(b.type)"
      :empty="false"
    >
      <KCard>
        <h3 class="mb-2">
          {{ t('data-planes.routes.item.from_rules') }}
        </h3>
        <template
          v-for="inbounds in [items.reduce<Record<number, Rule[]>>((prev, item) => {
            if(typeof item.inbound?.port !== 'undefined') {
              if (typeof prev[item.inbound.port] === 'undefined') {
                prev[item.inbound.port] = []
              }
              prev[item.inbound.port].push(item)
            }
            return prev
          }, {})]"
          :key="inbounds"
        >
          <div
            v-for="([port, rs], index) in Object.entries(inbounds).sort(([a], [b]) => Number(b) - Number(a))"
            :key="index"
          >
            <h4>{{ t('data-planes.routes.item.port', { port }) }}</h4>

            <RuleEntryList
              class="mt-2"
              :rules="rs"
              :policy-types-by-name="props.policyTypesByName"
              :data-testid="`from-rule-list-${index}`"
            />
          </div>
        </template>
      </KCard>
    </DataCollection>
  </div>
</template>

<script lang="ts" setup>
import RuleEntryList from './RuleEntryList.vue'
import type { Rule } from '../data'
import { useI18n } from '@/app/application'
import type { PolicyType } from '@/types/index.d'

const { t } = useI18n()

const props = defineProps<{
  rules: Rule[]
  policyTypesByName: Record<string, PolicyType | undefined>
}>()
</script>
