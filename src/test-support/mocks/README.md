# HTTP API Mocks

Our HTTP API mocks consist of a bunch of 'generator' functions, each in a
separate file on the filesystem, essentially modelling the HTTP API onto the
filesystem.

The mocks are used in several environments:

- During development in a browser via MockServiceWorker
- During CLI testing in a CLI via MockServiceWorker
- During browser testing in a browser via Cypress
- ...potentially more

## Creating new mocked API endpoints

### Getting started

All Kuma HTTP API endpoints are mapped to the filesystem under the `src/`
folder. For example the endpoint for `http://localhost:5681/config` is at
`src/config.ts`. There is a [`fs.ts`](./fs.ts) file that then maps the
filesystem to enable access in browser contexts. This `fs.ts` file needs to be
manually updated when adding a mock (there will eventually be a script to do
this for you)

An endpoint mock file must be a typescript file that contains a default export
like the following:

```typescript
import type { EndpointDependencies, MockResponder } from '@/test-support'
export default (deps: EndpointDependencies): MockResponder => (req) => {
  return {
    headers: {
    },
    body: {
    },
  }
}
```

**TLDR; Copy/pasta the above code, throw your response into the `body` property
above, save the file to the correct place in the filesystem and update the
`fs.ts` file accordingly, and you should be good to go**

(Support will be added at a later date to be able to add simple JSON files)

If an endpoint includes a dynamic path segment (most do) such as
`/meshes/default/dataplanes/_overview`. This would equate to a 'route string' of
`/meshes/:mesh/dataplanes/_overview`, and a file system path of
`/meshes/_/dataplanes/_overview`.

**In other words, replace any dynamic path segments in the URL/route with a `_`.
This `_` could either be a folder as in `/meshes/_/dataplanes/_overview` or a
file as in `/meshes/_.ts`.**

`headers` are the HTTP headers to use for the response, and these are usually
kept empty. By default this will mean the response will respond with a 200 HTTP
status code. In order to send a different status code use a HTTP `Status-Code`
header:

```typescript
import type { EndpointDependencies, MockResponder } from '@/test-support'
export default (deps: EndpointDependencies): MockResponder => (req) => {
  return {
    headers: {
      'Status-Code': '500'
    },
    body: {
    },
  }
}
```

If you need to add more HTTP headers you can add them to this `headers` object.

`body` is the HTTP response body and is usually a JSON object (but occasionally
a string). The following shows a simple HTTP API response:

```typescript
import type { EndpointDependencies, MockResponder } from '@/test-support'
export default (_deps: EndpointDependencies): MockResponder => (_req) => {
  return {
    headers: {
    },
    body: {
      hostname: 'control-plane-5d94cb99c6-rzr96',
      tagline: 'kuma',
      version: '1.7.1',
      basedOnKuma: '1.7.1',
      instanceId: 'control-plane-5d94cb99c6-rzr96-ca19',
      clusterId: 'b3c42481-0681-4da7-a276-c1fd4ed3c7a1',
      gui: 'The gui is available at /gui',
    },
  }
}
```

A more complicated example can be seen at [./src/meshes/_/dataplanes/_overview.ts](./src/meshes/_/dataplanes/_overview.ts)

The idea behind the approach is based on a traditional template engine and a set
of JSON templates. The JSON templates also have access to a collection of helper
functions and variables to enable you to create dynamic responses that help us
create a mocked HTTP API that covers as many scenarios as possible.

This idea of a 'template engine' model should be considered when adding anything
to the approach. i.e. we should avoid using `import` for adding new helpers and
instead add new helpers globally, either via the EndpointDependencies or
`fake.kuma`. This way every single template has the same helpers available to
it.

### Using the helpers and variables

The JSON templates have two separate sets of arguments, the
`EndpointDependencies` (i.e. the template helpers) and `req: Request` (i.e. the
template variables).

Each template file/HTTP API endpoint mock should contain all the variations we
need to view/preview the application during development. When testing functions
are provided to allow you to change the response during test setup. To be clear
you should not write the mock file to tailor the response for a test. It should
be tailored to give us the necessary variations for previewing during
development.

Both helpers and variables are still in a state of flux, and therefore this
documentation may not be entirely complete, if you see that this documentation
has fallen behind the actual usage, then please submit a PR updating these docs.

#### Helpers

At the time of writing the `EndpointDependencies`/Helpers are:

- `fake`: A helper object consisting of a slightly 'kuma-enhanced' faker-js object
- `pager`: A helper function for centralizing the very common paging logic
- `env`: A helper function for accessing "environment variables"

For `fake` the majority of the documentation can be found at
<https://fakerjs.dev/api/>. `fake` is used to help us generate massive amounts
of fake data. Aswell as the default [documented fake helpers](https://fakerjs.dev/api/),
we have an additional `fake.kuma` helper which contains helpers to generate fake
data that is tailored to a Kuma context i.e. generate a random protocol via
`fake.kuma.protocol()`. For the moment these are not documented but take a look
at [`FakeKuma`](../FakeKuma.ts). Kuma helpers should be kept simple and as
reusable as possible, which should err against adding tonnes of them. Additional
Kuma helpers should be properly considered during review (i.e are they
necessary? are they generic enough? etc).

`pager` usage can be seen in [./src/meshes/_/circuit-breakers.ts](./src/meshes/_/circuit-breakers.ts)
or any paged HTTP API response.

`env` is similiar to the `env` helper function that we use in the application
itself, but we have additional flags that we can use to control simple things to
aid testing such as 'counts of things'. For example setting
`KUMA_DATAPLANE_COUNT` to `"1"` during testing, or by setting a browser cookie
with this Key/Value during development or when viewing the preview site will
make the mocks only ever produce one single dataplane. Setting to `"0"` means
you can easily view empty states.

#### Variables

At the time of writing the `req:Request` variables consist of:

- `req.params`: an object containing the parameters from any dynamic URL
    segments i.e. `/meshes/:mesh/dataplanes/:name` > `{mesh: 'default', name:
    'dp-name'}`
- `req.url.searchParams`: A [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/get)
    object for access to anything from the requests query parameters.

These are highly likely to change shape slightly ^ at some point in a future
refactor. They loosely follow MockServiceWorkers `RestRequest` type
