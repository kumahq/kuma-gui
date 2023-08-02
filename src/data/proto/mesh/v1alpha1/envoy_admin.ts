/* eslint-disable */

export const protobufPackage = "kuma.mesh.v1alpha1";

export interface EnvoyAdmin {
  /** Port on which Envoy Admin API server will be listening */
  port: number;
}

function createBaseEnvoyAdmin(): EnvoyAdmin {
  return { port: 0 };
}

export const EnvoyAdmin = {
  fromJSON(object: any): EnvoyAdmin {
    return { port: isSet(object.port) ? Number(object.port) : 0 };
  },

  toJSON(message: EnvoyAdmin): unknown {
    const obj: any = {};
    message.port !== undefined && (obj.port = Math.round(message.port));
    return obj;
  },

  fromPartial(object: DeepPartial<EnvoyAdmin>): EnvoyAdmin {
    const message = Object.create(createBaseEnvoyAdmin()) as EnvoyAdmin;
    message.port = object.port ?? 0;
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
