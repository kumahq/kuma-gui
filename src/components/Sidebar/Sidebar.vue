<template>
  <aside class="sidebar">
    <h3 class="sidebar__title">
      Meshes
    </h3>
    <select>
      <option value>
        Finance
      </option>
      <option value>
        Another Mesh
      </option>
      <option value>
        Here Is A Mesh
      </option>
      <option value>
        There Is A Mesh
      </option>
    </select>

    <nav class="main-nav">
      <ul class="main-nav__group">
        <li>
          <h3 class="sidebar__title">
            General
          </h3>
        </li>
        <li>
          <router-link
            to="/"
            exact
          >
            Overview
          </router-link>
        </li>
      </ul>

      <ul class="main-nav__group">
        <li>
          <h3 class="sidebar__title">
            Entities
          </h3>
        </li>
        <li>
          <router-link to="/entities/services">
            Services
          </router-link>
        </li>
        <li>
          <router-link to="/entities/dataplanes">
            Dataplanes
          </router-link>
        </li>
      </ul>

      <ul class="main-nav__group">
        <li>
          <h3 class="sidebar__title">
            Policies
          </h3>
        </li>
        <li>
          <router-link to="/policies/traffic-permissions">
            Traffic Permissions
          </router-link>
        </li>
        <li>
          <router-link to="/policies/traffic-routes">
            Traffic Routes
          </router-link>
        </li>
        <li>
          <router-link to="/policies/traffic-log">
            Traffic Routes
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {}
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

.main-nav__group {

}
</style>
