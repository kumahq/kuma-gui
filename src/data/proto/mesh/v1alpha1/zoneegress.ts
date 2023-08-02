/* eslint-disable */
import { EnvoyAdmin } from "./envoy_admin";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** ZoneEgress allows us to configure dataplane in the Egress mode. */
export interface ZoneEgress {
  /**
   * Zone field contains Zone name where egress is serving, field will be
   * automatically set by Global Kuma CP
   */
  zone: string;
  /** Networking defines the address and port of the Egress to listen on. */
  networking: ZoneEgress_Networking | undefined;
}

export interface ZoneEgress_Networking {
  /** Address on which inbound listener will be exposed */
  address: string;
  /** Port of the inbound interface that will forward requests to the service. */
  port: number;
  /** Admin contains configuration related to Envoy Admin API */
  admin: EnvoyAdmin | undefined;
}

function createBaseZoneEgress(): ZoneEgress {
  return { zone: "", networking: undefined };
}

export const ZoneEgress = {
  fromJSON(object: any): ZoneEgress {
    return {
      zone: isSet(object.zone) ? String(object.zone) : "",
      networking: isSet(object.networking) ? ZoneEgress_Networking.fromJSON(object.networking) : undefined,
    };
  },

  toJSON(message: ZoneEgress): unknown {
    const obj: any = {};
    message.zone !== undefined && (obj.zone = message.zone);
    message.networking !== undefined &&
      (obj.networking = message.networking ? ZoneEgress_Networking.toJSON(message.networking) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ZoneEgress>): ZoneEgress {
    const message = Object.create(createBaseZoneEgress()) as ZoneEgress;
    message.zone = object.zone ?? "";
    message.networking = (object.networking !== undefined && object.networking !== null)
      ? ZoneEgress_Networking.fromPartial(object.networking)
      : undefined;
    return message;
  },
};

function createBaseZoneEgress_Networking(): ZoneEgress_Networking {
  return { address: "", port: 0, admin: undefined };
}

export const ZoneEgress_Networking = {
  fromJSON(object: any): ZoneEgress_Networking {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      port: isSet(object.port) ? Number(object.port) : 0,
      admin: isSet(object.admin) ? EnvoyAdmin.fromJSON(object.admin) : undefined,
    };
  },

  toJSON(message: ZoneEgress_Networking): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.port !== undefined && (obj.port = Math.round(message.port));
    message.admin !== undefined && (obj.admin = message.admin ? EnvoyAdmin.toJSON(message.admin) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ZoneEgress_Networking>): ZoneEgress_Networking {
    const message = Object.create(createBaseZoneEgress_Networking()) as ZoneEgress_Networking;
    message.address = object.address ?? "";
    message.port = object.port ?? 0;
    message.admin = (object.admin !== undefined && object.admin !== null)
      ? EnvoyAdmin.fromPartial(object.admin)
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
