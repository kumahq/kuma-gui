<template>
  <div class="overview">
    <page-header>
      <template v-slot:content>
        <h2 class="title-3x">
          404
        </h2>
        <h3 class="title-2x">
          {{ $route.meta.title }}
        </h3>
      </template>
    </page-header>
    <p>
      Sorry. We cannot find the page you were looking for.
      You could reload the page or go back
      <router-link to="/">
        Home
      </router-link>.
    </p>
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader.vue'

export default {
  name: 'NotFound',
  components: {
    PageHeader
  }
}
</script>
