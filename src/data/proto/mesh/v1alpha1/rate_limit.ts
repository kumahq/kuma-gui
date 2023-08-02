/* eslint-disable */
import { Duration } from "../../google/protobuf/duration";
import { Selector } from "./selector";

export const protobufPackage = "kuma.mesh.v1alpha1";

export interface RateLimit {
  /** List of selectors to match dataplanes that rate limit will be applied for */
  sources: Selector[];
  /** List of selectors to match services that need to be rate limited. */
  destinations: Selector[];
  /**
   * Configuration for RateLimit
   * +required
   */
  conf: RateLimit_Conf | undefined;
}

export interface RateLimit_Conf {
  /**
   * The HTTP RateLimit configuration
   * +optional
   */
  http: RateLimit_Conf_Http | undefined;
}

export interface RateLimit_Conf_Http {
  /**
   * The number of HTTP requests this RateLimiter allows
   * +required
   */
  requests: number;
  /**
   * The the interval for which `requests` will be accounted.
   * +required
   */
  interval:
    | Duration
    | undefined;
  /**
   * Describes the actions to take on RatelLimiter event
   * +optional
   */
  onRateLimit: RateLimit_Conf_Http_OnRateLimit | undefined;
}

export interface RateLimit_Conf_Http_OnRateLimit {
  /**
   * The HTTP status code to be set on a RateLimit event
   * +optional
   */
  status:
    | number
    | undefined;
  /**
   * The Headers to be added to the HTTP response on a RateLimit event
   * +optional
   */
  headers: RateLimit_Conf_Http_OnRateLimit_HeaderValue[];
}

export interface RateLimit_Conf_Http_OnRateLimit_HeaderValue {
  /**
   * Header name
   * +optional
   */
  key: string;
  /**
   * Header value
   * +optional
   */
  value: string;
  /**
   * Should the header be appended
   * +optional
   */
  append: boolean | undefined;
}

function createBaseRateLimit(): RateLimit {
  return { sources: [], destinations: [], conf: undefined };
}

export const RateLimit = {
  fromJSON(object: any): RateLimit {
    return {
      sources: Array.isArray(object?.sources) ? object.sources.map((e: any) => Selector.fromJSON(e)) : [],
      destinations: Array.isArray(object?.destinations)
        ? object.destinations.map((e: any) => Selector.fromJSON(e))
        : [],
      conf: isSet(object.conf) ? RateLimit_Conf.fromJSON(object.conf) : undefined,
    };
  },

  toJSON(message: RateLimit): unknown {
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
    message.conf !== undefined && (obj.conf = message.conf ? RateLimit_Conf.toJSON(message.conf) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<RateLimit>): RateLimit {
    const message = Object.create(createBaseRateLimit()) as RateLimit;
    message.sources = object.sources?.map((e) => Selector.fromPartial(e)) || [];
    message.destinations = object.destinations?.map((e) => Selector.fromPartial(e)) || [];
    message.conf = (object.conf !== undefined && object.conf !== null)
      ? RateLimit_Conf.fromPartial(object.conf)
      : undefined;
    return message;
  },
};

function createBaseRateLimit_Conf(): RateLimit_Conf {
  return { http: undefined };
}

export const RateLimit_Conf = {
  fromJSON(object: any): RateLimit_Conf {
    return { http: isSet(object.http) ? RateLimit_Conf_Http.fromJSON(object.http) : undefined };
  },

  toJSON(message: RateLimit_Conf): unknown {
    const obj: any = {};
    message.http !== undefined && (obj.http = message.http ? RateLimit_Conf_Http.toJSON(message.http) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<RateLimit_Conf>): RateLimit_Conf {
    const message = Object.create(createBaseRateLimit_Conf()) as RateLimit_Conf;
    message.http = (object.http !== undefined && object.http !== null)
      ? RateLimit_Conf_Http.fromPartial(object.http)
      : undefined;
    return message;
  },
};

function createBaseRateLimit_Conf_Http(): RateLimit_Conf_Http {
  return { requests: 0, interval: undefined, onRateLimit: undefined };
}

export const RateLimit_Conf_Http = {
  fromJSON(object: any): RateLimit_Conf_Http {
    return {
      requests: isSet(object.requests) ? Number(object.requests) : 0,
      interval: isSet(object.interval) ? Duration.fromJSON(object.interval) : undefined,
      onRateLimit: isSet(object.onRateLimit) ? RateLimit_Conf_Http_OnRateLimit.fromJSON(object.onRateLimit) : undefined,
    };
  },

  toJSON(message: RateLimit_Conf_Http): unknown {
    const obj: any = {};
    message.requests !== undefined && (obj.requests = Math.round(message.requests));
    message.interval !== undefined && (obj.interval = message.interval ? Duration.toJSON(message.interval) : undefined);
    message.onRateLimit !== undefined &&
      (obj.onRateLimit = message.onRateLimit ? RateLimit_Conf_Http_OnRateLimit.toJSON(message.onRateLimit) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<RateLimit_Conf_Http>): RateLimit_Conf_Http {
    const message = Object.create(createBaseRateLimit_Conf_Http()) as RateLimit_Conf_Http;
    message.requests = object.requests ?? 0;
    message.interval = (object.interval !== undefined && object.interval !== null)
      ? Duration.fromPartial(object.interval)
      : undefined;
    message.onRateLimit = (object.onRateLimit !== undefined && object.onRateLimit !== null)
      ? RateLimit_Conf_Http_OnRateLimit.fromPartial(object.onRateLimit)
      : undefined;
    return message;
  },
};

function createBaseRateLimit_Conf_Http_OnRateLimit(): RateLimit_Conf_Http_OnRateLimit {
  return { status: undefined, headers: [] };
}

export const RateLimit_Conf_Http_OnRateLimit = {
  fromJSON(object: any): RateLimit_Conf_Http_OnRateLimit {
    return {
      status: isSet(object.status) ? Number(object.status) : undefined,
      headers: Array.isArray(object?.headers)
        ? object.headers.map((e: any) => RateLimit_Conf_Http_OnRateLimit_HeaderValue.fromJSON(e))
        : [],
    };
  },

  toJSON(message: RateLimit_Conf_Http_OnRateLimit): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    if (message.headers) {
      obj.headers = message.headers.map((e) => e ? RateLimit_Conf_Http_OnRateLimit_HeaderValue.toJSON(e) : undefined);
    } else {
      obj.headers = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<RateLimit_Conf_Http_OnRateLimit>): RateLimit_Conf_Http_OnRateLimit {
    const message = Object.create(createBaseRateLimit_Conf_Http_OnRateLimit()) as RateLimit_Conf_Http_OnRateLimit;
    message.status = object.status ?? undefined;
    message.headers = object.headers?.map((e) => RateLimit_Conf_Http_OnRateLimit_HeaderValue.fromPartial(e)) || [];
    return message;
  },
};

function createBaseRateLimit_Conf_Http_OnRateLimit_HeaderValue(): RateLimit_Conf_Http_OnRateLimit_HeaderValue {
  return { key: "", value: "", append: undefined };
}

export const RateLimit_Conf_Http_OnRateLimit_HeaderValue = {
  fromJSON(object: any): RateLimit_Conf_Http_OnRateLimit_HeaderValue {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? String(object.value) : "",
      append: isSet(object.append) ? Boolean(object.append) : undefined,
    };
  },

  toJSON(message: RateLimit_Conf_Http_OnRateLimit_HeaderValue): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    message.append !== undefined && (obj.append = message.append);
    return obj;
  },

  fromPartial(
    object: DeepPartial<RateLimit_Conf_Http_OnRateLimit_HeaderValue>,
  ): RateLimit_Conf_Http_OnRateLimit_HeaderValue {
    const message = Object.create(
      createBaseRateLimit_Conf_Http_OnRateLimit_HeaderValue(),
    ) as RateLimit_Conf_Http_OnRateLimit_HeaderValue;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
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
