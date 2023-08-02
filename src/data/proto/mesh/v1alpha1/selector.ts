/* eslint-disable */

export const protobufPackage = "kuma.mesh.v1alpha1";

/** Selector defines structure for selecting tags for given dataplane */
export interface Selector {
  /** Tags to match, can be used for both source and destinations */
  match: { [key: string]: string };
}

export interface Selector_MatchEntry {
  key: string;
  value: string;
}

function createBaseSelector(): Selector {
  return { match: {} };
}

export const Selector = {
  fromJSON(object: any): Selector {
    return {
      match: isObject(object.match)
        ? Object.entries(object.match).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: Selector): unknown {
    const obj: any = {};
    obj.match = {};
    if (message.match) {
      Object.entries(message.match).forEach(([k, v]) => {
        obj.match[k] = v;
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Selector>): Selector {
    const message = Object.create(createBaseSelector()) as Selector;
    message.match = Object.entries(object.match ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseSelector_MatchEntry(): Selector_MatchEntry {
  return { key: "", value: "" };
}

export const Selector_MatchEntry = {
  fromJSON(object: any): Selector_MatchEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: Selector_MatchEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<Selector_MatchEntry>): Selector_MatchEntry {
    const message = Object.create(createBaseSelector_MatchEntry()) as Selector_MatchEntry;
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
