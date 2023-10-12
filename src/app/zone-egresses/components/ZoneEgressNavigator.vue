<template>
  <li
    data-testid="zone-egresses-navigator"
  >
    <RouterLink
      :class="{ 'is-active': [$route.name].concat($route.matched.map(item => item.name)).some((item) => item === 'zone-egress-list-view') }"
      :to="{
        name: 'zone-egress-list-view'
      }"
    >
      Zone Egresses
    </RouterLink>
  </li>
</template>
