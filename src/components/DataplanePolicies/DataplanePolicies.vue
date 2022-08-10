<template>
  <StatusInfo
    :has-error="hasError"
    :is-loading="isLoading"
    :is-empty="!hasItems"
  >
    <KCard border-variant="noBorder">
      <template #body>
        <AccordionList
          :initially-open="[]"
          multiple-open
        >
          <AccordionItem
            v-for="(item, key) in items"
            :key="key"
          >
            <template #accordion-header>
              <div class="flex items-center justify-between">
                <div>
                  <p
                    v-if="item.type === 'dataplane'"
                    class="text-lg"
                  >
                    Dataplane
                  </p>
                  <p
                    v-if="item.type !== 'dataplane'"
                    class="text-lg"
                  >
                    {{ item.service }}
                  </p>
                  <p class="subtitle">
                    <span v-if="item.type === 'inbound' || item.type === 'outbound'">
                      {{ item.type }} {{ item.name }}
                    </span>
                    <span v-else-if="item.type === 'service' || item.type === 'dataplane'">
                      {{ item.type }}
                    </span>

                    <KPop
                      width="300"
                      placement="right"
                      trigger="hover"
                    >
                      <KIcon
                        icon="help"
                        size="12"
                        class="ml-1"
                        view-box="0 0 16 16"
                      />
                      <template #content>
                        <div>
                          {{ POLICY_TYPE_SUBTITLE[item.type] }}
                        </div>
                      </template>
                    </KPop>
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

            <template #accordion-content>
              <div class="policy-wrapper">
                <div
                  v-for="(policyType, policyTypeName) in item.policyTypes"
                  :key="`${key}-${policyTypeName}`"
                  class="policy-item"
                >
                  <h4 class="policy-type">
                    {{ policyType.pluralDisplayName }}
                  </h4>

                  <ul>
                    <li
                      v-for="(policy, policyKey) in policyType.policies"
                      :key="`${key}-${policyTypeName}-${policyKey}`"
                      class="my-1"
                      data-testid="policy-name"
                    >
                      <router-link :to="policy.route">
                        {{ policy.name }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </AccordionItem>
        </AccordionList>
      </template>
    </kcard>
  </StatusInfo>
</template>

<script>
import { mapState } from 'vuex'
import Kuma from '@/services/kuma'
import StatusInfo from '@/components/Utils/StatusInfo.vue'
import AccordionList from '@/components/Accordion/AccordionList.vue'
import AccordionItem from '@/components/Accordion/AccordionItem.vue'

const POLICY_TYPE_SUBTITLE = {
  inbound: 'Policies applied on incoming connection on address',
  outbound: 'Policies applied on outgoing connection to the address',
  service: 'Policies applied on outgoing connections to service',
  dataplane: 'Policies applied on all incoming and outgoing connections to the selected data plane proxy',
}

export default {
  name: 'DataplanePolicies',
  components: {
    StatusInfo,
    AccordionList,
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
      items: [],
      hasItems: false,
      isLoading: true,
      hasError: false,
      searchInput: '',
      POLICY_TYPE_SUBTITLE,
    }
  },

  computed: {
    ...mapState({
      policiesByType: (state) => state.policiesByType,
    }),
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
    async fetchPolicies() {
      this.hasError = false
      this.isLoading = true

      try {
        const { items, total } = await Kuma.getDataplanePolicies({
          mesh: this.mesh,
          dppName: this.dppName,
        })

        this.processItems(items)
        this.hasItems = total > 0
        this.items = items
      } catch (e) {
        console.error(e)
        this.hasError = true
      } finally {
        this.isLoading = false
      }
    },

    processItems(items) {
      for (const item of items) {
        item.policyTypes = {}

        // eslint-disable-next-line guard-for-in
        for (const policyType in item.matchedPolicies) {
          const policy = this.policiesByType[policyType]

          const policyEntry = {
            pluralDisplayName: policy.pluralDisplayName,
            policies: item.matchedPolicies[policyType],
          }

          for (const entryPolicy of policyEntry.policies) {
            entryPolicy.route = {
              name: policy.path,
              query: { ns: entryPolicy.name },
              params: { mesh: entryPolicy.mesh },
            }
          }

          item.policyTypes[policyType] = policyEntry
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.subtitle {
  @apply text-sm capitalize tracking-wide flex items-center;

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
