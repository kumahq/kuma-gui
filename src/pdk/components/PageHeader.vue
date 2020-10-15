<template>
  <header class="page-header">
    <div class="row">
      <component
        :is="tag"
        class=""
      >
        <span class="float-left title">{{ formattedTitle }}</span>
        <slot name="title-logo" />
      </component>
      <nav class="d-inline-flex justify-content-end ml-auto text-right">
        <slot />
      </nav>
    </div>
    <slot name="below-title" />
  </header>
</template>

<script>
export default {
  name: 'PageHeader',

  props: {
    title: {
      type: String,
      default: ''
    },

    size: {
      type: Number,
      default: 3
    }
  },

  computed: {
    tag () {
      return `h${this.size}`
    },

    routeTitle () {
      return this.$route.matched[this.$route.matched.length - 1].meta.title
    },

    formattedTitle () {
      return this.title || this.routeTitle
    }
  }
}
</script>

<style scoped>
.page-header h1, h2, h3, h4, h5, h6 {
  font-weight: 400;
  color: #003B66;
}

.row {
  justify-content: space-between;
  padding: 0 15px;
}

.col {
  line-height: 38px;
}

h1, h2, h3, h4, h5, h6, nav {
  padding-top: 0px;
  padding-bottom: 20px;
}

nav {
  -ms-flex-positive: 0.1 !important;
  flex-grow: 0;
  white-space: nowrap;
}
</style>
