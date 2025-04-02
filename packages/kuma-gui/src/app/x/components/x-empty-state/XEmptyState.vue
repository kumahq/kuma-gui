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
          v-if="can('view growth-new-empty-states')"
          :title="title"
          appearance="secondary"
          data-testid="empty-block"
        >
          <template
            #image
          >
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
            <AnalyticsIcon
              v-else
            />
          </template>
          <template
            v-if="title.length"
            #title
          >
            <header>
              <h2
                class="x-empty-state-title"
              >
                <XI18n
                  :path="`${prefix}x-growth-empty-state.title`"
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
                :path="`${prefix}x-growth-empty-state.body`"
                default-path="components.x-empty-state.body"
              />
            </template>
          </template>
          <template
            #actions
          >
            <slot
              name="action"
            >
              <XTeleportSlot
                :name="`${props.type}-x-empty-state-actions`"
              />
              <XAction
                v-if="t(`${prefix}x-growth-empty-state.action.href`, undefined, { defaultMessage: '' }).length > 0"
                :action="(['docs', 'create'] as const).find((item) => item === t(`${prefix}x-growth-empty-state.action.type`, undefined, { defaultMessage: '' }))"
                :href="t(`${prefix}x-growth-empty-state.action.href`, undefined, { defaultMessage: '' })"
                :appearance="t(`${prefix}x-growth-empty-state.action.type`, undefined, { defaultMessage: '' }) === 'docs' ? 'secondary': undefined"
              >
                <XIcon
                  v-if="t(`${prefix}x-growth-empty-state.action.type`, undefined, { defaultMessage: '' }) === 'docs'"
                  name="docs"
                  :size="KUI_ICON_SIZE_40"
                />
                {{ t(`${prefix}x-growth-empty-state.action.label`, undefined, { defaultMessage: '' }) }}
              </XAction>
            </slot>
          </template>
        </EntityEmptyState>
        <KEmptyState
          v-else
          class="x-empty-state"
          data-testid="empty-block"
        >
          <template
            #icon
          >
            <slot
              name="icon"
            />
          </template>
          <template
            #title
          >
            <slot
              name="title"
            >
              <template
                v-if="title.length > 0"
              >
                <header>
                  <h2>
                    <XI18n
                      :path="`${prefix}x-empty-state.title`"
                      default-path="components.x-empty-state.title"
                    />
                  </h2>
                </header>
              </template>
            </slot>
          </template>

          <template
            v-if="slots.default"
          >
            <slot
              name="default"
            />
          </template>
          <template
            v-else-if="body.length > 0"
          >
            <XI18n
              :path="`${prefix}x-empty-state.body`"
              default-path="components.x-empty-state.body"
            />
          </template>

          <template
            #action
          >
            <slot
              name="action"
            >
              <XTeleportSlot
                :name="`${props.type}-x-empty-state-actions`"
              />
              <XAction
                v-if="href.length > 0"
                :action="(['docs', 'create'] as const).find((item) => item === actionType)"
                :href="href"
              >
                {{ actionLabel }}
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
import { EntityEmptyState } from '@kong-ui-public/entities-shared'

import { useCan } from '@/app/application'

const props = withDefaults(defineProps<{
  type?: string
}>(), {
  type: '',
})
const slots = defineSlots()
const can = useCan()

const iconMapping: Record<string, unknown> = {
  'zone-cps': LocationIcon,
  'zones-crud': LocationIcon,
  'meshes': MeshIcon,
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
