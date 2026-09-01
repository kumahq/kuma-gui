<template>
  <span class="target-ref">
    <XAction
      :href="`kri://${kri}`"
    >
      <XBadge>
        <slot />
      </XBadge>
    </XAction>
    <XLayout
      v-if="props.targetRef.kind === 'MeshServiceSubset' && props.targetRef.tags"
      variant="separated"
    >
      <XAction
        v-for="(value, key) in props.targetRef.tags"
        :key="key"
        :href="t(`common.label.href.${key.replaceAll('.', '~')}`, {
          mesh: props.targetRef.mesh,
          zone: '',
          namespace: '',
          name: value,
        }, { defaultMessage: '' })"
      >
        <XBadge
          :variant="r('kuma.label').test(key) ? 'reserved-kv' : 'kv'"
        >
          {{ key }}:<strong>{{ value }}</strong>
        </XBadge>
      </XAction>
    </XLayout>


    <span
      v-if="props.targetRef.weight !== undefined && props.targetRef.weight !== 1"
      class="weight"
    >
      <!-- TODO: Replace this with the @kong/icons icon once available -->
      <img
        src="@/assets/images/icon-weight.svg?url"
        alt="Weight"
      >
      {{ props.targetRef.weight }}
    </span>
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useI18n, useRegExp } from '@/app/application'
import { Kri } from '@/app/kuma'
import type { TargetRef } from '@/types/index.d'

const props = defineProps<{
  targetRef: TargetRef
}>()

const { t } = useI18n()
const { r } = useRegExp()


const kri = computed(() => {
  if (!props.targetRef.name) {
    return ''
  }

  switch (props.targetRef.kind) {
    case 'MeshService':
    case 'MeshServiceSubset': {
      return Kri.toString({ shortName: '~standard', mesh: props.targetRef.mesh ?? '', name: props.targetRef.name.replaceAll('_', '~') })
    }
    case 'MeshGateway': {
      return Kri.toString({ shortName: '~builtin', mesh: props.targetRef.mesh ?? '', name: props.targetRef.name.replaceAll('_', '~') })
    }
    default: {
      return ''
    }
  }
})
</script>

<style lang="scss" scoped>
.target-ref {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--x-space-40);
}

.weight {
  display: inline-flex;
  align-items: center;
  gap: var(--x-space-20);
  color: var(--x-color-text-neutral);
}
</style>
