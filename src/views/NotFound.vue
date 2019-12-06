<template>
  <div class="overview">
    <page-header noflex>
      <h2 class="xxl">
        404
      </h2>
      <h3 class="title-2x">
        {{ $route.meta.title }}
      </h3>
    </page-header>
    <page-content>
      <p>
        Sorry. We cannot find the page you were looking for.
        You could reload the page or go back
        <router-link to="/">
          Home
        </router-link>.
      </p>
    </page-content>
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader.vue'
import PageContent from '@/components/Utils/PageContent.vue'

export default {
  name: 'NotFound',
  components: {
    PageHeader,
    PageContent
  }
}
</script>
