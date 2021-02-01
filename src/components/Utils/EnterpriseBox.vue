<template>
  <KAlert
    class="py-1"
    appearance="success"
    size="small"
  >
    <template slot="alertMessage">
      <div class="alert-content flex items-center text-sm">
        <div class="mr-3">
          some message
        </div>
        <div>
          <KButton
            class="no-underline"
            appearance="primary"
            size="small"
            :to="url"
          >
            Enterprise
          </KButton>
        </div>
      </div>
    </template>
  </KAlert>
</template>

<script>
export default {
  name: 'EnterpriseBox',
  data () {
    return {
      url: process.env.VUE_APP_INSTALL_URL,
    }
  },
}
</script>

<style lang="scss" scoped>
.alert-content {
  display: flex;
  align-items: center;
  font-size: var(--type-sm);

  > *:first-of-type {
    margin-right: var(--spacing-sm);
  }

  .k-button {
    text-decoration: none;

    &:after {
      display: none;
    }
  }
}
</style>
