<template>
  <div class="yaml-view">
    <KCard :title="title">
      <template slot="body">
        <prism
          v-if="content"
          class="code-block"
          language="yaml"
          :code="yamlContent"
        />
        <div v-else>
          <p>No code to parse.</p>
        </div>
      </template>
      <template slot="actions">
        <KClipboardProvider
          v-if="content"
          v-slot="{ copyToClipboard }"
        >
          <KPop placement="bottom">
            <KButton
              appearance="primary"
              @click="() => { copyToClipboard(yamlContent) }"
            >
              Copy to Clipboard
            </KButton>
            <div slot="content">
              <p>Entity copied to clipboard!</p>
            </div>
          </KPop>
        </KClipboardProvider>
      </template>
    </KCard>
  </div>
</template>

<script>
import Prism from 'vue-prismjs'
import 'prismjs/themes/prism.css'
import yaml from 'json2yaml'

export default {
  name: 'YamlView',
  components: {
    prism: Prism
  },
  props: {
    title: {
      type: String,
      default: null
    },
    content: {
      type: Object,
      default: null
    }
  },
  computed: {
    yamlContent () {
      const content = this.content

      return yaml.stringify(content)
    }
  }
}
</script>

<style scoped>
.code-block {
  border-radius: 3px;
  background-color: rgba(150, 58, 133, 0.05);
}
</style>
