import { DataplaneNetworking } from './DataplaneNetworking'
import type {
  DataPlane as PartialDataplane,
} from '@/types/index.d'
export type Dataplane = PartialDataplane & {
  config: PartialDataplane
  networking: DataplaneNetworking
}
export const Dataplane = {
  fromObject(partialDataplane: PartialDataplane): Dataplane {
    return {
      ...partialDataplane,
      config: partialDataplane,
      networking: DataplaneNetworking.fromObject(partialDataplane.networking),
    }
  },
}
