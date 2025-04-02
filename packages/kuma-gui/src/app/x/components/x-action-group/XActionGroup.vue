<template>
  <div
    data-testid="x-action-group"
    :class="{
      'x-action-group': true,
      'expanded': props.expanded,
    }"
  >
    <template
      v-if="!props.expanded"
    >
      <KDropdown
        :kpop-attributes="{
          placement: 'bottom-end',
        }"
        width="auto"
      >
        <template
          #default
        >
          <slot
            v-if="slots.control"
            name="control"
          />
          <XAction
            v-else
            data-testid="x-action-group-control"
            icon
            appearance="tertiary"
            size="small"
          >
            <XIcon
              name="more"
            />
          </XAction>
        </template>
        <template
          #items
        >
          <XProvider
            name="x-action-group"
            :service="props"
          >
            <slot
              name="default"
            />
          </XProvider>
        </template>
      </KDropdown>
    </template>
    <slot
      v-else
      name="default"
    />
  </div>
</template>
<script lang="ts" setup>
import { KDropdown } from '@kong/kongponents'

const props = withDefaults(defineProps<{
  expanded?: boolean
}>(), {
  expanded: false,
})
const slots = defineSlots()

</script>
<style lang="scss" scoped>
.x-action-group.expanded {
  display: flex;
  align-items: center;
}

.x-action-group.expanded :deep(> *) {
  border-color: $kui-color-border-primary-weak;
  border-top: $kui-border-width-10 solid;
  border-bottom: $kui-border-width-10 solid;
  padding: $kui-space-30 $kui-space-50;
  font-weight: $kui-font-weight-semibold;
  text-decoration: none;
}

.x-action-group.expanded :deep(> .active) {
  border-color: $kui-color-border-primary-strong;
  background-color: $kui-color-background-primary-weakest;
}

.x-action-group.expanded :deep(> * + *) {
  border-left: $kui-border-width-10 solid;
}

.x-action-group.expanded :deep(> *:first-child) {
  border-left: $kui-border-width-10 solid;
  border-top-left-radius: $kui-border-radius-30;
  border-bottom-left-radius: $kui-border-radius-30;
}

.x-action-group.expanded :deep(> *:last-child) {
  border-right: $kui-border-width-10 solid;
  border-top-right-radius: $kui-border-radius-30;
  border-bottom-right-radius: $kui-border-radius-30;
}

.x-action-group :deep(.popover-container) {
  min-width: 100px;
  max-width: 300px;
}

.x-action-group :deep(.dropdown-item-trigger) {
  padding-right: 40px;
}
</style>
