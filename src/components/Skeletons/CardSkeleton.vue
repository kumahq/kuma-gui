<template>
  <div class="skeleton-card-wrapper">
    <KCard>
      <template
        v-if="$props.cardTitle"
        slot="title"
      >
        <slot name="cardTitle" />
      </template>
      <template slot="body">
        <slot
          name="cardContent"
          class="skeleton-card__content"
        />
        <div
          v-if="$props.cardActionContent && $props.cardActionRoute"
          class="skeleton-card__action"
        >
          <slot name="cardAction">
            <!-- $props.cardActionRoute should be a route array -->
            <KButton
              :to="$props.cardActionRoute"
              appearance="primary"
            >
              {{ $props.cardActionContent }}
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
    cardActionContent: {
      type: String,
      required: true
    },
    cardActionRoute: {
      type: Array,
      required: true
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

.skeleton-card__content {

}

.skeleton-card__action {

}
</style>
