<template>
  <Fetcher
    :has-error="hasError"
    :is-loading="isLoading"
    :is-empty="!hasItems"
  >
    <KCard border-variant="noBorder">
      <template v-slot:body>
        <Accordion
          :initially-open="[]"
          multiple-open
        >
          <AccordionItem
            v-for="(item, key) in items"
            :key="key"
          >
            <template v-slot:accordion-header>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-lg">
                    {{ item.name }}
                  </p>
                  <p class="subtitle">
                    {{ item.type }}
                  </p>
                </div>

                <div class="flex flex-wrap justify-end">
                  <KBadge
                    v-for="(_, key) in item.matchedPolicies"
                    :key="key"
                    class="mr-2 mb-2"
                  >
                    {{ key }}
                  </KBadge>
                </div>
              </div>
            </template>

            <template v-slot:accordion-content>
              <div class="policy-wrapper">
                <div
                  v-for="(policyGroup, policyType) in item.matchedPolicies"
                  :key="policyType"
                  class="policy-item"
                >
                  <h4 class="policy-type">
                    {{ getPolicyTitle(policyType) }}
                  </h4>
                  <ul>
                    <li
                      v-for="(policy) in policyGroup"
                      :key="policy.name"
                      class="my-1"
                      data-testid="policy-name"
                    >
                      <router-link :to="getPolicyLink(policy)">
                        {{ policy.name }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </AccordionItem>
        </Accordion>
      </template>
    </kcard>
  </Fetcher>
</template>

<script>
import { POLICY_MAP } from '@/consts'
import Kuma from '@/services/kuma'
import Fetcher from '@/components/Utils/Fetcher'
import Accordion from '@/components/Accordion/Accordion'
import AccordionItem from '@/components/Accordion/AccordionItem'

export default {
  name: 'DataplanePolicies',
  components: {
    Fetcher,
    Accordion,
    AccordionItem,
  },
  props: {
    mesh: {
      type: String,
      required: true,
    },
    dppName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      hasItems: false,
      isLoading: true,
      hasError: false,
      policies: [],
      searchInput: '',
      POLICY_MAP,
    }
  },

  watch: {
    dppName() {
      this.fetchPolicies()
    },
  },
  mounted() {
    this.fetchPolicies()
  },

  methods: {
    getPolicyTitle(policyType) {
      return POLICY_MAP[policyType]?.title || policyType
    },
    getPolicyLink(policy) {
      return {
        name: POLICY_MAP[policy.type]?.route,
        query: { ns: policy.name },
        params: { mesh: policy.mesh },
      }
    },
    async fetchPolicies() {
      this.hasError = false
      this.isLoading = true

      try {
        const { items, total } = await Kuma.getDataplanePolicies({
          mesh: this.mesh,
          dppName: this.dppName,
        })

        this.hasItems = total > 0

        this.items = items
      } catch (e) {
        this.hasError = true
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.subtitle {
  @apply text-sm tracking-wide;

  color: var(--black-45);
}

.policy-type {
  @apply uppercase text-sm font-medium mb-2;

  color: var(--gray-3);
}

.policy-wrapper {
  display: grid;
  padding: 16px;
  gap: 8px;
  margin-bottom: 16px;

  .item {
    height: 100%;
  }

  @media only screen and (min-width: 841px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 1fr;
  }

  @media only screen and (min-width: 1270px) {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
