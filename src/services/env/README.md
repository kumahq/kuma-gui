# env

The `env` service is used for accessing application 'environment variables'.
'Environment variables' in the context of our application aren't *just*
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
env('KUMA_ENVIRONMENT_VARIABLE_NAME')
```

and the env service knows where to find this environment variable (either a
build-time CLI provided variable, or run-time index.html provided variables).

All variable names use the `KUMA_` prefix.

*These variables will not change during the lifetime of the browsers page, i.e.
they are not reactive. A browser refresh will be required if they have changed.*

A `CookiedEnv` is also provided that can be optionally injected per environment
(such as on preview sites) to allow the user to set these variables via `Web
Inspector > Application > Storage > Cookies` allowing us to easily change these
variables during previewing.

## env('')

TBD

## Env

TBD

## CookiedEnv

TBD
