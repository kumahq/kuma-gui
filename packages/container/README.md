# @kumahq/container

This module contains code to implement an unobtrusive service container to
achieve a dependency inversion pattern

This README begins with a high level overview of the approach given that whilst
we have a model of the problems we are solving and where we want to be, the
implementation is still in flux and likely will be for some time to come.

Part of the design of the approach (keeping the
configuration/injection/implementation on The Outside) was decided knowing that
things would likely change over time and we didn't want to lock ourselves in to
a particular implementation or dependency. Therefore a minimal declarative
"configuration-based" API was chosen.

## TL;DR

At a high-level the approach we are aiming for would look like the following
YAML:

```yaml
data-source:
  service: DataSourcePool
  arguments:
    - sources
    - lifecycle
lifecycle:
  service: DataSourceLifecycle
mesh-sources:
  service: getMeshSources
  labels:
   - sources
data-source-with-logging:
  service: loggingDecorator
  decorates: data-source
```

This would convert into the following "wiring/plumbing" in javascript:

```js
const meshSources = getMeshSources()
const lifecycle = new DataSourceLifeCycle()
const dataSourcePool = new DataSourcePool(
  [meshSources],
  lifecycle
)
const dataSource = loggingDecorator(dataSourcePool)
```

- A `service` is a "creator" or factory (either a class to instantiate, or a
function to call) that returns an instance of your "service"/functionality.
- `arguments` are the arguments instantiate the class with or call the function
with
- `labels` allow you to make `services`s as arguments to other services (to
express a reverted relationship when necessary)
- `decorates` allows you to `decorate` one `service` with another just like an
ECMA decorator.

**That's it. There's nothing more to it.**

## But why?

Looking at the configuration format and comparing it with the Javascript you
can see that we can define "services" before their dependencies (arguments).
This means that if "for reasons" we don't know exactly what the arguments are
up-front, we can still define the service.

We can also overwrite and decorate already defined "services" by using the
"configure then build" two step approach.

We didn't want to use Vue's provide/inject approach either directly or
under-the-hood because we may need to define services outside of Vue or before
Vue has been instantiated/sourced.

### Dependency Inversion

[Dependency inversion is the D in SOLID](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
, one of the five principles intended to make applications more understandable,
flexible and maintainable.

At a high level it means injecting the dependencies of classes and components
from the outside, from a single composition root, rather than defining
dependencies deep in application code. The application codes against
abstractions and each composition root provides different concretions depending
on the feature-set required.

We *tell* the application what to do rather than *ask* what features are
enabled.

The simplest example of what we is avoiding a multitude of conditional `if`
statements throughout the codebase which leads to a complicated application
where it becomes harder and harder to implement new features.

Therefore in inverting the control over dependencies by moving the configuration
of dependencies as high as possible to a single composition root, it allows us
to completely change the feature-set of the GUI using a single file specific to
the version we are building.

## Using a service container

There are many service/dependency injection containers in the javascript
ecosystem.

First rule of dependency injection containers - don't depend on the
dependency injection container i.e. the fact that we are using a service
container (and which specific service container) should be hidden from the
majority of the application.

Constructor dependency injection can be achieved easily in native
javascript like so:

## Implementation

Uses [BrandiJS](https://brandi.js.org/getting-started) as the underlying
service container/dependency injection framework. **If you want to know more I
would advise reading those very detailed and useful docs.**

It is just a very thin (around 100 LoC) wrapper layer over BrandiJS.

The main issue with a YAML or simple JSON based approach is that by using
string keys to key our service container/configuration, all the types are lost.

To address this instead of using `string`s to identify our services and key
them in the service container we use "tokens". These are just like string keys
but they also carrying the type of the service. They can also be passed around
to use for specifying arguments, labels and specifying which services to
decorate.

The one issue with using tokens is that these can't be used as "properties" in
a YAML/JSON struct/blob. Therefore the structure uses the next best thing i.e.
a list of entries:

Given a YAML example of:

```yaml
data-source:
  service: DataSourcePool
  arguments:
    - sources
    - lifecycle
lifecycle:
  service: DataSourceLifecycle
mesh-sources:
  service: getMeshSources
  labels:
   - sources
data-source-with-logging:
  service: loggingDecorator
  decorates: data-source
```

The following is not possible:

```javascript
build({
  token('data-source'): {
    service: DataSourcePool
  }
})
```

Whereas the following _is_ possible.

```javascript
const get = build([
  [token('data-source'), {
    service: DataSourcePool
  }]
])
```

We also split our container/application up into modules, and we use a function
from each module to return a list of entries/services relevant to that module,
that we then combine into the final built service container.


```javascript
import { build } from '@kumahq/container'
const get = build(
  app(),
  meshes(),
  dataPlanes(),
  policies(),
  DEV_MODE ? msw() : []
  DEV_MODE ? mocks() : []
)
```

Each "plugin"/"module" contains services specific to its own functionality, but
also exports its own set of tokens for if another module wants to decorate,
overwrite or otherwise enhance the functionality of another module.

```javascript
import { build } from '@kumahq/container'
import { TOKENS as APP } from '@/app/application'
import { TOKENS as MESHES } from '@/app/meshes'

const $ = {
  ...APP,
  ...MESHES
}
const get = build(
  meshes($),
  dataPlanes($), // dataplanes has access to meshes TOKENS and can now decorate services from meshes if necessary
  policies(),
  DEV_MODE ? msw() : []
  DEV_MODE ? mocks() : []
)
const app = get(APP.app) // get a reference to the Vue app using the TOKENS.app token
```
