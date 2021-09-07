<template>
  <KCard :title="cardTitle">
    <template v-slot:body>
      <slot
        name="cardContent"
        class="skeleton-card__content"
      />
      <div
        v-if="cardActionButtonText && cardActionRoute"
        class="skeleton-card__action mt-4"
      >
        <slot name="cardAction">
          <a
            v-if="externalLink"
            :href="cardActionRoute"
            target="_blank"
            class="external-link-btn"
          >
            {{ cardActionButtonText }}
          </a>
          <KButton
            v-else
            :to="cardActionRoute"
            appearance="primary"
          >
            {{ cardActionButtonText }}
          </KButton>
        </slot>
      </div>
    </template>
  </KCard>
</template>

<script>
import KCard from '@kongponents/kcard'
import KButton from '@kongponents/kbutton'

export default {
  name: 'CardSkeleton',
  components: {
    KCard,
    KButton,
  },
  props: {
    cardTitle: {
      type: String,
      required: true,
    },
    cardActionRoute: {
      // this can be a router-link object or a URL string
      type: [Object, String],
      required: true,
    },
    cardActionButtonText: {
      type: String,
      required: true,
    },
    externalLink: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.skeleton-card__action,
.skeleton-card__content {
  text-align: center;
}
</style>
