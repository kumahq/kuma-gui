<template>
  <div class="listener-routes-card">
    <div class="listener-routes">
      <div class="column">
        <div class="header">
          <h2 class="title">
            {{ t('builtin-gateways.detail.listeners') }}
          </h2>

          <p class="count">
            {{ meshGateway.conf.listeners.length }}
          </p>
        </div>

        <div class="content">
          <div class="listener-list">
            <template
              v-for="(listener, index) in meshGateway.conf.listeners"
              :key="index"
            >
              <div
                class="card listener-card"
                :class="{
                  'active': index === props.selectedListenerIndex,
                }"
                data-testid="listener-card"
                @click="triggerAction"
              >
                <div class="listener-card-header">
                  <KBadge appearance="info">
                    {{ t(`http.api.value.${listener.protocol}`) }}
                  </KBadge>

                  <RouterLink
                    :to="{
                      name: 'builtin-gateway-detail-view',
                      query: {
                        listener: index,
                      },
                    }"
                    class="listener-hostname"
                    data-action
                  >
                    {{ listener.hostname }}:{{ listener.port }}
                  </RouterLink>
                </div>

                <dl
                  v-if="listener.tags || listener.tls"
                  class="definition-list definition-list--horizontal mt-2"
                >
                  <div v-if="listener.tags">
                    <dt class="text-neutral">
                      {{ t('builtin-gateways.detail.tags') }}:
                    </dt>
                    <dd>
                      <TagList :tags="listener.tags" />
                    </dd>
                  </div>

                  <div v-if="listener.tls">
                    <dt class="text-neutral">
                      {{ t('http.api.property.tls') }}:
                    </dt>
                    <dd>{{ listener.tls.mode ?? 'TERMINATE' }}</dd>
                  </div>
                </dl>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="column">
        <div class="header">
          <h2 class="title">
            {{ t('builtin-gateways.detail.routes') }}
          </h2>

          <p class="count">
            {{ toRules.length }}
          </p>
        </div>

        <div class="content">
          <div class="to-rule-list">
            <EmptyBlock v-if="toRules.length === 0">
              <template #title>
                {{ t('builtin-gateways.detail.no_rules', { listener: props.selectedListenerIndex + 1 }) }}
              </template>
            </EmptyBlock>

            <template v-else>
              <template
                v-for="(toRule, index) in toRules"
                :key="index"
              >
                <div
                  class="card route-card"
                  data-testid="route-card"
                >
                  <div class="stack-with-borders">
                    <dl class="definition-list definition-list--horizontal mt-2">
                      <div>
                        <dt class="text-neutral visually-hidden">
                          {{ t('builtin-gateways.detail.type') }}:
                        </dt>
                        <dd>
                          <KBadge>{{ toRule.type }}</KBadge>
                        </dd>
                      </div>

                      <template v-if="!toRule.config.hostnames.includes('*')">
                        <div>
                          <dt class="text-neutral">
                            {{ t('builtin-gateways.detail.hostnames') }}:
                          </dt>
                          <dd>{{ toRule.config.hostnames.join(', ') }}</dd>
                        </div>
                      </template>

                      <div>
                        <dt class="text-neutral">
                          {{ t('builtin-gateways.detail.matchers') }}:
                        </dt>
                        <dd>
                          <RuleMatchers
                            v-if="toRule.matchers.length > 0"
                            :items="toRule.matchers"
                          />

                          <code v-else>*</code>
                        </dd>
                      </div>

                      <div>
                        <dt class="text-neutral">
                          {{ t('builtin-gateways.detail.origins') }}:
                        </dt>
                        <dd>
                          <div class="list">
                            <KBadge
                              v-for="(origin, originIndex) in toRule.origins"
                              :key="originIndex"
                            >
                              <RouterLink
                                :to="{
                                  name: 'policy-detail-view',
                                  params: {
                                    mesh: origin.mesh,
                                    policyPath: props.policyTypesByName[origin.type]!.path,
                                    policy: origin.name,
                                  },
                                }"
                              >
                                {{ origin.name }}
                              </RouterLink>
                            </KBadge>
                          </div>
                        </dd>
                      </div>
                    </dl>

                    <div v-if="toRule.config.rules.length > 0">
                      <b>{{ t('builtin-gateways.detail.rules') }}</b>:

                      <div class="stack-small mt-2">
                        <div
                          v-for="(rule, ruleIndex) in toRule.config.rules"
                          :key="ruleIndex"
                          class="rule stack-small"
                        >
                          <div>
                            {{ t('builtin-gateways.detail.matches') }}:

                            <div class="stack-small mt-2">
                              <RuleMatch
                                v-for="(match, matchIndex) in rule.matches"
                                :key="matchIndex"
                                :match="match"
                              />
                            </div>
                          </div>

                          <div v-if="rule.default.filters.length > 0">
                            {{ t('builtin-gateways.detail.filters') }}:

                            <div class="stack-small mt-2">
                              <RuleFilter
                                v-for="(filter, filterIndex) in rule.default.filters"
                                :key="filterIndex"
                                :filter="filter"
                              />
                            </div>
                          </div>

                          <div v-if="rule.default.backendRefs.length > 0">
                            {{ t('builtin-gateways.detail.services') }}:

                            <div class="stack-small mt-2">
                              <div
                                v-for="(backendRef, backendRefIndex) in rule.default.backendRefs"
                                :key="backendRefIndex"
                              >
                                <TargetRef :target-ref="backendRef">
                                  {{ backendRef.name }}
                                </TargetRef>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-if="toRule.config.default">
                      <b>{{ t('builtin-gateways.detail.default') }}</b>:

                      <div
                        v-if="toRule.config.default.backendRefs && toRule.config.default.backendRefs.length > 0"
                        class="stack-small mt-2"
                      >
                        <div class="rule stack-small">
                          <div>
                            {{ t('builtin-gateways.detail.services') }}:

                            <div class="stack-small mt-2">
                              <div
                                v-for="(backendRef, backendRefIndex) in toRule.config.default.backendRefs"
                                :key="backendRefIndex"
                              >
                                <TargetRef :target-ref="backendRef">
                                  {{ backendRef.name }}
                                </TargetRef>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import type { MeshGateway } from '../data'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import TagList from '@/app/common/TagList.vue'
import TargetRef from '@/app/common/TargetRef.vue'
import type { Rule } from '@/app/data-planes/data'
import RuleFilter from '@/app/rules/components/RuleFilter.vue'
import RuleMatch from '@/app/rules/components/RuleMatch.vue'
import RuleMatchers from '@/app/rules/components/RuleMatchers.vue'
import type { PolicyType } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { matchesTags } from '@/utilities/matchesTags'

const { t } = useI18n()

const props = defineProps<{
  meshGateway: MeshGateway
  selectedListenerIndex: number
  policyTypesByName: Partial<Record<string, PolicyType>>
  inspectRules: Rule[]
}>()

const toRules = computed(() => {
  const listener = props.meshGateway.conf.listeners[props.selectedListenerIndex]
  if (!listener) {
    return []
  }

  return props.inspectRules.filter((inspectRule) => {
    if (inspectRule.ruleType === 'to' && matchesTags(listener.tags ?? {}, inspectRule.matchers)) {
      if (inspectRule.type === 'MeshHTTPRoute' && ['HTTP', 'HTTPS'].includes(listener.protocol)) {
        return true
      }

      if (inspectRule.type === 'MeshTCPRoute' && ['TCP', 'TLS'].includes(listener.protocol)) {
        return true
      }
    }

    return false
  })
})

function triggerAction(event: Event) {
  if (event.isTrusted) {
    const actionElement = (event.currentTarget as HTMLElement).querySelector('[data-action]')
    if (actionElement instanceof HTMLElement && typeof actionElement.click === 'function') {
      actionElement.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.listener-routes-card {
  border: 1px solid $kui-color-border;
  border-radius: $kui-border-radius-20;
}

.listener-routes {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
}

.column + .column {
  border-left: 1px solid $kui-color-border;
}

.header {
  padding: $kui-space-60 $kui-space-60 $kui-space-40 $kui-space-60;
  border-bottom: 1px solid $kui-color-border;
}

.title {
  font-size: $kui-font-size-40;
  line-height: $kui-line-height-30;
}

.count {
  color: $kui-color-text-neutral-strong;
  margin-top: $kui-space-20;
}

.content {
  padding: $kui-space-60;
}

.listener-list>*+*,
.to-rule-list>*+* {
  margin-top: $kui-space-60;
}

.card {
  padding: $kui-space-50;
  border: 1px solid $kui-color-border;
  border-radius: $kui-border-radius-20;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.08);
}

.listener-card {
  cursor: pointer;
}

.listener-card.active {
  border-color: $kui-color-border-primary;
}

.route-card-title {
  font-size: $kui-font-size-30;
  line-height: $kui-line-height-30;
}

.list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: $kui-space-40;
  align-items: baseline;
}

.rule {
  padding: $kui-space-40;
  border: $kui-border-width-10 solid $kui-color-border;
  border-radius: $kui-border-radius-10;
}

.definition-list {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: $kui-space-40 $kui-space-50;
}

.definition-list:where(:not(.definition-list--horizontal)) {
  flex-direction: column;
}

.definition-list>* {
  min-width: 0;
}

.definition-list dt,
.definition-list dd {
  display: inline;
}

.text-neutral {
  color: $kui-color-text-neutral;
}
</style>
