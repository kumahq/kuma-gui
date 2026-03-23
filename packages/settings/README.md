# @kumahq/settings

Utilities to help configure and discover features/settings such as environment
variables, feature flags and user ability/capability.

## `env`

The `env` service is used for accessing application 'environment variables'.
'Environment variables' in the context of our application aren't _just_
variables that come from the build-time CLI environment, but they can also come
from the run-time Kuma binary (these are passed through via the `index.html`
file that embeds our application)

Additionally, there are certain circumstances where we may need to alter these
environment variables without rebuilding the app, or situations where we aren't
running via the Kuma binary itself, for example during staging/previews or
testing.

As an application developer you can use the following to access these variables
from anywhere in the application:

```javascript
env("KUMA_ENVIRONMENT_VARIABLE_NAME");
```

and the env service knows where to find this environment variable (either a
build-time CLI provided variable, or run-time index.html provided variables).

All variable names use the `KUMA_` prefix.

_These variables will not change during the lifetime of the browsers page, i.e.
they are not reactive. A browser refresh will be required if they have changed._

A `CookiedEnv` is also provided that can be optionally injected per environment
(such as on preview sites) to allow the user to set these variables via `Web
Inspector > Application > Storage > Cookies` allowing us to easily change these
variables during previewing.


## `can`

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

