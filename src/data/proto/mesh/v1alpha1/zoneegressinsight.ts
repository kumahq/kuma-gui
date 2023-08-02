/* eslint-disable */
import { DiscoverySubscription } from "./dataplane_insight";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** ZoneEgressInsight defines the observed state of a Zone Egress. */
export interface ZoneEgressInsight {
  /** List of ADS subscriptions created by a given Zone Kuma CP. */
  subscriptions: DiscoverySubscription[];
}

function createBaseZoneEgressInsight(): ZoneEgressInsight {
  return { subscriptions: [] };
}

export const ZoneEgressInsight = {
  fromJSON(object: any): ZoneEgressInsight {
    return {
      subscriptions: Array.isArray(object?.subscriptions)
        ? object.subscriptions.map((e: any) => DiscoverySubscription.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ZoneEgressInsight): unknown {
    const obj: any = {};
    if (message.subscriptions) {
      obj.subscriptions = message.subscriptions.map((e) => e ? DiscoverySubscription.toJSON(e) : undefined);
    } else {
      obj.subscriptions = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ZoneEgressInsight>): ZoneEgressInsight {
    const message = Object.create(createBaseZoneEgressInsight()) as ZoneEgressInsight;
    message.subscriptions = object.subscriptions?.map((e) => DiscoverySubscription.fromPartial(e)) || [];
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;
