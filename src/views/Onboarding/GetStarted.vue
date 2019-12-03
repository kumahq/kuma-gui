<template>
  <div class="welcome welcome__step-1">
    <p>
      Kuma has been successfully installed, you’re one step away to build a
      modern cloud-native architecture!
    </p>
  </div>
</template>

<script>
export default {
  name: 'OnboardingStep1',
  metaInfo: {
    title: 'Welcome to Kuma!'
  },
  components: {

  },
  data () {
    return {

    }
  },
  beforeMount () {
    this.bootstrap()
  },
  methods: {
    bootstrap () {
      this.isLoading = true
      this.isEmpty = false
    }
  }
}
</script>

<style>
</style>
