<template>
  <div class="entity-summary entity-section-list">
    <h3 class="entity-title">
      <span class="kutil-sr-only">Service:</span>

      <router-link :to="serviceInsightRoute">
        {{ serviceInsight.name }}
      </router-link>

      <div
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
        <span>Data planes:</span>
        <span>Total: {{ props.serviceInsight.dataplanes.total }} (online: {{ props.serviceInsight.dataplanes.online }})</span>
      </div>
    </section>

    <YamlView :content="rawServiceInsight" />
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
  name: 'service-insight-detail-view',
  params: {
    service: props.serviceInsight.name,
    mesh: props.serviceInsight.mesh,
  },
}))
const status = computed(() => STATUS[props.serviceInsight.status])
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
  grid-template-columns: 10ch 1fr;
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
