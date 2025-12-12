# kuma-http-api

Typescript types for `kumahq/kuma`.

** Please note: These types are not published to a registry and are used for
`kumahq/kuma-gui` only **

## OpenAPI Overlays

Importantly we make some amends to the upstream Kuma OpenAPI spec to reflect
reality, i.e. upstream kuma uses go protobufs which eventually create
timestamps as date-like, whereas they actually come over in HTTP responses as
strings, enums can be `string | integer` but come over in HTTP responses as
strings.

Additionally we provide separate "request schemas" overlaid ontop of the
upstream spec that copy the original response schemas and apply some amends to
make the request objects more correct from an end user perspective for example:

- readOnly properties are removed
- Certain "immutable" properties are marked as readOnly, for example changing a
`name` property is essentially a create, therefore the `name` property should
be included in these schemas but you shouldn't change it.
- There are a few places where `enums` are "informal oneOf"s i.e. you select a
certain type and then have certain properties depending on the `type`. We turn
these into proper `oneOf`s/discriminated unions.

## Contributing

Please see `make help`, but you probably just want `make build`.

`make types/clean` will re-clone the upstream schema and regenerate everything
from scratch without cleaning your `node_modules` folder.

### Overview

TL;DR the schemas can be rebuilt using `make build`.

Overlays are applied by "filesystem convention" using corresponding `make`
target that knows about the convention.

`make build` splits up the upstream kuma `openapi.yaml` into individual
schemas/paths etc in `./generated`.

It then uses these plus several files in `./src` to generate a `./dist` folder
containing individual files for each resource/schema and paths etc.

Finally these are bundled up before a final `./openapi.overaly.tmpl.yaml` is
overlaid onto it producing the final `./openapi.yaml` file from which a
`index.d.ts` containing a full set of pure Typescript types is produced.

### Overlay/source files

Overlay files should mirror the `./dist` folder structure inside `./src`. So if
an overlay file exists in `./src/Resource.overlay.yaml` it will build a
resulting schema in `./dist/Resource.yaml`.

Any non-overlay files in `./src` will just be copied over into `./dist`.

Any newly create schemas (as opposed to overlaid existing ones) will need
adding/referencing in `./src/openapi.overlay.yaml`

`./dist` ends up being a copy of `./generated` with any files in `./src` copied
or overlaid on-top of it. The final overlay file in
`./openapi.overlay.tmpl.yaml` adds "global amends" plus adds versioning so we
know what version of kuma the specification was generated from.

#### `$ref`s

Standard OpenAPI Overlays do not dereference `$ref`s at "overlay-time", i.e. if
you add a `$ref` to an overlay it remains a `$ref` in the final OpenAPI schema
file.

For "reasons" sometimes we need to dereference `$ref`'s at "overlay-time". This
is done by using a non-standard `!!oas-overlay/dereference` YAML tag:

```yaml
# DOES NOT dereference. This $ref will still be a ref in the resulting schema
$ref: './MeshAccessLogItem.yaml#/properties/spec'

# DOES dereference. This $ref will be deferenced at overlay-time and result in the actual YAML
# structure ending up in the resulting schema
$ref: !!oas-overlay/dereference '../../../generated/components/schemas/MeshAccessLogItem.yaml#/properties/spec'
```

Note: "overlay-time" `$ref`s that you wish to dereference should mostly use the
`generated` source code resolved from the location of the overlay file itself,
whereas non-dereferenced `$ref`s will use the location of the resulting schema
for resolving.


#### Filesystem Summary

- `./generated`: A full set of schemas split up from the upstream kuma OpenAPI
   spec.
- `./src`: Source/overlay files. These are the only files you should be
   editing.
- `./dist`: The resulting full set of overlaid schemas, similar to
  `./generated` but with `./src` applied/overlaid
- `./src/openapi.overlay.yaml`: Acts as a file to include new components/paths.
- `./openapi.overlay.yaml`: Applies "global" amends including version tagging.
- `./openapi.yaml`: The final full OpenAPI spec
- `./index.d.ts`: Types generated from `./openapi.yaml`
