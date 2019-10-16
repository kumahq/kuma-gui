<template>
  <div id="app" class="antialiased">
    <global-header />
    <div class="content-container container">
      <div class="flex">
        <div class="w-1/4">
          <sidebar />
        </div>
        <div class="w-3/4">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GlobalHeader from "@/components/Global/Header";
import Sidebar from "@/components/Sidebar/Sidebar";

export default {
  components: {
    GlobalHeader,
    Sidebar
  },
  metaInfo: {
    title: "Home",
    titleTemplate: "%s | Kuma",
    htmlAttrs: {
      lang: "en"
    }
  }
};
</script>