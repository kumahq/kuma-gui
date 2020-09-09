<template>
  <svg
    class="refresh-icon"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="viewBox"
  >
    <g
      :fill="fill"
      fill-rule="nonzero"
    >
      <path d="M18 5.5a12.465 12.465 0 00-8.118 2.995 1.5 1.5 0 001.847 2.363l.115-.095A9.437 9.437 0 0118 8.5l.272.004a9.487 9.487 0 019.07 7.75l.04.246H25a.5.5 0 00-.416.777l4 6a.5.5 0 00.832 0l4-6 .04-.072A.5.5 0 0033 16.5h-2.601l-.017-.15C29.567 10.2 24.294 5.5 18 5.5zM2.584 18.723l-.04.072A.5.5 0 003 19.5h2.6l.018.15C6.433 25.8 11.706 30.5 18 30.5c3.013 0 5.873-1.076 8.118-2.995a1.5 1.5 0 00-1.847-2.363l-.115.095A9.437 9.437 0 0118 27.5l-.272-.004a9.487 9.487 0 01-9.07-7.75l-.041-.246H11a.5.5 0 00.416-.777l-4-6a.5.5 0 00-.832 0l-4 6z" />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'RefreshIcon',
  props: {
    fill: {
      type: String,
      default: '#fff'
    },
    viewBox: {
      type: String,
      default: '0 0 36 36'
    }
  }
}
</script>

<style lang="scss" scoped>
.refresh-icon {
  --i: 18px;
  display: block;
  width: var(--i);
  height: var(--i);
  margin-right: 5px;

  g {
    transform-box: fill-box;
    transform-origin: 50% 50%;
  }

  &.is-spinning g {
    animation: spin 1.2s infinite linear;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(1turn); }
  }
}
</style>
