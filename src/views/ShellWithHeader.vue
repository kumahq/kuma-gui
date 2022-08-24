<template>
  <div>
    <GlobalHeader />
    <div class="main-content-container">
      <div class="main-content">
        <router-view v-slot="{ Component }">
          <transition
            mode="out-in"
            name="fade"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import GlobalHeader from '@/components/Global/GlobalHeader.vue'

export default {
  name: 'ShellWithHeader',

  components: {
    GlobalHeader,
  },
}
</script>
