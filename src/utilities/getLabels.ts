import type { LabelValue, Tags } from '@/types/index.d'

export function getLabels(labels: Tags | null | undefined): LabelValue[] {
  return Object.entries(labels ?? {}).map(([label, value]) => ({ label, value }))
}
