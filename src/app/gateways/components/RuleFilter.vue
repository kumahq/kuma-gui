<template>
  <div class="filter">
    <div>
      <KBadge appearance="neutral">
        {{ props.filter.type }}
      </KBadge>
    </div>

    <div>
      <template v-if="props.filter.type === 'RequestHeaderModifier'">
        <div class="list">
          <template v-if="props.filter.requestHeaderModifier.add">
            <div class="list">
              <KBadge>add</KBadge>

              <span
                v-for="({ name, value }, index) in props.filter.requestHeaderModifier.add"
                :key="index"
              >
                {{ name }}:{{ value }}
              </span>
            </div>
          </template>

          <template v-if="props.filter.requestHeaderModifier.set">
            <div class="list">
              <KBadge>set</KBadge>

              <span
                v-for="({ name, value }, index) in props.filter.requestHeaderModifier.set"
                :key="index"
              >
                {{ name }}:{{ value }}
              </span>
            </div>
          </template>

          <template v-if="props.filter.requestHeaderModifier.remove">
            <div class="list">
              <KBadge>remove</KBadge>

              <span
                v-for="(name, index) in props.filter.requestHeaderModifier.remove"
                :key="index"
              >
                {{ name }}
              </span>
            </div>
          </template>
        </div>
      </template>

      <template v-else-if="props.filter.type === 'ResponseHeaderModifier'">
        <div class="list">
          <template v-if="props.filter.responseHeaderModifier.add">
            <div class="list">
              <KBadge>add</KBadge>

              <span
                v-for="({ name, value }, index) in props.filter.responseHeaderModifier.add"
                :key="index"
              >
                {{ name }}:{{ value }}
              </span>
            </div>
          </template>

          <template v-if="props.filter.responseHeaderModifier.set">
            <div class="list">
              <KBadge>set</KBadge>

              <span
                v-for="({ name, value }, index) in props.filter.responseHeaderModifier.set"
                :key="index"
              >
                {{ name }}:{{ value }}
              </span>
            </div>
          </template>

          <template v-if="props.filter.responseHeaderModifier.remove">
            <div class="list">
              <KBadge>remove</KBadge>

              <span
                v-for="(name, index) in props.filter.responseHeaderModifier.remove"
                :key="index"
              >
                {{ name }}
              </span>
            </div>
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
        <dl class="list">
          <div v-if="props.filter.requestRedirect.schema">
            <span class="text-neutral">
              {{ t('http.api.property.schema') }}:
            </span>
            {{ props.filter.requestRedirect.schema }}
          </div>

          <div v-if="props.filter.requestRedirect.hostname">
            <span class="text-neutral">
              {{ t('http.api.property.hostname') }}:
            </span>
            {{ props.filter.requestRedirect.hostname }}
          </div>

          <div v-if="props.filter.requestRedirect.port">
            <span class="text-neutral">
              {{ t('http.api.property.port') }}:
            </span>
            {{ props.filter.requestRedirect.port }}
          </div>

          <div v-if="props.filter.requestRedirect.path">
            <span class="text-neutral">
              {{ t(`http.api.property.${props.filter.requestRedirect.path.type}`) }}:
            </span>

            <template v-if="props.filter.requestRedirect.path.type === 'ReplaceFullPath'">
              {{ props.filter.requestRedirect.path.replaceFullPath }}
            </template>

            <template v-else>
              {{ props.filter.requestRedirect.path.replacePrefixMatch }}
            </template>
          </div>

          <div v-if="props.filter.requestRedirect.statusCode">
            <span class="text-neutral">
              {{ t('http.api.property.statusCode') }}:
            </span>
            {{ props.filter.requestRedirect.statusCode }}
          </div>
        </dl>
      </template>

      <template v-else>
        <dl class="list">
          <div v-if="props.filter.urlRewrite.hostToBackendHostname">
            <span class="text-neutral">
              {{ t('http.api.property.hostToBackendHostname') }}:
            </span>
            {{ props.filter.urlRewrite.hostToBackendHostname }}
          </div>

          <div v-if="props.filter.urlRewrite.hostname">
            <span class="text-neutral">
              {{ t('http.api.property.hostname') }}:
            </span>
            {{ props.filter.urlRewrite.hostname }}
          </div>

          <div v-if="props.filter.urlRewrite.path">
            <span class="text-neutral">
              {{ t(`http.api.property.${props.filter.urlRewrite.path.type}`) }}:
            </span>
            <template v-if="props.filter.urlRewrite.path.type === 'ReplaceFullPath'">
              {{ props.filter.urlRewrite.path.replaceFullPath }}
            </template>
            <template v-else>
              {{ props.filter.urlRewrite.path.replacePrefixMatch }}
            </template>
          </div>
        </dl>
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
