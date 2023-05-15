import { TOKENS as DEV_TOKENS, services as development } from '@/services/development'
import { TOKENS, services as e2e } from '@/services/e2e'
import { build, token } from '@/services/utils'

(async () => {
  const $ = {
    // cypress doesn't need i18n but this quietens TS temporarily
    i18n: token('i18n'),
    ...DEV_TOKENS,
    ...TOKENS,
  }
  build(
    development($),
    e2e($),
  )
})()
