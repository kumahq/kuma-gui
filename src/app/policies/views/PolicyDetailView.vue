<template>
  <RouteView
    v-slot="{route: _route}"
  >
    <RouteTitle
      :title="t('policies.routes.item.title')"
    />
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'policies-list-view',
            params: _route.params
          },
          text: t('policies.routes.item.breadcrumbs')
        },
      ]"
    >
      <PolicyDetails
        v-if="policyType"
        :name="props.policyName"
        :mesh="props.mesh"
        :path="props.policyPath"
        :type="policyType.name"
      />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import PolicyDetails from '../components/PolicyDetails.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'
const route = useRoute()
const store = useStore()
const { t } = useI18n()

const props = defineProps<{
  mesh: string,
  policyPath: string,
  policyName: string,
}>()

const policyType = computed(() => store.state.policyTypesByPath[props.policyPath])

start()

function start() {
  store.dispatch('updatePageTitle', route.params.policy)
}
</script>
