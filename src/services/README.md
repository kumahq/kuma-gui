# Services

Note: All "Services" in this folder don't relate to "Kuma Services" (please see
`app/services/` if you are looking for that)

All 'services' in this folder are mostly vanilla javascript classes and or
functions containing functionality used and reused through out the application.
The majority of 'services' are instantiated lazily as singletons and are kept in
a service container. All access/retrieval/injection of these "services" should
be done through the service container.

We currently use [brandi](https://brandi.js.org/) as our service container and
dependency inversion library, and some of the APIs used follow brandi very
closely, please see [brandi's documentation](https://brandi.js.org/getting-started)
for further usage and reference.

We have two composition roots (`services/production.ts` and
`services/development.ts`). These, along with the dependency inversion pattern
allow us to switch in and out services and components for different environments
from one single place, the composition root. For example, we have a number of
services/components that should only be used when in a development environment.
Inverting the control and injecting these dependencies from The Outside means
its straightforwards to have completely different functionality per environment
whilst avoiding many conditional forks in the application itself.

## Composing more services via composition

If you want to write another service, consider what would be useful to be
injected functionality and use normal vanilla constructor injection to build
your service.

```javascript
class MyService {
  constructor(dep: AnotherServiceOrDependency) {
    // use dep
  }
}
```

Then use brandi and our thin helper functions to wire together the dependencies.

```javascript
// services/production.ts
const TOKENS = {
  AnotherService: service(AnotherServiceOrDependency, { description: 'AnotherServiceOrDependency' })
  MyService: service(MyService, { description: 'MyService' })
}
injected(MyService, TOKENS.AnotherService)
```

These 'services' can then be accessed from `@/utilities` (currently, but subject to
change) if you add a useInjection function to `@/utilities/index.ts`:

```javascript
// utilities/index.ts
import { TOKENS, createInjections } from '@/services'

export const [
  useMyService,
] = createInjections(TOKENS.myService)
```

```javascript
// YourComponent.vue
import { useMyService } from '@/utilities'
const myService = useMyService()
```

Note: You only have to add a useInjection function if you need to use the
service from within a Vue Component. Vue Components have no accessible
constructor so these functions are in lieu of constructor injection. If you
service is just a dependency for another service, then the service container
will inject all that for you as long as you tell it to do so using `inject`.

## Brandi helper functions

We also use some thin helper functions to make creating services and wiring them
together a tiny bit less code. You should only see these being used in
composition roots (i.e. `services/production.ts` and `services/development.ts`
etc). You are also free to use brandi APIs specifically in the composition roots
if you want.

## A note about brandi usage

We initially chose brandi as our DI/service container, and that may or may not
change in the future. Importantly you should not see/use brandi itself deeper in
the application itself, only `useService` functions, and vanilla javascript
constructor injection.

