<template>
  <XI18n
    v-slot="{ t }"
  >
    <template
      v-for="prefix in [props.type.length > 0 ? `${props.type}.` : 'components.']"
      :key="prefix"
    >
      <template
        v-for="{title, body, href, actionLabel, actionType} in [
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
        <EntityEmptyState
          :title="title"
          appearance="secondary"
          data-testid="empty-block"
          :action-button-text="actionType === 'create' && href.length ? actionLabel : undefined"
          :learn-more="actionType === 'docs' && href.length"
          @click:learn-more="openInNewTab(href)"
          @click:create="openInNewTab(href)"
        >
          <template #image>
            <div class="empty-state-icon">
              <slot
                v-if="slots.icon"
                name="icon"
              />
              <component
                :is="iconMapping[type]"
                v-else-if="type && iconMapping[type]"
                :color="KUI_COLOR_TEXT_DECORATIVE_AQUA"
                :size="KUI_ICON_SIZE_50"
              />
              <AnalyticsIcon v-else />
            </div>
          </template>
          <template #title>
            <header v-if="title.length">
              <h2 class="x-empty-state-title">
                <XI18n
                  :path="`${prefix}x-empty-state.title`"
                  default-path="components.x-empty-state.title"
                />
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
            #actions
          >
            <slot name="action">
              <XAction
                v-if="href.length > 0"
                :action="(['docs', 'create'] as const).find((item) => item === actionType)"
                :href="href"
                :appearance="actionType === 'docs' ? 'secondary': undefined"
              >
                <XIcon
                  v-if="actionType === 'docs'"
                  name="docs"
                  :size="KUI_ICON_SIZE_40"
                />
                {{ actionLabel }}
              </XAction>
              <XTeleportSlot
                v-else
                :name="`${props.type}-x-empty-state-actions`"
              />
            </slot>
          </template>
        </EntityEmptyState>
      </template>
    </template>
  </XI18n>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_DECORATIVE_AQUA, KUI_ICON_SIZE_40, KUI_ICON_SIZE_50 } from '@kong/design-tokens'
import { LocationIcon, AnalyticsIcon, MeshIcon } from '@kong/icons'
import { EntityEmptyState } from '@kong-ui-public/entities-shared'

const props = withDefaults(defineProps<{
  type?: string
}>(), {
  type: '',
})
const slots = defineSlots()

const iconMapping: Record<string, unknown> = {
  'zone-cps': LocationIcon,
  'meshes': MeshIcon,
}

const openInNewTab = (url: string): void => {
  // open url in tab
  window.open(url, '_blank')
}
</script>
<style lang="scss" scoped>
.empty-state-icon {
  background-color: $kui-method-color-background-patch;
  border-radius: $kui-border-radius-20;
  padding: $kui-space-40;
}

.x-empty-state-title{
  font-size: $kui-font-size-50;
}
</style>
