<template>
  <aside class="sidebar" id="main-nav">
    <h3 class="sidebar__title">Meshes</h3>
    <select name id>
      <option value>Finance</option>
      <option value>Another Mesh</option>
      <option value>Here Is A Mesh</option>
      <option value>There Is A Mesh</option>
    </select>

    <h3 class="sidebar__title">Entities</h3>
    <ul>
      <li>
        <router-link to="/">Overview</router-link>
      </li>
      <li>
        <router-link to="/services">Services</router-link>
      </li>
      <li>
        <router-link to="/traffic-permissions">Traffic Permissions</router-link>
      </li>
      <li>
        <router-link to="/traffic-routes">Traffic Routes</router-link>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {};
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.sidebar__title {
  font-weight: normal;
  text-transform: uppercase;
}
</style>
