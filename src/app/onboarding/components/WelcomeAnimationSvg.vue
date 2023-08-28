<template>
  <svg
    class="background svg"
    :class="{ active: mounted }"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1920 1080"
  >
    <defs />
    <defs>
      <linearGradient
        id="a"
        x1="64.8%"
        x2="34.4%"
        y1="-12.6%"
        y2="153.1%"
      >
        <stop
          offset="0%"
          stop-color="var(--onboarding-accent-dark)"
        />
        <stop
          offset="100%"
          stop-color="var(--onboarding-accent)"
        />
      </linearGradient>
      <linearGradient
        id="b"
        x1="0%"
        x2="107.4%"
        y1="41.5%"
        y2="41.5%"
      >
        <stop
          offset="0%"
          stop-color="var(--onboarding-accent-dark)"
        />
        <stop
          offset="100%"
          stop-color="var(--onboarding-accent)"
        />
      </linearGradient>
    </defs>
    <g
      fill="none"
      fill-rule="evenodd"
      mask="url(#ccard)"
      transform="translate(-63 -285)"
    >
      <g
        stroke="var(--onboarding-accent)"
        stroke-width="6"
      >
        <path
          d="M1444 893h252"
        />
        <path
          stroke-opacity=".4"
          d="M1529 705h232M1452 603h237"
        />
        <path
          d="M1754 563l-332 332h-76M1444 935l121 121M263 859l156 156"
        />
        <path
          stroke-opacity=".4"
          d="M742 781H556"
        />
        <path
          d="M697 736H513"
        />
        <path
          stroke-opacity=".4"
          d="M695 783V577"
        />
        <path
          d="M261 1026V751M509 573V438M1502 415l291 290"
        />
        <path
          stroke-opacity=".4"
          d="M698 912L26 240M1368 411v540l61 61 95-95M1434 3h267l193 192v354"
        />
        <path
          d="M517 411h342l138 138M1416 573v242l371 323"
        />
        <path
          d="M1486 817V612l-146-146M839 243h-97l-83 84v348M1698 1063V817l58-57h122M1069 299L558 810M696 1058H585L468 941V570L322 424"
        />
        <path
          d="M277 528l160 160 236-236 121 121M632 979h-45l-67-67v-86H0M106 669h275M70 707h331M207 745h210M85 784h356M1417 558h228M1609 634h203M528 946h76M619 604v131M1359 567l125 125M1332 594l156 156M1594 1070V959M381 632L260 753"
        />
        <path
          stroke-opacity=".4"
          d="M605 817V497M1851 959h-518M944 570H390"
        />
        <path
          d="M638 912H342M635 1139V912"
        />
      </g>
      <foreignObject
        x="0"
        y="0"
        width="100%"
        height="100%"
      >
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </foreignObject>
    </g>
  </svg>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const mounted = ref(false)

onMounted(function () {
  window.setTimeout(() => {
    mounted.value = true
  }, 30)
})
</script>

<style lang="scss" scoped>
@use 'sass:math';
@use 'sass:list';

.svg {
  --path1: path('M1444 893h252');
  --path2: path('M1529 705h232M1452 603h237');
  --path3: path('M1754 563l-332 332h-76M1444 935l121 121M263 859l156 156');
  --path4: path('M742 781H556');
  --path5: path('M697 736H513');
  --path6: path('M695 783V577');
  --path7: path('M261 1026V751M509 573V438M1502 415l291 290');
  --path8: path('M698 912L26 240M1368 411v540l61 61 95-95M1434 3h267l193 192v354');
  --path9: path('M517 411h342l138 138M1416 573v242l371 323');
  --path10: path(
    'M1486 817V612l-146-146M839 243h-97l-83 84v348M1698 1063V817l58-57h122M1069 299L558 810M696 1058H585L468 941V570L322 424'
  );
  --path11: path(
    'M277 528l160 160 236-236 121 121M632 979h-45l-67-67v-86H0M106 669h275M70 707h331M207 745h210M85 784h356M1417 558h228M1609 634h203M528 946h76M619 604v131M1359 567l125 125M1332 594l156 156M1594 1070V959M381 632L260 753'
  );
  --path12: path('M605 817V497M1851 959h-518M944 570H390');
  --path13: path('M638 912H342M635 1139V912');

  $pathLength1: 252;
  $pathLength2: 469;
  $pathLength3: 937.256;
  $pathLength4: 186;
  $pathLength5: 184;
  $baseSpeed: 0.5;

  $lengths: $pathLength1, $pathLength2, $pathLength3, pathLength4, pathLength5;

  position: absolute;
  min-width: 1700px;

  @media screen and (max-width: 1699px) {
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  foreignObject {
    position: relative;

    div {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 15px;
      height: 15px;
      background: #fff;
      box-shadow: inset 0 0 0 2px var(--onboarding-accent);
      border-radius: 100%;
      transform: scale(0);
      z-index: 2;
      --end: 100%;
      --start: 0%;
      --duration: #{5 * $baseSpeed}s;
      offset-distance: var(--start);
      filter: hue-rotate(180deg) brightness(6) blur(40px);
      will-change: offset-distance, filter;

      &:before,
      &:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 100%;
        left: 0;
        top: 0;
      }
      &:after {
        z-index: 1;
        background: #fff;
        box-shadow: inset 0 0 0 2px var(--onboarding-accent);
      }
      &:before {
        background: var(--onboarding-accent);
        z-index: -1;
        @keyframes pulsing {
          50% {
            transform: scale(3);
            opacity: 0;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
      }
      &:nth-of-type(2),
      &:nth-of-type(15) {
        --duration: calc(3 * #{$baseSpeed})s;
      }
      &:nth-of-type(3),
      &:nth-of-type(16) {
        --duration: calc(4 * #{$baseSpeed});
        --start: 100%;
        --end: 0%;
      }
      &:nth-of-type(6),
      &:nth-of-type(19),
      &:nth-of-type(7),
      &:nth-of-type(20),
      &:nth-of-type(4),
      &:nth-of-type(17) {
        --duration: calc(2 * #{$baseSpeed})s;
      }
      &:nth-of-type(9),
      &:nth-of-type(22),
      &:nth-of-type(10),
      &:nth-of-type(23),
      &:nth-of-type(8),
      &:nth-of-type(21),
      &:nth-of-type(12),
      &:nth-of-type(25),
      &:nth-of-type(11),
      &:nth-of-type(24) {
        --duration: calc(5 * #{$baseSpeed})s;
      }
      &:nth-of-type(12),
      &:nth-of-type(25),
      &:nth-of-type(11),
      &:nth-of-type(24) {
        --end: 50%;
      }
      &:nth-of-type(25),
      &:nth-of-type(24) {
        --start: 50%;
        --end: 100%;
      }
      @for $i from 1 through 13 {
        &:nth-of-type(#{$i}) {
          offset-path: var(--path#{$i});
        }
      }
      @for $i from 14 through 26 {
        &:nth-of-type(#{$i}) {
          offset-path: var(--path#{ calc( #{$i} - 13 ) });
        }
      }
    }
  }
  path {
    stroke-dasharray: 1000px 1000px;
    stroke-dashoffset: -1000px;
    filter: hue-rotate(180deg) brightness(6) blur(40px);
    opacity: 0.3;
    will-change: stroke-dashoffset, filter;

    @for $i from 1 through 5 {
      $length: list.nth($lengths, $i);
      filter: hue-rotate(40deg) brightness(2) blur(4px);

      &:nth-of-type(#{$i}) {
        stroke-dasharray: #{$length}px #{$length}px;
        stroke-dashoffset: -#{$length}px;
      }
    }
  }

  @supports (not (offset-distance: 100%)) {
    foreignObject div {
      display: none;
    }
  }

  &.active {
    g {
      foreignObject {
        div {
          transition: offset-distance var(--duration) ease-in-out,
            transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease-in-out, filter 1.5s ease-in-out;
          &:before {
            animation: pulsing calc(1 * #{$baseSpeed})s ease-in-out 16;
          }
          @for $i from 1 through 26 {
            &:nth-of-type(#{$i}) {
              &:before {
                animation-delay: #{math.div($i, -16) * $baseSpeed}s;
              }
              transition-delay: #{(math.div($i, 18) + 2) * $baseSpeed}s, #{(math.div($i, 18) + 2) * $baseSpeed}s, calc(#{(math.div($i, 18) + 1.85) * $baseSpeed}s + var(--duration)),
                #{(math.div($i, 18) + 2) * $baseSpeed}s;
              filter: hue-rotate(0deg) brightness(1) blur(0px);
              offset-distance: var(--end);
              opacity: 0;
              transform: scale(1);
            }
          }
        }
      }
    }
    path {
      stroke-dashoffset: 0;
      opacity: 0.3;
      filter: hue-rotate(0deg) brightness(1) blur(0px);
    }
    @supports (not (offset-distance: 100%)) {
      foreignObject div {
        display: none;
      }
    }
  }
}
.background {
  position: fixed;
  z-index: -1;
  inset: 0;
}
</style>
