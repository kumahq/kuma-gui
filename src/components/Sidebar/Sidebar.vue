<template>
  <aside class="sidebar" id="main-nav">
    <h3>Meshes</h3>
    <select name id>
      <option value>Finance</option>
      <option value>Another Mesh</option>
      <option value>Here Is A Mesh</option>
      <option value>There Is A Mesh</option>
    </select>

    <h3>Entities</h3>
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

<style>
</style>