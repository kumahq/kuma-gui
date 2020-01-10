<template>
  <div class="overview">
    <KEmptyState>
      <template slot="title">
        <KIcon
          class="kong-icon--centered"
          color="var(--yellow-base)"
          icon="warning"
          size="64"
        />
        Page Not Found
      </template>
      <template slot="message">
        The page or entity you were looking for does not exist.
      </template>
      <template slot="cta">
        <KButton
          appearance="primary"
          :to="{
            name: 'mesh-overview',
            params: {
              mesh: homepage
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
import PageHeader from '@/components/Utils/PageHeader.vue'
import PageContent from '@/components/Utils/PageContent.vue'

export default {
  name: 'NotFound',
  metaInfo: {
    title: 'Not Found'
  },
  components: {
    PageHeader,
    PageContent
  },
  computed: {
    homepage () {
      const meshFromLS = localStorage.getItem('selectedMesh')
      const meshFromState = this.$store.getters.getSelectedMesh

      if (meshFromLS && meshFromLS.length > 0) {
        return meshFromLS
      } else {
        return meshFromState
      }
    }
  }
}
</script>
