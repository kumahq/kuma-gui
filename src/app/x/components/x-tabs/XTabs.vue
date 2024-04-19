<template>
  <div
    ref="$ref"
    class="x-tabs"
    v-bind="$attrs"
  >
    <KTabs
      role="navigation"
      :aria-label="attrs['aria-label']"
      :tabs="items"
      :model-value="props.selected.length > 0 ? `#${props.selected}` : ''"
      hide-panels
    >
      <template
        v-for="item in items"
        :key="`${item.title}`"
        #[`${item.title}-anchor`]
      >
        <slot
          :name="`${item.title}-tab`"
        />
      </template>
    </KTabs>
  </div>
</template>
<script lang="ts" setup>
import { useSlots, useAttrs, computed, onMounted, ref, watch } from 'vue'

import type { Tab } from '@kong/kongponents'

const $ref = ref<HTMLDivElement | null>(null)

defineOptions({
  inheritAttrs: false,
})
const attrs = useAttrs()
const $attrs = Object.fromEntries(Object.entries(attrs).filter(([key, _value]) => !['aria-label'].includes(key)))

const slots = useSlots()

const props = withDefaults(defineProps<{
  selected?: string
}>(), {
  selected: '',
})

const items = computed(() => {
  return Object.keys(slots).reduce<Tab[]>((prev, key) => {
    const pos = key.lastIndexOf('-tab')
    if (pos !== -1) {
      const title = key.substring(0, pos)
      prev.push(
        {
          title,
          hash: `#${title}`,
        },
      )
    }
    return prev
  }, [])
})
const rewrite = () => {
  const $el = $ref.value! // $ref is statically always there

  const $tablist = $el.querySelector('[role="tablist"]')
  const $tabs = $el.querySelectorAll('[role="tab"]')
  const $tabindexed = $el.querySelectorAll('[tabindex="0"]')
  const $id = $el.querySelectorAll('[id]')

  $tablist && ['role', 'aria-label'].forEach(attr => $tablist.removeAttribute(attr))
  ;['role'].forEach(attr => Array.from($tabs).forEach(item => item.removeAttribute(attr)))
  ;['tabindex'].forEach(attr => Array.from($tabindexed).forEach(item => item.removeAttribute(attr)))

  ;['id'].forEach(attr => Array.from($id).forEach(item => {
    item.setAttribute('data-testid', item.getAttribute(attr) ?? '')
    item.removeAttribute(attr)
  }))
}
onMounted(rewrite)
watch(() => slots, () => {
  rewrite()
})
</script>
<style lang="scss" scoped>
:deep(.tab-link) > * {
  transition: inherit;
  border-radius: inherit;
  color: inherit;
  outline: inherit;
}
:deep(.tab-link) > *:focus-visible {
  background-color: $kui-color-background-neutral-weaker;
  box-shadow: $kui-shadow-focus;
}
</style>
