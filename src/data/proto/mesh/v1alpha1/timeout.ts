/* eslint-disable */
import { Duration } from "../../google/protobuf/duration";
import { Selector } from "./selector";

export const protobufPackage = "kuma.mesh.v1alpha1";

export interface Timeout {
  /** List of selectors to match dataplanes that are sources of traffic. */
  sources: Selector[];
  /** List of selectors to match services that are destinations of traffic. */
  destinations: Selector[];
  conf: Timeout_Conf | undefined;
}

export interface Timeout_Conf {
  /** ConnectTimeout defines time to establish connection */
  connectTimeout: Duration | undefined;
  tcp: Timeout_Conf_Tcp | undefined;
  http:
    | Timeout_Conf_Http
    | undefined;
  /** Deprecated: set parameters through Http section */
  grpc: Timeout_Conf_Grpc | undefined;
}

/** Tcp defines timeouts that are applied when the protocol is TCP */
export interface Timeout_Conf_Tcp {
  /**
   * IdleTimeout is defined as the period in which there are no bytes sent
   * or received on either the upstream or downstream connection
   */
  idleTimeout: Duration | undefined;
}

/** Http defines timeouts that are applied when the protocol is HTTP */
export interface Timeout_Conf_Http {
  /**
   * RequestTimeout is a span between the point at which the entire
   * downstream request (i.e. end-of-stream) has been processed and when the
   * upstream response has been completely processed
   */
  requestTimeout:
    | Duration
    | undefined;
  /**
   * IdleTimeout is the time at which a downstream or upstream connection
   * will be terminated if there are no active streams
   */
  idleTimeout:
    | Duration
    | undefined;
  /**
   * StreamIdleTimeout is the amount of time that the connection manager
   * will allow a stream to exist with no upstream or downstream activity
   */
  streamIdleTimeout:
    | Duration
    | undefined;
  /**
   * MaxStreamDuration is the maximum time that a stream’s lifetime will
   * span
   */
  maxStreamDuration: Duration | undefined;
}

/** Grpc defines timeouts that are applied when the protocol is GRPC */
export interface Timeout_Conf_Grpc {
  /**
   * StreamIdleTimeout is the amount of time that the connection manager
   * will allow a stream to exist with no upstream or downstream activity
   * Deprecated: use Http.StreamIdleTimeout instead
   */
  streamIdleTimeout:
    | Duration
    | undefined;
  /**
   * MaxStreamDuration is the maximum time that a stream’s lifetime will
   * span
   * Deprecated: use Http.MaxStreamDuration instead
   */
  maxStreamDuration: Duration | undefined;
}

function createBaseTimeout(): Timeout {
  return { sources: [], destinations: [], conf: undefined };
}

export const Timeout = {
  fromJSON(object: any): Timeout {
    return {
      sources: Array.isArray(object?.sources) ? object.sources.map((e: any) => Selector.fromJSON(e)) : [],
      destinations: Array.isArray(object?.destinations)
        ? object.destinations.map((e: any) => Selector.fromJSON(e))
        : [],
      conf: isSet(object.conf) ? Timeout_Conf.fromJSON(object.conf) : undefined,
    };
  },

  toJSON(message: Timeout): unknown {
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
    message.conf !== undefined && (obj.conf = message.conf ? Timeout_Conf.toJSON(message.conf) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Timeout>): Timeout {
    const message = Object.create(createBaseTimeout()) as Timeout;
    message.sources = object.sources?.map((e) => Selector.fromPartial(e)) || [];
    message.destinations = object.destinations?.map((e) => Selector.fromPartial(e)) || [];
    message.conf = (object.conf !== undefined && object.conf !== null)
      ? Timeout_Conf.fromPartial(object.conf)
      : undefined;
    return message;
  },
};

function createBaseTimeout_Conf(): Timeout_Conf {
  return { connectTimeout: undefined, tcp: undefined, http: undefined, grpc: undefined };
}

export const Timeout_Conf = {
  fromJSON(object: any): Timeout_Conf {
    return {
      connectTimeout: isSet(object.connectTimeout) ? Duration.fromJSON(object.connectTimeout) : undefined,
      tcp: isSet(object.tcp) ? Timeout_Conf_Tcp.fromJSON(object.tcp) : undefined,
      http: isSet(object.http) ? Timeout_Conf_Http.fromJSON(object.http) : undefined,
      grpc: isSet(object.grpc) ? Timeout_Conf_Grpc.fromJSON(object.grpc) : undefined,
    };
  },

  toJSON(message: Timeout_Conf): unknown {
    const obj: any = {};
    message.connectTimeout !== undefined &&
      (obj.connectTimeout = message.connectTimeout ? Duration.toJSON(message.connectTimeout) : undefined);
    message.tcp !== undefined && (obj.tcp = message.tcp ? Timeout_Conf_Tcp.toJSON(message.tcp) : undefined);
    message.http !== undefined && (obj.http = message.http ? Timeout_Conf_Http.toJSON(message.http) : undefined);
    message.grpc !== undefined && (obj.grpc = message.grpc ? Timeout_Conf_Grpc.toJSON(message.grpc) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Timeout_Conf>): Timeout_Conf {
    const message = Object.create(createBaseTimeout_Conf()) as Timeout_Conf;
    message.connectTimeout = (object.connectTimeout !== undefined && object.connectTimeout !== null)
      ? Duration.fromPartial(object.connectTimeout)
      : undefined;
    message.tcp = (object.tcp !== undefined && object.tcp !== null)
      ? Timeout_Conf_Tcp.fromPartial(object.tcp)
      : undefined;
    message.http = (object.http !== undefined && object.http !== null)
      ? Timeout_Conf_Http.fromPartial(object.http)
      : undefined;
    message.grpc = (object.grpc !== undefined && object.grpc !== null)
      ? Timeout_Conf_Grpc.fromPartial(object.grpc)
      : undefined;
    return message;
  },
};

function createBaseTimeout_Conf_Tcp(): Timeout_Conf_Tcp {
  return { idleTimeout: undefined };
}

export const Timeout_Conf_Tcp = {
  fromJSON(object: any): Timeout_Conf_Tcp {
    return { idleTimeout: isSet(object.idleTimeout) ? Duration.fromJSON(object.idleTimeout) : undefined };
  },

  toJSON(message: Timeout_Conf_Tcp): unknown {
    const obj: any = {};
    message.idleTimeout !== undefined &&
      (obj.idleTimeout = message.idleTimeout ? Duration.toJSON(message.idleTimeout) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Timeout_Conf_Tcp>): Timeout_Conf_Tcp {
    const message = Object.create(createBaseTimeout_Conf_Tcp()) as Timeout_Conf_Tcp;
    message.idleTimeout = (object.idleTimeout !== undefined && object.idleTimeout !== null)
      ? Duration.fromPartial(object.idleTimeout)
      : undefined;
    return message;
  },
};

function createBaseTimeout_Conf_Http(): Timeout_Conf_Http {
  return {
    requestTimeout: undefined,
    idleTimeout: undefined,
    streamIdleTimeout: undefined,
    maxStreamDuration: undefined,
  };
}

export const Timeout_Conf_Http = {
  fromJSON(object: any): Timeout_Conf_Http {
    return {
      requestTimeout: isSet(object.requestTimeout) ? Duration.fromJSON(object.requestTimeout) : undefined,
      idleTimeout: isSet(object.idleTimeout) ? Duration.fromJSON(object.idleTimeout) : undefined,
      streamIdleTimeout: isSet(object.streamIdleTimeout) ? Duration.fromJSON(object.streamIdleTimeout) : undefined,
      maxStreamDuration: isSet(object.maxStreamDuration) ? Duration.fromJSON(object.maxStreamDuration) : undefined,
    };
  },

  toJSON(message: Timeout_Conf_Http): unknown {
    const obj: any = {};
    message.requestTimeout !== undefined &&
      (obj.requestTimeout = message.requestTimeout ? Duration.toJSON(message.requestTimeout) : undefined);
    message.idleTimeout !== undefined &&
      (obj.idleTimeout = message.idleTimeout ? Duration.toJSON(message.idleTimeout) : undefined);
    message.streamIdleTimeout !== undefined &&
      (obj.streamIdleTimeout = message.streamIdleTimeout ? Duration.toJSON(message.streamIdleTimeout) : undefined);
    message.maxStreamDuration !== undefined &&
      (obj.maxStreamDuration = message.maxStreamDuration ? Duration.toJSON(message.maxStreamDuration) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Timeout_Conf_Http>): Timeout_Conf_Http {
    const message = Object.create(createBaseTimeout_Conf_Http()) as Timeout_Conf_Http;
    message.requestTimeout = (object.requestTimeout !== undefined && object.requestTimeout !== null)
      ? Duration.fromPartial(object.requestTimeout)
      : undefined;
    message.idleTimeout = (object.idleTimeout !== undefined && object.idleTimeout !== null)
      ? Duration.fromPartial(object.idleTimeout)
      : undefined;
    message.streamIdleTimeout = (object.streamIdleTimeout !== undefined && object.streamIdleTimeout !== null)
      ? Duration.fromPartial(object.streamIdleTimeout)
      : undefined;
    message.maxStreamDuration = (object.maxStreamDuration !== undefined && object.maxStreamDuration !== null)
      ? Duration.fromPartial(object.maxStreamDuration)
      : undefined;
    return message;
  },
};

function createBaseTimeout_Conf_Grpc(): Timeout_Conf_Grpc {
  return { streamIdleTimeout: undefined, maxStreamDuration: undefined };
}

export const Timeout_Conf_Grpc = {
  fromJSON(object: any): Timeout_Conf_Grpc {
    return {
      streamIdleTimeout: isSet(object.streamIdleTimeout) ? Duration.fromJSON(object.streamIdleTimeout) : undefined,
      maxStreamDuration: isSet(object.maxStreamDuration) ? Duration.fromJSON(object.maxStreamDuration) : undefined,
    };
  },

  toJSON(message: Timeout_Conf_Grpc): unknown {
    const obj: any = {};
    message.streamIdleTimeout !== undefined &&
      (obj.streamIdleTimeout = message.streamIdleTimeout ? Duration.toJSON(message.streamIdleTimeout) : undefined);
    message.maxStreamDuration !== undefined &&
      (obj.maxStreamDuration = message.maxStreamDuration ? Duration.toJSON(message.maxStreamDuration) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Timeout_Conf_Grpc>): Timeout_Conf_Grpc {
    const message = Object.create(createBaseTimeout_Conf_Grpc()) as Timeout_Conf_Grpc;
    message.streamIdleTimeout = (object.streamIdleTimeout !== undefined && object.streamIdleTimeout !== null)
      ? Duration.fromPartial(object.streamIdleTimeout)
      : undefined;
    message.maxStreamDuration = (object.maxStreamDuration !== undefined && object.maxStreamDuration !== null)
      ? Duration.fromPartial(object.maxStreamDuration)
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
