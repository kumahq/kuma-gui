import escape from 'escape-string-regexp'
import jsonSchemaValidatorPlugin from 'eslint-plugin-json-schema-validator'
import { execSync } from 'node:child_process'
import { readFileSync as read } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Linter } from 'eslint'

const $dir = dirname(fileURLToPath(import.meta.url))

type DependencyKey = 'dependencies' | 'devDependencies' | 'peerDependencies'

type Options = {
  workspaceRoot?: boolean
  dependencyIgnorePatterns?: Partial<
    Record<DependencyKey, Record<string, unknown>>
  >
  workspaceJSON?: Record<string, unknown>
}
export const npmWorkspaceJSON = () => JSON.parse(execSync('npm query :root').toString()).at(0)
export const defineConfig = ({
  workspaceRoot = false,
  dependencyIgnorePatterns = {},
  workspaceJSON = {},
}: Options = {}): Linter.Config[] => {
  const packageSchema = JSON.parse(read(resolve($dir, 'package.schema.json'), 'utf-8'))
  const workflowSchema = JSON.parse(read(resolve($dir, 'workflow.schema.json'), 'utf-8'))

  // 1. include any ignored version patterns
  ;(['dependencies', 'devDependencies', 'peerDependencies'] as DependencyKey[]).forEach((item) => {
    packageSchema.properties[item].patternProperties = {
      ...packageSchema.properties[item].patternProperties,
      ...dependencyIgnorePatterns[item] ?? {},
    }
  })

  // 2. Take engines from the workspace root and enforce them across all packages
  if(workspaceJSON !== null && typeof workspaceJSON === 'object' && Object.keys(workspaceJSON).length > 0) {
    Object.entries(workspaceJSON?.engines ?? {}).forEach(([key, value]) => {
      packageSchema.definitions[key].pattern = `^${escape(value)}$`
    })
  }

  // 3. Any non-root package.json files shouldn't ever specify `engines`
  if (!workspaceRoot) {
    packageSchema.properties.engines = { not: {} }
  }

  return [
    ...jsonSchemaValidatorPlugin.configs['flat/recommended'],
    {
      rules: {
        'json-schema-validator/no-invalid': ['error', {
          useSchemastoreCatalog: false,
          mergeSchemas: true,
          schemas: [
            {
              fileMatch: ['package.json'],
              // our schema allows for ignoring individual dependencies if required
              // see ./package.schema.json patternProperties examples
              schema: packageSchema,
            },
            {
              fileMatch: ['.github/**/*.{yaml,yml}'],
              schema: workflowSchema,
            },
          ],
        }],
      },
    },
  ]
}
