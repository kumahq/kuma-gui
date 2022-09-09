<template>
  <KCard border-variant="noBorder">
    <template #body>
      <ul>
        <li
          v-for="{ kind, payload, index } in warnings"
          :key="`${kind}/${index}`"
          class="mb-1"
        >
          <KAlert appearance="warning">
            <template #alertMessage>
              <component
                :is="getWarningComponent(kind)"
                :payload="payload"
              />
            </template>
          </KAlert>
        </li>
      </ul>
    </template>
  </KCard>
</template>

<script>
import WarningDefault from '@/views/Entities/components/WarningDefault.vue'
import WarningEnvoyIncompatible from '@/views/Entities/components/WarningEnvoyIncompatible.vue'
import WarningZoneAndKumaDPVersionsIncompatible from '@/views/Entities/components/WarningZoneAndKumaDPVersionsIncompatible.vue'
import WarningUnsupportedKumaDPVersion from '@/views/Entities/components/WarningUnsupportedKumaDPVersion.vue'
import WarningZoneAndGlobalCPSVersionsIncompatible from '@/views/Entities/components/WarningZoneAndGlobalCPSVersionsIncompatible.vue'

import {
  INCOMPATIBLE_UNSUPPORTED_ENVOY,
  INCOMPATIBLE_UNSUPPORTED_KUMA_DP,
  INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS,
  INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
} from '@/dataplane'

export default {
  name: 'WarningsWidget',
  props: {
    warnings: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getWarningComponent(kind = '') {
      switch (kind) {
        case INCOMPATIBLE_UNSUPPORTED_ENVOY:
          return WarningEnvoyIncompatible
        case INCOMPATIBLE_UNSUPPORTED_KUMA_DP:
          return WarningUnsupportedKumaDPVersion
        case INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS:
          return WarningZoneAndKumaDPVersionsIncompatible
        case INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS:
          return WarningZoneAndGlobalCPSVersionsIncompatible
        default:
          return WarningDefault
      }
    },
  },
}
</script>
