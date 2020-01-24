<template>
  <div class="snippet-generator">
    <div class="snippet-generator__block">
      <div
        v-for="(item, index) in selectedCodeSnippet"
        :key="index"
        class="snippet-generator__block__content"
      >
        <KCard>
          <template slot="body">
            <pre><code>{{ item.code }}</code></pre>
          </template>
          <template slot="actions">
            <select
              v-model="selectedSnippet"
              class="snippet-generator__selector"
            >
              <option
                v-for="(item, index) in snippets"
                :key="index"
                :value="index"
                :selected="selectedCodeSnippet"
              >
                {{ item.label }}
              </option>
            </select>
            <KClipboardProvider
              v-slot="{ copyToClipboard }"
            >
              <KPop placement="right">
                <KButton
                  appearance="primary"
                  @click="() => { copyToClipboard(item.code) }"
                >
                  Copy {{ item.label }}
                </KButton>
                <div slot="content">
                  <p>Snippet copied!</p>
                </div>
              </KPop>
            </KClipboardProvider>
          </template>
        </KCard>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SnippetGenerator',
  props: {
    snippets: {
      type: Array,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      selectedSnippet: 0
    }
  },
  computed: {
    selectedCodeSnippet () {
      return this.snippets.filter((e, i) => {
        return this.selectedSnippet === i
      })
    }
  }
}
</script>

<style lang="scss">
.snippet-generator {

}

.snippet-generator__selector {
  padding-right: 2em;
}

.snippet-generator__block__content {

  .k-card-actions {
    width: 100%;
    display: flex;
    align-items: center;

    > * {
      flex: 0 0 1;
      margin-right: 1em;
    }
  }

  pre {
    border-radius: 3px;
    background-color: rgba(150, 58, 133, 0.05);
    padding: 1em;
    margin: .5em 0;
    overflow: auto;
  }
}
</style>
