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
import { computed } from 'vue'

const POLICIES: Record<string, { iconUrl: string | null }> = {
  CircuitBreaker: {
    iconUrl: CircuitBreakerIconUrl,
  },
  FaultInjection: {
    iconUrl: FaultInjectionIconUrl,
  },
  HealthCheck: {
    iconUrl: HealthCheckIconUrl,
  },
  MeshAccessLog: {
    // TODO: Update with new icon when/if available.
    iconUrl: TrafficLogIconUrl,
  },
  MeshGateway: {
    // TODO: Update with new icon when/if available.
    iconUrl: null,
  },
  MeshGatewayRoute: {
    // TODO: Update with new icon when/if available.
    iconUrl: null,
  },
  MeshTrace: {
    // TODO: Update with new icon when/if available.
    iconUrl: TrafficTraceIconUrl,
  },
  MeshTrafficPermission: {
    // TODO: Update with new icon when/if available.
    iconUrl: TrafficPermissionIconUrl,
  },
  ProxyTemplate: {
    iconUrl: ProxyTemplateIconUrl,
  },
  RateLimit: {
    iconUrl: RateLimitIconUrl,
  },
  Retry: {
    iconUrl: RetryIconUrl,
  },
  Timeout: {
    iconUrl: TimeoutIconUrl,
  },
  TrafficLog: {
    iconUrl: TrafficLogIconUrl,
  },
  TrafficPermission: {
    iconUrl: TrafficPermissionIconUrl,
  },
  TrafficRoute: {
    iconUrl: TrafficRouteIconUrl,
  },
  TrafficTrace: {
    iconUrl: TrafficTraceIconUrl,
  },
  VirtualOutbound: {
    iconUrl: VirtualOutboundIconUrl,
  },
}

const props = defineProps({
  policyType: {
    type: String,
    required: true,
  },
})

const policy = computed(() => POLICIES[props.policyType])
</script>

<style lang="scss" scoped>
.policy-type-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.policy-type-tag-icon {
  width: 24px;
  aspect-ratio: 1 / 1;
}
</style>
