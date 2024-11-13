import { test as _test } from 'vitest'
export { server } from '@/test-support'

type Writeable<T> = { -readonly [P in keyof T]: Writeable<T[P]> };

const freeze = (obj: any) => {
  Object.keys(obj).forEach(prop => {
    if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
      freeze(obj[prop])
    }
  })
  return Object.freeze(obj)
}

type Transformer<T> = T extends {
  fromObject: infer R
} ? { fromObject: R } : { fromObject: any }

type TestOptions = {
  env?: Record<string, string>
  params?: Record<string, string>
}

export const plugin = <T>(
  transformer: Transformer<T>,
  get: (
    env: Record<string, string>,
    params: Record<string, string>
  ) => Promise<unknown>,
) => {
  type K = ReturnType<typeof transformer['fromObject']>
  type Partial = Parameters<typeof transformer['fromObject']>[0]
  return {
    // vite doesn't seem to let us have a function here so use a fixture object
    // containing a function
    fixture: {
      setup: async (
        fn: (item: Partial) => Partial,
        options: TestOptions = {},
      ): Promise<K> => {
        // recreate the mock/partial from our mocks for every test
        // entirely replacing the env and request params each time i.e. non-merging
        const res = await get(options.env ?? {}, options.params ?? {}) as Writeable<Partial>
        // freeze the result of any setup/mutation so we can make sure our transformers don't overwrite
        const partial = freeze(fn(res)) as Readonly<Partial>
        // return the transformed/augmented object/entity
        return transformer.fromObject(partial)
      },
    },
  }
}
