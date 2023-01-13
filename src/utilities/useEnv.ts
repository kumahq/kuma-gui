import container from '@/services/container'
import type { EnvVars } from '@/services/env'

export const useEnv = () => {
  return (key: keyof EnvVars) => {
    return container.get('env').var(key)
  }
}
