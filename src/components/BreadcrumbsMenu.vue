<template>
  <KBreadcrumbs
    v-if="routes.length > 0 && !hideBreadcrumbs"
    :items="routes"
  />
</template>

<script>
import { KBreadcrumbs } from '@kong/kongponents'

export default {
  name: 'BreadcrumbsMenu',

  components: {
    KBreadcrumbs,
  },

  computed: {
    pageMesh() {
      return this.$route.params.mesh
    },

    routes() {
      const items = []

      this.$route.matched.forEach((r) => {
        const key = r.redirect !== undefined && r.redirect.name !== undefined ? r.redirect.name : r.name

        /** this adds the mesh name and url to the breadcrumb chain */
        const isCurrentRoute = this.isCurrentRoute(r)
        if (isCurrentRoute && this.pageMesh) {
          items.push({
            key: this.pageMesh,
            to: { path: `/meshes/${this.pageMesh}` },
            title: `Mesh Overview for ${this.pageMesh}`,
            text: this.pageMesh,
          })
        }

        if (isCurrentRoute && r.meta.parent && r.meta.parent !== 'undefined') {
          const parentRoute = this.$router.resolve({ name: r.meta.parent })

          items.push({
            key: r.meta.parent,
            to: { name: parentRoute.name },
            title: parentRoute.meta.title,
            text: r.meta.breadcrumb || parentRoute.meta.title,
          })
        } else if (isCurrentRoute && !r.meta.excludeAsBreadcrumb) {
          items.push({
            key,
            to: { name: key },
            title: r.meta.title,
            text: r.meta.breadcrumb || r.meta.title,
          })
        } else if (r.meta.parent && r.meta.parent !== 'undefined') {
          items.push({
            key: r.meta.parent,
            to: { name: r.meta.parent },
            title: r.meta.title,
            text: r.meta.breadcrumb || r.meta.title,
          })
        }
      })

      // the current page the user is on
      const currentRouteText = this.calculateRouteTextAdvanced(this.$route)

      if (currentRouteText) {
        items.push({
          title: currentRouteText,
          text: currentRouteText,
        })
      }

      return items
    },

    hideBreadcrumbs() {
      return this.$route.query.hide_breadcrumb
    },
  },

  methods: {
    isCurrentRoute(route) {
      return (route.name && route.name === this.$route.name) || route.redirect === this.$route.name
    },

    calculateRouteTextAdvanced(route) {
      const params = route.params

      const { expandSidebar, ...cleanParams } = params

      const isMesh = route.name === 'mesh-overview'
      const newParams = Object.assign({}, cleanParams, { mesh: null })

      if (isMesh) {
        return params.mesh
      } else {
        return Object.values(newParams).filter((x) => x)[0]
      }
    },
  },
}
</script>

<style lang="scss">
.krumbs {
  font-size: var(--type-lg);

  .krumb-item {
    a {
      color: #000 !important;
      text-decoration: none;
      font-weight: 400;
    }
  }

  @media (min-width: 701px) {
    font-size: var(--type-xl);
  }
}
</style>
