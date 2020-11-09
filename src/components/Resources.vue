<template>
  <div class="resource-list">
    <KCard
      v-if="version"
      title="Resources"
    >
      <template slot="body">
        <p>
          Join the {{ $productName }} community and ask questions:
        </p>
        <ul class="resource-list">
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
      const versionOutput = (storedVersion !== null)
        ? storedVersion
        : 'latest'

      if (storedVersion) {
        return [
          {
            link: `https://kuma.io/docs/${versionOutput}/`,
            label: `${process.env.VUE_APP_NAMESPACE} Documentation`
          },
          {
            link: 'https://kuma-mesh.slack.com/',
            label: `${process.env.VUE_APP_NAMESPACE} Community Chat`
          },
          {
            link: 'https://github.com/kumahq/kuma',
            label: `${process.env.VUE_APP_NAMESPACE} GitHub Repository`
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
  list-style: disc;
  // margin-top: 6px;

  li {
    margin-left: 20px;
  }
}
</style>
