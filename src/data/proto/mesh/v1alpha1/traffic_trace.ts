/* eslint-disable */
import { Selector } from "./selector";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** TrafficTrace defines trace configuration for selected dataplanes. */
export interface TrafficTrace {
  /** List of selectors to match dataplanes. */
  selectors: Selector[];
  /** Configuration of the tracing. */
  conf: TrafficTrace_Conf | undefined;
}

/** Configuration defines settings of the tracing. */
export interface TrafficTrace_Conf {
  /** Backend defined in the Mesh entity. */
  backend: string;
}

function createBaseTrafficTrace(): TrafficTrace {
  return { selectors: [], conf: undefined };
}

export const TrafficTrace = {
  fromJSON(object: any): TrafficTrace {
    return {
      selectors: Array.isArray(object?.selectors) ? object.selectors.map((e: any) => Selector.fromJSON(e)) : [],
      conf: isSet(object.conf) ? TrafficTrace_Conf.fromJSON(object.conf) : undefined,
    };
  },

  toJSON(message: TrafficTrace): unknown {
    const obj: any = {};
    if (message.selectors) {
      obj.selectors = message.selectors.map((e) => e ? Selector.toJSON(e) : undefined);
    } else {
      obj.selectors = [];
    }
    message.conf !== undefined && (obj.conf = message.conf ? TrafficTrace_Conf.toJSON(message.conf) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficTrace>): TrafficTrace {
    const message = Object.create(createBaseTrafficTrace()) as TrafficTrace;
    message.selectors = object.selectors?.map((e) => Selector.fromPartial(e)) || [];
    message.conf = (object.conf !== undefined && object.conf !== null)
      ? TrafficTrace_Conf.fromPartial(object.conf)
      : undefined;
    return message;
  },
};

function createBaseTrafficTrace_Conf(): TrafficTrace_Conf {
  return { backend: "" };
}

export const TrafficTrace_Conf = {
  fromJSON(object: any): TrafficTrace_Conf {
    return { backend: isSet(object.backend) ? String(object.backend) : "" };
  },

  toJSON(message: TrafficTrace_Conf): unknown {
    const obj: any = {};
    message.backend !== undefined && (obj.backend = message.backend);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficTrace_Conf>): TrafficTrace_Conf {
    const message = Object.create(createBaseTrafficTrace_Conf()) as TrafficTrace_Conf;
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
