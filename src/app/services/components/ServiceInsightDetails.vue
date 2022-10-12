<template>
  <div class="entity-summary entity-section-list">
    <h3 class="entity-title">
      <span class="kutil-sr-only">Service:</span>

      <router-link :to="serviceInsightRoute">
        {{ serviceInsight.name }}
      </router-link>

      <div
        v-if="status !== null"
        :class="`status status--${status.appearance}`"
        data-testid="data-plane-status-badge"
      >
        {{ status.title.toLowerCase() }}
      </div>

      <EntityURLControl
        v-if="route.name !== serviceInsightRoute.name"
        :route="serviceInsightRoute"
      />
    </h3>

    <section>
      <div class="definition">
        <span>Mesh:</span>
        <span>{{ serviceInsight.mesh }}</span>
      </div>

      <div class="definition">
        <span>Address:</span>
        <span>
          <template v-if="serviceInsight.addressPort">
            {{ serviceInsight.addressPort }}
          </template>

          <template v-else>—</template>
        </span>
      </div>

      <div
        v-if="dataPlaneStatus !== null"
        class="definition"
      >
        <span>Data planes (online / total):</span>
        <span>{{ dataPlaneStatus }}</span>
      </div>
    </section>

    <YamlView
      id="code-block-service-insight"
      :content="rawServiceInsight"
      is-searchable
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { useRoute } from 'vue-router'

import { ServiceInsight } from '@/types'
import { stripTimes } from '@/helpers'
import { STATUS } from '@/consts'
import EntityURLControl from '@/components/Utils/EntityURLControl.vue'
import YamlView from '@/components/Skeletons/YamlView.vue'

const route = useRoute()

const props = defineProps({
  serviceInsight: {
    type: Object as PropType<ServiceInsight>,
    required: true,
  },
})

const serviceInsightRoute = computed(() => ({
  name: props.serviceInsight.serviceType === 'external' ? 'external-service-detail-view' : 'service-insight-detail-view',
  params: {
    service: props.serviceInsight.name,
    mesh: props.serviceInsight.mesh,
  },
}))
const status = computed(() => props.serviceInsight.status ? STATUS[props.serviceInsight.status] : null)
const dataPlaneStatus = computed(() => props.serviceInsight.dataplanes ? `${props.serviceInsight.dataplanes.online ?? 0} / ${props.serviceInsight.dataplanes.total}` : null)
const rawServiceInsight = computed(() => stripTimes(props.serviceInsight))
</script>

<style lang="scss" scoped>
h3 {
  margin-bottom: var(--spacing-xs);
  font-size: 1.4em;
}

.entity-section-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md) var(--spacing-xl);
}

.entity-title {
  display: flex;
  gap: var(--spacing-md);
}

.definition {
  display: grid;
  grid-template-columns: 22ch 1fr;
  grid-gap: var(--spacing-md);
}

.status::before {
  content: '';
  display: inline-block;
  vertical-align: middle;
  margin-right: var(--spacing-xs);
  border: 4px solid currentColor;
  border-radius: 50%;
}

.status--success {
  color: var(--green-400);
}

.status--warning {
  color: var(--yellow-500);
}

.status--danger {
  color:  var(--red-600);
}
</style>
