import GithubButton from 'vue-github-button'

import AppErrorMessage from '@/app/AppErrorMessage.vue'
import AppHeader from '@/app/AppHeader.vue'
import MainView from '@/app/application/components/app-view/MainView.vue'
import AppLoadingBar from '@/app/AppLoadingBar.vue'
import AppOnboardingNotification from '@/app/AppOnboardingNotification.vue'
import AppSidebar from '@/app/AppSidebar.vue'
import KumaLogo from '@/app/common/KumaLogo.vue'
import OverviewCharts from '@/app/main-overview/components/OverviewCharts.vue'
import NotificationManager from '@/app/notification-manager/components/NotificationManager.vue'
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
  AppLoadingBar: constant(AppLoadingBar, { description: 'AppLoadingBar' }),
  AppErrorMessage: constant(AppErrorMessage, { description: 'AppErrorMessage' }),
  NotificationManager: constant(NotificationManager, { description: 'NotificationManager' }),
  AppOnboardingNotification: constant(AppOnboardingNotification, { description: 'AppOnboardingNotification' }),
  MainView: constant(MainView, { description: 'MainView' }),
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
  useAppLoadingBar,
  useAppErrorMessage,
  useNotificationManager,
  useAppOnboardingNotification,
  useMainView,
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
  TOKENS.AppLoadingBar,
  TOKENS.AppErrorMessage,
  TOKENS.NotificationManager,
  TOKENS.AppOnboardingNotification,
  TOKENS.MainView,
)
