import KubernetesGraph from '@/app/onboarding/components/graphs/KubernetesGraph.vue'
import MemoryGraph from '@/app/onboarding/components/graphs/MemoryGraph.vue'
import MultizoneGraph from '@/app/onboarding/components/graphs/MultizoneGraph.vue'
import PostgresGraph from '@/app/onboarding/components/graphs/PostgresGraph.vue'
import StandaloneGraph from '@/app/onboarding/components/graphs/StandaloneGraph.vue'
import { constant, createInjections } from '@/services/utils'

export const TOKENS = {
  KubernetesGraph: constant(KubernetesGraph, { description: 'KubernetesGraph' }),
  PostgresGraph: constant(PostgresGraph, { description: 'PostgresGraph' }),
  MemoryGraph: constant(MemoryGraph, { description: 'MemoryGraph' }),
  MultizoneGraph: constant(MultizoneGraph, { description: 'MultizoneGraph' }),
  StandaloneGraph: constant(StandaloneGraph, { description: 'StandaloneGraph' }),
}
export const [
  useKubernetesGraph,
  usePostgresGraph,
  useMemoryGraph,
  useMultizoneGraph,
  useStandaloneGraph,
] = createInjections(
  TOKENS.KubernetesGraph,
  TOKENS.PostgresGraph,
  TOKENS.MemoryGraph,
  TOKENS.MultizoneGraph,
  TOKENS.StandaloneGraph,
)
