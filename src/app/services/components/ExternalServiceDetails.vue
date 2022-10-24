<template>
  <div class="entity-summary entity-section-list">
    <h3 class="entity-title">
      <span class="kutil-sr-only">Service:</span>

      <router-link :to="externalServiceRoute">
        {{ externalService.name }}
      </router-link>

      <EntityURLControl
        v-if="route.name !== externalServiceRoute.name"
        :route="externalServiceRoute"
      />
    </h3>

    <section>
      <div class="definition">
        <span>Mesh:</span>
        <span>{{ externalService.mesh }}</span>
      </div>

      <div class="definition">
        <span>Address:</span>
        <span>{{ props.externalService.networking.address }}</span>
      </div>

      <div class="definition">
        <span>TLS:</span>
        <span>{{ props.externalService.networking.tls?.enabled ? 'Enabled' : 'Disabled' }}</span>
      </div>
    </section>

    <section v-if="tags.length > 0">
      <h4>Tags</h4>

      <TagList :tags="tags" />
    </section>

    <YamlView
      id="code-block-external-service"
      :content="rawExternalService"
      is-searchable
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue'
import { useRoute } from 'vue-router'

import { ExternalService } from '@/types'
import { stripTimes } from '@/helpers'
import TagList from '@/app/common/TagList.vue'
import EntityURLControl from '@/components/Utils/EntityURLControl.vue'
import YamlView from '@/app/common/YamlView.vue'

const route = useRoute()

const props = defineProps({
  externalService: {
    type: Object as PropType<ExternalService>,
    required: true,
  },
})

const externalServiceRoute = computed(() => ({
  name: 'external-service-detail-view',
  params: {
    service: props.externalService.name,
    mesh: props.externalService.mesh,
  },
}))
const tags = computed(() => Object.entries(props.externalService.tags).map(([label, value]) => ({ label, value })))
const rawExternalService = computed(() => stripTimes(props.externalService))
</script>

<style lang="scss" scoped>
h3, h4 {
  margin-bottom: var(--spacing-xs);
}

h3 {
  font-size: 1.4em;
}

h4 {
  font-size: 1.25em;
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
