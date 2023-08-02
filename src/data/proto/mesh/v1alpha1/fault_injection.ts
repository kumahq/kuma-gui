/* eslint-disable */
import { Duration } from "../../google/protobuf/duration";
import { Selector } from "./selector";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** FaultInjection defines the configuration of faults between dataplanes. */
export interface FaultInjection {
  /** List of selectors to match dataplanes that are sources of traffic. */
  sources: Selector[];
  /** List of selectors to match services that are destinations of traffic. */
  destinations: Selector[];
  /** Configuration of FaultInjection */
  conf: FaultInjection_Conf | undefined;
}

/**
 * Conf defines several types of faults, at least one fault should be
 * specified
 */
export interface FaultInjection_Conf {
  /**
   * Delay if specified then response from the destination will be delivered
   * with a delay
   */
  delay:
    | FaultInjection_Conf_Delay
    | undefined;
  /** Abort if specified makes source side to receive specified httpStatus code */
  abort:
    | FaultInjection_Conf_Abort
    | undefined;
  /** ResponseBandwidth if specified limits the speed of sending response body */
  responseBandwidth: FaultInjection_Conf_ResponseBandwidth | undefined;
}

/** Delay defines configuration of delaying a response from a destination */
export interface FaultInjection_Conf_Delay {
  /**
   * Percentage of requests on which delay will be injected, has to be in
   * [0.0 - 100.0] range
   */
  percentage:
    | number
    | undefined;
  /** The duration during which the response will be delayed */
  value: Duration | undefined;
}

/**
 * Abort defines a configuration of not delivering requests to destination
 * service and replacing the responses from destination dataplane by
 * predefined status code
 */
export interface FaultInjection_Conf_Abort {
  /**
   * Percentage of requests on which abort will be injected, has to be in
   * [0.0 - 100.0] range
   */
  percentage:
    | number
    | undefined;
  /** HTTP status code which will be returned to source side */
  httpStatus: number | undefined;
}

/**
 * ResponseBandwidth defines a configuration to limit the speed of
 * responding to the requests
 */
export interface FaultInjection_Conf_ResponseBandwidth {
  /**
   * Percentage of requests on which response bandwidth limit will be
   * injected, has to be in [0.0 - 100.0] range
   */
  percentage:
    | number
    | undefined;
  /**
   * Limit is represented by value measure in gbps, mbps, kbps or bps, e.g.
   * 10kbps
   */
  limit: string | undefined;
}

function createBaseFaultInjection(): FaultInjection {
  return { sources: [], destinations: [], conf: undefined };
}

export const FaultInjection = {
  fromJSON(object: any): FaultInjection {
    return {
      sources: Array.isArray(object?.sources) ? object.sources.map((e: any) => Selector.fromJSON(e)) : [],
      destinations: Array.isArray(object?.destinations)
        ? object.destinations.map((e: any) => Selector.fromJSON(e))
        : [],
      conf: isSet(object.conf) ? FaultInjection_Conf.fromJSON(object.conf) : undefined,
    };
  },

  toJSON(message: FaultInjection): unknown {
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
    message.conf !== undefined && (obj.conf = message.conf ? FaultInjection_Conf.toJSON(message.conf) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<FaultInjection>): FaultInjection {
    const message = Object.create(createBaseFaultInjection()) as FaultInjection;
    message.sources = object.sources?.map((e) => Selector.fromPartial(e)) || [];
    message.destinations = object.destinations?.map((e) => Selector.fromPartial(e)) || [];
    message.conf = (object.conf !== undefined && object.conf !== null)
      ? FaultInjection_Conf.fromPartial(object.conf)
      : undefined;
    return message;
  },
};

function createBaseFaultInjection_Conf(): FaultInjection_Conf {
  return { delay: undefined, abort: undefined, responseBandwidth: undefined };
}

export const FaultInjection_Conf = {
  fromJSON(object: any): FaultInjection_Conf {
    return {
      delay: isSet(object.delay) ? FaultInjection_Conf_Delay.fromJSON(object.delay) : undefined,
      abort: isSet(object.abort) ? FaultInjection_Conf_Abort.fromJSON(object.abort) : undefined,
      responseBandwidth: isSet(object.responseBandwidth)
        ? FaultInjection_Conf_ResponseBandwidth.fromJSON(object.responseBandwidth)
        : undefined,
    };
  },

  toJSON(message: FaultInjection_Conf): unknown {
    const obj: any = {};
    message.delay !== undefined &&
      (obj.delay = message.delay ? FaultInjection_Conf_Delay.toJSON(message.delay) : undefined);
    message.abort !== undefined &&
      (obj.abort = message.abort ? FaultInjection_Conf_Abort.toJSON(message.abort) : undefined);
    message.responseBandwidth !== undefined && (obj.responseBandwidth = message.responseBandwidth
      ? FaultInjection_Conf_ResponseBandwidth.toJSON(message.responseBandwidth)
      : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<FaultInjection_Conf>): FaultInjection_Conf {
    const message = Object.create(createBaseFaultInjection_Conf()) as FaultInjection_Conf;
    message.delay = (object.delay !== undefined && object.delay !== null)
      ? FaultInjection_Conf_Delay.fromPartial(object.delay)
      : undefined;
    message.abort = (object.abort !== undefined && object.abort !== null)
      ? FaultInjection_Conf_Abort.fromPartial(object.abort)
      : undefined;
    message.responseBandwidth = (object.responseBandwidth !== undefined && object.responseBandwidth !== null)
      ? FaultInjection_Conf_ResponseBandwidth.fromPartial(object.responseBandwidth)
      : undefined;
    return message;
  },
};

function createBaseFaultInjection_Conf_Delay(): FaultInjection_Conf_Delay {
  return { percentage: undefined, value: undefined };
}

export const FaultInjection_Conf_Delay = {
  fromJSON(object: any): FaultInjection_Conf_Delay {
    return {
      percentage: isSet(object.percentage) ? Number(object.percentage) : undefined,
      value: isSet(object.value) ? Duration.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: FaultInjection_Conf_Delay): unknown {
    const obj: any = {};
    message.percentage !== undefined && (obj.percentage = message.percentage);
    message.value !== undefined && (obj.value = message.value ? Duration.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<FaultInjection_Conf_Delay>): FaultInjection_Conf_Delay {
    const message = Object.create(createBaseFaultInjection_Conf_Delay()) as FaultInjection_Conf_Delay;
    message.percentage = object.percentage ?? undefined;
    message.value = (object.value !== undefined && object.value !== null)
      ? Duration.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseFaultInjection_Conf_Abort(): FaultInjection_Conf_Abort {
  return { percentage: undefined, httpStatus: undefined };
}

export const FaultInjection_Conf_Abort = {
  fromJSON(object: any): FaultInjection_Conf_Abort {
    return {
      percentage: isSet(object.percentage) ? Number(object.percentage) : undefined,
      httpStatus: isSet(object.httpStatus) ? Number(object.httpStatus) : undefined,
    };
  },

  toJSON(message: FaultInjection_Conf_Abort): unknown {
    const obj: any = {};
    message.percentage !== undefined && (obj.percentage = message.percentage);
    message.httpStatus !== undefined && (obj.httpStatus = message.httpStatus);
    return obj;
  },

  fromPartial(object: DeepPartial<FaultInjection_Conf_Abort>): FaultInjection_Conf_Abort {
    const message = Object.create(createBaseFaultInjection_Conf_Abort()) as FaultInjection_Conf_Abort;
    message.percentage = object.percentage ?? undefined;
    message.httpStatus = object.httpStatus ?? undefined;
    return message;
  },
};

function createBaseFaultInjection_Conf_ResponseBandwidth(): FaultInjection_Conf_ResponseBandwidth {
  return { percentage: undefined, limit: undefined };
}

export const FaultInjection_Conf_ResponseBandwidth = {
  fromJSON(object: any): FaultInjection_Conf_ResponseBandwidth {
    return {
      percentage: isSet(object.percentage) ? Number(object.percentage) : undefined,
      limit: isSet(object.limit) ? String(object.limit) : undefined,
    };
  },

  toJSON(message: FaultInjection_Conf_ResponseBandwidth): unknown {
    const obj: any = {};
    message.percentage !== undefined && (obj.percentage = message.percentage);
    message.limit !== undefined && (obj.limit = message.limit);
    return obj;
  },

  fromPartial(object: DeepPartial<FaultInjection_Conf_ResponseBandwidth>): FaultInjection_Conf_ResponseBandwidth {
    const message = Object.create(
      createBaseFaultInjection_Conf_ResponseBandwidth(),
    ) as FaultInjection_Conf_ResponseBandwidth;
    message.percentage = object.percentage ?? undefined;
    message.limit = object.limit ?? undefined;
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
