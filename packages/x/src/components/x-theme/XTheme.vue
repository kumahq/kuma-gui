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
      height: 16px;
    }
  }
  @keyframes icon-size-40 {
    100% {
      width: 20px;
      height: 20px;
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
</style>
<style lang="scss" scoped>
:deep(> *) {
  & {
    --icon-wifi-tethering-glyph: url('@/assets/images/icon-wifi-tethering.svg?inline');
    --icon-home-glyph: url('@/assets/images/navigation/icon-home.svg?inline');
    --icon-zone-glyph: url('@/assets/images/zone.svg?inline');
    --icon-mesh-glyph: url('@/assets/images/mesh.svg?inline');
    --icon-zone-egress-glyph: url('@/assets/images/navigation/icon-zone-egresses.svg?inline');
    --icon-configuration-glyph: url('@/assets/images/navigation/icon-configuration.svg?inline');
    --icon-dataplane-standard-glyph: url('@/assets/images/gateway.svg?inline');
    --icon-dataplane-builtin-glyph: url('@/assets/images/gateway.svg?inline');
    --icon-dataplane-delegated-glyph: url('@/assets/images/gateway.svg?inline');
    --icon-subscription-glyph: url('@/assets/images/subscriptions.svg?inline');
    --icon-policy-glyph: url('@/assets/images/policy.svg?inline');

    --icon-wifi-tethering: icon-wifi-tethering;
    --icon-home: icon-home;
    --icon-zone: icon-zone;
    --icon-mesh: icon-mesh;
    --icon-zone-egress: icon-zone-egress;
    --icon-configuration: icon-configuration;
    --icon-dataplane-standard: icon-dataplane-standard;
    --icon-dataplane-builtin: icon-dataplane-standard;
    --icon-dataplane-delegated: icon-dataplane-standard;
    --icon-subscription: icon-subscription;
    --icon-policy: icon-policy;
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
</style>
