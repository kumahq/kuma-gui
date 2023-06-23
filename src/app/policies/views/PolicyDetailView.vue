<template>
  <RouteView
    v-slot="{route}"
    module="policies"
  >
    <RouteTitle
      :title="t('policies.routes.item.title', {name: route.params.policy})"
    />
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'policies-list-view',
            params: {
              mesh: route.params.mesh,
              policyPath: route.params.policyPath,
            },
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

import PolicyDetails from '../components/PolicyDetails.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'
const store = useStore()
const { t } = useI18n()

const props = defineProps<{
  mesh: string,
  policyPath: string,
  policyName: string,
}>()

const policyType = computed(() => store.state.policyTypesByPath[props.policyPath])

</script>
