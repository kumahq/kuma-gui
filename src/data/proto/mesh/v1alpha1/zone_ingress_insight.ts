/* eslint-disable */
import { DiscoverySubscription } from "./dataplane_insight";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** ZoneIngressInsight defines the observed state of a Zone Ingress. */
export interface ZoneIngressInsight {
  /** List of ADS subscriptions created by a given Zone Kuma CP. */
  subscriptions: DiscoverySubscription[];
}

function createBaseZoneIngressInsight(): ZoneIngressInsight {
  return { subscriptions: [] };
}

export const ZoneIngressInsight = {
  fromJSON(object: any): ZoneIngressInsight {
    return {
      subscriptions: Array.isArray(object?.subscriptions)
        ? object.subscriptions.map((e: any) => DiscoverySubscription.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ZoneIngressInsight): unknown {
    const obj: any = {};
    if (message.subscriptions) {
      obj.subscriptions = message.subscriptions.map((e) => e ? DiscoverySubscription.toJSON(e) : undefined);
    } else {
      obj.subscriptions = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ZoneIngressInsight>): ZoneIngressInsight {
    const message = Object.create(createBaseZoneIngressInsight()) as ZoneIngressInsight;
    message.subscriptions = object.subscriptions?.map((e) => DiscoverySubscription.fromPartial(e)) || [];
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;
