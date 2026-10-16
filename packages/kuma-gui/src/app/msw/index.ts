import { token } from '@kumahq/container'
import { setupWorker } from 'msw/browser'

import type { Token, ServiceDefinition } from '@kumahq/container'
import type { SetupWorker } from 'msw/browser'

type Handler = Parameters<typeof setupWorker>[0]
type Passthrough = (req: Request) => boolean | void

type Msw = ReturnType<SetupWorker['start']>

const $ = {
  msw: token<Msw>('msw'),
  mswHandlers: token('msw.handlers'),
  mswPassthroughs: token('msw.passthroughs'),
}
export const TOKENS = $
const passthroughExtension = /\.(vue|ts|js|json)(\?.*)?$/
export const services = (_: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('msw.passthrough.msw'), {
      service: () => [(req: Request) => {
        const { pathname, href } = new URL(req.url)
        if (
          pathname.startsWith('/node_modules') ||
          pathname.startsWith('/src/assets/') ||
          passthroughExtension.test(href)
        ) {
          return true
        }
      }],
      labels: [
        $.mswPassthroughs,
      ],
    }],
    [$.msw, {
      service: (handlers: Handler[] = [], passthroughs: Passthrough[]) => {
        return setupWorker(...handlers).start({
          quiet: true,
          onUnhandledFrame({ frame, defaults }) {
            if (frame.protocol !== 'http') {
              defaults.warn()
              return
            }
            const req = (frame.data as { request: Request }).request
            if (!passthroughs.some((passthrough) => passthrough(req))) {
              defaults.warn()
            }
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
