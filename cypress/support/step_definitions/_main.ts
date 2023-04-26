import { TOKENS, services as e2e } from '../services'
import { TOKENS as DEV_TOKENS, services as development } from '@/services/development'
import { build } from '@/services/utils'

(async () => {
  const $ = {
    ...DEV_TOKENS,
    ...TOKENS,
  }
  build(
    development($),
    e2e($),
  )
})()
