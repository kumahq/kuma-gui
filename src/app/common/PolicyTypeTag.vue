<template>
  <span class="policy-type-tag">
    <img
      v-if="POLICY_ICON[props.policyType]"
      class="policy-type-tag-icon"
      :src="POLICY_ICON[props.policyType]"
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

const POLICY_ICON: Record<string, string> = {
  CircuitBreaker: CircuitBreakerIconUrl,
  FaultInjection: FaultInjectionIconUrl,
  HealthCheck: HealthCheckIconUrl,
  MeshAccessLog: TrafficLogIconUrl, // TODO: Update with new icon when/if available.
  MeshCircuitBreaker: CircuitBreakerIconUrl,
  MeshFaultInjection: FaultInjectionIconUrl,
  MeshHealthCheck: HealthCheckIconUrl, // TODO: Update with new icon when/if available.
  MeshProxyPatch: ProxyTemplateIconUrl, // TODO: Update with new icon when/if available.
  MeshRateLimit: RateLimitIconUrl,
  MeshRetry: RetryIconUrl,
  MeshTimeout: TimeoutIconUrl,
  MeshTrace: TrafficTraceIconUrl,
  MeshTrafficPermission: TrafficPermissionIconUrl,
  ProxyTemplate: ProxyTemplateIconUrl,
  RateLimit: RateLimitIconUrl,
  Retry: RetryIconUrl,
  Timeout: TimeoutIconUrl,
  TrafficLog: TrafficLogIconUrl,
  TrafficPermission: TrafficPermissionIconUrl,
  TrafficRoute: TrafficRouteIconUrl,
  TrafficTrace: TrafficTraceIconUrl,
  VirtualOutbound: VirtualOutboundIconUrl,
}

const props = defineProps({
  policyType: {
    type: String,
    required: true,
  },
})
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
