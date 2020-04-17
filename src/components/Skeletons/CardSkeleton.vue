<template>
  <div class="skeleton-card-wrapper">
    <KCard
      :title="cardTitle"
      :class="{ 'is-centered': centerText }"
    >
      <template slot="body">
        <slot
          name="cardContent"
          class="skeleton-card__content"
        />
        <div
          v-if="cardActionButtonText && cardActionRoute"
          class="skeleton-card__action mt-4"
        >
          <slot name="cardAction">
            <KButton
              :to="cardActionRoute"
              appearance="primary"
            >
              {{ cardActionButtonText }}
            </KButton>
          </slot>
        </div>
      </template>
    </KCard>
  </div>
</template>

<script>
import KCard from '@kongponents/kcard'
import KButton from '@kongponents/kbutton'

export default {
  name: 'CardSkeleton',
  components: {
    KCard,
    KButton
  },
  props: {
    cardTitle: {
      type: String,
      required: true
    },
    cardActionRoute: {
      type: Object,
      required: true
    },
    cardActionButtonText: {
      type: String,
      required: true
    },
    centerText: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton-card-wrapper {

}

.skeleton-card__action,
.skeleton-card__content {
  text-align: center;
}

.skeleton-card__title {

}

.skeleton-card__content {

}

.skeleton-card__action {

}

.is-centered {

  &, * {
    text-align: center;
  }
}
</style>
