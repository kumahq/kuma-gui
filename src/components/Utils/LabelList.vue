<template>
  <div class="label-list">
    <div
      v-if="isReady"
      class="label-list-content"
    >
      <KCard
        v-if="!isLoading && !isEmpty"
        :title="title"
        border-variant="noBorder"
      >
        <template slot="body">
          <ul
            class="label-list__items"
            :class="colClass"
          >
            <li
              v-for="(value, key) in items"
              :key="key"
            >
              <h4 class="label-list__items__title">
                {{ key }}
              </h4>
              <!-- tags array -->
              <p
                v-if="key === 'tags'"
                class="label-list__items__value"
              >
                <span
                  v-for="(k, v) in value"
                  :key="k"
                  class="tag-cols my-2"
                >
                  <span class="tag-cols__label">
                    {{ v }}:
                  </span>
                  <span class="tag-cols__value">
                    {{ k }}
                  </span>
                </span>
              </p>
              <!-- basic string value -->
              <p v-else>
                {{ value }}
              </p>
            </li>
          </ul>
        </template>
      </KCard>
    </div>

    <!-- loading state -->
    <KEmptyState
      v-if="isLoading"
      cta-is-hidden
    >
      <template slot="title">
        <div class="card-icon mb-3">
          <KIcon
            icon="spinner"
            color="rgba(0, 0, 0, 0.1)"
            size="42"
          />
        </div>
        Data Loading...
      </template>
    </KEmptyState>

    <!-- no data to load -->
    <KEmptyState
      v-if="isEmpty && !isLoading"
      cta-is-hidden
    >
      <template slot="title">
        <div class="card-icon mb-3">
          <KIcon
            class="kong-icon--centered"
            color="var(--yellow-base)"
            icon="warning"
            size="42"
          />
        </div>
        There is no data to display.
      </template>
    </KEmptyState>

    <!-- error -->
    <KEmptyState
      v-if="hasError"
      cta-is-hidden
    >
      <template slot="title">
        <div class="card-icon mb-3">
          <KIcon
            class="kong-icon--centered"
            color="var(--yellow-base)"
            icon="warning"
            size="42"
          />
        </div>
        An error has occurred while trying to load this data.
      </template>
    </KEmptyState>
  </div>
  </div>
</template>

<script>
export default {
  name: 'LabelList',
  props: {
    items: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    hasError: {
      type: Boolean,
      default: false
    },
    isEmpty: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isReady () {
      return !this.isEmpty && !this.hasError && !this.isLoading
    },
    colClass () {
      const len = Object.entries(this.items).length

      if (len > 6) {
        return 'has-columns cols-2'
      } else if (len >= 9) {
        return 'has-columns cols-3'
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.label-list-content {

  .kong-card {
    margin-bottom: 0 !important;
  }
}

.label-list {

}

.label-list__items {

  li {
    display: block;
    overflow: hidden;

    &:not(:last-of-type) {
      margin-bottom: var(--spacing-md);
    }
  }

  @media screen and (min-width: 1024px) {
    &.has-columns {
      column-gap: 10px;
    }

    &.cols-2 {
      column-count: 2;
    }

    &.cols-3 {
      column-count: 3;
    }
  }
}

.label-list__items__title {
  font-size: var(--type-sm);
  font-weight: 500;
  text-transform: uppercase;
  color: var(--gray-3);
}

.label-list__items__value {
  font-size: var(--type-sm);
  font-family: var(--font-family-mono);
}

.tag-cols {
  display: grid;
  grid-auto-flow: column dense;
  grid-gap: 10px;
  grid-template-columns: repeat(3, 1fr 4fr);

  span {
    // flex: 1 0 0;
  }
}

.tag-cols__label {
  min-width: 80px;
  font-weight: 700;
  text-align: right;
}

.tag-cols__value {

}
</style>
