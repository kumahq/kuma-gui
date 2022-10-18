<template>
  <div class="resource-list">
    <KCard title="Create a virtual mesh">
      <template #body>
        <p>
          We can create multiple isolated Mesh resources (i.e. per application/<wbr>team/<wbr>business unit).
        </p>

        <div class="resource-list-actions mt-4">
          <KButton
            :to="{ name: 'create-mesh' }"
            appearance="primary"
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

    <KCard :title="`Apply ${tagline} policies`">
      <template #body>
        <p>
          We can apply {{ PRODUCT_NAME }} policies to secure, observe, route and manage the Mesh and its data plane proxies.
        </p>

        <div class="resource-list-actions mt-4">
          <KButton
            :to="policyDocsUrl"
            appearance="primary"
          >
            Explore policies
          </KButton>
        </div>
      </template>
    </KCard>

    <KCard
      v-if="resourceLinks.length > 0"
      title="Resources"
    >
      <template #body>
        <p>
          Join the {{ PRODUCT_NAME }} community and ask questions:
        </p>

        <ul>
          <li
            v-for="(item, index) in resourceLinks"
            :key="index"
          >
            <a
              :href="item.link"
              target="_blank"
            >
              {{ item.label }}
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

import { PRODUCT_NAME } from '@/consts'
import { useStore } from '@/store/store'

const store = useStore()

const policyDocsUrl = `https://kuma.io/policies/${import.meta.env.VITE_UTM}`
const tagline = store.getters['config/getTagline']
const dataplaneWizardRoute = computed(() => {
  const name = store.getters['config/getEnvironment'] === 'universal' ? 'universal-dataplane' : 'kubernetes-dataplane'

  return { name }
})
const resourceLinks = computed(() => {
  const kumaDocsVersion = store.getters['config/getKumaDocsVersion']

  if (!kumaDocsVersion) {
    return []
  }

  return [
    {
      link: `https://kuma.io/docs/${kumaDocsVersion}/${import.meta.env.VITE_UTM}`,
      label: `${import.meta.env.VITE_NAMESPACE} Documentation`,
    },
    {
      link: `https://kuma-mesh.slack.com/${import.meta.env.VITE_UTM}`,
      label: `${import.meta.env.VITE_NAMESPACE} Community Chat`,
    },
    {
      link: `https://github.com/kumahq/kuma${import.meta.env.VITE_UTM}`,
      label: `${import.meta.env.VITE_NAMESPACE} GitHub Repository`,
    },
  ]
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
