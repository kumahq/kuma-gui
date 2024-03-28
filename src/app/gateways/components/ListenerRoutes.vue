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

                <div
                  v-if="listener.tags || listener.tls"
                  class="list mt-2"
                >
                  <div v-if="listener.tags">
                    <b>{{ t('builtin-gateways.detail.tags') }}</b>: <TagList :tags="listener.tags" />
                  </div>

                  <div
                    v-if="listener.tls"
                    class="tls"
                  >
                    <b>{{ t('http.api.property.tls') }}</b>: {{ listener.tls.mode ?? 'TERMINATE' }}
                  </div>
                </div>
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
                  <dl class="route-definition-list">
                    <div>
                      <dt>{{ t('builtin-gateways.detail.type') }}:</dt>
                      <dd>{{ toRule.type }}</dd>
                    </div>

                    <template v-if="!toRule.config.hostnames.includes('*')">
                      <div>
                        <dt>{{ t('builtin-gateways.detail.hostnames') }}:</dt>
                        <dd>{{ toRule.config.hostnames.join(', ') }}</dd>
                      </div>
                    </template>

                    <template v-if="toRule.matchers.length > 0">
                      <div>
                        <dt>{{ t('builtin-gateways.detail.matchers') }}:</dt>

                        <dd>
                          <RuleMatchers :items="toRule.matchers" />
                        </dd>
                      </div>
                    </template>

                    <div>
                      <dt>{{ t('builtin-gateways.detail.origins') }}:</dt>

                      <dd>
                        <div class="origins">
                          <div
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
                          </div>
                        </div>
                      </dd>
                    </div>

                    <template v-if="toRule.config.rules.length > 0">
                      <div>
                        <dt>{{ t('builtin-gateways.detail.rules') }}:</dt>

                        <dd>
                          <div class="rules">
                            <div
                              v-for="(rule, ruleIndex) in toRule.config.rules"
                              :key="ruleIndex"
                              class="rule"
                            >
                              <div>
                                {{ t('builtin-gateways.detail.matches') }}:

                                <div class="matches">
                                  <RuleMatch
                                    v-for="(match, matchIndex) in rule.matches"
                                    :key="matchIndex"
                                    :match="match"
                                  />
                                </div>
                              </div>

                              <div>
                                {{ t('builtin-gateways.detail.services') }}:

                                <ul class="services">
                                  <li
                                    v-for="(backendRef, backendRefIndex) in rule.default.backendRefs"
                                    :key="backendRefIndex"
                                  >
                                    <RouterLink
                                      v-if="['MeshService', 'MeshServiceSubset'].includes(backendRef.kind) && backendRef.name"
                                      :to="{
                                        name: 'service-detail-view',
                                        params: {
                                          service: backendRef.name,
                                        },
                                      }"
                                    >
                                      {{ backendRef.name }}
                                    </RouterLink>

                                    <template v-if="backendRef.weight !== undefined && backendRef.weight !== 1">
                                      {{ t('builtin-gateways.detail.weight_suffix', { weight: backendRef.weight }) }}
                                    </template>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </dd>
                      </div>
                    </template>
                  </dl>
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

import RuleMatch from './RuleMatch.vue'
import type { MeshGateway } from '../data'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import TagList from '@/app/common/TagList.vue'
import type { Rule } from '@/app/data-planes/data'
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

.list {
  display: flex;
  gap: $kui-space-50;
  align-items: baseline;
}

.tls {
  color: $kui-color-text-neutral;
}

.listener-card {
  cursor: pointer;
}

.listener-card.active {
  border-color: $kui-color-border-primary;
}

.route-definition-list>*+*,
.rules,
.rule>*+* {
  margin-top: $kui-space-40;
}

.route-definition-list dt {
  display: inline;
  font-weight: $kui-font-weight-semibold;
}

.route-definition-list dt,
.route-definition-list dd {
  display: inline;
}

.rules>*+* {
  margin-top: $kui-space-40;
  border-top: $kui-border-width-10 solid $kui-color-border;
  padding-top: $kui-space-40;
}

.origins,
.matches,
.services,
.origins>*+*,
.matches>*+*,
.services>*+* {
  margin-top: $kui-space-20;
}
</style>
