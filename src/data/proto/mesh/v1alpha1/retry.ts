/* eslint-disable */
import { Duration } from "../../google/protobuf/duration";
import { HttpMethod, httpMethodFromJSON, httpMethodToJSON } from "./http_method";
import { Selector } from "./selector";

export const protobufPackage = "kuma.mesh.v1alpha1";

/**
 * These options correspond with the retry_on options in Envoy's documentation:
 * https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/router_filter#config-http-filters-router-x-envoy-retry-on
 */
export enum HttpRetryOn {
  all_5xx = "all_5xx",
  gateway_error = "gateway_error",
  reset = "reset",
  connect_failure = "connect_failure",
  envoy_ratelimited = "envoy_ratelimited",
  retriable_4xx = "retriable_4xx",
  refused_stream = "refused_stream",
  retriable_status_codes = "retriable_status_codes",
  retriable_headers = "retriable_headers",
  http3_post_connect_failure = "http3_post_connect_failure",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function httpRetryOnFromJSON(object: any): HttpRetryOn {
  switch (object) {
    case 0:
    case "all_5xx":
      return HttpRetryOn.all_5xx;
    case 1:
    case "gateway_error":
      return HttpRetryOn.gateway_error;
    case 2:
    case "reset":
      return HttpRetryOn.reset;
    case 3:
    case "connect_failure":
      return HttpRetryOn.connect_failure;
    case 4:
    case "envoy_ratelimited":
      return HttpRetryOn.envoy_ratelimited;
    case 5:
    case "retriable_4xx":
      return HttpRetryOn.retriable_4xx;
    case 6:
    case "refused_stream":
      return HttpRetryOn.refused_stream;
    case 7:
    case "retriable_status_codes":
      return HttpRetryOn.retriable_status_codes;
    case 8:
    case "retriable_headers":
      return HttpRetryOn.retriable_headers;
    case 9:
    case "http3_post_connect_failure":
      return HttpRetryOn.http3_post_connect_failure;
    case -1:
    case "UNRECOGNIZED":
    default:
      return HttpRetryOn.UNRECOGNIZED;
  }
}

export function httpRetryOnToJSON(object: HttpRetryOn): string {
  switch (object) {
    case HttpRetryOn.all_5xx:
      return "all_5xx";
    case HttpRetryOn.gateway_error:
      return "gateway_error";
    case HttpRetryOn.reset:
      return "reset";
    case HttpRetryOn.connect_failure:
      return "connect_failure";
    case HttpRetryOn.envoy_ratelimited:
      return "envoy_ratelimited";
    case HttpRetryOn.retriable_4xx:
      return "retriable_4xx";
    case HttpRetryOn.refused_stream:
      return "refused_stream";
    case HttpRetryOn.retriable_status_codes:
      return "retriable_status_codes";
    case HttpRetryOn.retriable_headers:
      return "retriable_headers";
    case HttpRetryOn.http3_post_connect_failure:
      return "http3_post_connect_failure";
    case HttpRetryOn.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Retry {
  /**
   * List of selectors to match dataplanes that retry policy should be
   * configured for
   */
  sources: Selector[];
  /** List of selectors to match services that need to be health checked. */
  destinations: Selector[];
  /** +required */
  conf: Retry_Conf | undefined;
}

export interface Retry_Conf {
  http: Retry_Conf_Http | undefined;
  tcp: Retry_Conf_Tcp | undefined;
  grpc: Retry_Conf_Grpc | undefined;
}

export interface Retry_Conf_BackOff {
  /** +required */
  baseInterval:
    | Duration
    | undefined;
  /** +optional */
  maxInterval: Duration | undefined;
}

export interface Retry_Conf_Http {
  /** +optional */
  numRetries:
    | number
    | undefined;
  /** +optional */
  perTryTimeout:
    | Duration
    | undefined;
  /** +optional */
  backOff:
    | Retry_Conf_BackOff
    | undefined;
  /** +optional */
  retriableStatusCodes: number[];
  /** +optional */
  retriableMethods: HttpMethod[];
  /** +optional */
  retryOn: HttpRetryOn[];
}

export interface Retry_Conf_Tcp {
  /** +optional */
  maxConnectAttempts: number;
}

export interface Retry_Conf_Grpc {
  /** +optional */
  retryOn: Retry_Conf_Grpc_RetryOn[];
  /** +optional */
  numRetries:
    | number
    | undefined;
  /** +optional */
  perTryTimeout:
    | Duration
    | undefined;
  /** +optional */
  backOff: Retry_Conf_BackOff | undefined;
}

export enum Retry_Conf_Grpc_RetryOn {
  cancelled = "cancelled",
  deadline_exceeded = "deadline_exceeded",
  internal = "internal",
  resource_exhausted = "resource_exhausted",
  unavailable = "unavailable",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function retry_Conf_Grpc_RetryOnFromJSON(object: any): Retry_Conf_Grpc_RetryOn {
  switch (object) {
    case 0:
    case "cancelled":
      return Retry_Conf_Grpc_RetryOn.cancelled;
    case 1:
    case "deadline_exceeded":
      return Retry_Conf_Grpc_RetryOn.deadline_exceeded;
    case 2:
    case "internal":
      return Retry_Conf_Grpc_RetryOn.internal;
    case 3:
    case "resource_exhausted":
      return Retry_Conf_Grpc_RetryOn.resource_exhausted;
    case 4:
    case "unavailable":
      return Retry_Conf_Grpc_RetryOn.unavailable;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Retry_Conf_Grpc_RetryOn.UNRECOGNIZED;
  }
}

export function retry_Conf_Grpc_RetryOnToJSON(object: Retry_Conf_Grpc_RetryOn): string {
  switch (object) {
    case Retry_Conf_Grpc_RetryOn.cancelled:
      return "cancelled";
    case Retry_Conf_Grpc_RetryOn.deadline_exceeded:
      return "deadline_exceeded";
    case Retry_Conf_Grpc_RetryOn.internal:
      return "internal";
    case Retry_Conf_Grpc_RetryOn.resource_exhausted:
      return "resource_exhausted";
    case Retry_Conf_Grpc_RetryOn.unavailable:
      return "unavailable";
    case Retry_Conf_Grpc_RetryOn.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseRetry(): Retry {
  return { sources: [], destinations: [], conf: undefined };
}

export const Retry = {
  fromJSON(object: any): Retry {
    return {
      sources: Array.isArray(object?.sources) ? object.sources.map((e: any) => Selector.fromJSON(e)) : [],
      destinations: Array.isArray(object?.destinations)
        ? object.destinations.map((e: any) => Selector.fromJSON(e))
        : [],
      conf: isSet(object.conf) ? Retry_Conf.fromJSON(object.conf) : undefined,
    };
  },

  toJSON(message: Retry): unknown {
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
    message.conf !== undefined && (obj.conf = message.conf ? Retry_Conf.toJSON(message.conf) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Retry>): Retry {
    const message = Object.create(createBaseRetry()) as Retry;
    message.sources = object.sources?.map((e) => Selector.fromPartial(e)) || [];
    message.destinations = object.destinations?.map((e) => Selector.fromPartial(e)) || [];
    message.conf = (object.conf !== undefined && object.conf !== null)
      ? Retry_Conf.fromPartial(object.conf)
      : undefined;
    return message;
  },
};

function createBaseRetry_Conf(): Retry_Conf {
  return { http: undefined, tcp: undefined, grpc: undefined };
}

export const Retry_Conf = {
  fromJSON(object: any): Retry_Conf {
    return {
      http: isSet(object.http) ? Retry_Conf_Http.fromJSON(object.http) : undefined,
      tcp: isSet(object.tcp) ? Retry_Conf_Tcp.fromJSON(object.tcp) : undefined,
      grpc: isSet(object.grpc) ? Retry_Conf_Grpc.fromJSON(object.grpc) : undefined,
    };
  },

  toJSON(message: Retry_Conf): unknown {
    const obj: any = {};
    message.http !== undefined && (obj.http = message.http ? Retry_Conf_Http.toJSON(message.http) : undefined);
    message.tcp !== undefined && (obj.tcp = message.tcp ? Retry_Conf_Tcp.toJSON(message.tcp) : undefined);
    message.grpc !== undefined && (obj.grpc = message.grpc ? Retry_Conf_Grpc.toJSON(message.grpc) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Retry_Conf>): Retry_Conf {
    const message = Object.create(createBaseRetry_Conf()) as Retry_Conf;
    message.http = (object.http !== undefined && object.http !== null)
      ? Retry_Conf_Http.fromPartial(object.http)
      : undefined;
    message.tcp = (object.tcp !== undefined && object.tcp !== null)
      ? Retry_Conf_Tcp.fromPartial(object.tcp)
      : undefined;
    message.grpc = (object.grpc !== undefined && object.grpc !== null)
      ? Retry_Conf_Grpc.fromPartial(object.grpc)
      : undefined;
    return message;
  },
};

function createBaseRetry_Conf_BackOff(): Retry_Conf_BackOff {
  return { baseInterval: undefined, maxInterval: undefined };
}

export const Retry_Conf_BackOff = {
  fromJSON(object: any): Retry_Conf_BackOff {
    return {
      baseInterval: isSet(object.baseInterval) ? Duration.fromJSON(object.baseInterval) : undefined,
      maxInterval: isSet(object.maxInterval) ? Duration.fromJSON(object.maxInterval) : undefined,
    };
  },

  toJSON(message: Retry_Conf_BackOff): unknown {
    const obj: any = {};
    message.baseInterval !== undefined &&
      (obj.baseInterval = message.baseInterval ? Duration.toJSON(message.baseInterval) : undefined);
    message.maxInterval !== undefined &&
      (obj.maxInterval = message.maxInterval ? Duration.toJSON(message.maxInterval) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Retry_Conf_BackOff>): Retry_Conf_BackOff {
    const message = Object.create(createBaseRetry_Conf_BackOff()) as Retry_Conf_BackOff;
    message.baseInterval = (object.baseInterval !== undefined && object.baseInterval !== null)
      ? Duration.fromPartial(object.baseInterval)
      : undefined;
    message.maxInterval = (object.maxInterval !== undefined && object.maxInterval !== null)
      ? Duration.fromPartial(object.maxInterval)
      : undefined;
    return message;
  },
};

function createBaseRetry_Conf_Http(): Retry_Conf_Http {
  return {
    numRetries: undefined,
    perTryTimeout: undefined,
    backOff: undefined,
    retriableStatusCodes: [],
    retriableMethods: [],
    retryOn: [],
  };
}

export const Retry_Conf_Http = {
  fromJSON(object: any): Retry_Conf_Http {
    return {
      numRetries: isSet(object.numRetries) ? Number(object.numRetries) : undefined,
      perTryTimeout: isSet(object.perTryTimeout) ? Duration.fromJSON(object.perTryTimeout) : undefined,
      backOff: isSet(object.backOff) ? Retry_Conf_BackOff.fromJSON(object.backOff) : undefined,
      retriableStatusCodes: Array.isArray(object?.retriableStatusCodes)
        ? object.retriableStatusCodes.map((e: any) => Number(e))
        : [],
      retriableMethods: Array.isArray(object?.retriableMethods)
        ? object.retriableMethods.map((e: any) => httpMethodFromJSON(e))
        : [],
      retryOn: Array.isArray(object?.retryOn) ? object.retryOn.map((e: any) => httpRetryOnFromJSON(e)) : [],
    };
  },

  toJSON(message: Retry_Conf_Http): unknown {
    const obj: any = {};
    message.numRetries !== undefined && (obj.numRetries = message.numRetries);
    message.perTryTimeout !== undefined &&
      (obj.perTryTimeout = message.perTryTimeout ? Duration.toJSON(message.perTryTimeout) : undefined);
    message.backOff !== undefined &&
      (obj.backOff = message.backOff ? Retry_Conf_BackOff.toJSON(message.backOff) : undefined);
    if (message.retriableStatusCodes) {
      obj.retriableStatusCodes = message.retriableStatusCodes.map((e) => Math.round(e));
    } else {
      obj.retriableStatusCodes = [];
    }
    if (message.retriableMethods) {
      obj.retriableMethods = message.retriableMethods.map((e) => httpMethodToJSON(e));
    } else {
      obj.retriableMethods = [];
    }
    if (message.retryOn) {
      obj.retryOn = message.retryOn.map((e) => httpRetryOnToJSON(e));
    } else {
      obj.retryOn = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Retry_Conf_Http>): Retry_Conf_Http {
    const message = Object.create(createBaseRetry_Conf_Http()) as Retry_Conf_Http;
    message.numRetries = object.numRetries ?? undefined;
    message.perTryTimeout = (object.perTryTimeout !== undefined && object.perTryTimeout !== null)
      ? Duration.fromPartial(object.perTryTimeout)
      : undefined;
    message.backOff = (object.backOff !== undefined && object.backOff !== null)
      ? Retry_Conf_BackOff.fromPartial(object.backOff)
      : undefined;
    message.retriableStatusCodes = object.retriableStatusCodes?.map((e) => e) || [];
    message.retriableMethods = object.retriableMethods?.map((e) => e) || [];
    message.retryOn = object.retryOn?.map((e) => e) || [];
    return message;
  },
};

function createBaseRetry_Conf_Tcp(): Retry_Conf_Tcp {
  return { maxConnectAttempts: 0 };
}

export const Retry_Conf_Tcp = {
  fromJSON(object: any): Retry_Conf_Tcp {
    return { maxConnectAttempts: isSet(object.maxConnectAttempts) ? Number(object.maxConnectAttempts) : 0 };
  },

  toJSON(message: Retry_Conf_Tcp): unknown {
    const obj: any = {};
    message.maxConnectAttempts !== undefined && (obj.maxConnectAttempts = Math.round(message.maxConnectAttempts));
    return obj;
  },

  fromPartial(object: DeepPartial<Retry_Conf_Tcp>): Retry_Conf_Tcp {
    const message = Object.create(createBaseRetry_Conf_Tcp()) as Retry_Conf_Tcp;
    message.maxConnectAttempts = object.maxConnectAttempts ?? 0;
    return message;
  },
};

function createBaseRetry_Conf_Grpc(): Retry_Conf_Grpc {
  return { retryOn: [], numRetries: undefined, perTryTimeout: undefined, backOff: undefined };
}

export const Retry_Conf_Grpc = {
  fromJSON(object: any): Retry_Conf_Grpc {
    return {
      retryOn: Array.isArray(object?.retryOn) ? object.retryOn.map((e: any) => retry_Conf_Grpc_RetryOnFromJSON(e)) : [],
      numRetries: isSet(object.numRetries) ? Number(object.numRetries) : undefined,
      perTryTimeout: isSet(object.perTryTimeout) ? Duration.fromJSON(object.perTryTimeout) : undefined,
      backOff: isSet(object.backOff) ? Retry_Conf_BackOff.fromJSON(object.backOff) : undefined,
    };
  },

  toJSON(message: Retry_Conf_Grpc): unknown {
    const obj: any = {};
    if (message.retryOn) {
      obj.retryOn = message.retryOn.map((e) => retry_Conf_Grpc_RetryOnToJSON(e));
    } else {
      obj.retryOn = [];
    }
    message.numRetries !== undefined && (obj.numRetries = message.numRetries);
    message.perTryTimeout !== undefined &&
      (obj.perTryTimeout = message.perTryTimeout ? Duration.toJSON(message.perTryTimeout) : undefined);
    message.backOff !== undefined &&
      (obj.backOff = message.backOff ? Retry_Conf_BackOff.toJSON(message.backOff) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Retry_Conf_Grpc>): Retry_Conf_Grpc {
    const message = Object.create(createBaseRetry_Conf_Grpc()) as Retry_Conf_Grpc;
    message.retryOn = object.retryOn?.map((e) => e) || [];
    message.numRetries = object.numRetries ?? undefined;
    message.perTryTimeout = (object.perTryTimeout !== undefined && object.perTryTimeout !== null)
      ? Duration.fromPartial(object.perTryTimeout)
      : undefined;
    message.backOff = (object.backOff !== undefined && object.backOff !== null)
      ? Retry_Conf_BackOff.fromPartial(object.backOff)
      : undefined;
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
