# x-i18n

The `XI18n` component offers several ways to translate/localize strings.

Please note the `:strings` property is primarily used for testing purposes.

<Story
  height="600"
>
    <XI18n
      v-slot="{ t }"
    >
      {{ t('http.api.property.usingExportedT') }}
    </XI18n>
    <hr />
    <XI18n
      prefix="http.api.property"
      v-slot="{ t }"
    >
      {{ t('.httpPropertyPrefixingWithExportedT') }}<br />
      {{ t('http.api.property.withoutPrefix') }}<br />
    </XI18n>
    <hr />
    <XI18n
      prefix="http.api.property"
      v-slot="{ t }"
    >
      {{ t('.<strong>unlikely path with HTML</strong>') }}
    </XI18n>
    <hr />
    <XI18n
      path="http.api.property.<strong>unlikely path with HTML</strong>"
    />
    <hr />
    <XI18n
      :strings="{ path: 'strings prop' }"
      v-slot="{ t }"
    >
      {{ t('path') }}
    </XI18n>
    <hr />
    <XI18n
      :strings="(e) => ({ path: e('<strong>slotted i18n text</strong> that allows{ var }') })"
      path="path"
    >
      <template
        #var
      >
        <XAction appearance="primary"> components {{'<strong>and escaped HTML</strong>'}}</XAction>
      </template>
    </XI18n>
<template
  v-for="html in ['<strong>escaped HTML</strong>']"
>
    <XI18n
      :strings="(e) => ({ path: e('<strong>inline i18n text</strong> that allows { var }') })"
      path="path"
      :params="{ var: html }"
    />
</template>
</Story>
