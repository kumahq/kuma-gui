<template>
  <div class="filter">
    <XBadge appearance="neutral">
      {{ props.filter.type }}
    </XBadge>

    <div>
      <template v-if="props.filter.type === 'RequestHeaderModifier'">
        <div class="list">
          <template
            v-for="(value, key) in props.filter.requestHeaderModifier"
            :key="key"
          >
            <template v-if="value">
              <span
                v-for="(entry, index) in value"
                :key="index"
              >
                <span class="text-neutral">
                  {{ key }}:
                </span>

                {{ typeof entry === 'string' ? entry : `${entry.name}:${entry.value}` }}
              </span>
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
              <span
                v-for="(entry, index) in value"
                :key="index"
              >
                <span class="text-neutral">
                  {{ key }}:
                </span>

                {{ typeof entry === 'string' ? entry: `${entry.name}:${entry.value}` }}
              </span>
            </template>
          </template>
        </div>
      </template>

      <template v-else-if="props.filter.type === 'RequestMirror'">
        <TargetRef :target-ref="props.filter.requestMirror.backendRef">
          {{ props.filter.requestMirror.backendRef.name }}
        </TargetRef>

        <template v-if="props.filter.requestMirror.percentage">
          ({{ props.filter.requestMirror.percentage }}%)
        </template>
      </template>

      <template v-else-if="props.filter.type === 'RequestRedirect'">
        <div class="list">
          <div
            v-for="(value, key) in props.filter.requestRedirect"
            :key="key"
          >
            <template v-if="value">
              <span class="text-neutral">
                {{ key }}:
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
                {{ key }}:
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

const props = defineProps<{
  filter: ToTargetRefFilter
}>()
</script>

<style lang="scss" scoped>
.filter {
  display: flex;
  flex-wrap: wrap;
  gap: $kui-space-50;
  align-items: baseline;
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
