import { TOKENS as DEV_TOKENS, services as development } from '@/services/development'
import { TOKENS as E2E_TOKENS, services as e2e } from '@/services/e2e'
import { build } from '@/services/utils'

/**
 * Note: This service *should* be constructed with the chain "production + development + e2e" (for the token creation and the service build call). However, our Cypress setup currently doesn’t handle .vue files (discovered via the routes service) and the way to “solve” this is for our tests is to not include the production service. That makes it necessary to use `@ts-ignore` below as the types expect the tokens from the production service that are missing here.
 */

(async () => {
  const $ = {
    ...DEV_TOKENS,
    ...E2E_TOKENS,
  }
  build(
    // @ts-ignore
    development($),
    // @ts-ignore
    e2e($),
  )
})()
