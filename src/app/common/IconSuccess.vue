<template>
  <i
    class="icon-success mb-3"
    role="img"
  >
    &#x2713;
  </i>
</template>

<style lang="scss" scoped>
$size: 30px;

.icon-success {
  display: block;
  width: #{$size};
  height: #{$size};
  line-height: #{$size};
  border-radius: 50%;
  background-color: var(--green-500);
  margin: 0 auto;
  color: var(--white);
  font-size: 13px;
  text-align: center;
}
</style>
