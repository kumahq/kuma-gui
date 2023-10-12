<template>
  <li
    data-testid="zones-navigator"
  >
    <RouterLink
      :class="{ 'is-active': [$route.name].concat($route.matched.map(item => item.name)).some((item) => item === 'zone-index-view') }"
      :to="{
        name: 'zone-cp-list-view'
      }"
    >
      Zones
    </RouterLink>
  </li>
</template>
