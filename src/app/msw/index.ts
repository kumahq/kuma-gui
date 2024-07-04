import { setupWorker } from 'msw/browser'

import { token } from '@/services/utils'
import type { Token, ServiceDefinition } from '@/services/utils'
import type { SetupWorker } from 'msw/browser'

type Handler = Parameters<typeof setupWorker>[0]
type Passthrough = (req: Request) => string | string[] | void

type Msw = ReturnType<SetupWorker['start']>

const $ = {
  msw: token<Msw>('msw'),
  mswHandlers: token('msw.handlers'),
  mswPassthroughs: token('msw.passthroughs'),
}
export const TOKENS = $
export const services = (_: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('msw.passthrough.msw'), {
      service: () => [(req: Request) => {
        const { pathname, href } = new URL(req.url)
        if (
          pathname.startsWith('/@fs') ||
          pathname.startsWith('/node_modules') ||
          pathname.startsWith('/src/assets') ||
          href.match(/\.(vue|ts|js|json)(\?.*)?$/)
        ) {
          return `Found an unhandled ${req.method} request to ${href}`
        }
      }],
      labels: [
        $.mswPassthroughs,
      ],
    },
    ],
    [$.msw, {
      service: (handlers: Handler[] = [], passthroughs: Passthrough[]) => {
        console.warn(
          '%c ✨You are mocking api requests.',
          'background: gray; color: white; display: block; padding: 0.25rem;',
        )
        return setupWorker(...handlers).start({
          quiet: true,
          onUnhandledRequest(req: Request) {
            passthroughs.reduce<string[]>((prev, item) => prev.concat(item(req) ?? []), []).forEach(item => {
              console.warn(item)
            })
          },
        })
      },
      arguments: [
        $.mswHandlers,
        $.mswPassthroughs,
      ],
    }],
  ]
}
