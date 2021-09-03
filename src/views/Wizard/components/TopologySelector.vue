<template>
  <div class="topology-selector">
    <slot name="title" />
    <form id="topology-selector-form">
      <div
        v-for="(type, index) in types"
        :key="index"
      >
        <label
          :for="`topology-type-${index}`"
          :class="{ 'is-selected': (checked === index) ? true : false }"
          class="topology__label"
          @click="handleToggle(index)"
        >
          <KCard has-hover>
            <template v-slot:body>
              <div class="topology__content-container">
                <div class="topology__switch">
                  <input
                    :id="`topology-type-${index}`"
                    :value="type.value"
                    name="topology-type"
                    type="radio"
                    class="k-input topology__input"
                    @change="$emit('topologySelected', type.value)"
                  >
                </div>
                <div
                  v-if="type.image"
                  class="topology__card__image"
                >
                  <img
                    :src="type.image"
                    :alt="`Topology diagram for ${type.name}`"
                  >
                </div>
                <div class="topology__card__content">
                  <h3 class="xxl mb-2">{{ type.name }}</h3>
                  <div v-if="type.content">
                    <p class="lg">{{ type.content }}</p>
                  </div>
                </div>
              </div>
            </template>
          </KCard>
        </label>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    types: {
      type: Array,
      default: () => [{}],
    },
  },
  data() {
    return {
      checked: null,
    }
  },
  methods: {
    handleToggle(ev) {
      this.checked = ev
    },
  },
}
</script>

<style lang="scss" scoped>
.topology-selector {
  margin: var(--spacing-xl) 0;
}

#topology-selector-form {
  margin: var(--spacing-lg) 0;
}

.topology__card {
}

.topology__label {
  overflow: hidden;
  cursor: pointer;

  &.is-selected .kong-card {
    background-color: var(--blue-lightest);
  }
}

.topology__content-container {
  display: flex;
  align-items: center;
  justify-content: stretch;
}

.topology__switch,
.topology__card__image,
.topology__card__content {
  margin: 0 16px;
}

.topology__switch {
  width: calc(8% - 32px);
  text-align: center;
}

.topology__input {
  margin: 0 auto;
}

.topology__card__image {
  width: calc(26% - 32px);
  object-fit: contain;
  overflow: hidden;
  border-radius: 16px;

  img {
    display: block;
    width: 100%;
    height: auto;
    margin: 0;
  }
}

.topology__card__content {
  width: calc(66% - 32px);
}
</style>
