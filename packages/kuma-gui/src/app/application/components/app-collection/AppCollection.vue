<template>
  <KTableView
    ref="$ref"
    data-testid="app-collection"
    class="app-collection"
    :headers="props.headers.map((item) => {
      if (item.key === 'actions') {
        item.key = '_actions'
      }
      return item
    })"
    :data="typeof props.items === 'undefined' ? [] : props.items"
    :cell-attrs="({ headerKey }) => ({
      class: `${headerKey}-column`,
    })"
    :row-attrs="getRowAttributes"
    :hide-pagination="true"
    :resize-columns="true"
    :table-preferences="{
      columnWidths: props.headers.reduce<Record<string, number>>((prev, value) => {
        if (typeof value.width !== 'undefined') {
          prev[value.key] = value.width
        }
        return prev
      }, {}),
    }"
    :loading="typeof props.items === 'undefined'"
    @row:click="click"
    @update:table-preferences="resize"
  >
    <template
      v-for="key in Object.keys(slots).map((item) => item === 'actions' ? '_actions' : item)"
      :key="key"
      #[key]="{ row }"
    >
      <slot
        v-if="(props.items ?? []).length > 0"
        :name="key === '_actions' ? 'actions' : key"
        :row="row as Row"
      />
    </template>
  </KTableView>
</template>

<script lang="ts" setup generic="Row extends {}">
import { KTableView } from '@kong/kongponents'
import { ref, inject, onMounted } from 'vue'


import { runInDebug } from '../../'
import type { TableViewHeader as KTableViewHeader, TablePreferences } from '@kong/kongponents'
type ResizeValue = {
  headers: Record<string, { width: number }>
}

type TableHeader = KTableViewHeader & {
  width?: number
}


// when we are inside of a DataLoader make sure its using the `variant="list"`
// but only error in dev mode, if this fails in production we don't want things
// to blow up
const dataLoader = inject<{ props: { variant: string } } | undefined>('data-loader')
if (typeof dataLoader !== 'undefined') {
  if (dataLoader.props.variant !== 'list') {
    runInDebug(() => {
      // throw new Error('Please use <DataLoader variant="list" />')
    })
  }
}
//
const props = withDefaults(defineProps<{
  isSelectedRow?: ((row: Row) => boolean)
  items: Row[] | undefined
  headers: TableHeader[]
}>(), {
  isSelectedRow: undefined,
})

const emit = defineEmits<{
  (e: 'resize', value: ResizeValue): void
}>()

const slots = defineSlots<{
  [key: string]: (props: {
    row: Row
  }) => any
}>()

const resize = (args: TablePreferences) => {
  const headers = Object.entries(args.columnWidths ?? {}).reduce<Record<string, { width: number }>>((prev, [key, value]) => {
    prev[key] = {
      width: value,
    }
    return prev
  }, {})

  emit('resize', {
    headers,
  })
}

function getRowAttributes(row: Record<string, any>): Record<string, any> {
  if (!row) {
    return {}
  }

  const attributes: Record<string, string> = {}

  if (typeof props.isSelectedRow !== 'undefined' && props.isSelectedRow(row as Row)) {
    attributes.class = 'is-selected'
  }

  return attributes
}
const click = (e: MouseEvent) => {
  const $tr = (e.target as HTMLElement).closest('tr')
  if ($tr) {
    const $a: HTMLAnchorElement | null = ['td:first-child a', '[data-action]'].reduce<HTMLAnchorElement | null>((prev, item) => {
      if (prev === null) {
        return $tr.querySelector(item)
      }
      return prev
    }, null)
    if ((window.getSelection()?.isCollapsed ?? true) && $a !== null && $a.closest('tr, li') === $tr) {
      e.preventDefault()
      $a.click()
    }
  }
}
const $ref = ref<InstanceType<typeof KTableView> | null>(null)
const rewrite = () => {
  const $el = $ref.value?.$el
  if (
    ((el: any | HTMLElement): el is HTMLElement => el && typeof el.querySelectorAll === 'function')($el)
  ) {
    const $trs = $el.querySelectorAll('tr[tabindex="0"]')
      ;['tabindex'].forEach(attr => Array.from($trs).forEach(item => item.removeAttribute(attr)))
  }
}
onMounted(rewrite)

</script>

<style lang="scss" scoped>
.app-collection :deep(td:first-child a) {
  color: inherit;
  font-weight: $kui-font-weight-semibold;
  text-decoration: none;
}

.app-collection :deep(td:first-child li a) {
  color: $kui-color-text-primary;
  font-weight: $kui-font-weight-regular;
}

.app-collection :deep(td:first-child li a:hover) {
  text-decoration: underline;
}
</style>

<style lang="scss">
.app-collection ._actions-column {
  width: 48px;
}

.app-collection .is-selected {
  background-color: $kui-color-background-neutral-weakest;
}
</style>
