---
type: service
---
# can

`can` provides a way to easily ask about whether a user or resource has the
ability to do something. This could be based upon permissions (of the user, or
the control plane) or just general ability to do something maybe based on what
features are enabled in a cluster/mesh, or whether a resource has a
technical feature enabled.

You can think of `can`s default perspective as being that of the user, but if
you pass a different "context" to `can` to make it read like being in the
perspective of that "context". For example you might pass a mesh or dataplane
resource in as a second argument to see if a specific dataplane "can use
transparent proxying".

```vue
can('create zones')
can('read mesh-insights')
```
```vue
can('use service-insights', mesh)
can('use transparent-proxy', dataplane)
```
