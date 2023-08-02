/* eslint-disable */
import { Selector } from "./selector";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** TrafficRoute defines routing rules for the traffic in the mesh. */
export interface TrafficRoute {
  /** List of selectors to match data plane proxies that are sources of traffic. */
  sources: Selector[];
  /**
   * List of selectors to match services that are destinations of traffic.
   *
   * Notice the difference between sources and destinations.
   * While the source of traffic is always a data plane proxy within a mesh,
   * the destination is a service that could be either within or outside
   * of a mesh.
   */
  destinations: Selector[];
  /** Configuration for the route. */
  conf: TrafficRoute_Conf | undefined;
}

/** Split defines a destination with a weight assigned to it. */
export interface TrafficRoute_Split {
  /**
   * Weight assigned to that destination.
   * Weights are not percentages. For example two destinations with
   * weights the same weight "1" will receive both same amount of the traffic.
   * 0 means that the destination will be ignored.
   */
  weight:
    | number
    | undefined;
  /**
   * Selector to match individual endpoints that comprise that destination.
   *
   * Notice that an endpoint can be either inside or outside the mesh.
   * In the former case an endpoint corresponds to a data plane proxy,
   * in the latter case an endpoint is an External Service.
   */
  destination: { [key: string]: string };
}

export interface TrafficRoute_Split_DestinationEntry {
  key: string;
  value: string;
}

/** LoadBalancer defines the load balancing policy and configuration. */
export interface TrafficRoute_LoadBalancer {
  roundRobin?: TrafficRoute_LoadBalancer_RoundRobin | undefined;
  leastRequest?: TrafficRoute_LoadBalancer_LeastRequest | undefined;
  ringHash?: TrafficRoute_LoadBalancer_RingHash | undefined;
  random?: TrafficRoute_LoadBalancer_Random | undefined;
  maglev?: TrafficRoute_LoadBalancer_Maglev | undefined;
}

/**
 * RoundRobin is a simple policy in which each available upstream host is
 * selected in round robin order.
 */
export interface TrafficRoute_LoadBalancer_RoundRobin {
}

/**
 * LeastRequest uses different algorithms depending on whether hosts have
 * the same or different weights.
 */
export interface TrafficRoute_LoadBalancer_LeastRequest {
  /**
   * The number of random healthy hosts from which the host with the fewest
   * active requests will be chosen. Defaults to 2 so that we perform
   * two-choice selection if the field is not set.
   */
  choiceCount: number;
}

/** RingHash implements consistent hashing to upstream hosts. */
export interface TrafficRoute_LoadBalancer_RingHash {
  /**
   * The hash function used to hash hosts onto the ketama ring. The value
   * defaults to 'XX_HASH'.
   */
  hashFunction: string;
  /** Minimum hash ring size. */
  minRingSize: number;
  /** Maximum hash ring size. */
  maxRingSize: number;
}

/** Random selects a random available host. */
export interface TrafficRoute_LoadBalancer_Random {
}

/** Maglev implements consistent hashing to upstream hosts. */
export interface TrafficRoute_LoadBalancer_Maglev {
}

/** Conf defines the destination configuration. */
export interface TrafficRoute_Conf {
  /**
   * List of destinations with weights assigned to them.
   * When used, "destination" is not allowed.
   */
  split: TrafficRoute_Split[];
  /** Load balancer configuration for given "split" or "destination" */
  loadBalancer:
    | TrafficRoute_LoadBalancer
    | undefined;
  /**
   * One destination that the traffic will be redirected to.
   * When used, "split" is not allowed.
   */
  destination: { [key: string]: string };
  /**
   * Configuration of HTTP traffic. Traffic is matched one by one with the
   * order defined in the list. If the request does not match any criteria
   * then "split" or "destination" outside of "http" section is executed.
   */
  http: TrafficRoute_Http[];
}

export interface TrafficRoute_Conf_DestinationEntry {
  key: string;
  value: string;
}

/** Http defines configuration for HTTP traffic. */
export interface TrafficRoute_Http {
  /**
   * If request matches against defined criteria then "split" or "destination"
   * is executed.
   */
  match:
    | TrafficRoute_Http_Match
    | undefined;
  /** Modifications to the traffic matched by the match section. */
  modify:
    | TrafficRoute_Http_Modify
    | undefined;
  /**
   * List of destinations with weights assigned to them.
   * When used, "destination" is not allowed.
   */
  split: TrafficRoute_Split[];
  /**
   * One destination that the traffic will be redirected to.
   * When used, "split" is not allowed.
   */
  destination: { [key: string]: string };
}

/**
 * Match defines a series of matching criteria to apply modification and
 * reroute the traffic.
 */
export interface TrafficRoute_Http_Match {
  /** Method matches method of HTTP request. */
  method:
    | TrafficRoute_Http_Match_StringMatcher
    | undefined;
  /** Path matches HTTP path. */
  path:
    | TrafficRoute_Http_Match_StringMatcher
    | undefined;
  /** Headers match HTTP request headers. */
  headers: { [key: string]: TrafficRoute_Http_Match_StringMatcher };
}

/** StringMatcher matches the string value. */
export interface TrafficRoute_Http_Match_StringMatcher {
  /** Prefix matches the string against defined prefix. */
  prefix?:
    | string
    | undefined;
  /** Exact checks that strings are equal to each other. */
  exact?:
    | string
    | undefined;
  /**
   * Regex checks the string using RE2 syntax.
   * https://github.com/google/re2/wiki/Syntax
   */
  regex?: string | undefined;
}

export interface TrafficRoute_Http_Match_HeadersEntry {
  key: string;
  value: TrafficRoute_Http_Match_StringMatcher | undefined;
}

/** Modify defines modifications of matched HTTP messages. */
export interface TrafficRoute_Http_Modify {
  /** Path modifications. */
  path:
    | TrafficRoute_Http_Modify_Path
    | undefined;
  /** Host modifications. */
  host:
    | TrafficRoute_Http_Modify_Host
    | undefined;
  /** Request headers modifications. */
  requestHeaders:
    | TrafficRoute_Http_Modify_Headers
    | undefined;
  /** Response headers modifications. */
  responseHeaders: TrafficRoute_Http_Modify_Headers | undefined;
}

/**
 * RegexReplace defines a way to match string using regex and build a new
 * one using substitution section.
 */
export interface TrafficRoute_Http_Modify_RegexReplace {
  /**
   * Pattern of the regex using RE2 syntax.
   * https://github.com/google/re2/wiki/Syntax
   */
  pattern: string;
  /**
   * Substitution using regex groups. E.g. use \\1 as a first matched
   * group.
   */
  substitution: string;
}

/** Path defines modification of path of the HTTP request. */
export interface TrafficRoute_Http_Modify_Path {
  /** RewritePrefix rewrites previously matched prefix in match section. */
  rewritePrefix?:
    | string
    | undefined;
  /** Regex rewrites prefix using regex with substitution. */
  regex?: TrafficRoute_Http_Modify_RegexReplace | undefined;
}

/** Host defines modification of the HTTP Host header */
export interface TrafficRoute_Http_Modify_Host {
  /** Value replaces the host header with given value. */
  value?:
    | string
    | undefined;
  /** FromPath replaces the host header from path using regex. */
  fromPath?: TrafficRoute_Http_Modify_RegexReplace | undefined;
}

/** Headers defines modification of HTTP headers. */
export interface TrafficRoute_Http_Modify_Headers {
  /** List of add header operations. */
  add: TrafficRoute_Http_Modify_Headers_Add[];
  /** List of remove header operations. */
  remove: TrafficRoute_Http_Modify_Headers_Remove[];
}

/** Add defines operation of adding new HTTP header. */
export interface TrafficRoute_Http_Modify_Headers_Add {
  /** Name of the header. */
  name: string;
  /** Value of the header. */
  value: string;
  /**
   * If true, it appends the value if there is already a value.
   * Otherwise, value of existing header will be replaced.
   */
  append: boolean;
}

/** Remove defines operation of removing an HTTP header. */
export interface TrafficRoute_Http_Modify_Headers_Remove {
  /** Name of the header to remove. */
  name: string;
}

export interface TrafficRoute_Http_DestinationEntry {
  key: string;
  value: string;
}

function createBaseTrafficRoute(): TrafficRoute {
  return { sources: [], destinations: [], conf: undefined };
}

export const TrafficRoute = {
  fromJSON(object: any): TrafficRoute {
    return {
      sources: Array.isArray(object?.sources) ? object.sources.map((e: any) => Selector.fromJSON(e)) : [],
      destinations: Array.isArray(object?.destinations)
        ? object.destinations.map((e: any) => Selector.fromJSON(e))
        : [],
      conf: isSet(object.conf) ? TrafficRoute_Conf.fromJSON(object.conf) : undefined,
    };
  },

  toJSON(message: TrafficRoute): unknown {
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
    message.conf !== undefined && (obj.conf = message.conf ? TrafficRoute_Conf.toJSON(message.conf) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute>): TrafficRoute {
    const message = Object.create(createBaseTrafficRoute()) as TrafficRoute;
    message.sources = object.sources?.map((e) => Selector.fromPartial(e)) || [];
    message.destinations = object.destinations?.map((e) => Selector.fromPartial(e)) || [];
    message.conf = (object.conf !== undefined && object.conf !== null)
      ? TrafficRoute_Conf.fromPartial(object.conf)
      : undefined;
    return message;
  },
};

function createBaseTrafficRoute_Split(): TrafficRoute_Split {
  return { weight: undefined, destination: {} };
}

export const TrafficRoute_Split = {
  fromJSON(object: any): TrafficRoute_Split {
    return {
      weight: isSet(object.weight) ? Number(object.weight) : undefined,
      destination: isObject(object.destination)
        ? Object.entries(object.destination).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: TrafficRoute_Split): unknown {
    const obj: any = {};
    message.weight !== undefined && (obj.weight = message.weight);
    obj.destination = {};
    if (message.destination) {
      Object.entries(message.destination).forEach(([k, v]) => {
        obj.destination[k] = v;
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Split>): TrafficRoute_Split {
    const message = Object.create(createBaseTrafficRoute_Split()) as TrafficRoute_Split;
    message.weight = object.weight ?? undefined;
    message.destination = Object.entries(object.destination ?? {}).reduce<{ [key: string]: string }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      },
      {},
    );
    return message;
  },
};

function createBaseTrafficRoute_Split_DestinationEntry(): TrafficRoute_Split_DestinationEntry {
  return { key: "", value: "" };
}

export const TrafficRoute_Split_DestinationEntry = {
  fromJSON(object: any): TrafficRoute_Split_DestinationEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: TrafficRoute_Split_DestinationEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Split_DestinationEntry>): TrafficRoute_Split_DestinationEntry {
    const message = Object.create(
      createBaseTrafficRoute_Split_DestinationEntry(),
    ) as TrafficRoute_Split_DestinationEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseTrafficRoute_LoadBalancer(): TrafficRoute_LoadBalancer {
  return {};
}

export const TrafficRoute_LoadBalancer = {
  fromJSON(object: any): TrafficRoute_LoadBalancer {
    return {
      roundRobin: isSet(object.roundRobin)
        ? TrafficRoute_LoadBalancer_RoundRobin.fromJSON(object.roundRobin)
        : undefined,
      leastRequest: isSet(object.leastRequest)
        ? TrafficRoute_LoadBalancer_LeastRequest.fromJSON(object.leastRequest)
        : undefined,
      ringHash: isSet(object.ringHash) ? TrafficRoute_LoadBalancer_RingHash.fromJSON(object.ringHash) : undefined,
      random: isSet(object.random) ? TrafficRoute_LoadBalancer_Random.fromJSON(object.random) : undefined,
      maglev: isSet(object.maglev) ? TrafficRoute_LoadBalancer_Maglev.fromJSON(object.maglev) : undefined,
    };
  },

  toJSON(message: TrafficRoute_LoadBalancer): unknown {
    const obj: any = {};
    message.roundRobin !== undefined &&
      (obj.roundRobin = message.roundRobin
        ? TrafficRoute_LoadBalancer_RoundRobin.toJSON(message.roundRobin)
        : undefined);
    message.leastRequest !== undefined && (obj.leastRequest = message.leastRequest
      ? TrafficRoute_LoadBalancer_LeastRequest.toJSON(message.leastRequest)
      : undefined);
    message.ringHash !== undefined &&
      (obj.ringHash = message.ringHash ? TrafficRoute_LoadBalancer_RingHash.toJSON(message.ringHash) : undefined);
    message.random !== undefined &&
      (obj.random = message.random ? TrafficRoute_LoadBalancer_Random.toJSON(message.random) : undefined);
    message.maglev !== undefined &&
      (obj.maglev = message.maglev ? TrafficRoute_LoadBalancer_Maglev.toJSON(message.maglev) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_LoadBalancer>): TrafficRoute_LoadBalancer {
    const message = Object.create(createBaseTrafficRoute_LoadBalancer()) as TrafficRoute_LoadBalancer;
    message.roundRobin = (object.roundRobin !== undefined && object.roundRobin !== null)
      ? TrafficRoute_LoadBalancer_RoundRobin.fromPartial(object.roundRobin)
      : undefined;
    message.leastRequest = (object.leastRequest !== undefined && object.leastRequest !== null)
      ? TrafficRoute_LoadBalancer_LeastRequest.fromPartial(object.leastRequest)
      : undefined;
    message.ringHash = (object.ringHash !== undefined && object.ringHash !== null)
      ? TrafficRoute_LoadBalancer_RingHash.fromPartial(object.ringHash)
      : undefined;
    message.random = (object.random !== undefined && object.random !== null)
      ? TrafficRoute_LoadBalancer_Random.fromPartial(object.random)
      : undefined;
    message.maglev = (object.maglev !== undefined && object.maglev !== null)
      ? TrafficRoute_LoadBalancer_Maglev.fromPartial(object.maglev)
      : undefined;
    return message;
  },
};

function createBaseTrafficRoute_LoadBalancer_RoundRobin(): TrafficRoute_LoadBalancer_RoundRobin {
  return {};
}

export const TrafficRoute_LoadBalancer_RoundRobin = {
  fromJSON(_: any): TrafficRoute_LoadBalancer_RoundRobin {
    return {};
  },

  toJSON(_: TrafficRoute_LoadBalancer_RoundRobin): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<TrafficRoute_LoadBalancer_RoundRobin>): TrafficRoute_LoadBalancer_RoundRobin {
    const message = Object.create(
      createBaseTrafficRoute_LoadBalancer_RoundRobin(),
    ) as TrafficRoute_LoadBalancer_RoundRobin;
    return message;
  },
};

function createBaseTrafficRoute_LoadBalancer_LeastRequest(): TrafficRoute_LoadBalancer_LeastRequest {
  return { choiceCount: 0 };
}

export const TrafficRoute_LoadBalancer_LeastRequest = {
  fromJSON(object: any): TrafficRoute_LoadBalancer_LeastRequest {
    return { choiceCount: isSet(object.choiceCount) ? Number(object.choiceCount) : 0 };
  },

  toJSON(message: TrafficRoute_LoadBalancer_LeastRequest): unknown {
    const obj: any = {};
    message.choiceCount !== undefined && (obj.choiceCount = Math.round(message.choiceCount));
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_LoadBalancer_LeastRequest>): TrafficRoute_LoadBalancer_LeastRequest {
    const message = Object.create(
      createBaseTrafficRoute_LoadBalancer_LeastRequest(),
    ) as TrafficRoute_LoadBalancer_LeastRequest;
    message.choiceCount = object.choiceCount ?? 0;
    return message;
  },
};

function createBaseTrafficRoute_LoadBalancer_RingHash(): TrafficRoute_LoadBalancer_RingHash {
  return { hashFunction: "", minRingSize: 0, maxRingSize: 0 };
}

export const TrafficRoute_LoadBalancer_RingHash = {
  fromJSON(object: any): TrafficRoute_LoadBalancer_RingHash {
    return {
      hashFunction: isSet(object.hashFunction) ? String(object.hashFunction) : "",
      minRingSize: isSet(object.minRingSize) ? Number(object.minRingSize) : 0,
      maxRingSize: isSet(object.maxRingSize) ? Number(object.maxRingSize) : 0,
    };
  },

  toJSON(message: TrafficRoute_LoadBalancer_RingHash): unknown {
    const obj: any = {};
    message.hashFunction !== undefined && (obj.hashFunction = message.hashFunction);
    message.minRingSize !== undefined && (obj.minRingSize = Math.round(message.minRingSize));
    message.maxRingSize !== undefined && (obj.maxRingSize = Math.round(message.maxRingSize));
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_LoadBalancer_RingHash>): TrafficRoute_LoadBalancer_RingHash {
    const message = Object.create(createBaseTrafficRoute_LoadBalancer_RingHash()) as TrafficRoute_LoadBalancer_RingHash;
    message.hashFunction = object.hashFunction ?? "";
    message.minRingSize = object.minRingSize ?? 0;
    message.maxRingSize = object.maxRingSize ?? 0;
    return message;
  },
};

function createBaseTrafficRoute_LoadBalancer_Random(): TrafficRoute_LoadBalancer_Random {
  return {};
}

export const TrafficRoute_LoadBalancer_Random = {
  fromJSON(_: any): TrafficRoute_LoadBalancer_Random {
    return {};
  },

  toJSON(_: TrafficRoute_LoadBalancer_Random): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<TrafficRoute_LoadBalancer_Random>): TrafficRoute_LoadBalancer_Random {
    const message = Object.create(createBaseTrafficRoute_LoadBalancer_Random()) as TrafficRoute_LoadBalancer_Random;
    return message;
  },
};

function createBaseTrafficRoute_LoadBalancer_Maglev(): TrafficRoute_LoadBalancer_Maglev {
  return {};
}

export const TrafficRoute_LoadBalancer_Maglev = {
  fromJSON(_: any): TrafficRoute_LoadBalancer_Maglev {
    return {};
  },

  toJSON(_: TrafficRoute_LoadBalancer_Maglev): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<TrafficRoute_LoadBalancer_Maglev>): TrafficRoute_LoadBalancer_Maglev {
    const message = Object.create(createBaseTrafficRoute_LoadBalancer_Maglev()) as TrafficRoute_LoadBalancer_Maglev;
    return message;
  },
};

function createBaseTrafficRoute_Conf(): TrafficRoute_Conf {
  return { split: [], loadBalancer: undefined, destination: {}, http: [] };
}

export const TrafficRoute_Conf = {
  fromJSON(object: any): TrafficRoute_Conf {
    return {
      split: Array.isArray(object?.split) ? object.split.map((e: any) => TrafficRoute_Split.fromJSON(e)) : [],
      loadBalancer: isSet(object.loadBalancer) ? TrafficRoute_LoadBalancer.fromJSON(object.loadBalancer) : undefined,
      destination: isObject(object.destination)
        ? Object.entries(object.destination).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      http: Array.isArray(object?.http)
        ? object.http.map((e: any) => TrafficRoute_Http.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TrafficRoute_Conf): unknown {
    const obj: any = {};
    if (message.split) {
      obj.split = message.split.map((e) => e ? TrafficRoute_Split.toJSON(e) : undefined);
    } else {
      obj.split = [];
    }
    message.loadBalancer !== undefined &&
      (obj.loadBalancer = message.loadBalancer ? TrafficRoute_LoadBalancer.toJSON(message.loadBalancer) : undefined);
    obj.destination = {};
    if (message.destination) {
      Object.entries(message.destination).forEach(([k, v]) => {
        obj.destination[k] = v;
      });
    }
    if (message.http) {
      obj.http = message.http.map((e) => e ? TrafficRoute_Http.toJSON(e) : undefined);
    } else {
      obj.http = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Conf>): TrafficRoute_Conf {
    const message = Object.create(createBaseTrafficRoute_Conf()) as TrafficRoute_Conf;
    message.split = object.split?.map((e) => TrafficRoute_Split.fromPartial(e)) || [];
    message.loadBalancer = (object.loadBalancer !== undefined && object.loadBalancer !== null)
      ? TrafficRoute_LoadBalancer.fromPartial(object.loadBalancer)
      : undefined;
    message.destination = Object.entries(object.destination ?? {}).reduce<{ [key: string]: string }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      },
      {},
    );
    message.http = object.http?.map((e) => TrafficRoute_Http.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTrafficRoute_Conf_DestinationEntry(): TrafficRoute_Conf_DestinationEntry {
  return { key: "", value: "" };
}

export const TrafficRoute_Conf_DestinationEntry = {
  fromJSON(object: any): TrafficRoute_Conf_DestinationEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: TrafficRoute_Conf_DestinationEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Conf_DestinationEntry>): TrafficRoute_Conf_DestinationEntry {
    const message = Object.create(createBaseTrafficRoute_Conf_DestinationEntry()) as TrafficRoute_Conf_DestinationEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseTrafficRoute_Http(): TrafficRoute_Http {
  return { match: undefined, modify: undefined, split: [], destination: {} };
}

export const TrafficRoute_Http = {
  fromJSON(object: any): TrafficRoute_Http {
    return {
      match: isSet(object.match) ? TrafficRoute_Http_Match.fromJSON(object.match) : undefined,
      modify: isSet(object.modify) ? TrafficRoute_Http_Modify.fromJSON(object.modify) : undefined,
      split: Array.isArray(object?.split) ? object.split.map((e: any) => TrafficRoute_Split.fromJSON(e)) : [],
      destination: isObject(object.destination)
        ? Object.entries(object.destination).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: TrafficRoute_Http): unknown {
    const obj: any = {};
    message.match !== undefined &&
      (obj.match = message.match ? TrafficRoute_Http_Match.toJSON(message.match) : undefined);
    message.modify !== undefined &&
      (obj.modify = message.modify ? TrafficRoute_Http_Modify.toJSON(message.modify) : undefined);
    if (message.split) {
      obj.split = message.split.map((e) => e ? TrafficRoute_Split.toJSON(e) : undefined);
    } else {
      obj.split = [];
    }
    obj.destination = {};
    if (message.destination) {
      Object.entries(message.destination).forEach(([k, v]) => {
        obj.destination[k] = v;
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Http>): TrafficRoute_Http {
    const message = Object.create(createBaseTrafficRoute_Http()) as TrafficRoute_Http;
    message.match = (object.match !== undefined && object.match !== null)
      ? TrafficRoute_Http_Match.fromPartial(object.match)
      : undefined;
    message.modify = (object.modify !== undefined && object.modify !== null)
      ? TrafficRoute_Http_Modify.fromPartial(object.modify)
      : undefined;
    message.split = object.split?.map((e) => TrafficRoute_Split.fromPartial(e)) || [];
    message.destination = Object.entries(object.destination ?? {}).reduce<{ [key: string]: string }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      },
      {},
    );
    return message;
  },
};

function createBaseTrafficRoute_Http_Match(): TrafficRoute_Http_Match {
  return { method: undefined, path: undefined, headers: {} };
}

export const TrafficRoute_Http_Match = {
  fromJSON(object: any): TrafficRoute_Http_Match {
    return {
      method: isSet(object.method) ? TrafficRoute_Http_Match_StringMatcher.fromJSON(object.method) : undefined,
      path: isSet(object.path) ? TrafficRoute_Http_Match_StringMatcher.fromJSON(object.path) : undefined,
      headers: isObject(object.headers)
        ? Object.entries(object.headers).reduce<{ [key: string]: TrafficRoute_Http_Match_StringMatcher }>(
          (acc, [key, value]) => {
            acc[key] = TrafficRoute_Http_Match_StringMatcher.fromJSON(value);
            return acc;
          },
          {},
        )
        : {},
    };
  },

  toJSON(message: TrafficRoute_Http_Match): unknown {
    const obj: any = {};
    message.method !== undefined &&
      (obj.method = message.method ? TrafficRoute_Http_Match_StringMatcher.toJSON(message.method) : undefined);
    message.path !== undefined &&
      (obj.path = message.path ? TrafficRoute_Http_Match_StringMatcher.toJSON(message.path) : undefined);
    obj.headers = {};
    if (message.headers) {
      Object.entries(message.headers).forEach(([k, v]) => {
        obj.headers[k] = TrafficRoute_Http_Match_StringMatcher.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Http_Match>): TrafficRoute_Http_Match {
    const message = Object.create(createBaseTrafficRoute_Http_Match()) as TrafficRoute_Http_Match;
    message.method = (object.method !== undefined && object.method !== null)
      ? TrafficRoute_Http_Match_StringMatcher.fromPartial(object.method)
      : undefined;
    message.path = (object.path !== undefined && object.path !== null)
      ? TrafficRoute_Http_Match_StringMatcher.fromPartial(object.path)
      : undefined;
    message.headers = Object.entries(object.headers ?? {}).reduce<
      { [key: string]: TrafficRoute_Http_Match_StringMatcher }
    >((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = TrafficRoute_Http_Match_StringMatcher.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseTrafficRoute_Http_Match_StringMatcher(): TrafficRoute_Http_Match_StringMatcher {
  return {};
}

export const TrafficRoute_Http_Match_StringMatcher = {
  fromJSON(object: any): TrafficRoute_Http_Match_StringMatcher {
    return {
      prefix: isSet(object.prefix) ? String(object.prefix) : undefined,
      exact: isSet(object.exact) ? String(object.exact) : undefined,
      regex: isSet(object.regex) ? String(object.regex) : undefined,
    };
  },

  toJSON(message: TrafficRoute_Http_Match_StringMatcher): unknown {
    const obj: any = {};
    message.prefix !== undefined && (obj.prefix = message.prefix);
    message.exact !== undefined && (obj.exact = message.exact);
    message.regex !== undefined && (obj.regex = message.regex);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Http_Match_StringMatcher>): TrafficRoute_Http_Match_StringMatcher {
    const message = Object.create(
      createBaseTrafficRoute_Http_Match_StringMatcher(),
    ) as TrafficRoute_Http_Match_StringMatcher;
    message.prefix = object.prefix ?? undefined;
    message.exact = object.exact ?? undefined;
    message.regex = object.regex ?? undefined;
    return message;
  },
};

function createBaseTrafficRoute_Http_Match_HeadersEntry(): TrafficRoute_Http_Match_HeadersEntry {
  return { key: "", value: undefined };
}

export const TrafficRoute_Http_Match_HeadersEntry = {
  fromJSON(object: any): TrafficRoute_Http_Match_HeadersEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? TrafficRoute_Http_Match_StringMatcher.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: TrafficRoute_Http_Match_HeadersEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? TrafficRoute_Http_Match_StringMatcher.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Http_Match_HeadersEntry>): TrafficRoute_Http_Match_HeadersEntry {
    const message = Object.create(
      createBaseTrafficRoute_Http_Match_HeadersEntry(),
    ) as TrafficRoute_Http_Match_HeadersEntry;
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? TrafficRoute_Http_Match_StringMatcher.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseTrafficRoute_Http_Modify(): TrafficRoute_Http_Modify {
  return { path: undefined, host: undefined, requestHeaders: undefined, responseHeaders: undefined };
}

export const TrafficRoute_Http_Modify = {
  fromJSON(object: any): TrafficRoute_Http_Modify {
    return {
      path: isSet(object.path) ? TrafficRoute_Http_Modify_Path.fromJSON(object.path) : undefined,
      host: isSet(object.host) ? TrafficRoute_Http_Modify_Host.fromJSON(object.host) : undefined,
      requestHeaders: isSet(object.requestHeaders)
        ? TrafficRoute_Http_Modify_Headers.fromJSON(object.requestHeaders)
        : undefined,
      responseHeaders: isSet(object.responseHeaders)
        ? TrafficRoute_Http_Modify_Headers.fromJSON(object.responseHeaders)
        : undefined,
    };
  },

  toJSON(message: TrafficRoute_Http_Modify): unknown {
    const obj: any = {};
    message.path !== undefined &&
      (obj.path = message.path ? TrafficRoute_Http_Modify_Path.toJSON(message.path) : undefined);
    message.host !== undefined &&
      (obj.host = message.host ? TrafficRoute_Http_Modify_Host.toJSON(message.host) : undefined);
    message.requestHeaders !== undefined && (obj.requestHeaders = message.requestHeaders
      ? TrafficRoute_Http_Modify_Headers.toJSON(message.requestHeaders)
      : undefined);
    message.responseHeaders !== undefined && (obj.responseHeaders = message.responseHeaders
      ? TrafficRoute_Http_Modify_Headers.toJSON(message.responseHeaders)
      : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Http_Modify>): TrafficRoute_Http_Modify {
    const message = Object.create(createBaseTrafficRoute_Http_Modify()) as TrafficRoute_Http_Modify;
    message.path = (object.path !== undefined && object.path !== null)
      ? TrafficRoute_Http_Modify_Path.fromPartial(object.path)
      : undefined;
    message.host = (object.host !== undefined && object.host !== null)
      ? TrafficRoute_Http_Modify_Host.fromPartial(object.host)
      : undefined;
    message.requestHeaders = (object.requestHeaders !== undefined && object.requestHeaders !== null)
      ? TrafficRoute_Http_Modify_Headers.fromPartial(object.requestHeaders)
      : undefined;
    message.responseHeaders = (object.responseHeaders !== undefined && object.responseHeaders !== null)
      ? TrafficRoute_Http_Modify_Headers.fromPartial(object.responseHeaders)
      : undefined;
    return message;
  },
};

function createBaseTrafficRoute_Http_Modify_RegexReplace(): TrafficRoute_Http_Modify_RegexReplace {
  return { pattern: "", substitution: "" };
}

export const TrafficRoute_Http_Modify_RegexReplace = {
  fromJSON(object: any): TrafficRoute_Http_Modify_RegexReplace {
    return {
      pattern: isSet(object.pattern) ? String(object.pattern) : "",
      substitution: isSet(object.substitution) ? String(object.substitution) : "",
    };
  },

  toJSON(message: TrafficRoute_Http_Modify_RegexReplace): unknown {
    const obj: any = {};
    message.pattern !== undefined && (obj.pattern = message.pattern);
    message.substitution !== undefined && (obj.substitution = message.substitution);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Http_Modify_RegexReplace>): TrafficRoute_Http_Modify_RegexReplace {
    const message = Object.create(
      createBaseTrafficRoute_Http_Modify_RegexReplace(),
    ) as TrafficRoute_Http_Modify_RegexReplace;
    message.pattern = object.pattern ?? "";
    message.substitution = object.substitution ?? "";
    return message;
  },
};

function createBaseTrafficRoute_Http_Modify_Path(): TrafficRoute_Http_Modify_Path {
  return {};
}

export const TrafficRoute_Http_Modify_Path = {
  fromJSON(object: any): TrafficRoute_Http_Modify_Path {
    return {
      rewritePrefix: isSet(object.rewritePrefix) ? String(object.rewritePrefix) : undefined,
      regex: isSet(object.regex) ? TrafficRoute_Http_Modify_RegexReplace.fromJSON(object.regex) : undefined,
    };
  },

  toJSON(message: TrafficRoute_Http_Modify_Path): unknown {
    const obj: any = {};
    message.rewritePrefix !== undefined && (obj.rewritePrefix = message.rewritePrefix);
    message.regex !== undefined &&
      (obj.regex = message.regex ? TrafficRoute_Http_Modify_RegexReplace.toJSON(message.regex) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Http_Modify_Path>): TrafficRoute_Http_Modify_Path {
    const message = Object.create(createBaseTrafficRoute_Http_Modify_Path()) as TrafficRoute_Http_Modify_Path;
    message.rewritePrefix = object.rewritePrefix ?? undefined;
    message.regex = (object.regex !== undefined && object.regex !== null)
      ? TrafficRoute_Http_Modify_RegexReplace.fromPartial(object.regex)
      : undefined;
    return message;
  },
};

function createBaseTrafficRoute_Http_Modify_Host(): TrafficRoute_Http_Modify_Host {
  return {};
}

export const TrafficRoute_Http_Modify_Host = {
  fromJSON(object: any): TrafficRoute_Http_Modify_Host {
    return {
      value: isSet(object.value) ? String(object.value) : undefined,
      fromPath: isSet(object.fromPath) ? TrafficRoute_Http_Modify_RegexReplace.fromJSON(object.fromPath) : undefined,
    };
  },

  toJSON(message: TrafficRoute_Http_Modify_Host): unknown {
    const obj: any = {};
    message.value !== undefined && (obj.value = message.value);
    message.fromPath !== undefined &&
      (obj.fromPath = message.fromPath ? TrafficRoute_Http_Modify_RegexReplace.toJSON(message.fromPath) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Http_Modify_Host>): TrafficRoute_Http_Modify_Host {
    const message = Object.create(createBaseTrafficRoute_Http_Modify_Host()) as TrafficRoute_Http_Modify_Host;
    message.value = object.value ?? undefined;
    message.fromPath = (object.fromPath !== undefined && object.fromPath !== null)
      ? TrafficRoute_Http_Modify_RegexReplace.fromPartial(object.fromPath)
      : undefined;
    return message;
  },
};

function createBaseTrafficRoute_Http_Modify_Headers(): TrafficRoute_Http_Modify_Headers {
  return { add: [], remove: [] };
}

export const TrafficRoute_Http_Modify_Headers = {
  fromJSON(object: any): TrafficRoute_Http_Modify_Headers {
    return {
      add: Array.isArray(object?.add)
        ? object.add.map((e: any) => TrafficRoute_Http_Modify_Headers_Add.fromJSON(e))
        : [],
      remove: Array.isArray(object?.remove)
        ? object.remove.map((e: any) => TrafficRoute_Http_Modify_Headers_Remove.fromJSON(e))
        : [],
    };
  },

  toJSON(message: TrafficRoute_Http_Modify_Headers): unknown {
    const obj: any = {};
    if (message.add) {
      obj.add = message.add.map((e) => e ? TrafficRoute_Http_Modify_Headers_Add.toJSON(e) : undefined);
    } else {
      obj.add = [];
    }
    if (message.remove) {
      obj.remove = message.remove.map((e) => e ? TrafficRoute_Http_Modify_Headers_Remove.toJSON(e) : undefined);
    } else {
      obj.remove = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Http_Modify_Headers>): TrafficRoute_Http_Modify_Headers {
    const message = Object.create(createBaseTrafficRoute_Http_Modify_Headers()) as TrafficRoute_Http_Modify_Headers;
    message.add = object.add?.map((e) => TrafficRoute_Http_Modify_Headers_Add.fromPartial(e)) || [];
    message.remove = object.remove?.map((e) => TrafficRoute_Http_Modify_Headers_Remove.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTrafficRoute_Http_Modify_Headers_Add(): TrafficRoute_Http_Modify_Headers_Add {
  return { name: "", value: "", append: false };
}

export const TrafficRoute_Http_Modify_Headers_Add = {
  fromJSON(object: any): TrafficRoute_Http_Modify_Headers_Add {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      value: isSet(object.value) ? String(object.value) : "",
      append: isSet(object.append) ? Boolean(object.append) : false,
    };
  },

  toJSON(message: TrafficRoute_Http_Modify_Headers_Add): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.value !== undefined && (obj.value = message.value);
    message.append !== undefined && (obj.append = message.append);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Http_Modify_Headers_Add>): TrafficRoute_Http_Modify_Headers_Add {
    const message = Object.create(
      createBaseTrafficRoute_Http_Modify_Headers_Add(),
    ) as TrafficRoute_Http_Modify_Headers_Add;
    message.name = object.name ?? "";
    message.value = object.value ?? "";
    message.append = object.append ?? false;
    return message;
  },
};

function createBaseTrafficRoute_Http_Modify_Headers_Remove(): TrafficRoute_Http_Modify_Headers_Remove {
  return { name: "" };
}

export const TrafficRoute_Http_Modify_Headers_Remove = {
  fromJSON(object: any): TrafficRoute_Http_Modify_Headers_Remove {
    return { name: isSet(object.name) ? String(object.name) : "" };
  },

  toJSON(message: TrafficRoute_Http_Modify_Headers_Remove): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Http_Modify_Headers_Remove>): TrafficRoute_Http_Modify_Headers_Remove {
    const message = Object.create(
      createBaseTrafficRoute_Http_Modify_Headers_Remove(),
    ) as TrafficRoute_Http_Modify_Headers_Remove;
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseTrafficRoute_Http_DestinationEntry(): TrafficRoute_Http_DestinationEntry {
  return { key: "", value: "" };
}

export const TrafficRoute_Http_DestinationEntry = {
  fromJSON(object: any): TrafficRoute_Http_DestinationEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: TrafficRoute_Http_DestinationEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<TrafficRoute_Http_DestinationEntry>): TrafficRoute_Http_DestinationEntry {
    const message = Object.create(createBaseTrafficRoute_Http_DestinationEntry()) as TrafficRoute_Http_DestinationEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
