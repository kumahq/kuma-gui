/* eslint-disable */
import { Selector } from "./selector";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** TrafficLog defines log for traffic between dataplanes. */
export interface TrafficLog {
  /** List of selectors to match dataplanes that are sources of traffic. */
  sources: Selector[];
  /** List of selectors to match services that are destinations of traffic. */
  destinations: Selector[];
  /** Configuration of the logging. */
  conf: TrafficLog_Conf | undefined;
}

/** Configuration defines settings of the logging. */
export interface TrafficLog_Conf {
  /** Backend defined in the Mesh entity. */
  backend: string;
}

function createBaseTrafficLog(): TrafficLog {
  return { sources: [], destinations: [], conf: undefined };
}

export const TrafficLog = {
  fromJSON(object: any): TrafficLog {
    return {
      sources: Array.isArray(object?.sources) ? object.sources.map((e: any) => Selector.fromJSON(e)) : [],
      destinations: Array.isArray(object?.destinations)
        ? object.destinations.map((e: any) => Selector.fromJSON(e))
        : [],
      conf: isSet(object.conf) ? TrafficLog_Conf.fromJSON(object.conf) : undefined,
    };
  },

  toJSON(message: TrafficLog): unknown {
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
    message.conf !== undefined && (obj.conf = message.conf ? TrafficLog_Conf.toJSON(message.conf) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficLog>): TrafficLog {
    const message = Object.create(createBaseTrafficLog()) as TrafficLog;
    message.sources = object.sources?.map((e) => Selector.fromPartial(e)) || [];
    message.destinations = object.destinations?.map((e) => Selector.fromPartial(e)) || [];
    message.conf = (object.conf !== undefined && object.conf !== null)
      ? TrafficLog_Conf.fromPartial(object.conf)
      : undefined;
    return message;
  },
};

function createBaseTrafficLog_Conf(): TrafficLog_Conf {
  return { backend: "" };
}

export const TrafficLog_Conf = {
  fromJSON(object: any): TrafficLog_Conf {
    return { backend: isSet(object.backend) ? String(object.backend) : "" };
  },

  toJSON(message: TrafficLog_Conf): unknown {
    const obj: any = {};
    message.backend !== undefined && (obj.backend = message.backend);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficLog_Conf>): TrafficLog_Conf {
    const message = Object.create(createBaseTrafficLog_Conf()) as TrafficLog_Conf;
    message.backend = object.backend ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
