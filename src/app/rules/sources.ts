import {
  Rule,
  RuleCollection,
} from './data'
import type { DataSourceResponse } from '@/app/application'
import { defineSources, type Source } from '@/app/application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'

export type RuleCollectionSource = DataSourceResponse<RuleCollection>
export const sources = (source: Source, api: KumaApi) => {
  return defineSources({
    '/meshes/:mesh/rules/for/:dataplane': async (params) => {
      return Rule.fromCollection(await api.getDataplaneRules({
        mesh: params.mesh,
        name: params.dataplane,
      }))
    },
  })
}
