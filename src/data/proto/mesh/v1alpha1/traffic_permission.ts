/* eslint-disable */
import { Selector } from "./selector";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** TrafficPermission defines permission for traffic between dataplanes. */
export interface TrafficPermission {
  /** List of selectors to match dataplanes that are sources of traffic. */
  sources: Selector[];
  /** List of selectors to match services that are destinations of traffic. */
  destinations: Selector[];
}

function createBaseTrafficPermission(): TrafficPermission {
  return { sources: [], destinations: [] };
}

export const TrafficPermission = {
  fromJSON(object: any): TrafficPermission {
    return {
      sources: Array.isArray(object?.sources) ? object.sources.map((e: any) => Selector.fromJSON(e)) : [],
      destinations: Array.isArray(object?.destinations)
        ? object.destinations.map((e: any) => Selector.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TrafficPermission): unknown {
    const obj: any = {};
    if (message.sources) {
      obj.sources = message.sources.map((e) => e ? Selector.toJSON(e) : undefined);
    } else {
      obj.sources = [];
    }
    if (message.destinations) {
      obj.destinations = message.destinations.map((e) => e ? Selector.toJSON(e) : undefined);
    } else {
      obj.destinations = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficPermission>): TrafficPermission {
    const message = Object.create(createBaseTrafficPermission()) as TrafficPermission;
    message.sources = object.sources?.map((e) => Selector.fromPartial(e)) || [];
    message.destinations = object.destinations?.map((e) => Selector.fromPartial(e)) || [];
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;
