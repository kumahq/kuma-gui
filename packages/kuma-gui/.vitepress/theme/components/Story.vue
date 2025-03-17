<template>
  <section
    class="story"
  >
    <iframe
      :height="props.height"
      ref="iframe"
      data-why
      data-why-show-source
    >
      <slot name="default" />
    </iframe>
    <details open class="vue-source">
      <summary>View Vue Source</summary>
      <div class="language-vue vp-adaptive-theme">
        <button title="Copy Code" class="copy"></button>
        <span class="lang">vue</span>
        <!-- eslint-disable vue/no-v-html -->
        <div v-html="vueSource"></div>
        <!-- eslint-enable -->
      </div>
    </details>

    <details class="html-source">
      <summary>View HTML Source</summary>
    <pre>
  <code>{{htmlSource}}</code>
    </pre>

    </details>

  </section>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { getWhyframeSource } from '@whyframe/core/utils'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'


const props = withDefaults(defineProps<{
  height?: number
}>(), {
  height: 300
})
const iframe = ref<HTMLIFrameElement | null>(null)
const htmlSource = ref<string>('')
const highlighter = ref<Awaited<ReturnType<typeof createHighlighterCore>> | undefined>()

;(async () => {
  highlighter.value = await createHighlighterCore({
    themes: [import('shiki/themes/nord.mjs')],
    langs: [import('shiki/langs/javascript.mjs')],
    engine: createJavaScriptRegexEngine()
  })
})()
const vueSource = computed(() => {
  if(highlighter.value && iframe.value) {
    return highlighter.value.codeToHtml(
      getWhyframeSource(iframe.value),
      {
        theme: 'nord',
        lang: 'javascript'
      }
    )
  }
  return undefined;
})

watch(() => iframe.value, (val) => {
  if(val) {
    setTimeout(() => {
      htmlSource.value = val.contentWindow.document.getElementById('sandboxed-component').innerHTML
    }, 1000)
  }
}, { immediate: true })
</script>

