/**
 * EntitySorter
 *
 * A quick mixin that will sort our entities by name
 * and mesh. Not very flexible but it's used heavily
 * in the GUI, so it was best as a mixin.
 */

export default {
  methods: {
    sortEntities (items: {
      name: string
      mesh: string
    }[]) {
      const sorted = items.sort((a, b) =>
        (a.name > b.name) ? 1 : (a.name === b.name) ? ((a.mesh > b.mesh) ? 1 : -1) : -1
      )

      return sorted
    }
  }
}
