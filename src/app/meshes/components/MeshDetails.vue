<template>
  <div class="stack">
    <KCard>
      <template #body>
        <MeshCharts :mesh-insight="meshInsight" />
      </template>
    </KCard>

    <KCard>
      <template #body>
        <div class="columns">
          <DefinitionList>
            <DefinitionListItem
              v-for="(value, property) in basicMesh"
              :key="property"
              :term="t(`http.api.property.${property}`)"
            >
              <KBadge
                v-if="typeof value === 'boolean'"
                :appearance="value ? 'success' : 'danger'"
              >
                {{ value ? 'Enabled' : 'Disabled' }}
              </KBadge>

              <template v-else-if="property === 'name' && typeof value === 'string'">
                <TextWithCopyButton :text="value" />
              </template>

              <template v-else>
                {{ value }}
              </template>
            </DefinitionListItem>
          </DefinitionList>

          <DefinitionList>
            <DefinitionListItem
              v-for="(value, property) in extendedMesh"
              :key="property"
              :term="t(`http.api.property.${property}`)"
            >
              <KBadge
                v-if="value === ''"
                appearance="danger"
              >
                Disabled
              </KBadge>

              <template v-else>
                {{ value }}
              </template>
            </DefinitionListItem>

            <DefinitionListItem :term="t('http.api.property.localityAwareLoadBalancing')">
              <KBadge :appearance="hasLocalityAwareLoadBalancing ? 'success' : 'danger'">
                {{ hasLocalityAwareLoadBalancing ? 'Enabled' : 'Disabled' }}
              </KBadge>
            </DefinitionListItem>
          </DefinitionList>

          <DefinitionList>
            <DefinitionListItem :term="`Policies (${totalPolicyCount})`">
              <ul>
                <li
                  v-for="(policyType, index) in policyTypes"
                  :key="index"
                >
                  <router-link
                    :to="{
                      name: 'policies-list-view',
                      params: {
                        policyPath: policyType.path
                      }
                    }"
                  >
                    {{ policyType.name }}: {{ policyType.total }}
                  </router-link>
                </li>
              </ul>
            </DefinitionListItem>
          </DefinitionList>
        </div>
      </template>
    </KCard>

    <KCard>
      <template #body>
        <ResourceCodeBlock
          id="code-block-mesh"
          :resource-fetcher="fetchMesh"
          :resource-fetcher-watch-key="mesh?.name || null"
        />
      </template>
    </KCard>
  </div>
</template>

<script lang="ts" setup>
import { KBadge, KCard } from '@kong/kongponents'
import { PropType, computed } from 'vue'
import { useRoute } from 'vue-router'

import MeshCharts from '../components/MeshCharts.vue'
import DefinitionList from '@/app/common/DefinitionList.vue'
import DefinitionListItem from '@/app/common/DefinitionListItem.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useStore } from '@/store/store'
import type { SingleResourceParameters } from '@/types/api.d'
import type { Mesh, MeshInsight } from '@/types/index.d'
import { useKumaApi, useI18n } from '@/utilities'
import { notEmpty } from '@/utilities/notEmpty'

const { t, formatIsoDate } = useI18n()
const kumaApi = useKumaApi()
const route = useRoute()
const store = useStore()

const props = defineProps({
  mesh: {
    type: Object as PropType<Mesh>,
    required: true,
  },

  meshInsight: {
    type: Object as PropType<MeshInsight>,
    required: true,
  },
})

const basicMesh = computed(() => {
  const { name, creationTime, modificationTime } = props.mesh
  return {
    name,
    created: formatIsoDate(creationTime),
    modified: formatIsoDate(modificationTime),
    'Data Plane Proxies': props.meshInsight.dataplanes.total,
  }
})

const hasLocalityAwareLoadBalancing = computed(() => Boolean(props.mesh.routing?.localityAwareLoadBalancing))

const extendedMesh = computed(() => ({
  mtls: getBackendData(props.mesh, 'mtls'),
  logging: getBackendData(props.mesh, 'logging'),
  metrics: getBackendData(props.mesh, 'metrics'),
  tracing: getBackendData(props.mesh, 'tracing'),
}))

const totalPolicyCount = computed(() => {
  return Object.values(props.meshInsight.policies ?? {}).reduce((total, stat) => total + stat.total, 0)
})
const policyTypes = computed(() => {
  return Object.entries(props.meshInsight.policies ?? {})
    .map(([policyTypeName, stat]) => {
      const policyType = store.state.policyTypesByName[policyTypeName]

      if (policyType && stat.total !== 0) {
        return {
          name: policyType.name,
          path: policyType.path,
          total: stat.total,
        }
      }

      return null
    })
    .filter(notEmpty)
})

function getBackendData(mesh: Mesh, field: 'mtls' | 'logging' | 'metrics' | 'tracing') {
  if (mesh[field] === undefined) {
    return ''
  }

  const enabledBackendName = mesh[field].enabledBackend ?? mesh[field].defaultBackend ?? mesh[field].backends[0].name
  const enabledBackend = mesh[field].backends.find((backend: any) => backend.name === enabledBackendName)

  return `${enabledBackend.type} / ${enabledBackend.name}`
}

async function fetchMesh(params?: SingleResourceParameters) {
  const name = route.params.mesh as string
  return await kumaApi.getMesh({ name }, params)
}
</script>
