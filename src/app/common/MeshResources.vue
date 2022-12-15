<template>
  <div class="resource-list">
    <KCard title="Create a virtual mesh">
      <template #body>
        <p>
          We can create multiple isolated Mesh resources (i.e. per application/<wbr>team/<wbr>business unit).
        </p>

        <div class="resource-list-actions mt-4">
          <KButton
            icon="plus"
            appearance="creation"
            :to="{ name: 'create-mesh' }"
          >
            Create mesh
          </KButton>
        </div>
      </template>
    </KCard>

    <KCard title="Connect data plane proxies">
      <template #body>
        <p>
          We need a data plane proxy for each replica of our services within a Mesh resource.
        </p>

        <div class="resource-list-actions mt-4">
          <KButton
            :to="dataplaneWizardRoute"
            appearance="primary"
          >
            Get started
          </KButton>
        </div>
      </template>
    </KCard>

    <KCard :title="`Apply ${ env('KUMA_NAME') } policies`">
      <template #body>
        <p>
          We can apply {{ env('KUMA_NAME') }} policies to secure, observe, route and manage the Mesh and its data plane proxies.
        </p>

        <div class="resource-list-actions mt-4">
          <KButton
            :to="`${env('KUMA_DOCS_URL')}/policies/?${env('KUMA_UTM_QUERY_PARAMS')}`"
            appearance="primary"
          >
            Explore policies
          </KButton>
        </div>
      </template>
    </KCard>

    <KCard
      title="Resources"
    >
      <template #body>
        <p>
          Join the {{ env('KUMA_NAME') }} community and ask questions:
        </p>

        <ul>
          <li>
            <a
              :href="`${env('KUMA_DOCS_URL')}/?${env('KUMA_UTM_QUERY_PARAMS')}`"
            >
              {{ env('KUMA_NAME') }} Documentation
            </a>
          </li>
          <li>
            <a
              :href="`${env('KUMA_CHAT_URL')}/?${env('KUMA_UTM_QUERY_PARAMS')}`"
            >
              {{ env('KUMA_NAME') }}  Community Chat
            </a>
          </li>
          <li>
            <a
              :href="`https://github.com/kumahq/kuma?${env('KUMA_UTM_QUERY_PARAMS')}`"
            >
              {{ env('KUMA_NAME') }} GitHub Repository
            </a>
          </li>
        </ul>
      </template>
    </KCard>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { KButton, KCard } from '@kong/kongponents'

import { useStore } from '@/store/store'
import { useEnv } from '@/utilities/useEnv'
const env = useEnv()

const store = useStore()

const dataplaneWizardRoute = computed(() => {
  const name = store.getters['config/getEnvironment'] === 'universal' ? 'universal-dataplane' : 'kubernetes-dataplane'

  return { name }
})
</script>

<style lang="scss" scoped>
ul {
  padding-left: var(--spacing-lg);
  list-style: disc;
}

.resource-list {
  display: flex;
  align-items: stretch;
  gap: var(--spacing-xs);
}

.resource-list > * {
  flex-basis: 25%;
}

.resource-list-actions {
  display: flex;
  justify-content: center;
}
</style>
