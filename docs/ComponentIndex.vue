<template>
  <ul>
    <li
      v-for="(item, index) in props.items"
      :key="index"
    >
      <a :href="'/docs/components/' + item.link">
        {{ item.text }}
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
const props = defineProps<{
  items: Array<{ text: string, link: string }>
}>()
</script>
