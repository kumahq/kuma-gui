<template>
  <div
    class="x-theme"
  >
    <slot name="default" />
  </div>
</template>
<style lang="scss">
  @keyframes icon-size-30 {
    100% {
      width: 16px;
      aspect-ratio: 1 / 1;
      vertical-align: middle;
      transform: translateY(-2px)
    }
  }
  @keyframes icon-size-40 {
    100% {
      width: 20px;
      aspect-ratio: 1 / 1;
      vertical-align: middle;
      transform: translateY(-2px)
    }
  }
  @keyframes icon-size-60 {
    100% {
      width: 24px;
      aspect-ratio: 1 / 1;
      vertical-align: middle;
      transform: translateY(-2px)
    }
  }
  @keyframes icon-wifi-tethering {
    100% {
      -webkit-mask-image: var(--icon-wifi-tethering-glyph);
      mask-image: var(--icon-wifi-tethering-glyph);
      background-color: var(--icon-color, var(--icon-color-wifi-tethering, currentColor));
    }
  }
  @keyframes icon-dataplane-standard {
    100% {
      -webkit-mask-image: var(--icon-dataplane-standard-glyph);
      mask-image: var(--icon-dataplane-standard-glyph);
      background-color: var(--icon-color, var(--icon-color-dataplane-standard, currentColor));
    }
  }
  @keyframes icon-dataplane-builtin {
    100% {
      -webkit-mask-image: var(--icon-dataplane-builtin-glyph);
      mask-image: var(--icon-dataplane-builtin-glyph);
      background-color: var(--icon-color, var(--icon-color-dataplane-builtin, currentColor));
    }
  }
  @keyframes icon-dataplane-delegated {
    100% {
      -webkit-mask-image: var(--icon-dataplane-delegated-glyph);
      mask-image: var(--icon-dataplane-delegated-glyph);
      background-color: var(--icon-color, var(--icon-color-dataplane-delegated, currentColor));
    }
  }
  @keyframes icon-subscription {
    100% {
      -webkit-mask-image: var(--icon-subscription-glyph);
      mask-image: var(--icon-subscription-glyph);
      background-color: var(--icon-color, var(--icon-color-subscription, currentColor));
    }
  }
  @keyframes icon-policy {
    100% {
      -webkit-mask-image: var(--icon-policy-glyph);
      mask-image: var(--icon-policy-glyph);
      background-color: var(--icon-color, var(--icon-color-policy, currentColor));
    }
  }
  @keyframes icon-home {
    100% {
      -webkit-mask-image: var(--icon-home-glyph);
      mask-image: var(--icon-home-glyph);
      background-color: var(--icon-color, var(--icon-color-home, currentColor));
    }
  }
  @keyframes icon-zone {
    100% {
      -webkit-mask-image: var(--icon-zone-glyph);
      mask-image: var(--icon-zone-glyph);
      background-color: var(--icon-color, var(--icon-color-zone, currentColor));
    }
  }
  @keyframes icon-zone-egress {
    100% {
      -webkit-mask-image: var(--icon-zone-egress-glyph);
      mask-image: var(--icon-zone-egress-glyph);
      background-color: var(--icon-color, var(--icon-color-zone-egress, currentColor));
    }
  }
  @keyframes icon-mesh {
    100% {
      -webkit-mask-image: var(--icon-mesh-glyph);
      mask-image: var(--icon-mesh-glyph);
      background-color: var(--icon-color, var(--icon-color-mesh, currentColor));
    }
  }
  @keyframes icon-configuration {
    100% {
      -webkit-mask-image: var(--icon-configuration-glyph);
      mask-image: var(--icon-configuration-glyph);
      background-color: var(--icon-color, var(--icon-color-configuration, currentColor));
    }
  }
  @keyframes icon-circuitbreaker {
    100% {
      background-image: var(--icon-circuitbreaker-glyph);
    }
  }
  @keyframes icon-faultinjection {
    100% {
      background-image: var(--icon-faultinjection-glyph);
    }
  }
  @keyframes icon-healthcheck {
    100% {
      background-image: var(--icon-healthcheck-glyph);
    }
  }
  @keyframes icon-proxytemplate {
    100% {
      background-image: var(--icon-proxytemplate-glyph);
    }
  }
  @keyframes icon-ratelimit {
    100% {
      background-image: var(--icon-ratelimit-glyph);
    }
  }
  @keyframes icon-retry {
    100% {
      background-image: var(--icon-retry-glyph);
    }
  }
  @keyframes icon-timeout {
    100% {
      background-image: var(--icon-timeout-glyph);
    }
  }
  @keyframes icon-trafficlog {
    100% {
      background-image: var(--icon-trafficlog-glyph);
    }
  }
  @keyframes icon-trafficpermission {
    100% {
      background-image: var(--icon-trafficpermission-glyph);
    }
  }
  @keyframes icon-trafficroute {
    100% {
      background-image: var(--icon-trafficroute-glyph);
    }
  }
  @keyframes icon-traffictrace {
    100% {
      background-image: var(--icon-traffictrace-glyph);
    }
  }
  @keyframes icon-virtualoutbound {
    100% {
      background-image: var(--icon-virtualoutbound-glyph);
    }
  }
  @keyframes icon-workload {
    100% {
      -webkit-mask-image: var(--icon-workload-glyph);
      mask-image: var(--icon-workload-glyph);
      background-color: var(--icon-color, var(--icon-color-workload, currentColor));
    }
  }
  @keyframes icon-mesh-identity {
    100% {
      -webkit-mask-image: var(--icon-policy-glyph);
      mask-image: var(--icon-policy-glyph);
      background-color: var(--icon-color, var(--icon-color-policy, currentColor));
    }
  }
  @keyframes icon-mesh-trust {
    100% {
      -webkit-mask-image: var(--icon-policy-glyph);
      mask-image: var(--icon-policy-glyph);
      background-color: var(--icon-color, var(--icon-color-policy, currentColor));
    }
  }
</style>
<style lang="scss" scoped>
:deep(> *) {
  & {
    --x-anchor-text-color: #{$kui-color-text-primary};
  }

  a {
    color: var(--x-anchor-text-color);
  }

  :where(p, td, dd, li) a:where(:hover, :focus) {
    text-decoration: underline;
  }

  /* icons */
  & {
    --icon-wifi-tethering-glyph: url('@/assets/images/icon-wifi-tethering.svg?inline');
    --icon-home-glyph: url('@/assets/images/navigation/icon-home.svg?inline');
    --icon-zone-glyph: url('@/assets/images/zone.svg?inline');
    --icon-mesh-glyph: url('@/assets/images/mesh.svg?inline');
    --icon-zone-egress-glyph: url('@/assets/images/navigation/icon-zone-egresses.svg?inline');
    --icon-configuration-glyph: url('@/assets/images/navigation/icon-configuration.svg?inline');
    --icon-dataplane-standard-glyph: url('@/assets/images/east-west.svg?inline');
    --icon-dataplane-builtin-glyph: url('@/assets/images/gateway.svg?inline');
    --icon-dataplane-delegated-glyph: url('@/assets/images/gateway.svg?inline');
    --icon-subscription-glyph: url('@/assets/images/subscriptions.svg?inline');
    --icon-policy-glyph: url('@/assets/images/policy.svg?inline');
    --icon-workload-glyph: url('@/assets/images/linked-services-icon.svg?inline');
    /* legacy */
    --icon-circuitbreaker-glyph: url('@/assets/images/policies/CircuitBreaker.png');
    --icon-faultinjection-glyph: url('@/assets/images/policies/FaultInjection.png');
    --icon-healthcheck-glyph: url('@/assets/images/policies/HealthCheck.png');
    --icon-proxytemplate-glyph: url('@/assets/images/policies/ProxyTemplate.png');
    --icon-ratelimit-glyph: url('@/assets/images/policies/RateLimit.png');
    --icon-retry-glyph: url('@/assets/images/policies/Retry.png');
    --icon-timeout-glyph: url('@/assets/images/policies/Timeout.jpg');
    --icon-trafficlog-glyph: url('@/assets/images/policies/TrafficLog.png');
    --icon-trafficpermission-glyph: url('@/assets/images/policies/TrafficPermission.png');
    --icon-trafficroute-glyph: url('@/assets/images/policies/TrafficRoute.png');
    --icon-traffictrace-glyph: url('@/assets/images/policies/TrafficTrace.png');
    --icon-virtualoutbound-glyph: url('@/assets/images/policies/VirtualOutbound.png');
    /* */

    /* application mappings i.e. kuma things to generic things */
    --icon-wifi-tethering: icon-wifi-tethering;
    --icon-home: icon-home;
    --icon-zone: icon-zone;
    --icon-mesh: icon-mesh;
    --icon-zone-egress: icon-zone-egress;
    --icon-configuration: icon-configuration;
    --icon-workload: icon-workload;
    --icon-mesh-identity: icon-mesh-identity;
    --icon-mesh-trust: icon-mesh-trust;
    /**
    * @deprecated
    */
    --icon-standard: icon-dataplane-standard;
    /**/
    --icon-dataplane-standard: icon-dataplane-standard;
    --icon-dataplane-builtin: icon-dataplane-standard;
    --icon-dataplane-delegated: icon-dataplane-standard;
    --icon-subscription: icon-subscription;
    --icon-policy: icon-policy;

    /* legacy */
    --icon-circuitbreakers: icon-circuitbreaker;
    --icon-faultinjections: icon-faultinjection;
    --icon-healthchecks: icon-healthcheck;
    --icon-proxytemplates: icon-proxytemplate;
    --icon-ratelimits: icon-ratelimit;
    --icon-retries: icon-retry;
    --icon-timeouts: icon-timeout;
    --icon-trafficlogs: icon-trafficlog;
    --icon-trafficpermissions: icon-trafficpermission;
    --icon-trafficroutes: icon-trafficroute;
    --icon-traffictraces: icon-traffictrace;

    --icon-CircuitBreaker: icon-circuitbreaker;
    --icon-FaultInjection: icon-faultinjection;
    --icon-HealthCheck: icon-healthcheck;
    --icon-ProxyTemplate: icon-proxytemplate;
    --icon-RateLimit: icon-ratelimit;
    --icon-Retry: icon-retry;
    --icon-Timeout: icon-timeout;
    --icon-TrafficLog: icon-trafficlog;
    --icon-TrafficPermission: icon-trafficpermission;
    --icon-TrafficRoute: icon-trafficroute;
    --icon-TrafficTrace: icon-traffictrace;
    /**/

    --icon-meshcircuitbreakers: icon-circuitbreaker;
    --icon-meshfaultinjections: icon-faultinjection;
    --icon-meshhealthchecks: icon-healthcheck;
    --icon-meshproxypatches: icon-proxytemplate;
    --icon-meshratelimits: icon-ratelimit;
    --icon-meshretries: icon-retry;
    --icon-meshtimeouts: icon-timeout;
    --icon-meshtraces: icon-traffictrace;
    --icon-meshtrafficpermissions: icon-trafficpermission;
    --icon-meshaccesslogs: icon-trafficlog;

    --icon-MeshCircuitBreaker: icon-circuitbreaker;
    --icon-MeshFaultInjection: icon-faultinjection;
    --icon-MeshHealthCheck: icon-healthcheck;
    --icon-MeshProxyPatch: icon-proxytemplate;
    --icon-MeshRateLimit: icon-ratelimit;
    --icon-MeshRetry: icon-retry;
    --icon-MeshTimeout: icon-timeout;
    --icon-MeshTrace: icon-traffictrace;
    --icon-MeshTrafficPermission: icon-trafficpermission;
    --icon-MeshAccessLog: icon-trafficlog;
  }
  & {
    --icon-space-before: #{$kui-space-30};
    --icon-space-after: #{$kui-space-30};
  }





  /* icon-helpers */
  *, *::before, *::after {
    animation-play-state: paused;
    animation-fill-mode: forwards;
  }
  *::before, *::after {
    display: inline-block;

    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-position: center;
    mask-size: 100%;
    -webkit-mask-size: 100%;

  }
  *::before {
    animation-name: var(--icon-name-start),
                    var(--icon-size-start, var(--icon-size, icon-size-30));
    background-color: var(--icon-color-start, var(--icon-color));
  }
  *::after {
    animation-name: var(--icon-name-end),
                    var(--icon-size-end, var(--icon-size, icon-size-30));
    background-color: var(--icon-color-end, var(--icon-color));
  }

  [style*='--icon-color-start']::before {
    color: var(--icon-color-start);
  }
  [style*='--icon-color-end']::after {
    color: var(--icon-color-end);
  }
  [style*='--icon-name-start']::before,
  [style*='--icon-name-end']::after {
    content: '';
  }
  [style*='--icon-name-start']::before {
    margin-right: var(--icon-space-after);
  }
  [style*='--icon-name-end']::after {
    margin-left: var(--icon-space-before);
  }
}

/* Kong Design Token Migrations */
:deep(> *) {
  /* Spacing */
  --x-space-10: #{$kui-space-10};
  --x-space-20: #{$kui-space-20};
  --x-space-30: #{$kui-space-30};
  --x-space-40: #{$kui-space-40};
  --x-space-50: #{$kui-space-50};
  --x-space-60: #{$kui-space-60};
  --x-space-70: #{$kui-space-70};
  --x-space-80: #{$kui-space-80};
  --x-space-90: #{$kui-space-90};
  --x-space-100: #{$kui-space-100};
  --x-space-110: #{$kui-space-110};

  /* Colors */
  --x-color-border: #{$kui-color-border};
  --x-color-text: #{$kui-color-text};
  --x-color-text-neutral: #{$kui-color-text-neutral};
  --x-color-background: #{$kui-color-background};
  --x-color-background-neutral: #{$kui-color-background-neutral};
  --x-color-background-neutral-weak: #{$kui-color-background-neutral-weak};
  --x-color-background-neutral-weaker: #{$kui-color-background-neutral-weaker};
  --x-color-background-neutral-weakest: #{$kui-color-background-neutral-weakest};
  --x-color-background-primary-weakest: #{$kui-color-background-primary-weakest};
  --x-color-background-danger-weakest: #{$kui-color-background-danger-weakest};
  --x-color-background-decorative-purple-weakest: #{$kui-color-background-decorative-purple-weakest};
  --x-color-text-primary: #{$kui-color-text-primary};
  --x-color-text-danger: #{$kui-color-text-danger};
  --x-color-text-disabled: #{$kui-color-text-disabled};
  --x-color-text-inverse: #{$kui-color-text-inverse};
  --x-color-text-success: #{$kui-color-text-success};
  --x-color-text-warning: #{$kui-color-text-warning};
  --x-color-text-decorative-purple: #{$kui-color-text-decorative-purple};
  --x-color-border-neutral-weak: #{$kui-color-border-neutral-weak};
  --x-color-border-primary: #{$kui-color-border-primary};
  --x-color-border-primary-weak: #{$kui-color-border-primary-weak};
  --x-color-border-danger-weak: #{$kui-color-border-danger-weak};

  /* Typography - Font Sizes */
  --x-font-size-20: #{$kui-font-size-20};
  --x-font-size-30: #{$kui-font-size-30};
  --x-font-size-40: #{$kui-font-size-40};
  --x-font-size-50: #{$kui-font-size-50};
  --x-font-size-60: #{$kui-font-size-60};
  --x-font-size-70: #{$kui-font-size-70};

  /* Typography - Font Weights */
  --x-font-weight-regular: #{$kui-font-weight-regular};
  --x-font-weight-medium: #{$kui-font-weight-medium};
  --x-font-weight-semibold: #{$kui-font-weight-semibold};
  --x-font-weight-bold: #{$kui-font-weight-bold};

  /* Typography - Font Families */
  --x-font-family-text: #{$kui-font-family-text};
  --x-font-family-code: #{$kui-font-family-code};

  /* Typography - Line Heights */
  --x-line-height-20: #{$kui-line-height-20};
  --x-line-height-30: #{$kui-line-height-30};
  --x-line-height-40: #{$kui-line-height-40};

  /* Borders - Width */
  --x-border-width-10: #{$kui-border-width-10};
  --x-border-width-20: #{$kui-border-width-20};

  /* Borders - Radius */
  --x-border-radius-10: #{$kui-border-radius-10};
  --x-border-radius-20: #{$kui-border-radius-20};
  --x-border-radius-30: #{$kui-border-radius-30};
  --x-border-radius-40: #{$kui-border-radius-40};
  --x-border-radius-round: #{$kui-border-radius-round};
  --x-border-radius-circle: #{$kui-border-radius-circle};

  /* Shadows */
  --x-shadow: #{$kui-shadow};
  --x-shadow-border: #{$kui-shadow-border};
  --x-shadow-focus: #{$kui-shadow-focus};

  /* Icons */
  --x-icon-size-30: #{$kui-icon-size-30};
  --x-icon-size-40: #{$kui-icon-size-40};
  --x-icon-size-50: #{$kui-icon-size-50};

  /* Animation */
  --x-animation-duration-20: #{$kui-animation-duration-20};
}
</style>
