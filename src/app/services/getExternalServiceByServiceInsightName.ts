import { kumaApi } from '@/api/kumaApi'
import { ExternalService } from '@/types/index.d'

// The following code is a hotfix for https://github.com/kumahq/kuma-gui/issues/599 until we implement the lookup of `ExternalService` resources by `ServiceInsight` name.
export async function getExternalServiceByServiceInsightName(mesh: string, name: string): Promise<ExternalService | null> {
  const { items } = await kumaApi.getAllExternalServicesFromMesh({ mesh })

  if (Array.isArray(items)) {
    const foundExternalService = items.find((externalService) => externalService.tags['kuma.io/service'] === name)

    return foundExternalService ?? null
  } else {
    return null
  }
}
