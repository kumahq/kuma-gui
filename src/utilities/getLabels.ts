import { LabelValue } from '@/types/index.d'

export function getLabels(labels: Record<string, string> | null | undefined): LabelValue[] {
  return Object.entries(labels ?? {}).map(([label, value]) => ({ label, value }))
}
