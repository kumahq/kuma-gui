import GithubButton from 'vue-github-button'

import AppHeader from '@/app/AppHeader.vue'
import AppSidebar from '@/app/AppSidebar.vue'
import KumaLogo from '@/app/common/KumaLogo.vue'
import OverviewCharts from '@/app/main-overview/components/OverviewCharts.vue'
import KubernetesGraph from '@/app/onboarding/components/graphs/KubernetesGraph.vue'
import MemoryGraph from '@/app/onboarding/components/graphs/MemoryGraph.vue'
import MultizoneGraph from '@/app/onboarding/components/graphs/MultizoneGraph.vue'
import PostgresGraph from '@/app/onboarding/components/graphs/PostgresGraph.vue'
import StandaloneGraph from '@/app/onboarding/components/graphs/StandaloneGraph.vue'
import { service, createInjections } from '@/services/utils'

export const TOKENS = {
  KumaLogo: service(() => KumaLogo, { description: 'KumaLogo' }),
  GithubButton: service(() => GithubButton, { description: 'GithubButton' }),
  OverviewCharts: service(() => OverviewCharts, { description: 'OverviewCharts' }),
  KubernetesGraph: service(() => KubernetesGraph, { description: 'KubernetesGraph' }),
  PostgresGraph: service(() => PostgresGraph, { description: 'PostgresGraph' }),
  MemoryGraph: service(() => MemoryGraph, { description: 'MemoryGraph' }),
  MultizoneGraph: service(() => MultizoneGraph, { description: 'MultizoneGraph' }),
  StandaloneGraph: service(() => StandaloneGraph, { description: 'StandaloneGraph' }),
  AppSidebar: service(() => AppSidebar, { description: 'AppSidebar' }),
  AppHeader: service(() => AppHeader, { description: 'AppHeader' }),
}
export const [
  useKumaLogo,
  useGithubButton,
  useOverviewCharts,
  useKubernetesGraph,
  usePostgresGraph,
  useMemoryGraph,
  useMultizoneGraph,
  useStandaloneGraph,
  useAppSidebar,
  useAppHeader,
] = createInjections(
  TOKENS.KumaLogo,
  TOKENS.GithubButton,
  TOKENS.OverviewCharts,
  TOKENS.KubernetesGraph,
  TOKENS.PostgresGraph,
  TOKENS.MemoryGraph,
  TOKENS.MultizoneGraph,
  TOKENS.StandaloneGraph,
  TOKENS.AppSidebar,
  TOKENS.AppHeader,
)
