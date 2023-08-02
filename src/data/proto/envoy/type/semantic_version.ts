/* eslint-disable */

export const protobufPackage = "envoy.type";

/**
 * Envoy uses SemVer (https://semver.org/). Major/minor versions indicate
 * expected behaviors and APIs, the patch version field is used only
 * for security fixes and can be generally ignored.
 */
export interface SemanticVersion {
  majorNumber: number;
  minorNumber: number;
  patch: number;
}

function createBaseSemanticVersion(): SemanticVersion {
  return { majorNumber: 0, minorNumber: 0, patch: 0 };
}

export const SemanticVersion = {
  fromJSON(object: any): SemanticVersion {
    return {
      majorNumber: isSet(object.majorNumber) ? Number(object.majorNumber) : 0,
      minorNumber: isSet(object.minorNumber) ? Number(object.minorNumber) : 0,
      patch: isSet(object.patch) ? Number(object.patch) : 0,
    };
  },

  toJSON(message: SemanticVersion): unknown {
    const obj: any = {};
    message.majorNumber !== undefined && (obj.majorNumber = Math.round(message.majorNumber));
    message.minorNumber !== undefined && (obj.minorNumber = Math.round(message.minorNumber));
    message.patch !== undefined && (obj.patch = Math.round(message.patch));
    return obj;
  },

  fromPartial(object: DeepPartial<SemanticVersion>): SemanticVersion {
    const message = Object.create(createBaseSemanticVersion()) as SemanticVersion;
    message.majorNumber = object.majorNumber ?? 0;
    message.minorNumber = object.minorNumber ?? 0;
    message.patch = object.patch ?? 0;
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
