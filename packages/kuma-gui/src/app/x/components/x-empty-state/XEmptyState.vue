<template>
  <XI18n
    v-slot="{ t }"
  >
    <template
      v-for="prefix in [props.type.length > 0 ? `${props.type}.` : 'components.']"
      :key="prefix"
    >
      <template
        v-for="{title, body} in [
          {
            title: t(`${prefix}x-empty-state.title`, undefined, { defaultMessage: t('components.x-empty-state.title') }),
            body: t(`${prefix}x-empty-state.body`, undefined, { defaultMessage: t('components.x-empty-state.body') }),
            href: t(`${prefix}x-empty-state.action.href`, undefined, { defaultMessage: '' }),
            actionLabel: t(`${prefix}x-empty-state.action.label`, undefined, { defaultMessage: '' }),
            actionType: t(`${prefix}x-empty-state.action.type`, undefined, { defaultMessage: '' }),
          },
        ]"
        :key="title"
      >
        <KEmptyState
          :icon-background="['control-planes', 'meshes', 'zone-cps', 'zones-crud'].includes(props.type)"
          data-testid="empty-block"
          v-bind="bindingProps"
        >
          <template
            v-for="(_, key) in slots"
            :key="key"
            #[`${key}`]
          >
            <slot
              :name="key"
            />
          </template>
          <template #icon>
            <slot
              v-if="slots.icon"
              name="icon"
            />
            <div
              v-else-if="type && iconMapping[type]"
              class="empty-state-icon"
            >
              <component
                :is="iconMapping[type]"
                :color="KUI_COLOR_TEXT_DECORATIVE_AQUA"
                :size="KUI_ICON_SIZE_50"
              />
            </div>
            <AnalyticsIcon v-else />
          </template>
          <template #title>
            <header>
              <h2 class="x-empty-state-title">
                <template
                  v-if="title.length && !slots.title"
                >
                  {{ title }}
                </template>
                <template v-else>
                  <slot name="title" />
                </template>
              </h2>
            </header>
          </template>
          <template
            #default
          >
            <slot
              v-if="slots.default"
              name="default"
            />
            <template
              v-else-if="body.length > 0"
            >
              <XI18n
                :path="`${prefix}x-empty-state.body`"
                default-path="components.x-empty-state.body"
              />
            </template>
          </template>
          <template
            #action
          >
            <slot name="action">
              <XTeleportSlot
                :name="`${props.type}-x-empty-state-actions`"
              />
              <XAction
                v-if="t(`${prefix}x-empty-state.action.href`, undefined, { defaultMessage: '' }).length > 0"
                :action="(['docs', 'create'] as const).find((item) => item === t(`${prefix}x-empty-state.action.type`, undefined, { defaultMessage: '' }))"
                :href="t(`${prefix}x-empty-state.action.href`, undefined, { defaultMessage: '' })"
                :appearance="t(`${prefix}x-empty-state.action.type`, undefined, { defaultMessage: '' }) === 'docs' ? 'secondary': undefined"
              >
                <XIcon
                  v-if="t(`${prefix}x-empty-state.action.type`, undefined, { defaultMessage: '' }) === 'docs'"
                  name="docs"
                  :size="KUI_ICON_SIZE_40"
                />
                {{ t(`${prefix}x-empty-state.action.label`, undefined, { defaultMessage: '' }) }}
              </XAction>
            </slot>
          </template>
        </KEmptyState>
      </template>
    </template>
  </XI18n>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_DECORATIVE_AQUA, KUI_ICON_SIZE_40, KUI_ICON_SIZE_50 } from '@kong/design-tokens'
import { LocationIcon, AnalyticsIcon, MeshIcon } from '@kong/icons'
import { KEmptyState } from '@kong/kongponents'

import type { EmptyStateProps } from '@kong/kongponents'

const props = withDefaults(defineProps<{
  type?: string
} & EmptyStateProps>(), {
  type: '',
})
const {
  iconBackground,
  ...bindingProps
} = props

const slots = defineSlots()

const iconMapping: Record<string, unknown> = {
  'zone-cps': LocationIcon,
  'zones-crud': LocationIcon,
  'meshes': MeshIcon,
}
</script>
<style lang="scss" scoped>
.x-empty-state-title {
  font-size: $kui-font-size-50;
}
</style>
