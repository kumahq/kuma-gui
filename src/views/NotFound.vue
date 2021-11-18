<template>
  <div class="overview">
    <KEmptyState>
      <template v-slot:title>
        <KIcon
          class="kong-icon--centered"
          color="var(--yellow-200)"
          icon="warning"
          secondary-color="var(--black-75)"
          size="64"
        />
        Page Not Found
      </template>
      <template v-slot:message>
        The page or entity you were looking for does not exist.
      </template>
      <template v-slot:cta>
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
</template>

<script>
export default {
  name: 'NotFound',
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
