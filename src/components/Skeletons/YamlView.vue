<template>
  <div class="yaml-view">
    <KCard :title="title">
      <template slot="body">
        <code><pre>{{ yamlContent }}</pre></code>
      </template>
      <template slot="actions">
        <KClipboardProvider v-slot="{ copyToClipboard }">
          <KPop placement="bottom">
            <KButton
              appearance="primary"
              @click="() => {
                copyToClipboard(yamlContent)
              }"
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
import yaml from 'json2yaml'

export default {
  name: 'YamlView',
  props: {
    title: {
      type: String,
      required: false,
      default: null
    },
    content: {
      type: Object,
      required: true,
      default: null
    }
  },
  computed: {
    yamlContent: function () {
      const content = this.content

      return yaml.stringify(content)
    }
  }
}
</script>

<style>

</style>
