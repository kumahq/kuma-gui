<template>
  <KAlert
    class="py-1"
    appearance="success"
    size="small"
  >
    <template slot="alertMessage">
      <div class="alert-content flex items-center text-sm">
        <div class="mr-3">
          Do more with Kuma <span class="alert-content__arrow">&rarr;</span>
        </div>
        <div>
          <KButton
            class="no-underline"
            appearance="primary"
            size="small"
            target="_blank"
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
      url: 'https://kuma.io/enterprise/?utm_source=Kuma-GUI'
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
