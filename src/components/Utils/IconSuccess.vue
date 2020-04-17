<template>
  <i
    class="card-icon icon-success mb-3"
    role="img"
  >
    &#x2713;
  </i>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.icon-success {
  --size: 30px;
  --font-size: 13px;
  --color: var(--logo-green);

  display: block;
  width: var(--size);
  height: var(--size);
  line-height: var(--size);
  border-radius: 50%;
  background-color: var(--color);
  margin: 0 auto;
  color: #fff;
  font-size: var(--font-size);
  text-align: center;
}
</style>
