<template>
  <KCard
    class="kong-ui-app-about-section"
    title-tag="h2"
  >
    <template
      v-if="$slots.title || title"
      #title
    >
      <span
        class="about-section-title"
        data-testid="about-section-title"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </span>
    </template>

    <template
      v-if="$slots.actions || created || modified"
      #actions
    >
      <div class="about-section-header-end">
        <div
          v-if="created || modified"
          class="about-section-timestamps"
          :class="{ 'has-actions': $slots.actions }"
        >
          <span
            v-if="created"
            class="about-section-timestamps-created"
            data-testid="about-section-timestamps-created"
          >{{ createdLabel }}: {{ created }}</span>
          <span
            v-if="created && displayModified"
            class="about-section-timestamps-arrow"
          >-></span>
          <span
            v-if="displayModified"
            class="about-section-timestamps-modified"
            data-testid="about-section-timestamps-modified"
          >{{ modifiedLabel }}: {{ modified }}</span>
        </div>

        <div
          v-if="$slots.actions"
          class="about-section-actions"
          data-testid="about-section-actions"
        >
          <slot name="actions" />
        </div>
      </div>
    </template>

    <div
      v-if="isLoading"
      data-testid="about-section-loading-skeleton"
    >
      <KSkeletonBox
        height="2"
        width="100"
      />
      <KSkeletonBox
        height="2"
        width="100"
      />
    </div>

    <div v-else>
      <p
        v-if="description"
        class="about-section-description"
        data-testid="about-section-description"
      >
        {{ description }}
      </p>

      <div
        v-if="$slots.default"
        class="about-section-content"
        data-testid="about-section-content"
      >
        <slot name="default" />
      </div>

      <hr
        v-if="$slots['divider-section']"
        data-testid="about-divider-section-separator"
      >

      <div
        v-if="$slots['divider-section']"
        class="about-divider-section"
        data-testid="about-divider-section"
      >
        <slot name="divider-section" />
      </div>
    </div>
  </KCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  created?: string
  createdLabel?: string
  modified?: string
  modifiedLabel?: string
  isLoading?: boolean
}>(), {
  title: '',
  description: '',
  created: '',
  createdLabel: 'Created',
  modified: '',
  modifiedLabel: 'Modified',
  isLoading: false,
})

const displayModified = computed(() => {
  return !!props.modified && props.modified !== props.created
})
</script>

<style lang="scss" scoped>
.kong-ui-app-about-section {
  .about-section-title {
    color: var(--kui-color-text, $kui-color-text);
    font-size: var(--kui-font-size-40, $kui-font-size-40);
    font-weight: var(--kui-font-weight-bold, $kui-font-weight-bold);
    line-height: var(--kui-line-height-30, $kui-line-height-30);
  }

  .about-section-header-end {
    display: flex;

    .about-section-timestamps {
      align-self: center;
      color: var(--kui-color-text-neutral, $kui-color-text-neutral);
      flex-direction: column;
      font-size: var(--kui-font-size-20, $kui-font-size-20);
      line-height: var(--kui-line-height-20, $kui-line-height-20);
      margin-bottom: var(--kui-space-50, $kui-space-50);

      @media (min-width: $kui-breakpoint-phablet) {
        flex-direction: row;
        margin-bottom: var(--kui-space-0, $kui-space-0);
      }

      &.has-actions {
        margin-right: var(--kui-space-60, $kui-space-60);
      }

      .about-section-timestamps-arrow {
        line-height: var(--kui-line-height-30, $kui-line-height-30);
        margin-left: var(--kui-space-40, $kui-space-40);
        margin-right: var(--kui-space-40, $kui-space-40);
      }
    }
  }

  .about-section-description {
    color: var(--kui-color-text, $kui-color-text);
    font-size: var(--kui-font-size-30, $kui-font-size-30);
    line-height: var(--kui-line-height-30, $kui-line-height-30);
    margin-bottom: var(--kui-space-70, $kui-space-70);
    margin-top: var(--kui-space-0, $kui-space-0);
  }

  .about-section-content {
    align-items: flex-start;
    align-self: stretch;
    color: var(--kui-color-text-neutral, $kui-color-text-neutral);
    column-gap: var(--kui-space-70, $kui-space-70);
    display: flex;
    flex-wrap: wrap;
    font-size: var(--kui-font-size-30, $kui-font-size-30);
    line-height: var(--kui-line-height-30, $kui-line-height-30);
    padding: var(--kui-space-0, $kui-space-0);
    row-gap: var(--kui-space-30, $kui-space-30);
  }

  .about-divider-section {
    color: var(--kui-color-text-neutral, $kui-color-text-neutral);
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    font-size: var(--kui-font-size-30, $kui-font-size-30);
    line-height: var(--kui-line-height-30, $kui-line-height-30);
    row-gap: var(--kui-space-50, $kui-space-50);
  }

  :deep(hr),
  hr {
    background-color: var(--kui-color-background-disabled, $kui-color-background-disabled);
    border: none;
    height: 1px;
    margin: var(--kui-space-0, $kui-space-0);
    width: 100%;
  }

  hr {
    margin-bottom: var(--kui-space-50, $kui-space-50);
    margin-top: var(--kui-space-50, $kui-space-50);
  }
}
</style>

<style lang="scss">
// TODO: clean up these styles after KCard redesign - KHCP-8971
.kong-ui-app-about-section.kong-card.border {
  border-radius: var(--kui-border-radius-20, $kui-border-radius-20);
  padding: var(--kui-space-70, $kui-space-70);

  .k-card-header {
    align-items: baseline;
    margin-bottom: var(--kui-space-0, $kui-space-0) !important;

    @media (max-width: $kui-breakpoint-phablet) {
      flex-direction: column;

      .k-card-actions {
        margin-left: unset;
      }
    }
  }
}
</style>
