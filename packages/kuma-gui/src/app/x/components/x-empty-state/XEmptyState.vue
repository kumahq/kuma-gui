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
        <KEmptyState
          class="x-empty-state"
          data-testid="empty-block"
        >
          <template
            #icon
          >
            <slot name="icon" />
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
            <slot name="default" />
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
            <slot name="action">
              <XAction
                v-if="href.length > 0"
                :action="(['docs', 'create'] as const).find((item) => item === actionType)"
                :href="href"
              >
                {{ actionLabel }}
              </XAction>
              <XTeleportSlot
                v-else
                :name="`${props.type}-x-empty-state-actions`"
              />
            </slot>
          </template>
        </KEmptyState>
      </template>
    </template>
  </XI18n>
</template>

<script lang="ts" setup>
import { KEmptyState } from '@kong/kongponents'
const props = withDefaults(defineProps<{
  type?: string
}>(), {
  type: '',
})
const slots = defineSlots()
</script>
