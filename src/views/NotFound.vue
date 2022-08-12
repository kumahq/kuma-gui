<template>
  <div>
    <GlobalHeader />
    <div class="overview">
      <KEmptyState>
        <template #title>
          <KIcon
            class="kong-icon--centered"
            color="var(--yellow-200)"
            icon="warning"
            secondary-color="var(--black-75)"
            size="64"
          />
          Page Not Found
        </template>
        <template #message>
          The page or entity you were looking for does not exist.
        </template>
        <template #cta>
          <KButton
            appearance="primary"
            :to="{
              name: 'global-overview',
              params: {
                mesh: currentMesh
              }
            }"
          >
            Go Home
          </KButton>
        </template>
      </KEmptyState>
    </div>
  </div>
</template>

<script>
import GlobalHeader from '@/components/Global/GlobalHeader.vue'
export default {
  name: 'NotFound',
  components: { GlobalHeader },
  metaInfo: {
    title: 'Item Not Found',
  },
  computed: {
    currentMesh() {
      const meshFromState = this.$store.state.selectedMesh

      return meshFromState
    },
  },
}
</script>
