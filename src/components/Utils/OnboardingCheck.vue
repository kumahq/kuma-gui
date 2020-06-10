<template>
  <div class="onboarding-check">
    <div v-if="alertClosed === false">
      <KAlert
        v-if="showNotice"
        appearance="info"
        class="dismissible"
        is-dismissible
        @closed="closeAlert"
      >
        <!-- <template slot="alertIcon">
        <KIcon
          icon="warning"
          size="24"
        />
      </template> -->
        <template slot="alertMessage">
          <div class="alert-content">
            <div>
              <strong>Welcome to Kuma!</strong> We've detected that you don't have
              any Dataplanes running yet. We've created an onboarding process to
              help you!
            </div>
            <div>
              <KButton
                appearance="primary"
                size="small"
                class="action-button"
                :to="{ path: '/get-started' }"
              >
                Get Started
              </KButton>
            </div>
          </div>
        </template>
      </KAlert>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'OnboardingCheck',
  data () {
    return {
      onlyDefaultMesh: false,
      alertClosed: false
    }
  },
  computed: {
    ...mapState({
      dataplanes: 'totalDataplaneCount',
      meshes: 'meshes'
    }),
    showNotice () {
      return !this.dataplanes && this.onlyDefaultMesh === true
    }
  },
  watch: {
    '$route' (to, from) {
      this.init()
    }
  },
  beforeMount () {
    this.init()
  },
  methods: {
    init () {
      // 1. get the dataplane count
      this.$store.dispatch('fetchDataplaneTotalCount')

      // 2. get the first few meshes from the API
      // 3. check if there is only 1 mesh
      // 4. check if the single mesh is `default`
      this.$api.getAllMeshes({ size: 3 })
        .then(response => {
          const total = response.total
          const items = response.items

          this.onlyDefaultMesh = total === 1 && items[0].name === 'default'
        })
    },
    closeAlert () {
      this.alertClosed = true
    }
  }
}
</script>

<style lang="scss" scoped>
.onboarding-check {
  margin: 0 0 var(--spacing-xl) 0;
}

.alert-content {

  @media screen and (min-width: 700px) {
    display: flex;
    align-items: center;

    > *:first-of-type {
      margin-right: var(--spacing-md);
    }

    > *:last-of-type {
      min-width: 150px;
    }
  }

  @media screen and (max-width: 699px) {
    > *:last-of-type {
      margin-top: 10px;
    }
  }
}

.action-button.action-button {
  text-decoration: none;
}
</style>
