<template>
  <div class="welcome welcome__step-1">
    <h1>Onboarding step 1</h1>
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
