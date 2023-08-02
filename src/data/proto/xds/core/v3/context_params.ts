/* eslint-disable */

export const protobufPackage = "xds.core.v3";

/**
 * Additional parameters that can be used to select resource variants. These include any
 * global context parameters, per-resource type client feature capabilities and per-resource
 * type functional attributes. All per-resource type attributes will be `xds.resource.`
 * prefixed and some of these are documented below:
 * `xds.resource.listening_address`: The value is "IP:port" (e.g. "10.1.1.3:8080") which is
 *   the listening address of a Listener. Used in a Listener resource query.
 */
export interface ContextParams {
  params: { [key: string]: string };
}

export interface ContextParams_ParamsEntry {
  key: string;
  value: string;
}

function createBaseContextParams(): ContextParams {
  return { params: {} };
}

export const ContextParams = {
  fromJSON(object: any): ContextParams {
    return {
      params: isObject(object.params)
        ? Object.entries(object.params).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: ContextParams): unknown {
    const obj: any = {};
    obj.params = {};
    if (message.params) {
      Object.entries(message.params).forEach(([k, v]) => {
        obj.params[k] = v;
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ContextParams>): ContextParams {
    const message = Object.create(createBaseContextParams()) as ContextParams;
    message.params = Object.entries(object.params ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseContextParams_ParamsEntry(): ContextParams_ParamsEntry {
  return { key: "", value: "" };
}

export const ContextParams_ParamsEntry = {
  fromJSON(object: any): ContextParams_ParamsEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: ContextParams_ParamsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<ContextParams_ParamsEntry>): ContextParams_ParamsEntry {
    const message = Object.create(createBaseContextParams_ParamsEntry()) as ContextParams_ParamsEntry;
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
