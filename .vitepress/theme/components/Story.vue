<template>
  <section
    class="story"
  >

    <iframe
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
        <div v-html="vueSource"></div>
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
import { getHighlighter } from 'shiki'

const iframe = ref<HTMLIFrameElement>(null)
const htmlSource = ref<string>('')
const highlighter = ref<Awaited<ReturnType<typeof getHighlighter>> | undefined>()

;(async () => {
  highlighter.value = await getHighlighter({
    themes: ['nord'],
    langs: ['javascript']
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

