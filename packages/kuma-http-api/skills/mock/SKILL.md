---
name: mock
description: "Write HTTP API mock files. Use when: adding a new mock endpoint, adding a list/item mock, randomising mock response data with faker."
---

You are an expert TypeScript engineer writing HTTP API mock files for a HTTP API that is consumed by a web application.

## Constraints

- **NEVER modify source code** — only write mock files and update `mocks/fs.ts`
- **ALWAYS derive types from the OpenAPI spec** — import types from the project's OpenAPI-generated types package and use `satisfies` to type-check the response body
- **ALWAYS randomise field values** using `fake` (faker) — never use hardcoded strings for names, IDs, dates, or counts unless they are fixed enum values or structural constants
- **NEVER import additional packages** — use only the `Dependencies` helpers (`fake`, `pager`, `env`); add new domain-specific helpers to the faker extension file if a reusable helper is needed
- **ALWAYS register the new file** in `mocks/fs.ts` after creating it

## File Location — Mirror the URL Path

Every endpoint maps to a TypeScript file under `mocks/src/`. Replace dynamic path segments with `_`.
A `_` can be either a **file** (`_.ts`) or a **folder** that contains further files:

| HTTP route | File path |
|---|---|
| `GET /users` | `mocks/src/users.ts` |
| `GET /users/:id` | `mocks/src/users/_.ts` |
| `GET /users/:id/posts` | `mocks/src/users/_/posts.ts` |
| `GET /users/:id/posts/:postId` | `mocks/src/users/_/posts/_.ts` |

## Required File Structure

Every mock file must export a single default function with this exact signature:

```typescript
import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake, env, pager }: Dependencies): ResponseHandler => (req) => {
  return {
    headers: {},
    body: { ... },
  }
}
```

- `headers` — usually `{}`. Use `{ 'Status-Code': '404' }` to return a non-200 status.
- `body` — a JSON object (or, rarely, a plain string for stats/metrics endpoints).

## Typing the Response Body

Always import the OpenAPI-generated type for the endpoint and use `satisfies` on the body. Check the project's OpenAPI types package for the correct import path and type names:

```typescript
import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '<openapi-types-package>'

type UserList = paths['/users']['get']['responses']['200']['content']['application/json']

export default ({ fake, env, pager }: Dependencies): ResponseHandler => (req) => {
  // ...
  return {
    headers: {},
    body: { total, items, next } satisfies UserList,
  }
}
```

For item endpoints, the type is often under `components['responses']` or `components['schemas']`:

```typescript
import type { components } from '<openapi-types-package>'
type User = components['responses']['UserItem']['content']['application/json']
// or
type User = components['schemas']['User']
```

## Dependencies Reference

### `fake` — Faker instance

Standard faker modules are always available:

```typescript
fake.word.noun()                               // random noun
fake.number.int({ min: 1, max: 1000 })        // random integer
fake.datatype.boolean()                        // random true/false
fake.helpers.arrayElement(['a', 'b', 'c'])    // pick one
fake.date.past()                               // Date object
fake.date.between({ from: start, to: Date.now() }).toISOString()
fake.internet.url()
fake.lorem.sentence()
```

The project may extend faker with domain-specific helpers. Check the faker extension file (e.g. `mocks/FakeKuma.ts`) for available helpers before generating domain values manually.

### `env` — Read environment / test variables

```typescript
env('MY_COUNT', '10')   // returns the env var or the default
```

Use `env` to let tests override counts and flags. Always provide a `fake`-generated default so the mock works without any setup:

```typescript
const count = parseInt(env('MY_THING_COUNT', `${fake.number.int({ min: 1, max: 100 })}`))
```

Available env variables are defined in `mocks/Env.ts`. Add a new entry there if the mock introduces a new control variable.

### `pager` — Paginate a list response

```typescript
const { total, next, pageTotal, offset } = pager(
  env('MY_THING_COUNT', `${fake.number.int({ min: 1, max: 200 })}`),
  req,
  '/things',   // self URL used for the `next` cursor
)
```

`pageTotal` is the number of items to generate for the current page. Always use it as the `Array.from` length.

## Patterns

### Pattern 1 — Paginated list

```typescript
import type { Dependencies, ResponseHandler } from '#mocks'
import type { paths } from '<openapi-types-package>'

type UserList = paths['/users']['get']['responses']['200']['content']['application/json']

export default ({ fake, env, pager }: Dependencies): ResponseHandler => (req) => {
  const { total, next, pageTotal, offset } = pager(
    env('USER_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    '/users',
  )

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const creationTime = fake.date.past()
        return {
          id: `${id}`,
          name: `${fake.word.noun()}-${id}`,
          creationTime: creationTime.toISOString(),
          modificationTime: fake.date.between({ from: creationTime, to: Date.now() }).toISOString(),
          enabled: fake.datatype.boolean(),
        }
      }),
    } satisfies UserList,
  }
}
```

### Pattern 2 — Item endpoint (path parameter)

```typescript
import type { Dependencies, ResponseHandler } from '#mocks'
import type { components } from '<openapi-types-package>'

type User = components['responses']['UserItem']['content']['application/json']

export default ({ fake, env }: Dependencies): ResponseHandler => (req) => {
  const name = req.params.name as string
  const creationTime = fake.date.past()

  return {
    headers: {},
    body: {
      name,
      email: fake.internet.email(),
      creationTime: creationTime.toISOString(),
      modificationTime: fake.date.between({ from: creationTime, to: Date.now() }).toISOString(),
    } satisfies User,
  }
}
```

### Pattern 3 — Nested resource list (path + query params)

```typescript
import type { Dependencies, ResponseHandler } from '#mocks'

export default ({ fake, env, pager }: Dependencies): ResponseHandler => (req) => {
  const { userId } = req.params
  const queryName = req.url.searchParams.get('name')
  const statusFilter = req.url.searchParams.get('filter[status]')
  const zoneLabelFilter = req.url.searchParams.get('filter[label.kuma.io/zone]')

  const { total, next, pageTotal, offset } = pager(
    env('POST_COUNT', `${fake.number.int({ min: 1, max: 1000 })}`),
    req,
    `/users/${userId}/posts`,
  )

  return {
    headers: {},
    body: {
      total,
      next,
      items: Array.from({ length: pageTotal }).map((_, i) => {
        const id = offset + i
        const title = queryName
          ? `${queryName}-${fake.word.noun()}-${id}`
          : `${fake.word.noun()}-${id}`
        const creationTime = fake.date.past()

        return {
          id: `${id}`,
          title,
          status: statusFilter ?? fake.helpers.arrayElement(['draft', 'published', 'archived']),
          creationTime: creationTime.toISOString(),
          modificationTime: fake.date.between({ from: creationTime, to: Date.now() }).toISOString(),
          labels: {
            'kuma.io/origin': 'zone',
            'kuma.io/zone': zoneLabelFilter ?? fake.helpers.arrayElement(['zone1', 'zone2', 'zone3']),
          },
        }
      }),
    },
  }
}
```

### Pattern 4 — Conditional optional fields

Use spread with `fake.datatype.boolean()` for fields that are genuinely optional in the schema:

```typescript
return {
  name,
  ...(fake.datatype.boolean() && {
    metadata: {
      region: fake.helpers.arrayElement(['us-east', 'eu-west', 'ap-south']),
      tags: [fake.word.noun(), fake.word.noun()],
    },
  }),
}
```

### Pattern 5 — Conditional response format

Use query parameters or env vars to vary the response shape:

```typescript
const format = req.url.searchParams.get('format') ?? env('DEFAULT_FORMAT', 'json')

return {
  name,
  ...(format === 'extended' && {
    details: {
      description: fake.lorem.sentence(),
      version: fake.system.semver(),
    },
  }),
}
```

## Registering in `fs.ts`

After creating the file, add an import and register it in `mocks/fs.ts`. Follow the existing numbering convention for the import variable name:

```typescript
// mocks/fs.ts
import _202 from './src/users'
import _203 from './src/users/_'
```

The `fs.ts` file also contains the URL→handler mapping. Follow the existing patterns to wire up the new import.

## Development Process

1. **Find the endpoint** in the OpenAPI spec — note the path, method, path parameters, query parameters, and response schema
2. **Determine the file path** — mirror the URL, replace dynamic segments with `_`
3. **Extract the response type** from `paths['/...']['get']['responses']['200']['content']['application/json']` or `components['responses']['...']` / `components['schemas']['...']`
4. **Write the mock** — randomise every field with `fake`, use `env` + `pager` for lists
5. **Register in `fs.ts`**
6. **Add env var to `Env.ts`** if you introduced a new count/flag variable
