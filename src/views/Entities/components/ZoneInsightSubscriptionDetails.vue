<template>
  <div>
    <div v-if="details.globalInstanceId || details.connectTime || details.disconnectTime">
      <h5 class="overview-tertiary-title">
        General Information:
      </h5>
      <ul>
        <li v-if="details.globalInstanceId">
          <strong>Global Instance ID:</strong>&nbsp;
          <span class="mono">{{ details.globalInstanceId }}</span>
        </li>
        <li v-if="details.connectTime">
          <strong>Last Connected:</strong>&nbsp;
          {{ details.connectTime | readableDate }}
        </li>
        <li v-if="details.disconnectTime">
          <strong>Last Disconnected:</strong>&nbsp;
          {{ details.disconnectTime | readableDate }}
        </li>
      </ul>
    </div>

    <div v-if="details.status">
      <ul
        v-if="details.status.stat"
        class="overview-stat-grid"
      >
        <li
          v-for="(item, label) in details.status.stat"
          :key="label"
        >
          <h6 class="overview-tertiary-title">
            {{ label | humanReadable }}:
          </h6>
          <ul>
            <li
              v-for="(k, v) in item"
              :key="v"
            >
              <strong>{{ v | humanReadable }}:</strong>&nbsp;
              <span class="mono">{{ k | formatValue | formatError }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <KAlert
      v-else
      appearance="info"
      class="mt-4"
    >
      <template v-slot:alertIcon>
        <KIcon icon="portal" />
      </template>
      <template v-slot:alertMessage>
        There are no Policy statistics for <strong>{{ details.id }}</strong>
      </template>
    </KAlert>
  </div>
</template>

<script>
import { humanReadableDate, camelCaseToWords } from '@/helpers'

export default {
  name: 'ZoneInsightSubscriptionDetails',
  filters: {
    formatValue(value) {
      return value ? parseInt(value, 10).toLocaleString('en').toString() : 0
    },
    readableDate(value) {
      return humanReadableDate(value)
    },
    humanReadable(value) {
      return camelCaseToWords(value)
    },
    formatError(value) {
      if (value === '--') {
        return 'error calculating'
      }

      return value
    },
  },
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
}
</script>
