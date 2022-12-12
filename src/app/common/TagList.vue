<template>
  <span class="tag-list">
    <template
      v-for="(tag, index) in tagList"
      :key="index"
    >
      <component
        :is="tag.route ? 'router-link' : 'span'"
        :to="tag.route"
        class="tag"
      >
        <span
          class="tag__label"
          :class="{ 'tag__label--is-kuma-io-label': tag.isKumaIoLabel }"
        >
          {{ tag.label }}
        </span>

        <span class="tag__value">
          {{ tag.value }}
        </span>
      </component>
    </template>
  </span>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { RouteLocation, useRouter } from 'vue-router'

import { LabelValue } from '@/types/index.d'

const router = useRouter()

interface LabelValueWithRoute extends LabelValue {
  route: RouteLocation | undefined
  isKumaIoLabel: boolean
}

const props = defineProps({
  tags: {
    type: Object as PropType<LabelValue[]>,
    required: true,
  },
})

const tagList = computed<LabelValueWithRoute[]>(() => {
  return props.tags.map((tag) => {
    const { label, value } = tag
    const route = getRoute(tag)
    const isKumaIoLabel = label.toLowerCase().includes('kuma.io/')

    return { label, value, route, isKumaIoLabel }
  })
})

function getRoute(tag: LabelValue): RouteLocation | undefined {
  // Wildcard tag values don’t refer to specific entities we can link to.
  if (tag.value === '*') {
    return undefined
  }

  try {
    switch (tag.label) {
      case 'kuma.io/zone': {
        return router.resolve({
          name: 'zones',
          query: { ns: tag.value },
        })
      }
      case 'kuma.io/service': {
        return router.resolve({
          name: 'service-list-view',
          query: { ns: tag.value },
        })
      }
      default: {
        return undefined
      }
    }
  } catch {
    // Ignores `router.resolve` errors because we don’t want this
    return undefined
  }
}
</script>

<style lang="scss" scoped>
$border-radius: 5px;

.tag-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--spacing-xxs);
}

.tag {
  display: inline-flex;
  align-items: stretch;
  font-size: var(--type-xs);
  border-radius: $border-radius;
}

.tag__label,
.tag__value {
  border: 1px solid transparent;
  padding: 0.1em 0.5em;
}

.tag__label {
  border-top-left-radius: $border-radius;
  border-bottom-left-radius: $border-radius;
  color: var(--white);
  background-color: var(--blue-400);
}

.tag__label--is-kuma-io-label {
  background-color: var(--blue-700);
}

.tag__value {
  color: var(--black-75);
  border-color: var(--grey-400);
  border-left-color: transparent;
  border-top-right-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
  background-color: var(--white);
}
</style>
