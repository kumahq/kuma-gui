/* eslint-disable */

export const protobufPackage = "kuma.mesh.v1alpha1";

export interface ServiceInsight {
  services: { [key: string]: ServiceInsight_Service };
}

export interface ServiceInsight_Service {
  status: ServiceInsight_Service_Status;
  dataplanes: ServiceInsight_Service_DataplaneStat | undefined;
  issuedBackends: { [key: string]: number };
  serviceType: ServiceInsight_Service_Type;
  addressPort: string;
}

export enum ServiceInsight_Service_Status {
  /** none - should not be used */
  none = "none",
  offline = "offline",
  partially_degraded = "partially_degraded",
  online = "online",
  not_available = "not_available",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function serviceInsight_Service_StatusFromJSON(object: any): ServiceInsight_Service_Status {
  switch (object) {
    case 0:
    case "none":
      return ServiceInsight_Service_Status.none;
    case 1:
    case "offline":
      return ServiceInsight_Service_Status.offline;
    case 2:
    case "partially_degraded":
      return ServiceInsight_Service_Status.partially_degraded;
    case 3:
    case "online":
      return ServiceInsight_Service_Status.online;
    case 4:
    case "not_available":
      return ServiceInsight_Service_Status.not_available;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ServiceInsight_Service_Status.UNRECOGNIZED;
  }
}

export function serviceInsight_Service_StatusToJSON(object: ServiceInsight_Service_Status): string {
  switch (object) {
    case ServiceInsight_Service_Status.none:
      return "none";
    case ServiceInsight_Service_Status.offline:
      return "offline";
    case ServiceInsight_Service_Status.partially_degraded:
      return "partially_degraded";
    case ServiceInsight_Service_Status.online:
      return "online";
    case ServiceInsight_Service_Status.not_available:
      return "not_available";
    case ServiceInsight_Service_Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum ServiceInsight_Service_Type {
  internal = "internal",
  external = "external",
  gateway_delegated = "gateway_delegated",
  gateway_builtin = "gateway_builtin",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function serviceInsight_Service_TypeFromJSON(object: any): ServiceInsight_Service_Type {
  switch (object) {
    case 0:
    case "internal":
      return ServiceInsight_Service_Type.internal;
    case 1:
    case "external":
      return ServiceInsight_Service_Type.external;
    case 2:
    case "gateway_delegated":
      return ServiceInsight_Service_Type.gateway_delegated;
    case 3:
    case "gateway_builtin":
      return ServiceInsight_Service_Type.gateway_builtin;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ServiceInsight_Service_Type.UNRECOGNIZED;
  }
}

export function serviceInsight_Service_TypeToJSON(object: ServiceInsight_Service_Type): string {
  switch (object) {
    case ServiceInsight_Service_Type.internal:
      return "internal";
    case ServiceInsight_Service_Type.external:
      return "external";
    case ServiceInsight_Service_Type.gateway_delegated:
      return "gateway_delegated";
    case ServiceInsight_Service_Type.gateway_builtin:
      return "gateway_builtin";
    case ServiceInsight_Service_Type.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ServiceInsight_Service_DataplaneStat {
  total: number;
  online: number;
  offline: number;
}

export interface ServiceInsight_Service_IssuedBackendsEntry {
  key: string;
  value: number;
}

export interface ServiceInsight_ServicesEntry {
  key: string;
  value: ServiceInsight_Service | undefined;
}

function createBaseServiceInsight(): ServiceInsight {
  return { services: {} };
}

export const ServiceInsight = {
  fromJSON(object: any): ServiceInsight {
    return {
      services: isObject(object.services)
        ? Object.entries(object.services).reduce<{ [key: string]: ServiceInsight_Service }>((acc, [key, value]) => {
          acc[key] = ServiceInsight_Service.fromJSON(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: ServiceInsight): unknown {
    const obj: any = {};
    obj.services = {};
    if (message.services) {
      Object.entries(message.services).forEach(([k, v]) => {
        obj.services[k] = ServiceInsight_Service.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ServiceInsight>): ServiceInsight {
    const message = Object.create(createBaseServiceInsight()) as ServiceInsight;
    message.services = Object.entries(object.services ?? {}).reduce<{ [key: string]: ServiceInsight_Service }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = ServiceInsight_Service.fromPartial(value);
        }
        return acc;
      },
      {},
    );
    return message;
  },
};

function createBaseServiceInsight_Service(): ServiceInsight_Service {
  return {
    status: ServiceInsight_Service_Status.none,
    dataplanes: undefined,
    issuedBackends: {},
    serviceType: ServiceInsight_Service_Type.internal,
    addressPort: "",
  };
}

export const ServiceInsight_Service = {
  fromJSON(object: any): ServiceInsight_Service {
    return {
      status: isSet(object.status)
        ? serviceInsight_Service_StatusFromJSON(object.status)
        : ServiceInsight_Service_Status.none,
      dataplanes: isSet(object.dataplanes)
        ? ServiceInsight_Service_DataplaneStat.fromJSON(object.dataplanes)
        : undefined,
      issuedBackends: isObject(object.issuedBackends)
        ? Object.entries(object.issuedBackends).reduce<{ [key: string]: number }>((acc, [key, value]) => {
          acc[key] = Number(value);
          return acc;
        }, {})
        : {},
      serviceType: isSet(object.serviceType)
        ? serviceInsight_Service_TypeFromJSON(object.serviceType)
        : ServiceInsight_Service_Type.internal,
      addressPort: isSet(object.addressPort) ? String(object.addressPort) : "",
    };
  },

  toJSON(message: ServiceInsight_Service): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = serviceInsight_Service_StatusToJSON(message.status));
    message.dataplanes !== undefined &&
      (obj.dataplanes = message.dataplanes
        ? ServiceInsight_Service_DataplaneStat.toJSON(message.dataplanes)
        : undefined);
    obj.issuedBackends = {};
    if (message.issuedBackends) {
      Object.entries(message.issuedBackends).forEach(([k, v]) => {
        obj.issuedBackends[k] = Math.round(v);
      });
    }
    message.serviceType !== undefined && (obj.serviceType = serviceInsight_Service_TypeToJSON(message.serviceType));
    message.addressPort !== undefined && (obj.addressPort = message.addressPort);
    return obj;
  },

  fromPartial(object: DeepPartial<ServiceInsight_Service>): ServiceInsight_Service {
    const message = Object.create(createBaseServiceInsight_Service()) as ServiceInsight_Service;
    message.status = object.status ?? ServiceInsight_Service_Status.none;
    message.dataplanes = (object.dataplanes !== undefined && object.dataplanes !== null)
      ? ServiceInsight_Service_DataplaneStat.fromPartial(object.dataplanes)
      : undefined;
    message.issuedBackends = Object.entries(object.issuedBackends ?? {}).reduce<{ [key: string]: number }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = Number(value);
        }
        return acc;
      },
      {},
    );
    message.serviceType = object.serviceType ?? ServiceInsight_Service_Type.internal;
    message.addressPort = object.addressPort ?? "";
    return message;
  },
};

function createBaseServiceInsight_Service_DataplaneStat(): ServiceInsight_Service_DataplaneStat {
  return { total: 0, online: 0, offline: 0 };
}

export const ServiceInsight_Service_DataplaneStat = {
  fromJSON(object: any): ServiceInsight_Service_DataplaneStat {
    return {
      total: isSet(object.total) ? Number(object.total) : 0,
      online: isSet(object.online) ? Number(object.online) : 0,
      offline: isSet(object.offline) ? Number(object.offline) : 0,
    };
  },

  toJSON(message: ServiceInsight_Service_DataplaneStat): unknown {
    const obj: any = {};
    message.total !== undefined && (obj.total = Math.round(message.total));
    message.online !== undefined && (obj.online = Math.round(message.online));
    message.offline !== undefined && (obj.offline = Math.round(message.offline));
    return obj;
  },

  fromPartial(object: DeepPartial<ServiceInsight_Service_DataplaneStat>): ServiceInsight_Service_DataplaneStat {
    const message = Object.create(
      createBaseServiceInsight_Service_DataplaneStat(),
    ) as ServiceInsight_Service_DataplaneStat;
    message.total = object.total ?? 0;
    message.online = object.online ?? 0;
    message.offline = object.offline ?? 0;
    return message;
  },
};

function createBaseServiceInsight_Service_IssuedBackendsEntry(): ServiceInsight_Service_IssuedBackendsEntry {
  return { key: "", value: 0 };
}

export const ServiceInsight_Service_IssuedBackendsEntry = {
  fromJSON(object: any): ServiceInsight_Service_IssuedBackendsEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? Number(object.value) : 0 };
  },

  toJSON(message: ServiceInsight_Service_IssuedBackendsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = Math.round(message.value));
    return obj;
  },

  fromPartial(
    object: DeepPartial<ServiceInsight_Service_IssuedBackendsEntry>,
  ): ServiceInsight_Service_IssuedBackendsEntry {
    const message = Object.create(
      createBaseServiceInsight_Service_IssuedBackendsEntry(),
    ) as ServiceInsight_Service_IssuedBackendsEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? 0;
    return message;
  },
};

function createBaseServiceInsight_ServicesEntry(): ServiceInsight_ServicesEntry {
  return { key: "", value: undefined };
}

export const ServiceInsight_ServicesEntry = {
  fromJSON(object: any): ServiceInsight_ServicesEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? ServiceInsight_Service.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: ServiceInsight_ServicesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? ServiceInsight_Service.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ServiceInsight_ServicesEntry>): ServiceInsight_ServicesEntry {
    const message = Object.create(createBaseServiceInsight_ServicesEntry()) as ServiceInsight_ServicesEntry;
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? ServiceInsight_Service.fromPartial(object.value)
      : undefined;
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
