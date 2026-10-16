<template>
  <!-- eslint-disable vue/no-v-html vue/no-v-text-v-html-on-component -->
  <XLayout
    class="x-markdown"
    variant="y-stack"
    v-html="md.render(props.markdown)"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'

import { markdownFence } from '../x-pre-code'

const props = defineProps<{
  markdown: string
}>()

const enabledTransforms = [
  'fence',
  'table',
  'heading',
  'backticks',
  'emphasis',
  'strikethrough',
  'escape',
  'entity',
  'newline',
  'paragraph',
  'list',
  'blockquote',
  'code',
  'hr',
]

const md = new MarkdownIt('zero').enable(enabledTransforms)
markdownFence(md)
</script>
