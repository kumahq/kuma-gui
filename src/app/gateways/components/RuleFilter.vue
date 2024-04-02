<template>
  <div class="filter">
    <KBadge appearance="neutral">
      {{ t(`http.api.property.${props.filter.type}`) }}
    </KBadge>

    <div>
      <template v-if="props.filter.type === 'RequestHeaderModifier'">
        <div class="list">
          <template
            v-for="(value, key) in props.filter.requestHeaderModifier"
            :key="key"
          >
            <template v-if="value">
              <div class="list">
                <KBadge>{{ t(`http.api.property.${key}`) }}</KBadge>

                <span
                  v-for="(entry, index) in value"
                  :key="index"
                >
                  {{ typeof entry === 'string' ? entry : `${entry.name}:${entry.value}` }}
                </span>
              </div>
            </template>
          </template>
        </div>
      </template>

      <template v-else-if="props.filter.type === 'ResponseHeaderModifier'">
        <div class="list">
          <template
            v-for="(value, key) in props.filter.responseHeaderModifier"
            :key="key"
          >
            <template v-if="value">
              <div class="list">
                <KBadge>{{ t(`http.api.property.${key}`) }}</KBadge>

                <span
                  v-for="(entry, index) in value"
                  :key="index"
                >
                  <template v-if="typeof entry === 'string'">
                    {{ entry }}
                  </template>

                  <template v-else>
                    {{ entry.name }}:{{ entry.value }}
                  </template>
                </span>
              </div>
            </template>
          </template>
        </div>
      </template>

      <template v-else-if="props.filter.type === 'RequestMirror'">
        <TargetRef :target-ref="props.filter.requestMirror.backendRef">
          {{ props.filter.requestMirror.backendRef.name }}
          <template v-if="props.filter.requestMirror.percentage">
            ({{ props.filter.requestMirror.percentage }})
          </template>
        </TargetRef>
      </template>

      <template v-else-if="props.filter.type === 'RequestRedirect'">
        <div class="list">
          <div
            v-for="(value, key) in props.filter.requestRedirect"
            :key="key"
          >
            <template v-if="value">
              <span class="text-neutral">
                {{ t(`http.api.property.${key}`) }}:
              </span>

              <template v-if="typeof value === 'object'">
                {{ value.type === 'ReplaceFullPath' ? value.replaceFullPath : value.replacePrefixMatch }}
              </template>

              <template v-else>
                {{ value }}
              </template>
            </template>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="list">
          <div
            v-for="(value, key) in props.filter.urlRewrite"
            :key="key"
          >
            <template v-if="value">
              <span class="text-neutral">
                {{ t(`http.api.property.${key}`) }}:
              </span>

              <template v-if="typeof value === 'object'">
                {{ value.type === 'ReplaceFullPath' ? value.replaceFullPath : value.replacePrefixMatch }}
              </template>

              <template v-else>
                {{ value }}
              </template>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TargetRef from '@/app/common/TargetRef.vue'
import type { ToTargetRefFilter } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  filter: ToTargetRefFilter
}>()
</script>

<style lang="scss" scoped>
.filter {
  display: flex;
  flex-wrap: wrap;
  gap: $kui-space-50;
}

.list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: $kui-space-40;
  align-items: baseline;
}

.text-neutral {
  color: $kui-color-text-neutral;
}
</style>
