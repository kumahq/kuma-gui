/* eslint-disable */

export const protobufPackage = "udpa.annotations";

export interface VersioningAnnotation {
  /**
   * Track the previous message type. E.g. this message might be
   * udpa.foo.v3alpha.Foo and it was previously udpa.bar.v2.Bar. This
   * information is consumed by UDPA via proto descriptors.
   */
  previousMessageType: string;
}

function createBaseVersioningAnnotation(): VersioningAnnotation {
  return { previousMessageType: "" };
}

export const VersioningAnnotation = {
  fromJSON(object: any): VersioningAnnotation {
    return { previousMessageType: isSet(object.previousMessageType) ? String(object.previousMessageType) : "" };
  },

  toJSON(message: VersioningAnnotation): unknown {
    const obj: any = {};
    message.previousMessageType !== undefined && (obj.previousMessageType = message.previousMessageType);
    return obj;
  },

  fromPartial(object: DeepPartial<VersioningAnnotation>): VersioningAnnotation {
    const message = Object.create(createBaseVersioningAnnotation()) as VersioningAnnotation;
    message.previousMessageType = object.previousMessageType ?? "";
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
