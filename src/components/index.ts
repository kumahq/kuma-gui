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
import { constant, createInjections } from '@/services/utils'

export const TOKENS = {
  KumaLogo: constant(KumaLogo, { description: 'KumaLogo' }),
  GithubButton: constant(GithubButton, { description: 'GithubButton' }),
  OverviewCharts: constant(OverviewCharts, { description: 'OverviewCharts' }),
  KubernetesGraph: constant(KubernetesGraph, { description: 'KubernetesGraph' }),
  PostgresGraph: constant(PostgresGraph, { description: 'PostgresGraph' }),
  MemoryGraph: constant(MemoryGraph, { description: 'MemoryGraph' }),
  MultizoneGraph: constant(MultizoneGraph, { description: 'MultizoneGraph' }),
  StandaloneGraph: constant(StandaloneGraph, { description: 'StandaloneGraph' }),
  AppSidebar: constant(AppSidebar, { description: 'AppSidebar' }),
  AppHeader: constant(AppHeader, { description: 'AppHeader' }),
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
