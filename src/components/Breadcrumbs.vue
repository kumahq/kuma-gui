<template>
  <div>
    <Krumbs
      v-if="!hideBreadcrumbs"
      :items="routes"
    />
  </div>
</template>

<script>
import { isValidUuid } from '@/helpers'
export default {
  computed: {
    routes () {
      const { query } = this.$router.currentRoute

      return this.calculateRouteFromQuery(query) ||
        this.$route.matched.map(r => {
          const text = this.calculateRouteText(r)
          const title = this.calculateRouteTitle(r)

          if (this.isCurrentRoute(r) || (!text && !title) || r.meta.excludeAsBreadcrumb) {
            return
          }

          return this.getBreadcrumbItem(r.name,
            { name: r.redirect || r.name, params: r.params },
            this.calculateRouteTitle(r),
            this.calculateRouteText(r))
        })
          .filter(Boolean)
    },

    hideBreadcrumbs () {
      return this.$route.query.hide_breadcrumb
    }
  },

  methods: {
    getBreadcrumbItem (key, to, title, text) {
      return { key, to, title, text }
    },

    isCurrentRoute (r) {
      return r.name &&
        r.name === this.$router.currentRoute.name ||
        r.redirect === this.$router.currentRoute.name
    },

    calculateRouteFromQuery (q) {
      const {
        entity_id: entityId,
        entity_type: entityType
      } = q

      if (entityId && entityType) {
        const resolvedTo = this.$router.resolve({
          name: `show-${entityType.split('_')[0]}`,
          params: { id: entityId.split(',')[0] }
        }).normalizedTo

        const normalized = {
          ...resolvedTo,
          meta: {
            ...resolvedTo.meta
          }
        }

        // if there is an entity in the query params, then use it as the
        // breadcrumb comma separated list with label being the second argument
        // e.g. ?entity_id=uuid,name&entity_type=
        let breadcrumb = normalized.params.id.split('-')[0]
        if (entityId.split(',').length > 1 && entityId.split(',')[1]) {
          breadcrumb = entityId.split(',')[1]
        }

        normalized.meta.breadcrumb = breadcrumb

        return [
          {
            ...this.getBreadcrumbItem(
              normalized.name,
              normalized,
              this.calculateRouteTitle(normalized),
              this.calculateRouteText(normalized))
          }
        ]
      }
    },

    calculateRouteText (route) {
      // TODO: support child routes that are children of :id to support routes
      // like /workspaces/:id/services/:id/update
      if (route.path && route.path.indexOf(':mesh') > -1) {
        const params = this.$router.currentRoute.params

        return (
          params && params.id && isValidUuid(params.id) ? params.id.split('-')[0].trim() : params.id
        ) || route.meta.breadcrumb || route.meta.title
      }

      return (
        (route.meta && (route.meta.breadcrumb || route.meta.title)) ||
        route.name
      ) || route.meta.breadcrumb || route.meta.title
    },

    calculateRouteTitle (route) {
      return (
        (route.params && route.params.id) ||
        (route.path.indexOf(':id') > -1 &&
          this.$router.currentRoute.params &&
          this.$router.currentRoute.params.id)
      )
    }
  }
}
</script>
