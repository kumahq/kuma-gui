<template>
  <dl class="match-definition-list">
    <template v-if="props.match.method">
      <div class="match">
        <dt>
          <KBadge appearance="neutral">
            Method
          </KBadge>
        </dt>

        <dd>
          <KBadge>{{ props.match.method }}</KBadge>
        </dd>
      </div>
    </template>

    <template v-if="props.match.path">
      <div class="match">
        <dt>
          <KBadge appearance="neutral">
            Path
          </KBadge>
        </dt>

        <dd>
          <span class="key">Type:</span> <span>{{ props.match.path.type }}</span>
          <span class="key">Value:</span> <code>{{ props.match.path.value }}</code>
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
            <KBadge appearance="neutral">
              Query parameter
            </KBadge>
          </dt>

          <dd>
            <span class="key">Type:</span> <span>{{ param.type }}</span>
            <span class="key">Name:</span> <span>{{ param.name }}</span>
            <span class="key">Value:</span> <span>{{ param.value }}</span>
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
          <KBadge appearance="neutral">
            Header
          </KBadge>
        </dt>

        <dd>
          <span class="key">Type:</span> <span>{{ header.type ?? 'Exact' }}</span>
          <span class="key">Name:</span> <span>{{ header.name }}</span>
          <template v-if="header.value">
            <span class="key">Value:</span> <span>{{ header.value }}</span>
          </template>
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
.match-definition-list>*+* {
  margin-top: $kui-space-20;
}

.match {
  display: flex;
  gap: $kui-space-30;
}

.key {
  color: $kui-color-text-neutral;
}
</style>
