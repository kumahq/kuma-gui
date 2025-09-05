# XAnonymous

A completely empty component with no DOM elements at all i.e:

```vue
<template>
  <slot name="default" />
</template>
```

Mostly used for conditionally rendering an element:

```vue
  <component :is="true ? XTooltip : XAnonymous">
    <strong>Tooltipped</strong>
    <template
      v-if="true"
      #content
    >
      The tooltip
    </template>
  </component>
  <component :is="false ? XTooltip : XAnonymous">
    <strong>Not Tooltipped</strong>
    <template
      v-if="false"
      #content
    >
      The tooltip
    </template>
  </component>
```

