<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      name="mesh-external-service-detail-view"
      :params="{
        mesh: '',
        service: '',
        page: 1,
        size: me.pageSize,
        s: '',
        dataPlane: '',
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
  </DataSource>
</template>

<script lang="ts" setup>
import type { MeshExternalService } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import type { MeSource } from '@/app/me/sources'

const props = defineProps<{
  data: MeshExternalService
}>()
</script>

<style lang="scss" scoped>
.ip span {
  font-size: $kui-font-size-30;
}
</style>
