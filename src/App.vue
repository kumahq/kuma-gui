<template>
  <div id="app" class="antialiased">
    <global-header />
    <div class="flex justify-between">
      <sidebar />
      <router-view />
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
