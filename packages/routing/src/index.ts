interface DependencyDefaults {
  can: (...args: any[]) => boolean
  env: (...args: any[]) => string
  i18n: {
    t: (...args: any[]) => string
  }
}

export interface Dependencies extends DependencyDefaults {}
export type Can = Dependencies['can']
export type Env = Dependencies['env']

export * from './utils/dom'
export * from './utils/query'

