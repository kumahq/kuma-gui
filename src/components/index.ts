import { service, createInjections } from '@/services/utils'
import KumaLogo from '@/app/common/KumaLogo.vue'
import GithubButton from 'vue-github-button'

export const TOKENS = {
  KumaLogo: service(() => KumaLogo, { description: 'KumaLogo' }),
  GithubButton: service(() => GithubButton, { description: 'GithubButton' }),
}
export const [
  useKumaLogo,
  useGithubButton,
] = createInjections(
  TOKENS.KumaLogo,
  TOKENS.GithubButton,
)
