<template>
  <div class="topology-selector">
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
            <template slot="body">
              <div class="topology__content-container">
                <div class="topology__switch">
                  <input
                    :id="`topology-type-${index}`"
                    :value="type.value"
                    name="topology-type"
                    type="radio"
                    class="topology__input"
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
      default: () => [{}]
    }
  },
  data () {
    return {
      checked: null
    }
  },
  methods: {
    handleToggle (ev) {
      this.checked = ev
    }
  }
}
</script>

<style lang="scss" scoped>
.topology-selector {
  margin: 2rem 0;
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

.topology__switch, .topology__card__image, .topology__card__content {
  margin: 0 16px;
}

.topology__switch {
  width: calc(8% - 32px);
  text-align: center;
}

.topology__input {
  margin: 0 auto;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  width: 20px;
  color: var(--blue-base);
  border-radius: 100%;
  vertical-align: middle;
  padding: 0;
  border: 1px solid var(--grey-88);
  background-color: #fff;
  box-sizing: border-box;
  appearance: none;
  user-select: none;

  &:checked {
    border-color: currentColor;
    background-color: #fff;
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;

    &:after {
      content: "";
      display: flex;
      height: 10px;
      width: 10px;
      background-color: currentColor;
      border-radius: 100%;
    }
  }
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
