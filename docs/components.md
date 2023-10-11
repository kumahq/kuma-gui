# Components

<ComponentIndex :items="items" />

<script lang="ts" setup>
import ComponentIndex from './ComponentIndex.vue'

const items = getComponentItems()

function getComponentItems() {
  const modules = import.meta.glob('./components/**/*.md')
  const items = []

  for (const path in modules) {
    const link = path.replace(/\.md$/, '').replace(/^\.\/components\//, '')
    const parts = link.split('/')
    const text = parts[parts.length - 1]

    items.push({ text, link })
  }

  items.sort((itemA, itemB) => itemA.link.localeCompare(itemB.link))

  return items
}
</script>
