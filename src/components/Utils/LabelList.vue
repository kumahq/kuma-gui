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
          <div
            class="label-list__col-wrapper"
            :class="{ 'multi-col': (items.tags && Object.entries(items.tags).length) }"
          >
            <div class="label-list__col">
              <ul
                class="label-list__items"
                :class="colClass"
              >
                <li
                  v-for="(value, key) in itemsNoTags"
                  :key="key"
                >
                  <h4 class="label-list__items__title">
                    {{ key }}
                  </h4>
                  <p>
                    {{ value }}
                  </p>
                </li>
              </ul>
            </div>
            <div
              v-if="items.tags"
              class="label-list__col"
            >
              <div>
                <h4 class="label-list__items__title">
                  Tags
                </h4>
                <!-- tags array -->
                <ul>
                  <li class="label-list__items__value">
                    <span
                      v-for="(k, v) in items.tags"
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
                  </li>
                </ul>
              </div>
            </div>
          </div>
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
import { rejectKeys } from '@/views/Wizard/helpers'

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
    },
    itemsNoTags () {
      return rejectKeys(this.items, 'tags')
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

.label-list__col-wrapper {

  @media screen and (min-width: 1024px) {
    &.multi-col {
      display: flex;

      > * {
        flex: 1 0 0;

        &:not(:last-of-type) {
          margin-right: var(--spacing-md);
        }
      }
    }
  }
}

.label-list__items {

  li {
    display: block;
    overflow: hidden;

    &:not(:last-of-type) {
      margin-bottom: var(--spacing-md);
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
  // font-size: var(--type-sm);
  // font-family: var(--font-family-mono);
}

.tag-cols {
  display: grid;
  grid-auto-flow: column dense;
  grid-gap: 10px;
  grid-template-columns: repeat(2, 1fr 4fr);

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
