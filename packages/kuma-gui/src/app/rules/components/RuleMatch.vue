<template>
  <dl class="stack-small">
    <template v-if="props.match.method">
      <div class="match">
        <dt>
          <XBadge appearance="neutral">
            Method
          </XBadge>
        </dt>

        <dd>
          <XBadge>{{ props.match.method }}</XBadge>
        </dd>
      </div>
    </template>

    <template v-if="props.match.path">
      <div class="match">
        <dt>
          <XBadge appearance="neutral">
            Path
          </XBadge>
        </dt>

        <dd>
          <span><span class="text-neutral">type:</span> {{ props.match.path.type }}</span>
          <code>{{ props.match.path.value }}</code>
        </dd>
      </div>
    </template>

    <template v-if="props.match.queryParams && props.match.queryParams.length > 0">
      <div
        v-for="(param, index) in props.match.queryParams"
        :key="index"
      >
        <div class="match">
          <dt>
            <XBadge appearance="neutral">
              QueryParameter
            </XBadge>
          </dt>

          <dd>
            <div class="list">
              <span><span class="text-neutral">type:</span> {{ param.type }}</span>
              <span>{{ param.name }}:{{ param.value }}</span>
            </div>
          </dd>
        </div>
      </div>
    </template>

    <template v-if="props.match.headers && props.match.headers.length > 0">
      <div
        v-for="(header, index) in props.match.headers"
        :key="index"
        class="match"
      >
        <dt>
          <XBadge appearance="neutral">
            Header
          </XBadge>
        </dt>

        <dd>
          <div class="list">
            <span><span class="text-neutral">type:</span> {{ header.type ?? 'Exact' }}</span>
            <span>{{ header.name }}<span v-if="header.value">:{{ header.value }}</span></span>
          </div>
        </dd>
      </div>
    </template>
  </dl>
</template>

<script lang="ts" setup>
import type { ToTargetRefRuleMatch } from '@/types/index.d'

const props = defineProps<{
  match: ToTargetRefRuleMatch
}>()
</script>

<style lang="scss" scoped>
.match {
  display: flex;
  flex-wrap: wrap;
  gap: $kui-space-50;
}

.list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: $kui-space-40;
  align-items: baseline;
}

.text-neutral {
  color: $kui-color-text-neutral;
}
</style>
