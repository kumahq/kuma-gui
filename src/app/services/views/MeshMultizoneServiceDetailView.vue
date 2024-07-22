<template>
  <RouteView
    name="mesh-multizone-service-detail-view"
    :params="{
      mesh: '',
      service: '',
      page: 1,
      size: 50,
      s: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
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
            <DefinitionCard>
              <template
                #title
              >
                Ports
              </template>
              <template
                #body
              >
                <KTruncate>
                  <KBadge
                    v-for="connection in data.status.ports"
                    :key="connection.port"
                    appearance="info"
                  >
                    {{ connection.port }}:{{ connection.targetPort }}/{{ connection.appProtocol }}
                  </KBadge>
                </KTruncate>
              </template>
            </DefinitionCard>
            <DefinitionCard>
              <template
                #title
              >
                Match Labels
              </template>
              <template
                #body
              >
                <KTruncate>
                  <KBadge
                    v-for="(value, key) in data.spec.selector.meshService.matchLabels"
                    :key="`${key}:${value}`"
                    appearance="info"
                  >
                    {{ key }}:{{ value }}
                  </KBadge>
                </KTruncate>
              </template>
            </DefinitionCard>
            <DefinitionCard
              v-if="data.status.vips.length > 0"
              class="ip"
            >
              <template
                #title
              >
                VIPs
              </template>
              <template
                #body
              >
                <KTruncate>
                  <span
                    v-for="address in data.status.vips"
                    :key="address.ip"
                  >
                    {{ address.ip }}
                  </span>
                </KTruncate>
              </template>
            </DefinitionCard>
          </div>
        </KCard>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { MeshMultizoneService } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'

const props = defineProps<{
  data: MeshMultizoneService
}>()
</script>

<style lang="scss" scoped>
.ip span {
  font-size: $kui-font-size-30;
}
</style>
