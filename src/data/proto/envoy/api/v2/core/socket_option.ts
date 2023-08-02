/* eslint-disable */

export const protobufPackage = "envoy.api.v2.core";

/**
 * Generic socket option message. This would be used to set socket options that
 * might not exist in upstream kernels or precompiled Envoy binaries.
 * [#next-free-field: 7]
 */
export interface SocketOption {
  /**
   * An optional name to give this socket option for debugging, etc.
   * Uniqueness is not required and no special meaning is assumed.
   */
  description: string;
  /** Corresponding to the level value passed to setsockopt, such as IPPROTO_TCP */
  level: number;
  /** The numeric name as passed to setsockopt */
  name: number;
  /** Because many sockopts take an int value. */
  intValue?:
    | number
    | undefined;
  /** Otherwise it's a byte buffer. */
  bufValue?:
    | Uint8Array
    | undefined;
  /**
   * The state in which the option will be applied. When used in BindConfig
   * STATE_PREBIND is currently the only valid value.
   */
  state: SocketOption_SocketState;
}

export enum SocketOption_SocketState {
  /** STATE_PREBIND - Socket options are applied after socket creation but before binding the socket to a port */
  STATE_PREBIND = "STATE_PREBIND",
  /** STATE_BOUND - Socket options are applied after binding the socket to a port but before calling listen() */
  STATE_BOUND = "STATE_BOUND",
  /** STATE_LISTENING - Socket options are applied after calling listen() */
  STATE_LISTENING = "STATE_LISTENING",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function socketOption_SocketStateFromJSON(object: any): SocketOption_SocketState {
  switch (object) {
    case 0:
    case "STATE_PREBIND":
      return SocketOption_SocketState.STATE_PREBIND;
    case 1:
    case "STATE_BOUND":
      return SocketOption_SocketState.STATE_BOUND;
    case 2:
    case "STATE_LISTENING":
      return SocketOption_SocketState.STATE_LISTENING;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SocketOption_SocketState.UNRECOGNIZED;
  }
}

export function socketOption_SocketStateToJSON(object: SocketOption_SocketState): string {
  switch (object) {
    case SocketOption_SocketState.STATE_PREBIND:
      return "STATE_PREBIND";
    case SocketOption_SocketState.STATE_BOUND:
      return "STATE_BOUND";
    case SocketOption_SocketState.STATE_LISTENING:
      return "STATE_LISTENING";
    case SocketOption_SocketState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseSocketOption(): SocketOption {
  return { description: "", level: 0, name: 0, state: SocketOption_SocketState.STATE_PREBIND };
}

export const SocketOption = {
  fromJSON(object: any): SocketOption {
    return {
      description: isSet(object.description) ? String(object.description) : "",
      level: isSet(object.level) ? Number(object.level) : 0,
      name: isSet(object.name) ? Number(object.name) : 0,
      intValue: isSet(object.intValue) ? Number(object.intValue) : undefined,
      bufValue: isSet(object.bufValue) ? bytesFromBase64(object.bufValue) : undefined,
      state: isSet(object.state)
        ? socketOption_SocketStateFromJSON(object.state)
        : SocketOption_SocketState.STATE_PREBIND,
    };
  },

  toJSON(message: SocketOption): unknown {
    const obj: any = {};
    message.description !== undefined && (obj.description = message.description);
    message.level !== undefined && (obj.level = Math.round(message.level));
    message.name !== undefined && (obj.name = Math.round(message.name));
    message.intValue !== undefined && (obj.intValue = Math.round(message.intValue));
    message.bufValue !== undefined &&
      (obj.bufValue = message.bufValue !== undefined ? base64FromBytes(message.bufValue) : undefined);
    message.state !== undefined && (obj.state = socketOption_SocketStateToJSON(message.state));
    return obj;
  },

  fromPartial(object: DeepPartial<SocketOption>): SocketOption {
    const message = Object.create(createBaseSocketOption()) as SocketOption;
    message.description = object.description ?? "";
    message.level = object.level ?? 0;
    message.name = object.name ?? 0;
    message.intValue = object.intValue ?? undefined;
    message.bufValue = object.bufValue ?? undefined;
    message.state = object.state ?? SocketOption_SocketState.STATE_PREBIND;
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
