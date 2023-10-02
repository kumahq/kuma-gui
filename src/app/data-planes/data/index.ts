import {
  DataPlaneOverview,
} from '@/types/index.d'

export function parseMTLSData(dataPlaneOverview: DataPlaneOverview) {
  if (dataPlaneOverview.dataplaneInsight === undefined || dataPlaneOverview.dataplaneInsight.mTLS === undefined) {
    return null
  }

  const rawExpDate = new Date(dataPlaneOverview.dataplaneInsight.mTLS.certificateExpirationTime)
  // this prevents any weird date shifting
  const fixedExpDate = new Date(rawExpDate.getTime() + rawExpDate.getTimezoneOffset() * 60000)

  return {
    ...dataPlaneOverview.dataplaneInsight.mTLS,
    certificateExpirationTime: fixedExpDate.toISOString(),
  }
}
