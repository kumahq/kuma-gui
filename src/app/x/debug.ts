import XCopyButtonDebug from './components/x-copy-button/XCopyButtonDebug.vue'
import type { ServiceDefinition, Token } from '@/services/utils'
import { token } from '@/services/utils'
import type { Component } from 'vue'

export const services = (app: Record<string, Token>): ServiceDefinition[] => [
  [token('development.components'), {
    service: (orig: () => [string, Component][]) => {
      const components = orig()
      const copyButton = components.find(([key, _]) => key === 'XCopyButton')
      if (copyButton && typeof copyButton[1] !== 'undefined') {
        copyButton[1] = XCopyButtonDebug
      }
      return components
    },
    decorates: app.xVueComponents,
  }],
]
