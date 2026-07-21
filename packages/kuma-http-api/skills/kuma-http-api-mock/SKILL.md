---
name: kuma-http-api-mock
description: "Write HTTP API mock files for the kuma-gui mock server under `packages/kuma-http-api/mocks/`. Use whenever the user asks to add or update a mock endpoint, mock a new list/item resource, randomise mock response data with faker, register a new route in `fs.ts`, or extend the `FakeKuma` helpers — even if they don't say the word 'mock'."
metadata:
  author: Kong
  version: 1.0
---

You are writing HTTP API mock files for `@kumahq/kuma-http-api`, the package that ships typed OpenAPI definitions and a mock-data generator consumed by web apps (for example the kuma-gui web app), E2E tests, and the dev preview.

Everything in this skill lives under `packages/kuma-http-api/mocks/`:

```
mocks/
├── src/            # one file per endpoint; file path mirrors the URL
├── fs.ts           # endpoint → handler routing table
├── Env.ts          # typed env-var keys for test overrides
├── FakeKuma.ts     # Kuma-specific faker helpers (the `fake.kuma` namespace)
└── index.ts        # defines Dependencies, ResponseHandler, pager
```

## Hard constraints

- Touch only `mocks/`. Never edit source code under `packages/kuma-http-api/src/` or any other package.
- Don't introduce new npm imports inside mock files except types for using in `satisfies`. The mock "template engine" deliberately exposes everything through the `Dependencies` argument (`fake`, `pager`, `env`) so that every mock has identical capabilities. If a value needs a reusable generator, add a method to `FakeKuma.ts` instead of importing a new package.
- Every list endpoint paginates through `pager` so `size=` / `offset=` query parameters work consistently across the API.
- Every value that varies in reality must be randomised through `fake`. Hardcoded strings are reserved for literal enum values (`type: 'Mesh'`) and structural constants.
- `req.params.<x>` is `string | readonly string[]` — always coerce with `String(req.params.x)` before using it as a string. Template-literal interpolation hides this footgun.
- After creating a file, register it in `mocks/fs.ts`. If you add a new `env('KUMA_*', …)` key, add it to `mocks/Env.ts`. If your resource is kri-addressable, also add the kri re-export shim (see below).

## Start by finding a sibling

The fastest way to write a correct mock is to find the closest existing resource and copy its shape. Concrete starting points:

- **Top-level paginated list** (global-scoped, no mesh): copy from `mocks/src/hostnamegenerators.ts`.
- **Top-level item** (kri-addressable, global-scoped, no mesh, supports `?format=kubernetes`): copy from `mocks/src/meshes/_.ts`.
- **Kuma resource list under a mesh** (mesh-scoped): copy from `mocks/src/meshes/_/meshtrusts.ts`.
- **Kuma resource item under a mesh** (kri-addressable, mesh-scoped, supports `?format=kubernetes`): copy from `mocks/src/meshes/_/meshtrusts/_.ts`.
- **Sub-resource list under an item** (kri-addressable, filterable, nested, supports `?format=kubernetes`): copy from `mocks/src/meshes/_/meshservices/_/_hostnames.ts`.

Copying a sibling absorbs implicit conventions — the kri parsing block, the `Transfer-Encoding: chunked` randomisation, the `?format=kubernetes` `metadata` wrapper, the `k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'` switch — that would otherwise have to be re-derived from this document piece by piece. Then change the resource name, type literal, short name, and response type.

## File path mirrors the URL

Replace each dynamic path segment with `_`. `_` can be a file (`_.ts`) or a directory:

| HTTP route | File path |
|---|---|
| `GET /users` | `mocks/src/users.ts` |
| `GET /users/:id` | `mocks/src/users/_.ts` |
| `GET /users/:id/posts` | `mocks/src/users/_/posts.ts` |
| `GET /users/:id/posts/:postId` | `mocks/src/users/_/posts/_.ts` |

## File shape

```typescript
import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake, env, pager }: Dependencies): ResponseHandler => (req) => {
  return {
    headers: {},
    body: { /* ... */ },
  }
}
```

- `headers` is usually `{}`. Use `{ 'Status-Code': '404' }` to return a non-200 status. Many existing mocks also randomly set `{ 'Transfer-Encoding': 'chunked' }` so both response paths are exercised — mirror that if it fits.
- `body` is normally a JSON object. A few stats/metrics endpoints return a plain string instead — that's allowed by the `Response` type.

`#mocks` is a subpath import declared in `packages/kuma-http-api/package.json` that resolves to `mocks/index.ts`. Always import `Dependencies` and `ResponseHandler` from `#mocks`, never via a relative path.

## Typing the response with `satisfies`

OpenAPI types come from `@kumahq/kuma-http-api`. **Path keys use OpenAPI braces (`{mesh}`), not Express colons (`:mesh`)** — this is the most common silent footgun.

```typescript
import type { paths } from '@kumahq/kuma-http-api'

type MeshTrustsResponse = paths['/meshes/{mesh}/meshtrusts']['get']['responses']['200']['content']['application/json']
```

Some shapes also live under `components`:

```typescript
import type { components } from '@kumahq/kuma-http-api'

type MeshService = components['schemas']['MeshService']
type ErrorBody  = components['responses']['Error']['content']['application/json']
```

Always prefer to use a type that lives under `paths`. Apply the type with `satisfies` on the returned `body` so any drift between the mock and the spec becomes a type error:

```typescript
body: { total, next, items } satisfies MeshTrustsResponse,
```

If the spec hasn't been updated for the new endpoint yet, write the mock without `satisfies` and leave a `TODO` — inventing a type that doesn't exist in `@kumahq/kuma-http-api` would mask future drift.

## Working with `req`

`req.url.searchParams` is a standard `URLSearchParams`. `req.params.<x>` is `string | readonly string[]` — see the coercion rule in the hard constraints.

## The three helpers

### `fake` — Faker with a `.kuma` namespace

Standard faker modules are all available (`fake.word.noun()`, `fake.number.int(...)`, `fake.datatype.boolean()`, `fake.helpers.arrayElement(...)`, `fake.internet.url()`, `fake.lorem.sentence()`, `fake.date.past()`, etc.).

The `.kuma` namespace contains Kuma-specific helpers: kri identifiers, timespans, labels/tags, policy and resource names, certificates, hostname templates, and more. **Before generating any Kuma-shaped value by hand, read `packages/kuma-http-api/mocks/FakeKuma.ts`** — there is almost always a helper for what you need (`fake.kuma.timespan()`, `fake.kuma.kri({…})`, `fake.kuma.labels({…})`, `fake.kuma.nanodate()`, `fake.kuma.policyName()`, `fake.kuma.shortName('MeshTrust')`, …). Add a new method to `FakeKuma.ts` only if the value is reusable across resources and no existing helper fits.

### `env(key, default)` — test/preview-time overrides

```typescript
const count = parseInt(env('KUMA_THING_COUNT', `${fake.number.int({ min: 1, max: 100 })}`))
```

Both arguments are strings (env values are always strings). Always provide a `fake`-generated default so the mock is varied out of the box without any setup. Tests, E2E framework specs, and cookie overrides use the same `env` to constrain values to specific scenarios. Add the new key to `mocks/Env.ts`.

### `pager(total, req, selfUrl)` — pagination

```typescript
const { total, next, pageTotal, offset, size } = pager(
  env('KUMA_THING_COUNT', `${fake.number.int({ min: 1, max: 200 })}`),
  req,
  '/things',
)
```

`pageTotal` is the number of items for the current page — always use it as the length argument to `Array.from`. `offset + i` is a stable global index that survives pagination; prefer it over `i` for any field that should remain consistent across pages.

## Patterns

### List endpoint

```typescript
import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '@kumahq/kuma-http-api'

type ThingsResponse = paths['/things']['get']['responses']['200']['content']['application/json']

export default ({ fake, env, pager }: Dependencies): ResponseHandler => (req) => {
  const { total, next, pageTotal, offset } = pager(
    env('KUMA_THING_COUNT', `${fake.number.int({ min: 1, max: 200 })}`),
    req,
    '/things',
  )

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }, (_, i) => {
        const id = offset + i
        return {
          ...fake.kuma.timespan(),
          type: 'Thing',
          name: `${fake.word.noun()}-${id}`,
        }
      }),
    } satisfies ThingsResponse,
  }
}
```

### Item endpoint (kri-addressable resources)

Recent Kuma resources are addressable both by their legacy URL (`/meshes/:mesh/<resource>/:name`) and through a generic `/_kri/kri_<short>_:kri` endpoint. The same handler serves both. Copy the parsing pattern from a sibling resource — `mocks/src/meshes/_/meshtrusts/_.ts` is a clean reference.

```typescript
import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '@kumahq/kuma-http-api'

type ThingResponse = paths['/meshes/{mesh}/things/{name}']['get']['responses']['200']['content']['application/json']

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const k8s = env('KUMA_ENVIRONMENT', 'universal') === 'kubernetes'

  const kri = req.params.kri ? `kri_thing_${req.params.kri}` : undefined
  const [
    _prefix, shortName, mesh, zone, nspace, displayName,
  ] = kri ? kri.split('_') : [
    'kri',
    'thing',
    String(req.params.mesh),
    fake.helpers.arrayElement(['', fake.word.noun()]),
    ...(k8s ? String(req.params.name).split('.').toReversed() : ['', String(req.params.name)]),
  ]
  const name = kri ? `${displayName}${nspace ? `.${nspace}` : ''}` : String(req.params.name)

  return {
    headers: {},
    body: {
      ...fake.kuma.timespan(),
      type: 'Thing',
      mesh,
      name,
      kri: fake.kuma.kri({ shortName, mesh, zone, namespace: nspace, displayName }),
      labels: fake.kuma.labels({
        name: displayName,
        mesh,
        env: k8s ? 'kubernetes' : 'universal',
        ...(zone && { zone }),
        ...(k8s && { namespace: nspace }),
      }),
      // ...resource-specific spec
    } satisfies ThingResponse,
  }
}
```

If your resource isn't kri-addressable (list resource or pre-kri legacy), drop the kri block and use `String(req.params.name)` directly. As a rule of thumb, if the response includes a top level `kri` entry, the resource is kri-addressable.

For kri-addressable items, the canonical reference (kri parsing block, `?format=kubernetes` `metadata` wrapper, randomised chunked encoding) is `mocks/src/meshes/_/meshtrusts/_.ts`. When in doubt, mirror it exactly and swap the type literal + short name.

### kri re-export shim

For every kri-addressable resource, the item handler is also routed under `/_kri/kri_<short>_:kri`. The wiring lives in two places:

1. A one-line re-export at `mocks/src/_kri/kri_<short>__.ts`:

   ```typescript
   export { default } from '../meshes/_/<resource>/_'
   ```

   (look at `mocks/src/_kri/kri_mtrust__.ts` for the exact shape — every kri-addressable resource has one of these.)

2. An entry in `mocks/fs.ts` next to the existing `// <ResourceName>` comment in the kri block:

   ```typescript
   // MeshFoo
   '/_kri/kri_mfoo_:kri': _<your-number>,
   ```

Forget either and the kri URL form will fall through to the generic `/_kri/:kri` handler, which returns a stub. Always do both.

### Nested resource list with query-param filters

When the UI passes a filter, the mock should reflect it back in the generated rows — otherwise the mock can't be used to test filtered states. Common filters are `name` and labels. Label filters are prefixed with `label.` followed by the label key, for example `label.kuma.io/zone`, `label.k8s.kuma.io/namespace` or `label.kuma.io/listener-zoneingress`.

```typescript
const mesh = String(req.params.mesh)
const nameFilter = req.url.searchParams.get('name')
const statusFilter = req.url.searchParams.get('filter[status]')
const zoneLabelFilter = req.url.searchParams.get('filter[label.kuma.io/zone]')

const { total, next, pageTotal, offset } = pager(
  env('KUMA_POST_COUNT', `${fake.number.int({ min: 1, max: 200 })}`),
  req,
  `/meshes/${mesh}/posts`,
)

return {
  headers: {},
  body: {
    total,
    next,
    items: Array.from({ length: pageTotal }, (_, i) => {
      const id = offset + i
      return {
        ...fake.kuma.timespan(),
        type: 'Post',
        name: nameFilter ? `${nameFilter}-${id}` : `${fake.word.noun()}-${id}`,
        status: statusFilter ?? fake.helpers.arrayElement(['draft', 'published', 'archived']),
        labels: fake.kuma.labels({
          mesh,
          zone: zoneLabelFilter ?? fake.helpers.arrayElement(['zone1', 'zone2', 'zone3']),
        }),
      }
    }),
  },
}
```

### Conditional optional fields

Use spread with `fake.datatype.boolean()` for fields the schema marks optional. This exercises both code paths in the UI:

```typescript
return {
  name,
  ...(fake.datatype.boolean() && {
    metadata: {
      region: fake.helpers.arrayElement(['us-east', 'eu-west', 'ap-south']),
    },
  }),
}
```

### Conditional response shape (`?format=kubernetes`)

Every Kuma resource also serves a Kubernetes-style response when `?format=kubernetes` is set: the `apiVersion` is added and `mesh`/`name`/`labels` get wrapped inside a `metadata` object. Don't reinvent this — copy the pattern from `mocks/src/meshes/_/meshtrusts/_.ts`:

```typescript
const k8sFormat = req.url.searchParams.get('format') === 'kubernetes'

return {
  headers: {},
  body: {
    ...(k8sFormat ? { apiVersion: 'kuma.io/v1alpha1' } : {}),
    ...fake.kuma.timespan(),
    type: 'MeshFoo',
    mesh,
    name,
    kri: fake.kuma.kri({ ... }),
    ...((() => {
      const metadata = {
        mesh,
        name,
        labels: { ...fake.kuma.labels({ ... }) },
      }
      return k8sFormat ? { metadata } : metadata
    })()),
    spec: { ... },
  },
}
```

## Registering in `fs.ts`

`mocks/fs.ts` is a flat routing table. Add an `import` for the new file plus an entry in the exported `fs` object. The numeric variable names (`_1`, `_42`, `_628`) have no semantic meaning — pick any number that isn't already used in the file (a quick grep is enough). Place the route entry next to related ones and follow the section comments (`// meshes`, `// policies`, `// resources`, `// legacy policies`, etc.).

```typescript
import _501 from './src/things'
import _502 from './src/things/_'

export const fs = {
  // ...
  '/things': _501,
  '/things/:name': _502,
}
```

Note: `fs.ts` keys use Express-style colons (`:name`), even though the OpenAPI types use braces (`{name}`). This asymmetry is intentional — `fs.ts` is a URL router, not a spec reference.

## Adding env vars

If your mock introduces a new `env('KUMA_FOO', ...)` key, append it to the keyed type in `mocks/Env.ts`:

```typescript
export type Env = keyof {
  // ...existing keys
  KUMA_FOO: string
}
```

This is what makes `env('KUMA_FOO', '...')` type-safe — the key is constrained to the union of `Env`.

## Process

1. **Find the closest sibling mock** (see "Start by finding a sibling" above) — that's your starting template.
2. **Find the endpoint in `packages/kuma-http-api/openapi.yaml`** — note path, method, params, response schema, and whether the response is paginated.
3. **Decide the file path** under `mocks/src/` by mirroring the URL with `_` for dynamic segments.
4. **Locate the response type** in `@kumahq/kuma-http-api` (`paths['/...']['get']['responses']['200']['content']['application/json']` or `components['schemas'|'responses']['...']`). If the endpoint isn't in the spec yet, skip `satisfies` and leave a TODO — don't invent a type.
5. **Skim `FakeKuma.ts`** for any helper that already produces the values you need.
6. **Write the mock** — randomise every variable field, use `pager` for lists, `env` for test overrides, `fake.kuma.*` for Kuma-shaped values, and `satisfies` for the response type.
7. **Register the route in `mocks/fs.ts`**.
8. **If kri-addressable, add the kri re-export shim** (`mocks/src/_kri/kri_<short>__.ts`) and the `/_kri/kri_<short>_:kri` route in `fs.ts`.
9. **Add new env keys to `mocks/Env.ts`** if you introduced any.
