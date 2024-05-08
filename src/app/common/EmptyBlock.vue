<template>
  <template
    v-for="prefix in [props.type.length > 0 ? `${props.type}.` : 'components.']"
    :key="prefix"
  >
    <template
      v-for="{title, body, href, actionLabel, actionType} in [
        {
          title: t(`${prefix}x-empty-state.title`, undefined, { defaultMessage: '' }),
          body: t(`${prefix}x-empty-state.body`, undefined, { defaultMessage: '' }),
          href: t(`${prefix}x-empty-state.action.href`, undefined, { defaultMessage: '' }),
          actionLabel: t(`${prefix}x-empty-state.action.label`, undefined, { defaultMessage: '' }),
          actionType: t(`${prefix}x-empty-state.action.type`, undefined, { defaultMessage: '' }),
        },
      ]"
      :key="title"
    >
      <KEmptyState
        data-testid="empty-block"
      >
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
                <!-- eslint-disable vue/no-v-text-v-html-on-component -->
                <component
                  :is="`h2`"
                  v-html="title"
                />
                <!-- eslint-enable -->
              </header>
            </template>
          </slot>
        </template>

        <template
          v-if="$slots.default"
        >
          <slot name="default" />
        </template>
        <template
          v-else-if="body.length > 0"
        >
          <div
            v-html="body"
          />
        </template>

        <template
          v-if="$slots.action || href.length > 0"
          #action
        >
          <slot name="action">
            <XAction
              :type="(['docs', 'create'] as const).find((item) => item === actionType)"
              :href="href"
            >
              {{ actionLabel }}
            </XAction>
          </slot>
        </template>
      </KEmptyState>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { KEmptyState } from '@kong/kongponents'

import { useI18n } from '@/utilities'

const { t } = useI18n()
const props = withDefaults(defineProps<{
  type: string
}>(), {
  type: '',
})
</script>
