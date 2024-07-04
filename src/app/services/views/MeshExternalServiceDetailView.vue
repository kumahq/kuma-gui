<template>
  <RouteView
    name="mesh-external-service-detail-view"
    :params="{
    }"
  >
    <AppView>
      <div
        class="stack"
      >
        <KCard>
          <div class="columns">
            <DefinitionCard
              v-if="props.data.status.addresses.length > 0"
            >
              <template
                #title
              >
                Addresses
              </template>
              <template
                #body
              >
                <KTruncate>
                  <span
                    v-for="address in props.data.status.addresses"
                    :key="address.hostname"
                  >
                    {{ address.hostname }}
                  </span>
                </KTruncate>
              </template>
            </DefinitionCard>
            <DefinitionCard
              v-if="data.spec.match"
              class="port"
            >
              <template
                #title
              >
                Port
              </template>
              <template
                #body
              >
                <KBadge
                  v-for="connection in [data.spec.match]"
                  :key="connection.port"
                  appearance="info"
                >
                  {{ connection.port }}/{{ connection.protocol }}
                </KBadge>
              </template>
            </DefinitionCard>
            <DefinitionCard
              v-if="data.spec.match"
              class="tls"
            >
              <template
                #title
              >
                TLS
              </template>
              <template
                #body
              >
                <KBadge
                  appearance="neutral"
                >
                  {{ data.spec.tls?.enabled ? 'Enabled' : 'Disabled' }}
                </KBadge>
              </template>
            </DefinitionCard>
            <DefinitionCard
              v-if="typeof data.status.vip !== 'undefined'"
              class="ip"
            >
              <template
                #title
              >
                VIP
              </template>
              <template
                #body
              >
                {{ data.status.vip.ip }}
              </template>
            </DefinitionCard>
          </div>
        </KCard>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshExternalService } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'

const props = defineProps<{
  data: MeshExternalService
}>()
</script>

<style lang="scss" scoped>
.ip span {
  font-size: $kui-font-size-30;
}
</style>
