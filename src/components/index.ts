import { service, createInjections } from '@/services/utils'
import KumaLogo from '@/app/common/KumaLogo.vue'
import OverviewCharts from '@/app/main-overview/components/OverviewCharts.vue'
import GithubButton from 'vue-github-button'
import WelcomeAnimationSvg from '@/app/onboarding/components/WelcomeAnimationSvg.vue'
import KubernetesGraph from '@/app/onboarding/components/graphs/KubernetesGraph.vue'
import PostgresGraph from '@/app/onboarding/components/graphs/PostgresGraph.vue'
import MemoryGraph from '@/app/onboarding/components/graphs/MemoryGraph.vue'
import MultizoneGraph from '@/app/onboarding/components/graphs/MultizoneGraph.vue'
import StandaloneGraph from '@/app/onboarding/components/graphs/StandaloneGraph.vue'

export const TOKENS = {
  KumaLogo: service(() => KumaLogo, { description: 'KumaLogo' }),
  GithubButton: service(() => GithubButton, { description: 'GithubButton' }),
  OverviewCharts: service(() => OverviewCharts, { description: 'OverviewCharts' }),
  WelcomeAnimationSvg: service(() => WelcomeAnimationSvg, { description: 'WelcomeAnimationSvg' }),
  KubernetesGraph: service(() => KubernetesGraph, { description: 'KubernetesGraph' }),
  PostgresGraph: service(() => PostgresGraph, { description: 'PostgresGraph' }),
  MemoryGraph: service(() => MemoryGraph, { description: 'MemoryGraph' }),
  MultizoneGraph: service(() => MultizoneGraph, { description: 'MultizoneGraph' }),
  StandaloneGraph: service(() => StandaloneGraph, { description: 'StandaloneGraph' }),
}
export const [
  useKumaLogo,
  useGithubButton,
  useOverviewCharts,
  useWelcomeAnimationSvg,
  useKubernetesGraph,
  usePostgresGraph,
  useMemoryGraph,
  useMultizoneGraph,
  useStandaloneGraph,
] = createInjections(
  TOKENS.KumaLogo,
  TOKENS.GithubButton,
  TOKENS.OverviewCharts,
  TOKENS.WelcomeAnimationSvg,
  TOKENS.KubernetesGraph,
  TOKENS.PostgresGraph,
  TOKENS.MemoryGraph,
  TOKENS.MultizoneGraph,
  TOKENS.StandaloneGraph,
)
