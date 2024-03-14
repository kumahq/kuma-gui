<template>
  <KToggle
    v-slot="{ isToggled, toggle }"
  >
    <slot
      :expanded="isToggled.value"
      :toggle="toggle"
    />
  </KToggle>
</template>
