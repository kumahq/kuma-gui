<template>
  <div class="local-cps">
    <page-header noflex>
      <h2 class="type-xxl">
        {{ pageTitle }}
      </h2>
    </page-header>
    <FrameSkeleton class="py-2 px-4">
      <KCard
        v-if="isReady"
        border-variant="noBorder"
      >
        <template slot="body">
          <prism
            class="code-block"
            language="json"
            :code="codeOutput"
          />
        </template>
        <template slot="actions">
          <KClipboardProvider
            v-if="codeOutput"
            v-slot="{ copyToClipboard }"
          >
            <KPop placement="bottom">
              <KButton
                appearance="primary"
                @click="() => { copyToClipboard(codeOutput) }"
              >
                Copy config to clipboard
              </KButton>
              <div slot="content">
                <p>Config copied to clipboard!</p>
              </div>
            </KPop>
          </KClipboardProvider>
        </template>
      </KCard>

      <!-- loading / error handling -->
      <KEmptyState
        v-if="isLoading || hasError"
        cta-is-hidden
      >
        <template slot="title">
          <div class="card-icon mb-3">
            <KIcon
              v-if="icon"
              class="kong-icon--centered"
              :color="iconColor"
              :icon="icon"
              size="42"
            />
          </div>
          <span v-if="isLoading">
            Data Loading...
          </span>
          <span v-else-if="hasError">
            An error has occurred while trying to load this data.
          </span>
        </template>
      </KEmptyState>
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Prism from 'vue-prismjs'
import 'prismjs/themes/prism.css'
import PageHeader from '@/components/Utils/PageHeader.vue'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'

export default {
  name: 'Diagnostics',
  metaInfo: {
    title: 'Diagnostics'
  },
  components: {
    PageHeader,
    FrameSkeleton,
    Prism
  },
  data () {
    return {
      isLoading: true,
      hasError: false
    }
  },
  computed: {
    ...mapGetters({
      config: 'getConfig'
    }),
    icon () {
      if (this.isLoading) {
        return 'spinner'
      } else if (this.hasError) {
        return 'warning'
      }

      return false
    },
    iconColor () {
      if (this.hasError) {
        return 'var(--yellow-200)'
      }

      return '#ccc'
    },
    isReady () {
      return !this.hasError && !this.isLoading
    },
    pageTitle () {
      const metaTitle = this.$route.meta.title

      return metaTitle
    },
    codeOutput () {
      const code = this.config

      return JSON.stringify(code, null, 2)
    },
    configUrl () {
      const url = localStorage.getItem('kumaApiUrl') || null
      const apiUrl = url
        ? `${url}/config`
        : null

      return apiUrl
    }
  },
  beforeMount () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      // if the config isn't present, run
      if (!this.config) {
        // fetch the config
        this.$store.dispatch('getConfig')
          .catch(error => {
            this.hasError = true

            console.log(error)
          })
          .finally(() => {
            setTimeout(() => {
              this.isLoading = false
            }, process.env.VUE_APP_DATA_TIMEOUT)
          })
      } else {
        setTimeout(() => {
          this.isLoading = false
        }, process.env.VUE_APP_DATA_TIMEOUT)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-icon {
  text-align: center;

  img, svg {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
