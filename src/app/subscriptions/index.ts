import type { ServiceDefinition, token } from '@/services/utils'

type Token = ReturnType<typeof token>

export const services = (_app: Record<string, Token>): ServiceDefinition[] => {
  return [
  ]
}
