<template>
  <div>
    <KAlert
      v-if="!alertClosed && amountOfActions > 0"
      class="mb-4"
      appearance="info"
      is-dismissible
      @closed="closeAlert"
    >
      <template v-slot:alertMessage>
        <div class="mr-4">
          <span class="mr-2">
            <strong>ProTip:</strong>
            We've detected that there might be some possible to adjust the way how you use service mesh.
          </span>
          <KButton
            appearance="outline-primary"
            @click="openModal"
          >
            Check!
          </KButton>
        </div>
      </template>
    </KAlert>

    <KModal
      class="modal"
      :is-visible="isOpen"
      title="Here is a list of possible actions you might take to improve usability of your service mesh!"
    >
      <template v-slot:body-content>
        <Accordion
          multiple-open
          :initially-open="initiallyOpen"
        >
          <AccordionItem
            v-for="item in items"
            :key="item.name"
          >
            <template v-slot:accordion-header>
              <div class="flex items-center">
                <KIcon
                  v-if="item.isCompleted"
                  color="var(--green-400)"
                  icon="check"
                  size="20"
                  class="mr-4"
                />
                <KIcon
                  v-else
                  color="var(--yellow-300)"
                  secondary-color="var(--black-75)"
                  icon="warning"
                  size="20"
                  class="mr-4"
                />
                <strong>{{ item.name }}</strong>
              </div>
            </template>

            <template v-slot:accordion-content>
              <component
                :is="item.component"
                v-if="item.component"
              />
              <template v-else>
                <KCard>
                  <template v-slot:body>
                    {{ item.content }}
                  </template>
                </KCard>
              </template>
            </template>
          </AccordionItem>
        </Accordion>
      </template>
      <template v-slot:footer-content>
        <KButton
          class="no-underline success-button"
          appearance="secondary"
          @click="closeModal"
        >
          Close
        </KButton>
      </template>
    </KModal>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import Accordion from '@/components/Accordion/Accordion'
import AccordionItem from '@/components/Accordion/AccordionItem'
import OnboardingNotification from './components/OnboardingNotification.vue'
import LoggingNotification from './components/LoggingNotification.vue'
import MetricsNotification from './components/MetricsNotification.vue'
import MtlsNotification from './components/MtlsNotification.vue'
import TracingNotification from './components/TracingNotification.vue'

export default {
  name: 'NotificationManager',
  components: {
    Accordion,
    AccordionItem,
    OnboardingNotification,
    LoggingNotification,
    MetricsNotification,
    MtlsNotification,
    TracingNotification,
  },
  data() {
    return {
      alertClosed: false,
    }
  },
  computed: {
    ...mapState({
      isOpen: (state) => state.notifications.isOpen,
    }),

    ...mapGetters({
      hasLogging: 'notifications/hasLogging',
      hasMtls: 'notifications/hasMtls',
      hasMetrics: 'notifications/hasMetrics',
      hasTracking: 'notifications/hasTracking',
      items: 'notifications/items',
      amountOfActions: 'notifications/amountOfActions',
    }),
    initiallyOpen() {
      return this.items.reduce((acc, cur, index) => {
        if (!cur.isCompleted) {
          acc.push(index)
        }

        return acc
      }, [])
    },
  },
  methods: {
    ...mapActions({
      openModal: 'notifications/openModal',
      closeModal: 'notifications/closeModal',
    }),
    closeAlert() {
      this.alertClosed = true
    },
  },
}
</script>

<style lang="scss" scoped>
.modal {
  @apply mx-4;

  --KModalMaxWidth: 800px;
}
</style>
