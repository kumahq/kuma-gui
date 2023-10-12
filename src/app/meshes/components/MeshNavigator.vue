<template>
  <li
    data-testid="meshes-navigator"
  >
    <RouterLink
      :class="{ 'is-active': [$route.name].concat($route.matched.map(item => item.name)).some((item) => item === 'mesh-index-view') }"
      :to="{
        name: 'mesh-list-view'
      }"
    >
      Meshes
    </RouterLink>
  </li>
</template>
