<template>
  <li
    class="nav-item-home"
    data-testid="control-planes-navigator"
  >
    <RouterLink
      :class="{ 'is-active': [$route.name].concat($route.matched.map(item => item.name)).some((item) => item === 'home') }"
      :to="{
        name: 'home'
      }"
    >
      Home
    </RouterLink>
  </li>
</template>
