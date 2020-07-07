<template>
  <div class="resource-list">
    <KCard
      v-if="version"
      title="Resources"
    >
      <template slot="body">
        <ul>
          <li
            v-for="(item, index) in resourceLinks"
            :key="index"
          >
            <a
              :href="item.link"
              target="_blank"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </template>
    </KCard>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      version: 'getVersion'
    }),
    resourceLinks () {
      const storedVersion = this.version
      const versionOutput = (storedVersion !== null) ? storedVersion : 'latest'

      if (storedVersion) {
        return [
          {
            link: `https://kuma.io/docs/${versionOutput}/`,
            label: 'Kuma Documentation'
          },
          {
            link: 'https://kuma-mesh.slack.com/',
            label: 'Kuma Community Chat'
          },
          {
            link: 'https://github.com/Kong/kuma',
            label: 'Kuma GitHub Repository'
          }
        ]
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.resource-list {

}
</style>
