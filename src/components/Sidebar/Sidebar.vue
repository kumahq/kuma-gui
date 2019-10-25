<template>
  <aside class="sidebar">
    <h3 class="sidebar__title">Meshes</h3>
    <select name id>
      <option value>Finance</option>
      <option value>Another Mesh</option>
      <option value>Here Is A Mesh</option>
      <option value>There Is A Mesh</option>
    </select>

    <h3 class="sidebar__title">Entities</h3>

    <nav class="main-nav">
      <ul>
        <li>
          <router-link to="/" exact>Overview</router-link>
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
    </nav>
  </aside>
</template>

<script>
export default {};
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: calc(100vh - var(--topbar-height));
  background: rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  padding: 32px;
  font-size: var(--type-md);
}

.sidebar__title {
  font-size: var(--type-xs);
  font-weight: normal;
  text-transform: uppercase;
  margin: 24px 0 10px 0;
}

.main-nav {
}

.main-nav a {
  display: block;
  /* padding: 0 32px; */
  color: var(--black-1);
  line-height: 38px;
}

.main-nav .router-link-active {
  background: rgba(61, 136, 242, 0.07);
  box-shadow: inset -2px 0 0 0 rgba(61, 136, 242, 0.75);
  margin: 0 -32px;
  padding-left: 32px;
  padding-right: 32px;
}
</style>
