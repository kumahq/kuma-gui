<template>
  <KCard
    v-if="resourceLinks.length > 0"
    title="Resources"
  >
    <template v-slot:body>
      <p>
        Join the {{ productName }} community and ask questions:
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
</template>

<script>
import { mapGetters } from 'vuex'
import { PRODUCT_NAME } from '@/consts'

export default {
  data: () => ({
    productName: PRODUCT_NAME,
  }),
  computed: {
    ...mapGetters({
      kumaDocsVersion: 'config/getKumaDocsVersion',
    }),
    resourceLinks() {
      const storedVersion = this.kumaDocsVersion
      const kumaDocsVersion = storedVersion !== null ? storedVersion : 'latest'

      const utmSource = process.env.VUE_APP_UTM

      if (storedVersion) {
        return [
          {
            link: `https://kuma.io/docs/${kumaDocsVersion}/${utmSource}`,
            label: `${process.env.VUE_APP_NAMESPACE} Documentation`,
          },
          {
            link: `https://kuma-mesh.slack.com/${utmSource}`,
            label: `${process.env.VUE_APP_NAMESPACE} Community Chat`,
          },
          {
            link: `https://github.com/kumahq/kuma${utmSource}`,
            label: `${process.env.VUE_APP_NAMESPACE} GitHub Repository`,
          },
        ]
      }

      return []
    },
  },
}
</script>

<style lang="scss" scoped>
.resource-list {
  list-style: disc;

  li {
    margin-left: 20px;
  }
}
</style>
