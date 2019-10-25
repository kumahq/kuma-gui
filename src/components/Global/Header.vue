<template>
  <header class="main-header p-4">
    <div class="main-header__content flex justify-between items-center -mx-4">
      <div class="px-4">
        <router-link to="/" exact>
          <img src="@/assets/images/kuma-logo.svg" alt="Kuma Logo" />
        </router-link>
      </div>
      <div class="px-4">
        <p>Connected to Kuma at localhost:8000</p>
      </div>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  min-height: var(--topbar-height);
  border-bottom: 1px solid #eaecef;
}

.main-header__content {
  margin: 0 auto;
}
</style>
