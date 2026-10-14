---
type: directive
---

# v-icon-start / v-icon-end

Vue directive icon helpers (also see ../../components/x-theme)

```vue
<button
  v-icon-start="'home'"
>
  Home
</button>
<a
  v-icon-end="'mesh'"
>
  View Mesh
</a>
```

You can also pass an object for more control over size:

```vue
<span
  v-icon-start="{ name: 'zone', size: '40' }"
>
  Zone
</span>
```

