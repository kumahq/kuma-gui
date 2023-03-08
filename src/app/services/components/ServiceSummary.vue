<template>
  <div class="entity-summary entity-section-list">
    <section>
      <div class="block-list">
        <div>
          <h1 class="entity-title">
            <span>
              Service:

              <router-link :to="serviceRoute">
                {{ props.service.name }}
              </router-link>
            </span>

            <StatusBadge
              v-if="status"
              :status="status"
            />
          </h1>

          <div class="definition">
            <span>Mesh:</span>
            <span>{{ props.service.mesh }}</span>
          </div>

          <div class="definition">
            <span>Address:</span>
            <span>
              <template v-if="address !== null">
                {{ address }}
              </template>

              <template v-else>—</template>
            </span>
          </div>

          <div
            v-if="tls !== null"
            class="definition"
          >
            <span>TLS:</span>
            <span>{{ tls }}</span>
          </div>

          <div
            v-if="numberOfDataPlaneProxies !== null"
            class="definition"
          >
            <span>Data plane proxies:</span>
            <span>{{ numberOfDataPlaneProxies }}</span>
          </div>
        </div>

        <div v-if="tags !== null">
          <h2>Tags</h2>

          <TagList :tags="tags" />
        </div>
      </div>
    </section>

    <section class="config-section">
      <YamlView
        v-if="props.service.serviceType === 'external'"
        id="code-block-service"
        :content="rawService"
        is-searchable
        code-max-height="250px"
      />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { RouteLocationNamedRaw } from 'vue-router'

import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import YamlView from '@/app/common/YamlView.vue'
import { ExternalService, ServiceInsight } from '@/types/index.d'
import { stripTimes } from '@/utilities/helpers'

const props = defineProps({
  service: {
    type: Object as PropType<ServiceInsight>,
    required: true,
  },

  externalService: {
    type: Object as PropType<ExternalService | null>,
    required: false,
    default: null,
  },
})

const serviceRoute = computed<RouteLocationNamedRaw>(() => ({
  name: 'service-detail-view',
  params: {
    service: props.service.name,
    mesh: props.service.mesh,
  },
}))

const address = computed(() => {
  if (props.service.serviceType === 'external' && props.externalService !== null) {
    return props.externalService.networking.address
  } else {
    return props.service.addressPort ?? null
  }
})

const tls = computed(() => {
  if (props.service.serviceType === 'external' && props.externalService !== null) {
    return props.externalService.networking.tls?.enabled ? 'Enabled' : 'Disabled'
  } else {
    return null
  }
})

const numberOfDataPlaneProxies = computed(() => {
  if (props.service.serviceType === 'external') {
    return null
  } else {
    const online = props.service.dataplanes?.online ?? 0
    const total = props.service.dataplanes?.total ?? 0

    return `${online} online / ${total} total`
  }
})

const status = computed(() => {
  if (props.service.serviceType === 'external') {
    return null
  } else {
    return props.service.status ?? null
  }
})

const tags = computed(() => {
  if (props.service.serviceType === 'external' && props.externalService !== null) {
    return props.externalService.tags
  } else {
    return null
  }
})

const rawService = computed(() => stripTimes(props.externalService ?? props.service))
</script>

<style lang="scss" scoped>
.entity-summary {
  padding: var(--spacing-md);
}

.entity-section-list {
  display: flex;
  flex-wrap: wrap;
  row-gap: var(--spacing-md);
}

.entity-section-list > * {
  flex-basis: 60ch;
  min-inline-size: 0;
}

.entity-section-list > :not(:last-child) {
  padding-right: var(--spacing-md);
}

.config-section {
  max-width: 80ch;
}

.block-list > :not(:first-child) {
  margin-top: var(--spacing-xs);
}

.entity-title {
  display: flex;
  gap: var(--spacing-md);
}

.definition {
  display: grid;
  grid-template-columns: 16ch 1fr;
  grid-gap: var(--spacing-md);
}
</style>
