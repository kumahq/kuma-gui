<template>
  <a
    v-if="href"
    :href="href"
    class="external-link"
    target="_blank">
    <slot/>
    <KIcon
      icon="externalLink"
      width="12"
      height="12"
      view-box="0 0 12 12" />
  </a>
</template>

<script>
import { isValidUrl } from '../utils/helpers'
export default {
  name: 'ExternalLink',

  props: {
    href: {
      type: String,
      required: true,
      validator: function (value) {
        return isValidUrl(value)
      }
    }
  }
}
</script>

<style lang="scss">
.external-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  svg {
    margin-left: .5rem;
    path {
      fill: currentColor;
      fill-opacity: .5;
    }
  }
  &:hover {
    svg > path {
      fill-opacity: 1;
    }
  }
}
</style>
