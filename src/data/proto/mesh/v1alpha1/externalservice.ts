/* eslint-disable */
import { DataSource } from "../../system/v1alpha1/datasource";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** ExternalService defines configuration of the externally accessible service */
export interface ExternalService {
  networking:
    | ExternalService_Networking
    | undefined;
  /**
   * Tags associated with the external service,
   * e.g. kuma.io/service=web, kuma.io/protocol, version=1.0.
   */
  tags: { [key: string]: string };
}

/** Networking describes the properties of the external service connectivity */
export interface ExternalService_Networking {
  /** Address of the external service */
  address: string;
  tls:
    | ExternalService_Networking_TLS
    | undefined;
  /**
   * If disableHostDNSEntry is set to true then a DNS entry for the external
   * service taken from 'networking.address' won't be generated.
   * You can still reach this external service using
   * external-service-name.mesh:80 where "external-service-name" is taken from
   * "kuma.io/service" tag.
   */
  disableHostDNSEntry: boolean;
}

/** TLS */
export interface ExternalService_Networking_TLS {
  /** denotes that the external service uses TLS */
  enabled: boolean;
  /** Data source for the certificate of CA */
  caCert:
    | DataSource
    | undefined;
  /** Data source for the authentication */
  clientCert:
    | DataSource
    | undefined;
  /** Data source for the authentication */
  clientKey:
    | DataSource
    | undefined;
  /**
   * If true then TLS session will allow renegotiation.
   * It's not recommended to set this to true because of security reasons.
   * However, some servers requires this setting, especially when using
   * mTLS.
   */
  allowRenegotiation:
    | boolean
    | undefined;
  /**
   * ServerName overrides the default Server Name Indicator set by Kuma.
   * The default value is set to "address" specified in "networking".
   */
  serverName: string | undefined;
}

export interface ExternalService_TagsEntry {
  key: string;
  value: string;
}

function createBaseExternalService(): ExternalService {
  return { networking: undefined, tags: {} };
}

export const ExternalService = {
  fromJSON(object: any): ExternalService {
    return {
      networking: isSet(object.networking) ? ExternalService_Networking.fromJSON(object.networking) : undefined,
      tags: isObject(object.tags)
        ? Object.entries(object.tags).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: ExternalService): unknown {
    const obj: any = {};
    message.networking !== undefined &&
      (obj.networking = message.networking ? ExternalService_Networking.toJSON(message.networking) : undefined);
    obj.tags = {};
    if (message.tags) {
      Object.entries(message.tags).forEach(([k, v]) => {
        obj.tags[k] = v;
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ExternalService>): ExternalService {
    const message = Object.create(createBaseExternalService()) as ExternalService;
    message.networking = (object.networking !== undefined && object.networking !== null)
      ? ExternalService_Networking.fromPartial(object.networking)
      : undefined;
    message.tags = Object.entries(object.tags ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseExternalService_Networking(): ExternalService_Networking {
  return { address: "", tls: undefined, disableHostDNSEntry: false };
}

export const ExternalService_Networking = {
  fromJSON(object: any): ExternalService_Networking {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      tls: isSet(object.tls) ? ExternalService_Networking_TLS.fromJSON(object.tls) : undefined,
      disableHostDNSEntry: isSet(object.disableHostDNSEntry) ? Boolean(object.disableHostDNSEntry) : false,
    };
  },

  toJSON(message: ExternalService_Networking): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.tls !== undefined &&
      (obj.tls = message.tls ? ExternalService_Networking_TLS.toJSON(message.tls) : undefined);
    message.disableHostDNSEntry !== undefined && (obj.disableHostDNSEntry = message.disableHostDNSEntry);
    return obj;
  },

  fromPartial(object: DeepPartial<ExternalService_Networking>): ExternalService_Networking {
    const message = Object.create(createBaseExternalService_Networking()) as ExternalService_Networking;
    message.address = object.address ?? "";
    message.tls = (object.tls !== undefined && object.tls !== null)
      ? ExternalService_Networking_TLS.fromPartial(object.tls)
      : undefined;
    message.disableHostDNSEntry = object.disableHostDNSEntry ?? false;
    return message;
  },
};

function createBaseExternalService_Networking_TLS(): ExternalService_Networking_TLS {
  return {
    enabled: false,
    caCert: undefined,
    clientCert: undefined,
    clientKey: undefined,
    allowRenegotiation: undefined,
    serverName: undefined,
  };
}

export const ExternalService_Networking_TLS = {
  fromJSON(object: any): ExternalService_Networking_TLS {
    return {
      enabled: isSet(object.enabled) ? Boolean(object.enabled) : false,
      caCert: isSet(object.caCert) ? DataSource.fromJSON(object.caCert) : undefined,
      clientCert: isSet(object.clientCert) ? DataSource.fromJSON(object.clientCert) : undefined,
      clientKey: isSet(object.clientKey) ? DataSource.fromJSON(object.clientKey) : undefined,
      allowRenegotiation: isSet(object.allowRenegotiation) ? Boolean(object.allowRenegotiation) : undefined,
      serverName: isSet(object.serverName) ? String(object.serverName) : undefined,
    };
  },

  toJSON(message: ExternalService_Networking_TLS): unknown {
    const obj: any = {};
    message.enabled !== undefined && (obj.enabled = message.enabled);
    message.caCert !== undefined && (obj.caCert = message.caCert ? DataSource.toJSON(message.caCert) : undefined);
    message.clientCert !== undefined &&
      (obj.clientCert = message.clientCert ? DataSource.toJSON(message.clientCert) : undefined);
    message.clientKey !== undefined &&
      (obj.clientKey = message.clientKey ? DataSource.toJSON(message.clientKey) : undefined);
    message.allowRenegotiation !== undefined && (obj.allowRenegotiation = message.allowRenegotiation);
    message.serverName !== undefined && (obj.serverName = message.serverName);
    return obj;
  },

  fromPartial(object: DeepPartial<ExternalService_Networking_TLS>): ExternalService_Networking_TLS {
    const message = Object.create(createBaseExternalService_Networking_TLS()) as ExternalService_Networking_TLS;
    message.enabled = object.enabled ?? false;
    message.caCert = (object.caCert !== undefined && object.caCert !== null)
      ? DataSource.fromPartial(object.caCert)
      : undefined;
    message.clientCert = (object.clientCert !== undefined && object.clientCert !== null)
      ? DataSource.fromPartial(object.clientCert)
      : undefined;
    message.clientKey = (object.clientKey !== undefined && object.clientKey !== null)
      ? DataSource.fromPartial(object.clientKey)
      : undefined;
    message.allowRenegotiation = object.allowRenegotiation ?? undefined;
    message.serverName = object.serverName ?? undefined;
    return message;
  },
};

function createBaseExternalService_TagsEntry(): ExternalService_TagsEntry {
  return { key: "", value: "" };
}

export const ExternalService_TagsEntry = {
  fromJSON(object: any): ExternalService_TagsEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: ExternalService_TagsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<ExternalService_TagsEntry>): ExternalService_TagsEntry {
    const message = Object.create(createBaseExternalService_TagsEntry()) as ExternalService_TagsEntry;
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
