<template>
  <KCard border-variant="noBorder">
    <template #body>
      <ul>
        <li
          v-for="(warning, index) in props.warnings"
          :key="`${warning.kind}/${index}`"
          class="mb-1"
        >
          <KAlert appearance="warning">
            <template #alertMessage>
              <component
                :is="getWarningComponent(warning.kind)"
                :payload="warning.payload"
              />
            </template>
          </KAlert>
        </li>
      </ul>
    </template>
  </KCard>
</template>

<script lang="ts" setup>
import { KAlert, KCard } from '@kong/kongponents'
import { PropType } from 'vue'

import WarningDefault from './WarningDefault.vue'
import WarningEnvoyIncompatible from './WarningEnvoyIncompatible.vue'
import WarningUnsupportedKumaDPVersion from './WarningUnsupportedKumaDPVersion.vue'
import WarningZoneAndGlobalCPSVersionsIncompatible from './WarningZoneAndGlobalCPSVersionsIncompatible.vue'
import WarningZoneAndKumaDPVersionsIncompatible from './WarningZoneAndKumaDPVersionsIncompatible.vue'
import { Compatibility, ZoneCompatibility } from '@/types/index.d'
import {
  INCOMPATIBLE_UNSUPPORTED_ENVOY,
  INCOMPATIBLE_UNSUPPORTED_KUMA_DP,
  INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS,
  INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
} from '@/utilities/dataplane'

const props = defineProps({
  warnings: {
    type: Array as PropType<Array<Compatibility | ZoneCompatibility>>,
    required: true,
  },
})

function getWarningComponent(kind: string = ''): any {
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
}
</script>
