/* eslint-disable */
import { Duration } from "../../google/protobuf/duration";
import { Selector } from "./selector";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** HealthCheck defines configuration for health checking. */
export interface HealthCheck {
  /**
   * List of selectors to match dataplanes that should be configured to do
   * health checks.
   */
  sources: Selector[];
  /** List of selectors to match services that need to be health checked. */
  destinations: Selector[];
  /** Configuration for various types of health checking. */
  conf: HealthCheck_Conf | undefined;
}

/** Conf defines configuration for various types of health checking. */
export interface HealthCheck_Conf {
  /** Interval between consecutive health checks. */
  interval:
    | Duration
    | undefined;
  /** Maximum time to wait for a health check response. */
  timeout:
    | Duration
    | undefined;
  /**
   * Number of consecutive unhealthy checks before considering a host
   * unhealthy.
   */
  unhealthyThreshold: number;
  /** Number of consecutive healthy checks before considering a host healthy. */
  healthyThreshold: number;
  /**
   * If specified, Envoy will start health checking after for a random time in
   * ms between 0 and initial_jitter. This only applies to the first health
   * check.
   */
  initialJitter:
    | Duration
    | undefined;
  /**
   * If specified, during every interval Envoy will add interval_jitter to the
   * wait time.
   */
  intervalJitter:
    | Duration
    | undefined;
  /**
   * If specified, during every interval Envoy will add interval_ms *
   * interval_jitter_percent / 100 to the wait time. If interval_jitter_ms and
   * interval_jitter_percent are both set, both of them will be used to
   * increase the wait time.
   */
  intervalJitterPercent: number;
  /**
   * Allows to configure panic threshold for Envoy cluster. If not specified,
   * the default is 50%. To disable panic mode, set to 0%.
   */
  healthyPanicThreshold:
    | number
    | undefined;
  /**
   * If set to true, Envoy will not consider any hosts when the cluster is in
   * 'panic mode'. Instead, the cluster will fail all requests as if all hosts
   * are unhealthy. This can help avoid potentially overwhelming a failing
   * service.
   */
  failTrafficOnPanic:
    | boolean
    | undefined;
  /**
   * Specifies the path to the file where Envoy can log health check events.
   * If empty, no event log will be written.
   */
  eventLogPath: string;
  /**
   * If set to true, health check failure events will always be logged. If set
   * to false, only the initial health check failure event will be logged. The
   * default value is false.
   */
  alwaysLogHealthCheckFailures:
    | boolean
    | undefined;
  /**
   * The "no traffic interval" is a special health check interval that is used
   * when a cluster has never had traffic routed to it. This lower interval
   * allows cluster information to be kept up to date, without sending a
   * potentially large amount of active health checking traffic for no reason.
   * Once a cluster has been used for traffic routing, Envoy will shift back
   * to using the standard health check interval that is defined. Note that
   * this interval takes precedence over any other. The default value for "no
   * traffic interval" is 60 seconds.
   */
  noTrafficInterval: Duration | undefined;
  tcp: HealthCheck_Conf_Tcp | undefined;
  http:
    | HealthCheck_Conf_Http
    | undefined;
  /** Reuse health check connection between health checks. Default is true. */
  reuseConnection: boolean | undefined;
}

/**
 * Tcp defines optional configuration for specifying bytes to send and
 * expected response during the health check
 */
export interface HealthCheck_Conf_Tcp {
  /** Bytes which will be send during the health check to the target */
  send:
    | Uint8Array
    | undefined;
  /**
   * Bytes blocks expected as a response. When checking the response,
   * “fuzzy” matching is performed such that each block must be found, and
   * in the order specified, but not necessarily contiguous.
   */
  receive: Uint8Array[];
}

/**
 * Http defines optional Http configuration which will instruct the service
 * the health check will be made for is an http service. It's mutually
 * exclusive with the Tcp block so when provided you can't provide
 * the Tcp configuration
 */
export interface HealthCheck_Conf_Http {
  /**
   * The HTTP path which will be requested during the health check
   * (ie. /health)
   *  +required
   */
  path: string;
  /**
   * The list of HTTP headers which should be added to each health check
   * request
   *  +optional
   */
  requestHeadersToAdd: HealthCheck_Conf_Http_HeaderValueOption[];
  /**
   * List of HTTP response statuses which are considered healthy
   *  +optional
   */
  expectedStatuses: number[];
}

export interface HealthCheck_Conf_Http_HeaderValue {
  /**
   * Header name
   *  +required
   */
  key: string;
  /**
   * Header value
   *  +optional
   */
  value: string;
}

export interface HealthCheck_Conf_Http_HeaderValueOption {
  /**
   * Key/Value representation of the HTTP header
   *  +required
   */
  header:
    | HealthCheck_Conf_Http_HeaderValue
    | undefined;
  /**
   * The bool value which if true (default) will mean the header values
   * should be appended to already present ones
   *  +optional
   */
  append: boolean | undefined;
}

function createBaseHealthCheck(): HealthCheck {
  return { sources: [], destinations: [], conf: undefined };
}

export const HealthCheck = {
  fromJSON(object: any): HealthCheck {
    return {
      sources: Array.isArray(object?.sources) ? object.sources.map((e: any) => Selector.fromJSON(e)) : [],
      destinations: Array.isArray(object?.destinations)
        ? object.destinations.map((e: any) => Selector.fromJSON(e))
        : [],
      conf: isSet(object.conf) ? HealthCheck_Conf.fromJSON(object.conf) : undefined,
    };
  },

  toJSON(message: HealthCheck): unknown {
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
    message.conf !== undefined && (obj.conf = message.conf ? HealthCheck_Conf.toJSON(message.conf) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<HealthCheck>): HealthCheck {
    const message = Object.create(createBaseHealthCheck()) as HealthCheck;
    message.sources = object.sources?.map((e) => Selector.fromPartial(e)) || [];
    message.destinations = object.destinations?.map((e) => Selector.fromPartial(e)) || [];
    message.conf = (object.conf !== undefined && object.conf !== null)
      ? HealthCheck_Conf.fromPartial(object.conf)
      : undefined;
    return message;
  },
};

function createBaseHealthCheck_Conf(): HealthCheck_Conf {
  return {
    interval: undefined,
    timeout: undefined,
    unhealthyThreshold: 0,
    healthyThreshold: 0,
    initialJitter: undefined,
    intervalJitter: undefined,
    intervalJitterPercent: 0,
    healthyPanicThreshold: undefined,
    failTrafficOnPanic: undefined,
    eventLogPath: "",
    alwaysLogHealthCheckFailures: undefined,
    noTrafficInterval: undefined,
    tcp: undefined,
    http: undefined,
    reuseConnection: undefined,
  };
}

export const HealthCheck_Conf = {
  fromJSON(object: any): HealthCheck_Conf {
    return {
      interval: isSet(object.interval) ? Duration.fromJSON(object.interval) : undefined,
      timeout: isSet(object.timeout) ? Duration.fromJSON(object.timeout) : undefined,
      unhealthyThreshold: isSet(object.unhealthyThreshold) ? Number(object.unhealthyThreshold) : 0,
      healthyThreshold: isSet(object.healthyThreshold) ? Number(object.healthyThreshold) : 0,
      initialJitter: isSet(object.initialJitter) ? Duration.fromJSON(object.initialJitter) : undefined,
      intervalJitter: isSet(object.intervalJitter) ? Duration.fromJSON(object.intervalJitter) : undefined,
      intervalJitterPercent: isSet(object.intervalJitterPercent) ? Number(object.intervalJitterPercent) : 0,
      healthyPanicThreshold: isSet(object.healthyPanicThreshold) ? Number(object.healthyPanicThreshold) : undefined,
      failTrafficOnPanic: isSet(object.failTrafficOnPanic) ? Boolean(object.failTrafficOnPanic) : undefined,
      eventLogPath: isSet(object.eventLogPath) ? String(object.eventLogPath) : "",
      alwaysLogHealthCheckFailures: isSet(object.alwaysLogHealthCheckFailures)
        ? Boolean(object.alwaysLogHealthCheckFailures)
        : undefined,
      noTrafficInterval: isSet(object.noTrafficInterval) ? Duration.fromJSON(object.noTrafficInterval) : undefined,
      tcp: isSet(object.tcp) ? HealthCheck_Conf_Tcp.fromJSON(object.tcp) : undefined,
      http: isSet(object.http) ? HealthCheck_Conf_Http.fromJSON(object.http) : undefined,
      reuseConnection: isSet(object.reuseConnection) ? Boolean(object.reuseConnection) : undefined,
    };
  },

  toJSON(message: HealthCheck_Conf): unknown {
    const obj: any = {};
    message.interval !== undefined && (obj.interval = message.interval ? Duration.toJSON(message.interval) : undefined);
    message.timeout !== undefined && (obj.timeout = message.timeout ? Duration.toJSON(message.timeout) : undefined);
    message.unhealthyThreshold !== undefined && (obj.unhealthyThreshold = Math.round(message.unhealthyThreshold));
    message.healthyThreshold !== undefined && (obj.healthyThreshold = Math.round(message.healthyThreshold));
    message.initialJitter !== undefined &&
      (obj.initialJitter = message.initialJitter ? Duration.toJSON(message.initialJitter) : undefined);
    message.intervalJitter !== undefined &&
      (obj.intervalJitter = message.intervalJitter ? Duration.toJSON(message.intervalJitter) : undefined);
    message.intervalJitterPercent !== undefined &&
      (obj.intervalJitterPercent = Math.round(message.intervalJitterPercent));
    message.healthyPanicThreshold !== undefined && (obj.healthyPanicThreshold = message.healthyPanicThreshold);
    message.failTrafficOnPanic !== undefined && (obj.failTrafficOnPanic = message.failTrafficOnPanic);
    message.eventLogPath !== undefined && (obj.eventLogPath = message.eventLogPath);
    message.alwaysLogHealthCheckFailures !== undefined &&
      (obj.alwaysLogHealthCheckFailures = message.alwaysLogHealthCheckFailures);
    message.noTrafficInterval !== undefined &&
      (obj.noTrafficInterval = message.noTrafficInterval ? Duration.toJSON(message.noTrafficInterval) : undefined);
    message.tcp !== undefined && (obj.tcp = message.tcp ? HealthCheck_Conf_Tcp.toJSON(message.tcp) : undefined);
    message.http !== undefined && (obj.http = message.http ? HealthCheck_Conf_Http.toJSON(message.http) : undefined);
    message.reuseConnection !== undefined && (obj.reuseConnection = message.reuseConnection);
    return obj;
  },

  fromPartial(object: DeepPartial<HealthCheck_Conf>): HealthCheck_Conf {
    const message = Object.create(createBaseHealthCheck_Conf()) as HealthCheck_Conf;
    message.interval = (object.interval !== undefined && object.interval !== null)
      ? Duration.fromPartial(object.interval)
      : undefined;
    message.timeout = (object.timeout !== undefined && object.timeout !== null)
      ? Duration.fromPartial(object.timeout)
      : undefined;
    message.unhealthyThreshold = object.unhealthyThreshold ?? 0;
    message.healthyThreshold = object.healthyThreshold ?? 0;
    message.initialJitter = (object.initialJitter !== undefined && object.initialJitter !== null)
      ? Duration.fromPartial(object.initialJitter)
      : undefined;
    message.intervalJitter = (object.intervalJitter !== undefined && object.intervalJitter !== null)
      ? Duration.fromPartial(object.intervalJitter)
      : undefined;
    message.intervalJitterPercent = object.intervalJitterPercent ?? 0;
    message.healthyPanicThreshold = object.healthyPanicThreshold ?? undefined;
    message.failTrafficOnPanic = object.failTrafficOnPanic ?? undefined;
    message.eventLogPath = object.eventLogPath ?? "";
    message.alwaysLogHealthCheckFailures = object.alwaysLogHealthCheckFailures ?? undefined;
    message.noTrafficInterval = (object.noTrafficInterval !== undefined && object.noTrafficInterval !== null)
      ? Duration.fromPartial(object.noTrafficInterval)
      : undefined;
    message.tcp = (object.tcp !== undefined && object.tcp !== null)
      ? HealthCheck_Conf_Tcp.fromPartial(object.tcp)
      : undefined;
    message.http = (object.http !== undefined && object.http !== null)
      ? HealthCheck_Conf_Http.fromPartial(object.http)
      : undefined;
    message.reuseConnection = object.reuseConnection ?? undefined;
    return message;
  },
};

function createBaseHealthCheck_Conf_Tcp(): HealthCheck_Conf_Tcp {
  return { send: undefined, receive: [] };
}

export const HealthCheck_Conf_Tcp = {
  fromJSON(object: any): HealthCheck_Conf_Tcp {
    return {
      send: isSet(object.send) ? new Uint8Array(object.send) : undefined,
      receive: Array.isArray(object?.receive) ? object.receive.map((e: any) => new Uint8Array(e)) : [],
    };
  },

  toJSON(message: HealthCheck_Conf_Tcp): unknown {
    const obj: any = {};
    message.send !== undefined && (obj.send = message.send);
    if (message.receive) {
      obj.receive = message.receive.map((e) => e);
    } else {
      obj.receive = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<HealthCheck_Conf_Tcp>): HealthCheck_Conf_Tcp {
    const message = Object.create(createBaseHealthCheck_Conf_Tcp()) as HealthCheck_Conf_Tcp;
    message.send = object.send ?? undefined;
    message.receive = object.receive?.map((e) => e) || [];
    return message;
  },
};

function createBaseHealthCheck_Conf_Http(): HealthCheck_Conf_Http {
  return { path: "", requestHeadersToAdd: [], expectedStatuses: [] };
}

export const HealthCheck_Conf_Http = {
  fromJSON(object: any): HealthCheck_Conf_Http {
    return {
      path: isSet(object.path) ? String(object.path) : "",
      requestHeadersToAdd: Array.isArray(object?.requestHeadersToAdd)
        ? object.requestHeadersToAdd.map((e: any) => HealthCheck_Conf_Http_HeaderValueOption.fromJSON(e))
        : [],
      expectedStatuses: Array.isArray(object?.expectedStatuses)
        ? object.expectedStatuses.map((e: any) => Number(e))
        : [],
    };
  },

  toJSON(message: HealthCheck_Conf_Http): unknown {
    const obj: any = {};
    message.path !== undefined && (obj.path = message.path);
    if (message.requestHeadersToAdd) {
      obj.requestHeadersToAdd = message.requestHeadersToAdd.map((e) =>
        e ? HealthCheck_Conf_Http_HeaderValueOption.toJSON(e) : undefined
      );
    } else {
      obj.requestHeadersToAdd = [];
    }
    if (message.expectedStatuses) {
      obj.expectedStatuses = message.expectedStatuses.map((e) => e);
    } else {
      obj.expectedStatuses = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<HealthCheck_Conf_Http>): HealthCheck_Conf_Http {
    const message = Object.create(createBaseHealthCheck_Conf_Http()) as HealthCheck_Conf_Http;
    message.path = object.path ?? "";
    message.requestHeadersToAdd =
      object.requestHeadersToAdd?.map((e) => HealthCheck_Conf_Http_HeaderValueOption.fromPartial(e)) || [];
    message.expectedStatuses = object.expectedStatuses?.map((e) => e) || [];
    return message;
  },
};

function createBaseHealthCheck_Conf_Http_HeaderValue(): HealthCheck_Conf_Http_HeaderValue {
  return { key: "", value: "" };
}

export const HealthCheck_Conf_Http_HeaderValue = {
  fromJSON(object: any): HealthCheck_Conf_Http_HeaderValue {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: HealthCheck_Conf_Http_HeaderValue): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<HealthCheck_Conf_Http_HeaderValue>): HealthCheck_Conf_Http_HeaderValue {
    const message = Object.create(createBaseHealthCheck_Conf_Http_HeaderValue()) as HealthCheck_Conf_Http_HeaderValue;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseHealthCheck_Conf_Http_HeaderValueOption(): HealthCheck_Conf_Http_HeaderValueOption {
  return { header: undefined, append: undefined };
}

export const HealthCheck_Conf_Http_HeaderValueOption = {
  fromJSON(object: any): HealthCheck_Conf_Http_HeaderValueOption {
    return {
      header: isSet(object.header) ? HealthCheck_Conf_Http_HeaderValue.fromJSON(object.header) : undefined,
      append: isSet(object.append) ? Boolean(object.append) : undefined,
    };
  },

  toJSON(message: HealthCheck_Conf_Http_HeaderValueOption): unknown {
    const obj: any = {};
    message.header !== undefined &&
      (obj.header = message.header ? HealthCheck_Conf_Http_HeaderValue.toJSON(message.header) : undefined);
    message.append !== undefined && (obj.append = message.append);
    return obj;
  },

  fromPartial(object: DeepPartial<HealthCheck_Conf_Http_HeaderValueOption>): HealthCheck_Conf_Http_HeaderValueOption {
    const message = Object.create(
      createBaseHealthCheck_Conf_Http_HeaderValueOption(),
    ) as HealthCheck_Conf_Http_HeaderValueOption;
    message.header = (object.header !== undefined && object.header !== null)
      ? HealthCheck_Conf_Http_HeaderValue.fromPartial(object.header)
      : undefined;
    message.append = object.append ?? undefined;
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
