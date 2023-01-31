import { service, createInjections } from '@/services/utils'
import KumaLogo from '@/app/common/KumaLogo.vue'
import OverviewCharts from '@/app/main-overview/components/OverviewCharts.vue'
import GithubButton from 'vue-github-button'

export const TOKENS = {
  KumaLogo: service(() => KumaLogo, { description: 'KumaLogo' }),
  GithubButton: service(() => GithubButton, { description: 'GithubButton' }),
  OverviewCharts: service(() => OverviewCharts, { description: 'OverviewCharts' }),
}
export const [
  useKumaLogo,
  useGithubButton,
  useOverviewCharts,
] = createInjections(
  TOKENS.KumaLogo,
  TOKENS.GithubButton,
  TOKENS.OverviewCharts,
)
