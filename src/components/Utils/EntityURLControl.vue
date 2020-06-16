<template>
  <KClipboardProvider v-slot="{ copyToClipboard }">
    <KPop placement="bottom">
      <KButton
        appearance="secondary"
        size="small"
        @click="() => { copyToClipboard(url) }"
      >
        <KIcon
          slot="icon"
          icon="externalLink"
        />
        {{ copyButtonText }}
      </KButton>
      <div slot="content">
        <p>{{ confirmationText }}</p>
      </div>
    </KPop>
  </KClipboardProvider>
</template>

<script>
export default {
  name: 'EntityURLControl',
  props: {
    url: {
      type: String,
      required: true
    },
    copyButtonText: {
      type: String,
      default: 'Copy URL'
    },
    confirmationText: {
      type: String,
      default: 'URL copied to clipboard!'
    }
  }
}
</script>

<style>

</style>
