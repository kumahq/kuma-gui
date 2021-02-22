<template>
  <KCard border-variant="noBorder">
    <template slot="body">
      <ul>
        <li
          v-for="{ kind, payload, index } in warnings"
          :key="`${kind}/${index}`"
          class="mb-1"
        >
          <KAlert appearance="warning">
            <template slot="alertMessage">
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
import {
  INCOMPATIBLE_UNSUPPORTED_ENVOY,
  INCOMPATIBLE_UNSUPPORTED_KUMA_DP,
  INCOMPATIBLE_WRONG_FORMAT,
} from '@/helpers'
import WarningDefault from '@/views/Entities/components/WarningDefault'
import WarningEnvoyIncompatible from '@/views/Entities/components/WarningEnvoyIncompatible'
import WarningZoneAndKumaDPVersionsIncompatible
  from '@/views/Entities/components/WarningZoneAndKumaDPVersionsIncompatible'
import WarningUnsupportedKumaDPVersion from '@/views/Entities/components/WarningUnsupportedKumaDPVersion'
import WarningWrongFormat from '@/views/Entities/components/WarningWrongFormat'

export default {
  name: 'Warnings',
  props: {
    warnings: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getWarningComponent (kind = '') {
      switch (kind) {
        case INCOMPATIBLE_UNSUPPORTED_ENVOY:
          return WarningEnvoyIncompatible
        case INCOMPATIBLE_UNSUPPORTED_KUMA_DP:
          return WarningUnsupportedKumaDPVersion
        case INCOMPATIBLE_WRONG_FORMAT:
          return WarningWrongFormat
        case 'ZONE_CP_AND_KUMA_DP_VERSIONS_INCOMPATIBLE':
          return WarningZoneAndKumaDPVersionsIncompatible
        default:
          return WarningDefault
      }
    }
  },
}
</script>
