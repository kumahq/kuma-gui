# x-i18n

The `XI18n` component offers several ways to translate/localize strings.

<Story
  :params="{param: 'param'}"
  v-slot="{ params }"
>
  <figure>
    <XI18n
      v-slot="{ t }"
    >
      {{ t('http.api.property.usingT') }}
    </XI18n>
    <figcaption>Using exported `t`</figcaption>
  </figure>
  <figure>
    <XI18n
      prefix="http.api.property"
      v-slot="{ t }"
    >
      {{ t('prefixingWithT') }}
    </XI18n>
    <figcaption>Prefixing exported `t`</figcaption>
  </figure>
  <figure>
    <XI18n
      t="http.api.property.<strong>hi</strong>"
    >
    </XI18n>
    <figcaption>Prefixing exported `t`</figcaption>
  </figure>
  <figure>
    <XI18n
      :strings="{ hi: 'there' }"
      v-slot="{ t }"
    >
      {{ t('hi') }}
    </XI18n>
    <figcaption>Prefixing exported `t`</figcaption>
  </figure>
  <figure>
    <XI18n
      :strings="{ hi: 'there { var }' }"
      t="hi"
    >
      <template
        #var
      >
        <strong>here {{'<strong>there</strong>'}}</strong>
      </template>
    </XI18n>
    <figcaption>Prefixing exported `t`</figcaption>
  </figure>
</Story>
