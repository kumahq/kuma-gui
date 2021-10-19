<template>
  <div class="onboarding-container">
    <div class="onboarding-container__header">
      <slot name="header" />
    </div>
    <div :class="classes">
      <div class="w-full">
        <slot name="content" />
      </div>
    </div>
    <slot name="navigation" />

    <div :class="svgClasses">
      <svg
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
              stop-color="#260D50"
            />
            <stop
              offset="100%"
              stop-color="#822DC5"
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
              stop-color="#260D50"
            />
            <stop
              offset="100%"
              stop-color="#822DC5"
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
            stroke="#822DC5"
            stroke-width="6"
          >
            <path
              class="nodepath"
              d="M1444 893h252"
            />
            <path
              class="nodepath"
              stroke-opacity=".4"
              d="M1529 705h232M1452 603h237"
            />
            <path
              class="nodepath"
              d="M1754 563l-332 332h-76M1444 935l121 121M263 859l156 156"
            />
            <path
              class="nodepath"
              stroke-opacity=".4"
              d="M742 781H556"
            />
            <path
              class="nodepath"
              d="M697 736H513"
            />
            <path
              class="nodepath"
              stroke-opacity=".4"
              d="M695 783V577"
            />
            <path
              class="nodepath"
              d="M261 1026V751M509 573V438M1502 415l291 290"
            />
            <path
              class="nodepath"
              stroke-opacity=".4"
              d="M698 912L26 240M1368 411v540l61 61 95-95M1434 3h267l193 192v354"
            />
            <path
              class="nodepath"
              d="M517 411h342l138 138M1416 573v242l371 323"
            />
            <path
              class="nodepath"
              d="M1486 817V612l-146-146M839 243h-97l-83 84v348M1698 1063V817l58-57h122M1069 299L558 810M696 1058H585L468 941V570L322 424"
            />
            <path
              class="nodepath"
              d="M277 528l160 160 236-236 121 121M632 979h-45l-67-67v-86H0M106 669h275M70 707h331M207 745h210M85 784h356M1417 558h228M1609 634h203M528 946h76M619 604v131M1359 567l125 125M1332 594l156 156M1594 1070V959M381 632L260 753"
            />
            <path
              class="nodepath"
              stroke-opacity=".4"
              d="M605 817V497M1851 959h-518M944 570H390"
            />
            <path
              class="nodepath"
              d="M638 912H342M635 1139V912"
            />
            <path
              stroke="url(#a)"
              d="M1024 573h297v522h-31"
              class="final"
              transform="translate(0 3)"
            />
            <path
              fill="url(#b)"
              fill-rule="nonzero"
              d="M1024 592a18 18 0 100-36 18 18 0 000 36z"
              class="final circle"
              transform="translate(0 3)"
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'OnboardingContainer',
  props: {
    withImage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mounted: false,
    }
  },
  computed: {
    classes() {
      return ['onboarding-container__content', this.withImage ? 'onboarding-container__content--with-image' : '']
    },
    svgClasses() {
      return [
        'screen',
        {
          active: this.mounted,
        },
      ]
    },
  },
  mounted() {
    setTimeout(() => {
      this.mounted = true
    }, 100)
  },
}
</script>

<style lang="scss" scoped>
.onboarding-container {
  @apply w-full mx-auto my-0 px-4;

  &__header {
    @apply my-10;
  }

  &__content {
    // @apply h-px p-10 w-full bg-white text-lg; (option with strict height TODO check which option)
    @apply relative flex items-center justify-center p-10 w-full bg-transparent text-lg;
    min-height: 500px;
    // box-shadow: 4px 4px 14px 4px rgba(103, 71, 128, 0.11);

    --KTableHeaderSize: 18px;

    &--with-image {
      background: #f6f8fd;
    }
  }

  @media screen and (min-width: 768px) {
    max-width: 1075px;
  }
}

.k-radio {
  --KRadioPrimary: #5da46f;
  color: #5da46f;
}

.screen {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  z-index: -1;
  display: flex;
  justify-content: center;
  align-items: stretch;

  svg {
    width: 1800px;
    height: auto;
    flex-shrink: 0;

    foreignObject {
      position: relative;
      div {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 15px;
        height: 15px;
        background: #fff;
        box-shadow: inset 0 0 0 2px #822dc5;
        border-radius: 100%;
        offset-distance: 0%;
        transform: scale(0);
        z-index: 2;
        --end: 100%;
        --start: 0%;
        --duration: 5s;
        offset-distance: var(--start);
        filter: hue-rotate(180deg) brightness(6) blur(40px);
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
          box-shadow: inset 0 0 0 2px #822dc5;
        }
        &:before {
          background: #822dc5;
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
          --duration: 3s;
        }
        &:nth-of-type(3),
        &:nth-of-type(16) {
          --duration: 4s;
          --start: 100%;
          --end: 0%;
        }
        &:nth-of-type(6),
        &:nth-of-type(19),
        &:nth-of-type(7),
        &:nth-of-type(20),
        &:nth-of-type(4),
        &:nth-of-type(17) {
          --duration: 2s;
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
          --duration: 5s;
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
            offset-path: var(--path#{calc(($i - 13))});
          }
        }
      }
    }
    path {
      stroke-dasharray: 1000px 1000px;
      stroke-dashoffset: -1000px;
      filter: hue-rotate(180deg) brightness(6) blur(40px);
      opacity: 0.3;
      &.final {
        stroke-dashoffset: 1000px;
      }
      &.circle {
        opacity: 1;
        stroke-dasharray: 0 0;
        stroke-dashoffset: 0;
        transform: scale(0);
        transition: 0.2s ease-in-out;
        transform-origin: 1022px 570px;
      }
    }
  }

  &.active {
    svg {
      g {
        foreignObject {
          div {
            transition: offset-distance var(--duration) ease-in-out,
              transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease-in-out, filter 1.5s ease-in-out;
            &:before {
              animation: pulsing 1s ease-in-out 16;
            }
            @for $i from 1 through 26 {
              &:nth-of-type(#{$i}) {
                &:before {
                  animation-delay: #{$i/-16}s;
                }
                transition-delay: #{($i/18) + 2}s, #{($i/18) + 2}s, calc(#{($i/18) + 1.85}s + var(--duration)),
                  #{($i/18) + 2}s;
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
        @for $i from 1 through 20 {
          &:nth-of-type(#{$i}) {
            transition: #{2 - $i/30}s ease-in-out, stroke-dashoffset #{2 - $i/30}s ease-in-out;
            transition-delay: #{$i/3}s, #{($i/3) + 0.125}s;
            &.final {
              opacity: 1;
              transition: 0.75s ease-in-out, stroke-dashoffset 1.5s ease-in-out;
              transition-delay: 7s, 7.15s;
              &.circle {
                transition: 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
                transition-delay: 7s;
              }
            }
          }
        }

        &.circle {
          transform: scale(1);
          opacity: 1;
        }
      }
    }
  }
}
</style>

