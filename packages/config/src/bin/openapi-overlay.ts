import $RefParser from '@apidevtools/json-schema-ref-parser'
import { readFileSync as read, existsSync as exists } from 'fs'
import jsYaml, { DEFAULT_SCHEMA, Type } from 'js-yaml'
import openapiFormat from 'openapi-format'
import { dirname, isAbsolute, resolve } from 'path'

import type { OpenAPIOverlayOptions } from 'openapi-format'

const schema = () => {
  const nspace = 'tag:yaml.org,2002'
  return DEFAULT_SCHEMA.extend([
    new Type(`${nspace}:oas-overlay/dereference`, {
      kind: 'scalar',
      construct: (data: any) => {
        return new String(data)
      },
    }),
  ])
}

const YAML = {
  stringify: (json: any) => jsYaml.dump(json, { lineWidth: -1, noRefs: true }),
  parse: (str: string) => jsYaml.load(str, { schema: schema() }),
}

type WalkOptions = {
  onNode?: Record<string, (entry: [string, unknown]) => [string, unknown]>
}

const walk = <T>(obj: T, options: WalkOptions = {}): T => {
  const { onNode = {} } = options
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => walk(item, options)) as T
  }
  return Object.entries(obj).reduce((prev, [key, value]) => {
    const [k, v] = onNode[key] ? onNode[key]([key, value]) : [key, value]
    prev[k] = walk(v, options)
    return prev
  }, {} as Record<string, unknown>) as T
}

const opts = {
  keepComments: true,
  bundle: false,
}

const __ = process.argv.reduce((prev, flag, i, arr) => {
  const val = () => arr[i + 1]
  switch (true) {
    case flag === '--input':
    case flag === '-i':
      prev.input = val()
      break
  }
  return prev
}, {
  input: '',
});

(async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (__.input.length === 0) {
      throw new Error('Please provide a path with --input path')
    }

    const filepath = resolve(process.cwd(), __.input)
    if (!exists(filepath)) {
      throw new Error(`${filepath} does not exist`)
    }

    const json = YAML.parse(read(filepath, 'utf8'))

    // hide non-overlay `$ref`s by making them "private" with `#$ref`
    const hiddenRefs = walk(json, {
      onNode: {
        '$ref': ([key, value]) => [`${!(value instanceof String) ? '#' : ''}${key}`, String(value)],
      },
    })

    // dereference any remaining non-private refs before applying the overlay
    // hence these $refs are deferenced in the overlay file itself
    const dereferenced = await openapiFormat.parseString(
      YAML.stringify(await $RefParser.dereference(filepath, hiddenRefs, {})),
      opts,
    )

    // unhide the "private" `#$ref` backto `$ref`
    const overlay = walk(dereferenced, {
      onNode: {
        '#$ref': ([key, value]) => [`${key.substring(1)}`, String(value)],
      },
    })

    const baseDir = dirname(resolve(filepath))
    const oas = await openapiFormat.parseFile(
      isAbsolute(overlay.extends) ? overlay.extends : resolve(baseDir, overlay.extends),
      opts,
    )

    const res = await openapiFormat.openapiOverlay(oas, {
      overlaySet: overlay as OpenAPIOverlayOptions['overlaySet'],
    })

    const output = YAML.stringify(res.data)
    // eslint-disable-next-line no-console
    console.log(output)
  } catch (e) {
    // passthrough for now
    throw e
  }
})()

