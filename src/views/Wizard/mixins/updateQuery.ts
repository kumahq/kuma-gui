import Vue from 'vue'

/**
 * updateQuery
 *
 * This mixin will let you add and remove URL queries
 *
 */
export default Vue.extend({
  methods: {
    updateQuery (query: string, value: string, remove: string) {
      const router = this.$router
      const route = this.$route

      // remove a query entirely if needed
      if (remove) {
        delete route.query[remove]
      }

      if (!route.query) {
        // if the URL contains no current queries, simply add the query and value
        router.push({
          query: {
            [query]: value
          }
        }).catch(() => {})
      } else {
        router.push({
          query: Object.assign({}, route.query, { [query]: value })
        }).catch(() => {})
      }
    }
  }
})
