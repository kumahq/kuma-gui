<template>
  <div>
    <GlobalHeader />
    <div class="overview">
      <KEmptyState>
        <template #title>
          <KIcon
            class="kong-icon--centered"
            icon="warning"
            color="var(--black-75)"
            secondary-color="var(--yellow-300)"
            size="64"
          />

          <p>Page Not Found</p>
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

  components: {
    GlobalHeader,
  },

  computed: {
    currentMesh() {
      const meshFromState = this.$store.state.selectedMesh

      return meshFromState
    },
  },
}
</script>
