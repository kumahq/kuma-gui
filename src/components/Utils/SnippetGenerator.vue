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
            <prism
              class="code-block"
              :language="item.lang"
              :code="item.code"
            />
          </template>
          <template slot="actions">
            <select
              v-model="selectedSnippet"
              class="snippet-generator__selector"
            >
              <option
                v-for="(snippet, key) in snippets"
                :key="key"
                :value="key"
                :selected="selectedCodeSnippet"
              >
                {{ snippet.label }}
              </option>
            </select>
            <KClipboardProvider
              v-slot="{ copyToClipboard }"
            >
              <KPop
                placement="right"
                width="auto"
              >
                <KButton
                  appearance="primary"
                  :title="`Click to copy ${item.label} to clipboard`"
                  @click="() => { copyToClipboard(item.code) }"
                >
                  <span class="sr-only">Copy</span>
                  <img
                    src="@/assets/images/icon-copy-light.svg?external"
                    alt="Icon for copying to the clipboard"
                  >
                </KButton>
                <div slot="content">
                  <p>Copied!</p>
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
import Prism from 'vue-prismjs'
import 'prismjs/themes/prism.css'

export default {
  name: 'SnippetGenerator',
  components: {
    Prism
  },
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
      margin-right: 0.5em;
    }

    .k-button {
      min-height: 42px;

      &:after {
        display: none;
      }
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
