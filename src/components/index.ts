import GithubButton from 'vue-github-button'

import AppHeader from '@/app/AppHeader.vue'
import MainView from '@/app/application/components/app-view/MainView.vue'
import AppLoadingBar from '@/app/AppLoadingBar.vue'
import AppOnboardingNotification from '@/app/AppOnboardingNotification.vue'
import AppSidebar from '@/app/AppSidebar.vue'
import KumaLogo from '@/app/common/KumaLogo.vue'
import MainOverview from '@/app/main-overview/components/MainOverview.vue'
import MeshDetails from '@/app/meshes/components/MeshDetails.vue'
import KubernetesGraph from '@/app/onboarding/components/graphs/KubernetesGraph.vue'
import MemoryGraph from '@/app/onboarding/components/graphs/MemoryGraph.vue'
import MultizoneGraph from '@/app/onboarding/components/graphs/MultizoneGraph.vue'
import PostgresGraph from '@/app/onboarding/components/graphs/PostgresGraph.vue'
import StandaloneGraph from '@/app/onboarding/components/graphs/StandaloneGraph.vue'
import { constant, createInjections } from '@/services/utils'

export const TOKENS = {
  KumaLogo: constant(KumaLogo, { description: 'KumaLogo' }),
  GithubButton: constant(GithubButton, { description: 'GithubButton' }),
  MainOverview: constant(MainOverview, { description: 'MainOverview' }),
  KubernetesGraph: constant(KubernetesGraph, { description: 'KubernetesGraph' }),
  PostgresGraph: constant(PostgresGraph, { description: 'PostgresGraph' }),
  MemoryGraph: constant(MemoryGraph, { description: 'MemoryGraph' }),
  MultizoneGraph: constant(MultizoneGraph, { description: 'MultizoneGraph' }),
  StandaloneGraph: constant(StandaloneGraph, { description: 'StandaloneGraph' }),
  AppSidebar: constant(AppSidebar, { description: 'AppSidebar' }),
  AppHeader: constant(AppHeader, { description: 'AppHeader' }),
  AppLoadingBar: constant(AppLoadingBar, { description: 'AppLoadingBar' }),
  AppOnboardingNotification: constant(AppOnboardingNotification, { description: 'AppOnboardingNotification' }),
  MainView: constant(MainView, { description: 'MainView' }),
  MeshDetails: constant(MeshDetails, { description: 'MeshDetails' }),
}
export const [
  useKumaLogo,
  useGithubButton,
  useMainOverview,
  useKubernetesGraph,
  usePostgresGraph,
  useMemoryGraph,
  useMultizoneGraph,
  useStandaloneGraph,
  useAppSidebar,
  useAppHeader,
  useAppLoadingBar,
  useAppOnboardingNotification,
  useMainView,
  useMeshDetails,
] = createInjections(
  TOKENS.KumaLogo,
  TOKENS.GithubButton,
  TOKENS.MainOverview,
  TOKENS.KubernetesGraph,
  TOKENS.PostgresGraph,
  TOKENS.MemoryGraph,
  TOKENS.MultizoneGraph,
  TOKENS.StandaloneGraph,
  TOKENS.AppSidebar,
  TOKENS.AppHeader,
  TOKENS.AppLoadingBar,
  TOKENS.AppOnboardingNotification,
  TOKENS.MainView,
  TOKENS.MeshDetails,
)
