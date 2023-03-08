<template>
  <span class="policy-type-tag">
    <img
      v-if="policy.iconUrl !== null"
      class="policy-type-tag-icon"
      :src="policy.iconUrl"
      alt=""
    >

    <KIcon
      v-else
      icon="brain"
      size="24"
    />

    <slot>
      {{ props.policyType }}
    </slot>
  </span>
</template>

<script lang="ts" setup>
import { KIcon } from '@kong/kongponents'
import { computed } from 'vue'

import CircuitBreakerIconUrl from '@/assets/images/policies/CircuitBreaker.png'
import FaultInjectionIconUrl from '@/assets/images/policies/FaultInjection.png'
import HealthCheckIconUrl from '@/assets/images/policies/HealthCheck.png'
import ProxyTemplateIconUrl from '@/assets/images/policies/ProxyTemplate.png'
import RateLimitIconUrl from '@/assets/images/policies/RateLimit.png'
import RetryIconUrl from '@/assets/images/policies/Retry.png'
import TimeoutIconUrl from '@/assets/images/policies/Timeout.jpg'
import TrafficLogIconUrl from '@/assets/images/policies/TrafficLog.png'
import TrafficPermissionIconUrl from '@/assets/images/policies/TrafficPermission.png'
import TrafficRouteIconUrl from '@/assets/images/policies/TrafficRoute.png'
import TrafficTraceIconUrl from '@/assets/images/policies/TrafficTrace.png'
import VirtualOutboundIconUrl from '@/assets/images/policies/VirtualOutbound.png'
import { useStore } from '@/store/store'

const store = useStore()

type PolicyTagDefinition = { iconUrl: string | null }

const POLICIES: Record<string, PolicyTagDefinition> = {
  CircuitBreaker: { iconUrl: CircuitBreakerIconUrl },
  FaultInjection: { iconUrl: FaultInjectionIconUrl },
  HealthCheck: { iconUrl: HealthCheckIconUrl },
  MeshAccessLog: { iconUrl: TrafficLogIconUrl }, // TODO: Update with new icon when/if available.
  MeshCircuitBreaker: { iconUrl: CircuitBreakerIconUrl }, // TODO: Update with new icon when/if available.
  MeshGateway: { iconUrl: null }, // TODO: Update with new icon when/if available.
  MeshGatewayRoute: { iconUrl: null }, // TODO: Update with new icon when/if available.
  MeshHealthCheck: { iconUrl: HealthCheckIconUrl }, // TODO: Update with new icon when/if available.
  MeshProxyPatch: { iconUrl: ProxyTemplateIconUrl }, // TODO: Update with new icon when/if available.
  MeshRateLimit: { iconUrl: RateLimitIconUrl }, // TODO: Update with new icon when/if available.
  MeshRetry: { iconUrl: RetryIconUrl }, // TODO: Update with new icon when/if available.
  MeshTimeout: { iconUrl: TimeoutIconUrl }, // TODO: Update with new icon when/if available.
  MeshTrace: { iconUrl: TrafficTraceIconUrl }, // TODO: Update with new icon when/if available.
  MeshTrafficPermission: { iconUrl: TrafficPermissionIconUrl }, // TODO: Update with new icon when/if available.
  ProxyTemplate: { iconUrl: ProxyTemplateIconUrl },
  RateLimit: { iconUrl: RateLimitIconUrl },
  Retry: { iconUrl: RetryIconUrl },
  Timeout: { iconUrl: TimeoutIconUrl },
  TrafficLog: { iconUrl: TrafficLogIconUrl },
  TrafficPermission: { iconUrl: TrafficPermissionIconUrl },
  TrafficRoute: { iconUrl: TrafficRouteIconUrl },
  TrafficTrace: { iconUrl: TrafficTraceIconUrl },
  VirtualOutbound: { iconUrl: VirtualOutboundIconUrl },
}

const props = defineProps({
  policyType: {
    type: String,
    required: true,
  },
})

const policyTagDefinitions = computed<Record<string, PolicyTagDefinition>>(() => {
  const policyTagDefinitionEntries: [string, PolicyTagDefinition][] = store.state.policyTypes.map((policyType) => {
    const policyTagDefinition = POLICIES[policyType.name] ?? { iconUrl: null }

    return [policyType.name, policyTagDefinition]
  })

  return Object.fromEntries(policyTagDefinitionEntries)
})

const policy = computed(() => policyTagDefinitions.value[props.policyType])
</script>

<style lang="scss" scoped>
.policy-type-tag {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.policy-type-tag-icon {
  width: 24px;
  aspect-ratio: 1 / 1;
}
</style>
