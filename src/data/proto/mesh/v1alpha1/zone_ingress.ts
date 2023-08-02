/* eslint-disable */
import { EnvoyAdmin } from "./envoy_admin";

export const protobufPackage = "kuma.mesh.v1alpha1";

/**
 * ZoneIngress allows us to configure dataplane in the Ingress mode. In this
 * mode, dataplane has only inbound interfaces. Every inbound interface matches
 * with services that reside in that cluster.
 */
export interface ZoneIngress {
  /**
   * Zone field contains Zone name where ingress is serving, field will be
   * automatically set by Global Kuma CP
   */
  zone: string;
  /**
   * Networking defines the address and port of the Ingress to listen on.
   * Additionally publicly advertised address and port could be specified.
   */
  networking:
    | ZoneIngress_Networking
    | undefined;
  /**
   * AvailableService contains tags that represent unique subset of
   * endpoints
   */
  availableServices: ZoneIngress_AvailableService[];
}

export interface ZoneIngress_Networking {
  /** Address on which inbound listener will be exposed */
  address: string;
  /**
   * AdvertisedAddress defines IP or DNS name on which ZoneIngress is
   * accessible to other Kuma clusters.
   */
  advertisedAddress: string;
  /** Port of the inbound interface that will forward requests to the service. */
  port: number;
  /**
   * AdvertisedPort defines port on which ZoneIngress is accessible to other
   * Kuma clusters.
   */
  advertisedPort: number;
  /** Admin contains configuration related to Envoy Admin API */
  admin: EnvoyAdmin | undefined;
}

export interface ZoneIngress_AvailableService {
  /** tags of the service */
  tags: { [key: string]: string };
  /** number of instances available for given tags */
  instances: number;
  /** mesh of the instances available for given tags */
  mesh: string;
  /** instance of external service available from the zone */
  externalService: boolean;
}

export interface ZoneIngress_AvailableService_TagsEntry {
  key: string;
  value: string;
}

function createBaseZoneIngress(): ZoneIngress {
  return { zone: "", networking: undefined, availableServices: [] };
}

export const ZoneIngress = {
  fromJSON(object: any): ZoneIngress {
    return {
      zone: isSet(object.zone) ? String(object.zone) : "",
      networking: isSet(object.networking) ? ZoneIngress_Networking.fromJSON(object.networking) : undefined,
      availableServices: Array.isArray(object?.availableServices)
        ? object.availableServices.map((e: any) => ZoneIngress_AvailableService.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ZoneIngress): unknown {
    const obj: any = {};
    message.zone !== undefined && (obj.zone = message.zone);
    message.networking !== undefined &&
      (obj.networking = message.networking ? ZoneIngress_Networking.toJSON(message.networking) : undefined);
    if (message.availableServices) {
      obj.availableServices = message.availableServices.map((e) =>
        e ? ZoneIngress_AvailableService.toJSON(e) : undefined
      );
    } else {
      obj.availableServices = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ZoneIngress>): ZoneIngress {
    const message = Object.create(createBaseZoneIngress()) as ZoneIngress;
    message.zone = object.zone ?? "";
    message.networking = (object.networking !== undefined && object.networking !== null)
      ? ZoneIngress_Networking.fromPartial(object.networking)
      : undefined;
    message.availableServices = object.availableServices?.map((e) => ZoneIngress_AvailableService.fromPartial(e)) || [];
    return message;
  },
};

function createBaseZoneIngress_Networking(): ZoneIngress_Networking {
  return { address: "", advertisedAddress: "", port: 0, advertisedPort: 0, admin: undefined };
}

export const ZoneIngress_Networking = {
  fromJSON(object: any): ZoneIngress_Networking {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      advertisedAddress: isSet(object.advertisedAddress) ? String(object.advertisedAddress) : "",
      port: isSet(object.port) ? Number(object.port) : 0,
      advertisedPort: isSet(object.advertisedPort) ? Number(object.advertisedPort) : 0,
      admin: isSet(object.admin) ? EnvoyAdmin.fromJSON(object.admin) : undefined,
    };
  },

  toJSON(message: ZoneIngress_Networking): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.advertisedAddress !== undefined && (obj.advertisedAddress = message.advertisedAddress);
    message.port !== undefined && (obj.port = Math.round(message.port));
    message.advertisedPort !== undefined && (obj.advertisedPort = Math.round(message.advertisedPort));
    message.admin !== undefined && (obj.admin = message.admin ? EnvoyAdmin.toJSON(message.admin) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ZoneIngress_Networking>): ZoneIngress_Networking {
    const message = Object.create(createBaseZoneIngress_Networking()) as ZoneIngress_Networking;
    message.address = object.address ?? "";
    message.advertisedAddress = object.advertisedAddress ?? "";
    message.port = object.port ?? 0;
    message.advertisedPort = object.advertisedPort ?? 0;
    message.admin = (object.admin !== undefined && object.admin !== null)
      ? EnvoyAdmin.fromPartial(object.admin)
      : undefined;
    return message;
  },
};

function createBaseZoneIngress_AvailableService(): ZoneIngress_AvailableService {
  return { tags: {}, instances: 0, mesh: "", externalService: false };
}

export const ZoneIngress_AvailableService = {
  fromJSON(object: any): ZoneIngress_AvailableService {
    return {
      tags: isObject(object.tags)
        ? Object.entries(object.tags).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      instances: isSet(object.instances) ? Number(object.instances) : 0,
      mesh: isSet(object.mesh) ? String(object.mesh) : "",
      externalService: isSet(object.externalService) ? Boolean(object.externalService) : false,
    };
  },

  toJSON(message: ZoneIngress_AvailableService): unknown {
    const obj: any = {};
    obj.tags = {};
    if (message.tags) {
      Object.entries(message.tags).forEach(([k, v]) => {
        obj.tags[k] = v;
      });
    }
    message.instances !== undefined && (obj.instances = Math.round(message.instances));
    message.mesh !== undefined && (obj.mesh = message.mesh);
    message.externalService !== undefined && (obj.externalService = message.externalService);
    return obj;
  },

  fromPartial(object: DeepPartial<ZoneIngress_AvailableService>): ZoneIngress_AvailableService {
    const message = Object.create(createBaseZoneIngress_AvailableService()) as ZoneIngress_AvailableService;
    message.tags = Object.entries(object.tags ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.instances = object.instances ?? 0;
    message.mesh = object.mesh ?? "";
    message.externalService = object.externalService ?? false;
    return message;
  },
};

function createBaseZoneIngress_AvailableService_TagsEntry(): ZoneIngress_AvailableService_TagsEntry {
  return { key: "", value: "" };
}

export const ZoneIngress_AvailableService_TagsEntry = {
  fromJSON(object: any): ZoneIngress_AvailableService_TagsEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: ZoneIngress_AvailableService_TagsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<ZoneIngress_AvailableService_TagsEntry>): ZoneIngress_AvailableService_TagsEntry {
    const message = Object.create(
      createBaseZoneIngress_AvailableService_TagsEntry(),
    ) as ZoneIngress_AvailableService_TagsEntry;
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
