/* eslint-disable */
import { Duration } from "../../google/protobuf/duration";
import { Selector } from "./selector";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** CircuitBreaker defines circuit breaking policy for dataplane's outbound */
export interface CircuitBreaker {
  /** List of selectors to match dataplanes that are sources of traffic. */
  sources: Selector[];
  /** List of selectors to match services that are destinations of traffic. */
  destinations: Selector[];
  conf: CircuitBreaker_Conf | undefined;
}

export interface CircuitBreaker_Conf {
  /** Time interval between ejection analysis sweeps */
  interval:
    | Duration
    | undefined;
  /**
   * The base time that a host is ejected for. The real time is equal to the
   * base time multiplied by the number of times the host has been ejected
   */
  baseEjectionTime:
    | Duration
    | undefined;
  /**
   * The maximum percent of an upstream cluster that can be ejected due to
   * outlier detection, has to be in [0 - 100] range
   */
  maxEjectionPercent:
    | number
    | undefined;
  /** Enables Split Mode in which local and external errors are distinguished */
  splitExternalAndLocalErrors: boolean;
  detectors: CircuitBreaker_Conf_Detectors | undefined;
  thresholds: CircuitBreaker_Conf_Thresholds | undefined;
}

export interface CircuitBreaker_Conf_Detectors {
  /**
   * Errors with status code 5xx and locally originated errors, in Split
   * Mode - just errors with status code 5xx
   */
  totalErrors:
    | CircuitBreaker_Conf_Detectors_Errors
    | undefined;
  /**
   * Subset of 'total' related to gateway errors (502, 503 or 504 status
   * code)
   */
  gatewayErrors:
    | CircuitBreaker_Conf_Detectors_Errors
    | undefined;
  /**
   * Takes into account only in Split Mode, number of locally originated
   * errors
   */
  localErrors: CircuitBreaker_Conf_Detectors_Errors | undefined;
  standardDeviation: CircuitBreaker_Conf_Detectors_StandardDeviation | undefined;
  failure: CircuitBreaker_Conf_Detectors_Failure | undefined;
}

/** Detector based on counting consecutive number of errors */
export interface CircuitBreaker_Conf_Detectors_Errors {
  consecutive: number | undefined;
}

/**
 * Detection based on success rate, aggregated from every host in the
 * cluser
 */
export interface CircuitBreaker_Conf_Detectors_StandardDeviation {
  /** Ignore hosts with less number of requests than 'requestVolume' */
  requestVolume:
    | number
    | undefined;
  /**
   * Won't count success rate for cluster if number of hosts with required
   * 'requestVolume' is less than 'minimumHosts'
   */
  minimumHosts:
    | number
    | undefined;
  /** Resulting threshold = mean - (stdev * factor) */
  factor: number | undefined;
}

/**
 * Detection based on success rate, but threshold is set explicitly
 * (unlike 'standardDeviation')
 */
export interface CircuitBreaker_Conf_Detectors_Failure {
  /** Ignore hosts with less number of requests than 'requestVolume' */
  requestVolume:
    | number
    | undefined;
  /**
   * Won't count success rate for cluster if number of hosts with required
   * 'requestVolume' is less than 'minimumHosts'
   */
  minimumHosts:
    | number
    | undefined;
  /**
   * Eject host if failure percentage of a given host is greater than or
   * equal to this value, has to be in [0 - 100] range
   */
  threshold: number | undefined;
}

export interface CircuitBreaker_Conf_Thresholds {
  /**
   * The maximum number of connections that Envoy will make to the upstream
   * cluster. If not specified, the default is 1024.
   */
  maxConnections:
    | number
    | undefined;
  /**
   * The maximum number of pending requests that Envoy will allow to the
   * upstream cluster. If not specified, the default is 1024.
   */
  maxPendingRequests:
    | number
    | undefined;
  /**
   * The maximum number of parallel retries that Envoy will allow to the
   * upstream cluster. If not specified, the default is 3.
   */
  maxRetries:
    | number
    | undefined;
  /**
   * The maximum number of parallel requests that Envoy will make to the
   * upstream cluster. If not specified, the default is 1024.
   */
  maxRequests: number | undefined;
}

function createBaseCircuitBreaker(): CircuitBreaker {
  return { sources: [], destinations: [], conf: undefined };
}

export const CircuitBreaker = {
  fromJSON(object: any): CircuitBreaker {
    return {
      sources: Array.isArray(object?.sources) ? object.sources.map((e: any) => Selector.fromJSON(e)) : [],
      destinations: Array.isArray(object?.destinations)
        ? object.destinations.map((e: any) => Selector.fromJSON(e))
        : [],
      conf: isSet(object.conf) ? CircuitBreaker_Conf.fromJSON(object.conf) : undefined,
    };
  },

  toJSON(message: CircuitBreaker): unknown {
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
    message.conf !== undefined && (obj.conf = message.conf ? CircuitBreaker_Conf.toJSON(message.conf) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<CircuitBreaker>): CircuitBreaker {
    const message = Object.create(createBaseCircuitBreaker()) as CircuitBreaker;
    message.sources = object.sources?.map((e) => Selector.fromPartial(e)) || [];
    message.destinations = object.destinations?.map((e) => Selector.fromPartial(e)) || [];
    message.conf = (object.conf !== undefined && object.conf !== null)
      ? CircuitBreaker_Conf.fromPartial(object.conf)
      : undefined;
    return message;
  },
};

function createBaseCircuitBreaker_Conf(): CircuitBreaker_Conf {
  return {
    interval: undefined,
    baseEjectionTime: undefined,
    maxEjectionPercent: undefined,
    splitExternalAndLocalErrors: false,
    detectors: undefined,
    thresholds: undefined,
  };
}

export const CircuitBreaker_Conf = {
  fromJSON(object: any): CircuitBreaker_Conf {
    return {
      interval: isSet(object.interval) ? Duration.fromJSON(object.interval) : undefined,
      baseEjectionTime: isSet(object.baseEjectionTime) ? Duration.fromJSON(object.baseEjectionTime) : undefined,
      maxEjectionPercent: isSet(object.maxEjectionPercent) ? Number(object.maxEjectionPercent) : undefined,
      splitExternalAndLocalErrors: isSet(object.splitExternalAndLocalErrors)
        ? Boolean(object.splitExternalAndLocalErrors)
        : false,
      detectors: isSet(object.detectors) ? CircuitBreaker_Conf_Detectors.fromJSON(object.detectors) : undefined,
      thresholds: isSet(object.thresholds) ? CircuitBreaker_Conf_Thresholds.fromJSON(object.thresholds) : undefined,
    };
  },

  toJSON(message: CircuitBreaker_Conf): unknown {
    const obj: any = {};
    message.interval !== undefined && (obj.interval = message.interval ? Duration.toJSON(message.interval) : undefined);
    message.baseEjectionTime !== undefined &&
      (obj.baseEjectionTime = message.baseEjectionTime ? Duration.toJSON(message.baseEjectionTime) : undefined);
    message.maxEjectionPercent !== undefined && (obj.maxEjectionPercent = message.maxEjectionPercent);
    message.splitExternalAndLocalErrors !== undefined &&
      (obj.splitExternalAndLocalErrors = message.splitExternalAndLocalErrors);
    message.detectors !== undefined &&
      (obj.detectors = message.detectors ? CircuitBreaker_Conf_Detectors.toJSON(message.detectors) : undefined);
    message.thresholds !== undefined &&
      (obj.thresholds = message.thresholds ? CircuitBreaker_Conf_Thresholds.toJSON(message.thresholds) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<CircuitBreaker_Conf>): CircuitBreaker_Conf {
    const message = Object.create(createBaseCircuitBreaker_Conf()) as CircuitBreaker_Conf;
    message.interval = (object.interval !== undefined && object.interval !== null)
      ? Duration.fromPartial(object.interval)
      : undefined;
    message.baseEjectionTime = (object.baseEjectionTime !== undefined && object.baseEjectionTime !== null)
      ? Duration.fromPartial(object.baseEjectionTime)
      : undefined;
    message.maxEjectionPercent = object.maxEjectionPercent ?? undefined;
    message.splitExternalAndLocalErrors = object.splitExternalAndLocalErrors ?? false;
    message.detectors = (object.detectors !== undefined && object.detectors !== null)
      ? CircuitBreaker_Conf_Detectors.fromPartial(object.detectors)
      : undefined;
    message.thresholds = (object.thresholds !== undefined && object.thresholds !== null)
      ? CircuitBreaker_Conf_Thresholds.fromPartial(object.thresholds)
      : undefined;
    return message;
  },
};

function createBaseCircuitBreaker_Conf_Detectors(): CircuitBreaker_Conf_Detectors {
  return {
    totalErrors: undefined,
    gatewayErrors: undefined,
    localErrors: undefined,
    standardDeviation: undefined,
    failure: undefined,
  };
}

export const CircuitBreaker_Conf_Detectors = {
  fromJSON(object: any): CircuitBreaker_Conf_Detectors {
    return {
      totalErrors: isSet(object.totalErrors)
        ? CircuitBreaker_Conf_Detectors_Errors.fromJSON(object.totalErrors)
        : undefined,
      gatewayErrors: isSet(object.gatewayErrors)
        ? CircuitBreaker_Conf_Detectors_Errors.fromJSON(object.gatewayErrors)
        : undefined,
      localErrors: isSet(object.localErrors)
        ? CircuitBreaker_Conf_Detectors_Errors.fromJSON(object.localErrors)
        : undefined,
      standardDeviation: isSet(object.standardDeviation)
        ? CircuitBreaker_Conf_Detectors_StandardDeviation.fromJSON(object.standardDeviation)
        : undefined,
      failure: isSet(object.failure) ? CircuitBreaker_Conf_Detectors_Failure.fromJSON(object.failure) : undefined,
    };
  },

  toJSON(message: CircuitBreaker_Conf_Detectors): unknown {
    const obj: any = {};
    message.totalErrors !== undefined && (obj.totalErrors = message.totalErrors
      ? CircuitBreaker_Conf_Detectors_Errors.toJSON(message.totalErrors)
      : undefined);
    message.gatewayErrors !== undefined && (obj.gatewayErrors = message.gatewayErrors
      ? CircuitBreaker_Conf_Detectors_Errors.toJSON(message.gatewayErrors)
      : undefined);
    message.localErrors !== undefined && (obj.localErrors = message.localErrors
      ? CircuitBreaker_Conf_Detectors_Errors.toJSON(message.localErrors)
      : undefined);
    message.standardDeviation !== undefined && (obj.standardDeviation = message.standardDeviation
      ? CircuitBreaker_Conf_Detectors_StandardDeviation.toJSON(message.standardDeviation)
      : undefined);
    message.failure !== undefined &&
      (obj.failure = message.failure ? CircuitBreaker_Conf_Detectors_Failure.toJSON(message.failure) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<CircuitBreaker_Conf_Detectors>): CircuitBreaker_Conf_Detectors {
    const message = Object.create(createBaseCircuitBreaker_Conf_Detectors()) as CircuitBreaker_Conf_Detectors;
    message.totalErrors = (object.totalErrors !== undefined && object.totalErrors !== null)
      ? CircuitBreaker_Conf_Detectors_Errors.fromPartial(object.totalErrors)
      : undefined;
    message.gatewayErrors = (object.gatewayErrors !== undefined && object.gatewayErrors !== null)
      ? CircuitBreaker_Conf_Detectors_Errors.fromPartial(object.gatewayErrors)
      : undefined;
    message.localErrors = (object.localErrors !== undefined && object.localErrors !== null)
      ? CircuitBreaker_Conf_Detectors_Errors.fromPartial(object.localErrors)
      : undefined;
    message.standardDeviation = (object.standardDeviation !== undefined && object.standardDeviation !== null)
      ? CircuitBreaker_Conf_Detectors_StandardDeviation.fromPartial(object.standardDeviation)
      : undefined;
    message.failure = (object.failure !== undefined && object.failure !== null)
      ? CircuitBreaker_Conf_Detectors_Failure.fromPartial(object.failure)
      : undefined;
    return message;
  },
};

function createBaseCircuitBreaker_Conf_Detectors_Errors(): CircuitBreaker_Conf_Detectors_Errors {
  return { consecutive: undefined };
}

export const CircuitBreaker_Conf_Detectors_Errors = {
  fromJSON(object: any): CircuitBreaker_Conf_Detectors_Errors {
    return { consecutive: isSet(object.consecutive) ? Number(object.consecutive) : undefined };
  },

  toJSON(message: CircuitBreaker_Conf_Detectors_Errors): unknown {
    const obj: any = {};
    message.consecutive !== undefined && (obj.consecutive = message.consecutive);
    return obj;
  },

  fromPartial(object: DeepPartial<CircuitBreaker_Conf_Detectors_Errors>): CircuitBreaker_Conf_Detectors_Errors {
    const message = Object.create(
      createBaseCircuitBreaker_Conf_Detectors_Errors(),
    ) as CircuitBreaker_Conf_Detectors_Errors;
    message.consecutive = object.consecutive ?? undefined;
    return message;
  },
};

function createBaseCircuitBreaker_Conf_Detectors_StandardDeviation(): CircuitBreaker_Conf_Detectors_StandardDeviation {
  return { requestVolume: undefined, minimumHosts: undefined, factor: undefined };
}

export const CircuitBreaker_Conf_Detectors_StandardDeviation = {
  fromJSON(object: any): CircuitBreaker_Conf_Detectors_StandardDeviation {
    return {
      requestVolume: isSet(object.requestVolume) ? Number(object.requestVolume) : undefined,
      minimumHosts: isSet(object.minimumHosts) ? Number(object.minimumHosts) : undefined,
      factor: isSet(object.factor) ? Number(object.factor) : undefined,
    };
  },

  toJSON(message: CircuitBreaker_Conf_Detectors_StandardDeviation): unknown {
    const obj: any = {};
    message.requestVolume !== undefined && (obj.requestVolume = message.requestVolume);
    message.minimumHosts !== undefined && (obj.minimumHosts = message.minimumHosts);
    message.factor !== undefined && (obj.factor = message.factor);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CircuitBreaker_Conf_Detectors_StandardDeviation>,
  ): CircuitBreaker_Conf_Detectors_StandardDeviation {
    const message = Object.create(
      createBaseCircuitBreaker_Conf_Detectors_StandardDeviation(),
    ) as CircuitBreaker_Conf_Detectors_StandardDeviation;
    message.requestVolume = object.requestVolume ?? undefined;
    message.minimumHosts = object.minimumHosts ?? undefined;
    message.factor = object.factor ?? undefined;
    return message;
  },
};

function createBaseCircuitBreaker_Conf_Detectors_Failure(): CircuitBreaker_Conf_Detectors_Failure {
  return { requestVolume: undefined, minimumHosts: undefined, threshold: undefined };
}

export const CircuitBreaker_Conf_Detectors_Failure = {
  fromJSON(object: any): CircuitBreaker_Conf_Detectors_Failure {
    return {
      requestVolume: isSet(object.requestVolume) ? Number(object.requestVolume) : undefined,
      minimumHosts: isSet(object.minimumHosts) ? Number(object.minimumHosts) : undefined,
      threshold: isSet(object.threshold) ? Number(object.threshold) : undefined,
    };
  },

  toJSON(message: CircuitBreaker_Conf_Detectors_Failure): unknown {
    const obj: any = {};
    message.requestVolume !== undefined && (obj.requestVolume = message.requestVolume);
    message.minimumHosts !== undefined && (obj.minimumHosts = message.minimumHosts);
    message.threshold !== undefined && (obj.threshold = message.threshold);
    return obj;
  },

  fromPartial(object: DeepPartial<CircuitBreaker_Conf_Detectors_Failure>): CircuitBreaker_Conf_Detectors_Failure {
    const message = Object.create(
      createBaseCircuitBreaker_Conf_Detectors_Failure(),
    ) as CircuitBreaker_Conf_Detectors_Failure;
    message.requestVolume = object.requestVolume ?? undefined;
    message.minimumHosts = object.minimumHosts ?? undefined;
    message.threshold = object.threshold ?? undefined;
    return message;
  },
};

function createBaseCircuitBreaker_Conf_Thresholds(): CircuitBreaker_Conf_Thresholds {
  return { maxConnections: undefined, maxPendingRequests: undefined, maxRetries: undefined, maxRequests: undefined };
}

export const CircuitBreaker_Conf_Thresholds = {
  fromJSON(object: any): CircuitBreaker_Conf_Thresholds {
    return {
      maxConnections: isSet(object.maxConnections) ? Number(object.maxConnections) : undefined,
      maxPendingRequests: isSet(object.maxPendingRequests) ? Number(object.maxPendingRequests) : undefined,
      maxRetries: isSet(object.maxRetries) ? Number(object.maxRetries) : undefined,
      maxRequests: isSet(object.maxRequests) ? Number(object.maxRequests) : undefined,
    };
  },

  toJSON(message: CircuitBreaker_Conf_Thresholds): unknown {
    const obj: any = {};
    message.maxConnections !== undefined && (obj.maxConnections = message.maxConnections);
    message.maxPendingRequests !== undefined && (obj.maxPendingRequests = message.maxPendingRequests);
    message.maxRetries !== undefined && (obj.maxRetries = message.maxRetries);
    message.maxRequests !== undefined && (obj.maxRequests = message.maxRequests);
    return obj;
  },

  fromPartial(object: DeepPartial<CircuitBreaker_Conf_Thresholds>): CircuitBreaker_Conf_Thresholds {
    const message = Object.create(createBaseCircuitBreaker_Conf_Thresholds()) as CircuitBreaker_Conf_Thresholds;
    message.maxConnections = object.maxConnections ?? undefined;
    message.maxPendingRequests = object.maxPendingRequests ?? undefined;
    message.maxRetries = object.maxRetries ?? undefined;
    message.maxRequests = object.maxRequests ?? undefined;
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
