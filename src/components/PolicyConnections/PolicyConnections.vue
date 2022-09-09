
<template>
  <div>
    <LabelList
      :has-error="hasError"
      :is-loading="isLoading"
      :is-empty="!hasDataplanes"
    >
      <ul>
        <li>
          <h4>Dataplanes</h4>
          <input
            id="dataplane-search"
            v-model="searchInput"
            type="text"
            class="k-input mb-4"
            placeholder="Filter by name"
            required
          >
          <p
            v-for="(dataplane, key) in filteredDataplanes"
            :key="key"
            class="my-1"
            data-testid="dataplane-name"
          >
            <router-link
              :to="{
                name: 'dataplanes',
                query: {
                  ns: dataplane.dataplane.name,
                },
                params: {
                  mesh: dataplane.dataplane.mesh,
                },
              }"
            >
              {{ dataplane.dataplane.name }}
            </router-link>
          </p>
        </li>
      </ul>
    </LabelList>
  </div>
</template>

<script>
import Kuma from '@/services/kuma'
import LabelList from '@/components/Utils/LabelList.vue'

export default {
  name: 'PolicyConnections',
  components: {
    LabelList,
  },
  props: {
    mesh: {
      type: String,
      required: true,
    },
    policyType: {
      type: String,
      required: true,
    },
    policyName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      hasDataplanes: false,
      isLoading: true,
      hasError: false,
      dataplanes: [],
      searchInput: '',
    }
  },
  computed: {
    filteredDataplanes() {
      const lowerCasedInput = this.searchInput.toLowerCase()

      return this.dataplanes.filter(({ dataplane: { name } }) => name.toLowerCase().includes(lowerCasedInput))
    },
  },
  watch: {
    policyName() {
      this.fetchPolicyConntections()
    },
  },
  mounted() {
    this.fetchPolicyConntections()
  },

  methods: {
    async fetchPolicyConntections() {
      this.hasError = false
      this.isLoading = true

      try {
        const { items, total } = await Kuma.getPolicyConnections({
          mesh: this.mesh,
          policyType: this.policyType,
          policyName: this.policyName,
        })

        this.hasDataplanes = total > 0

        this.dataplanes = items
      } catch (e) {
        this.hasError = true
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
