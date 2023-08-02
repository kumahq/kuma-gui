/* eslint-disable */
import { DataSource } from "../../system/v1alpha1/datasource";
import { Selector } from "./selector";

export const protobufPackage = "kuma.mesh.v1alpha1";

/**
 * MeshGateway is a virtual proxy.
 *
 * Each MeshGateway is bound to a set of builtin gateway dataplanes.
 * Each builtin dataplane instance can host exactly one Gateway
 * proxy configuration.
 *
 * Gateway aligns with the Kubernetes Gateway API v1alpha2. See that
 * spec for detailed documentation.
 */
export interface MeshGateway {
  /**
   * Selectors is a list of selectors that are used to match builtin
   * gateway dataplanes that will receive this MeshGateway configuration.
   */
  selectors: Selector[];
  /**
   * Tags is the set of tags common to all of the gateway's listeners.
   *
   * This field must not include a `kuma.io/service` tag (the service is always
   * defined on the dataplanes).
   */
  tags: { [key: string]: string };
  /** The desired configuration of the MeshGateway. */
  conf: MeshGateway_Conf | undefined;
}

/** TLSConfig describes a TLS configuration. */
export interface MeshGateway_TLS {
}

export enum MeshGateway_TLS_Mode {
  /**
   * NONE - NONE is not a valid TLS mode. Ether TERMINATE or PASSTHROUGH must
   * be explicitly configured.
   */
  NONE = "NONE",
  /**
   * TERMINATE - The TLS session between the downstream client and the MeshGateway
   * is terminated at the MeshGateway. This mode requires the certificate
   * field to be set.
   */
  TERMINATE = "TERMINATE",
  /**
   * PASSTHROUGH - The TLS session is NOT terminated by the MeshGateway. This implies
   * that the MeshGateway can't decipher the TLS stream except for the
   * ClientHello message of the TLS protocol. The certificate field
   * is ignored in this mode.
   */
  PASSTHROUGH = "PASSTHROUGH",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function meshGateway_TLS_ModeFromJSON(object: any): MeshGateway_TLS_Mode {
  switch (object) {
    case 0:
    case "NONE":
      return MeshGateway_TLS_Mode.NONE;
    case 1:
    case "TERMINATE":
      return MeshGateway_TLS_Mode.TERMINATE;
    case 2:
    case "PASSTHROUGH":
      return MeshGateway_TLS_Mode.PASSTHROUGH;
    case -1:
    case "UNRECOGNIZED":
    default:
      return MeshGateway_TLS_Mode.UNRECOGNIZED;
  }
}

export function meshGateway_TLS_ModeToJSON(object: MeshGateway_TLS_Mode): string {
  switch (object) {
    case MeshGateway_TLS_Mode.NONE:
      return "NONE";
    case MeshGateway_TLS_Mode.TERMINATE:
      return "TERMINATE";
    case MeshGateway_TLS_Mode.PASSTHROUGH:
      return "PASSTHROUGH";
    case MeshGateway_TLS_Mode.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** TODO(jpeach) */
export interface MeshGateway_TLS_Options {
}

/** Aligns with MeshGatewayTLSConfig. */
export interface MeshGateway_TLS_Conf {
  /**
   * Mode defines the TLS behavior for the TLS session initiated
   * by the client.
   */
  mode: MeshGateway_TLS_Mode;
  /**
   * Certificates is an array of datasources that contain TLS
   * certificates and private keys.  Each datasource must contain a
   * sequence of PEM-encoded objects. The server certificate and private
   * key are required, but additional certificates are allowed and will
   * be added to the certificate chain.  The server certificate must
   * be the first certificate in the datasource.
   *
   * When multiple certificate datasources are configured, they must have
   * different key types. In practice, this means that one datasource
   * should contain an RSA key and certificate, and the other an
   * ECDSA key and certificate.
   */
  certificates: DataSource[];
  /**
   * Options should eventually configure how TLS is configured. This
   * is where cipher suite and version configuration can be specified,
   * client certificates enforced, and so on.
   */
  options: MeshGateway_TLS_Options | undefined;
}

export interface MeshGateway_Listener {
  /**
   * Hostname specifies the virtual hostname to match for protocol types that
   * define this concept. When unspecified, "", or `*`, all hostnames are
   * matched. This field can be omitted for protocols that don't require
   * hostname based matching.
   */
  hostname: string;
  /**
   * Port is the network port. Multiple listeners may use the
   * same port, subject to the Listener compatibility rules.
   */
  port: number;
  /** Protocol specifies the network protocol this listener expects to receive. */
  protocol: MeshGateway_Listener_Protocol;
  /**
   * TLS is the TLS configuration for the Listener. This field
   * is required if the Protocol field is "HTTPS" or "TLS" and
   * ignored otherwise.
   */
  tls:
    | MeshGateway_TLS_Conf
    | undefined;
  /**
   * Tags specifies a unique combination of tags that routes can use
   * to match themselves to this listener.
   *
   * When matching routes to listeners, the control plane constructs a
   * set of matching tags for each listener by forming the union of the
   * gateway tags and the listener tags. A route will be attached to the
   * listener if all of the route's tags are preset in the matching tags
   */
  tags: { [key: string]: string };
  /**
   * CrossMesh enables traffic to flow to this listener only from other
   * meshes.
   */
  crossMesh: boolean;
  /** Resources is used to specify listener-specific resource settings. */
  resources: MeshGateway_Listener_Resources | undefined;
}

export enum MeshGateway_Listener_Protocol {
  NONE = "NONE",
  TCP = "TCP",
  UDP = "UDP",
  TLS = "TLS",
  HTTP = "HTTP",
  HTTPS = "HTTPS",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function meshGateway_Listener_ProtocolFromJSON(object: any): MeshGateway_Listener_Protocol {
  switch (object) {
    case 0:
    case "NONE":
      return MeshGateway_Listener_Protocol.NONE;
    case 1:
    case "TCP":
      return MeshGateway_Listener_Protocol.TCP;
    case 2:
    case "UDP":
      return MeshGateway_Listener_Protocol.UDP;
    case 3:
    case "TLS":
      return MeshGateway_Listener_Protocol.TLS;
    case 4:
    case "HTTP":
      return MeshGateway_Listener_Protocol.HTTP;
    case 5:
    case "HTTPS":
      return MeshGateway_Listener_Protocol.HTTPS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return MeshGateway_Listener_Protocol.UNRECOGNIZED;
  }
}

export function meshGateway_Listener_ProtocolToJSON(object: MeshGateway_Listener_Protocol): string {
  switch (object) {
    case MeshGateway_Listener_Protocol.NONE:
      return "NONE";
    case MeshGateway_Listener_Protocol.TCP:
      return "TCP";
    case MeshGateway_Listener_Protocol.UDP:
      return "UDP";
    case MeshGateway_Listener_Protocol.TLS:
      return "TLS";
    case MeshGateway_Listener_Protocol.HTTP:
      return "HTTP";
    case MeshGateway_Listener_Protocol.HTTPS:
      return "HTTPS";
    case MeshGateway_Listener_Protocol.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface MeshGateway_Listener_Resources {
  connectionLimit: number;
}

export interface MeshGateway_Listener_TagsEntry {
  key: string;
  value: string;
}

/**
 * Conf defines the desired state of MeshGateway.
 *
 * Aligns with MeshGatewaySpec.
 */
export interface MeshGateway_Conf {
  /**
   * Listeners define logical endpoints that are bound on this MeshGateway's
   * address(es).
   */
  listeners: MeshGateway_Listener[];
}

export interface MeshGateway_TagsEntry {
  key: string;
  value: string;
}

function createBaseMeshGateway(): MeshGateway {
  return { selectors: [], tags: {}, conf: undefined };
}

export const MeshGateway = {
  fromJSON(object: any): MeshGateway {
    return {
      selectors: Array.isArray(object?.selectors) ? object.selectors.map((e: any) => Selector.fromJSON(e)) : [],
      tags: isObject(object.tags)
        ? Object.entries(object.tags).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      conf: isSet(object.conf) ? MeshGateway_Conf.fromJSON(object.conf) : undefined,
    };
  },

  toJSON(message: MeshGateway): unknown {
    const obj: any = {};
    if (message.selectors) {
      obj.selectors = message.selectors.map((e) => e ? Selector.toJSON(e) : undefined);
    } else {
      obj.selectors = [];
    }
    obj.tags = {};
    if (message.tags) {
      Object.entries(message.tags).forEach(([k, v]) => {
        obj.tags[k] = v;
      });
    }
    message.conf !== undefined && (obj.conf = message.conf ? MeshGateway_Conf.toJSON(message.conf) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGateway>): MeshGateway {
    const message = Object.create(createBaseMeshGateway()) as MeshGateway;
    message.selectors = object.selectors?.map((e) => Selector.fromPartial(e)) || [];
    message.tags = Object.entries(object.tags ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.conf = (object.conf !== undefined && object.conf !== null)
      ? MeshGateway_Conf.fromPartial(object.conf)
      : undefined;
    return message;
  },
};

function createBaseMeshGateway_TLS(): MeshGateway_TLS {
  return {};
}

export const MeshGateway_TLS = {
  fromJSON(_: any): MeshGateway_TLS {
    return {};
  },

  toJSON(_: MeshGateway_TLS): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MeshGateway_TLS>): MeshGateway_TLS {
    const message = Object.create(createBaseMeshGateway_TLS()) as MeshGateway_TLS;
    return message;
  },
};

function createBaseMeshGateway_TLS_Options(): MeshGateway_TLS_Options {
  return {};
}

export const MeshGateway_TLS_Options = {
  fromJSON(_: any): MeshGateway_TLS_Options {
    return {};
  },

  toJSON(_: MeshGateway_TLS_Options): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MeshGateway_TLS_Options>): MeshGateway_TLS_Options {
    const message = Object.create(createBaseMeshGateway_TLS_Options()) as MeshGateway_TLS_Options;
    return message;
  },
};

function createBaseMeshGateway_TLS_Conf(): MeshGateway_TLS_Conf {
  return { mode: MeshGateway_TLS_Mode.NONE, certificates: [], options: undefined };
}

export const MeshGateway_TLS_Conf = {
  fromJSON(object: any): MeshGateway_TLS_Conf {
    return {
      mode: isSet(object.mode) ? meshGateway_TLS_ModeFromJSON(object.mode) : MeshGateway_TLS_Mode.NONE,
      certificates: Array.isArray(object?.certificates)
        ? object.certificates.map((e: any) => DataSource.fromJSON(e))
        : [],
      options: isSet(object.options) ? MeshGateway_TLS_Options.fromJSON(object.options) : undefined,
    };
  },

  toJSON(message: MeshGateway_TLS_Conf): unknown {
    const obj: any = {};
    message.mode !== undefined && (obj.mode = meshGateway_TLS_ModeToJSON(message.mode));
    if (message.certificates) {
      obj.certificates = message.certificates.map((e) => e ? DataSource.toJSON(e) : undefined);
    } else {
      obj.certificates = [];
    }
    message.options !== undefined &&
      (obj.options = message.options ? MeshGateway_TLS_Options.toJSON(message.options) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGateway_TLS_Conf>): MeshGateway_TLS_Conf {
    const message = Object.create(createBaseMeshGateway_TLS_Conf()) as MeshGateway_TLS_Conf;
    message.mode = object.mode ?? MeshGateway_TLS_Mode.NONE;
    message.certificates = object.certificates?.map((e) => DataSource.fromPartial(e)) || [];
    message.options = (object.options !== undefined && object.options !== null)
      ? MeshGateway_TLS_Options.fromPartial(object.options)
      : undefined;
    return message;
  },
};

function createBaseMeshGateway_Listener(): MeshGateway_Listener {
  return {
    hostname: "",
    port: 0,
    protocol: MeshGateway_Listener_Protocol.NONE,
    tls: undefined,
    tags: {},
    crossMesh: false,
    resources: undefined,
  };
}

export const MeshGateway_Listener = {
  fromJSON(object: any): MeshGateway_Listener {
    return {
      hostname: isSet(object.hostname) ? String(object.hostname) : "",
      port: isSet(object.port) ? Number(object.port) : 0,
      protocol: isSet(object.protocol)
        ? meshGateway_Listener_ProtocolFromJSON(object.protocol)
        : MeshGateway_Listener_Protocol.NONE,
      tls: isSet(object.tls) ? MeshGateway_TLS_Conf.fromJSON(object.tls) : undefined,
      tags: isObject(object.tags)
        ? Object.entries(object.tags).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      crossMesh: isSet(object.crossMesh) ? Boolean(object.crossMesh) : false,
      resources: isSet(object.resources) ? MeshGateway_Listener_Resources.fromJSON(object.resources) : undefined,
    };
  },

  toJSON(message: MeshGateway_Listener): unknown {
    const obj: any = {};
    message.hostname !== undefined && (obj.hostname = message.hostname);
    message.port !== undefined && (obj.port = Math.round(message.port));
    message.protocol !== undefined && (obj.protocol = meshGateway_Listener_ProtocolToJSON(message.protocol));
    message.tls !== undefined && (obj.tls = message.tls ? MeshGateway_TLS_Conf.toJSON(message.tls) : undefined);
    obj.tags = {};
    if (message.tags) {
      Object.entries(message.tags).forEach(([k, v]) => {
        obj.tags[k] = v;
      });
    }
    message.crossMesh !== undefined && (obj.crossMesh = message.crossMesh);
    message.resources !== undefined &&
      (obj.resources = message.resources ? MeshGateway_Listener_Resources.toJSON(message.resources) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGateway_Listener>): MeshGateway_Listener {
    const message = Object.create(createBaseMeshGateway_Listener()) as MeshGateway_Listener;
    message.hostname = object.hostname ?? "";
    message.port = object.port ?? 0;
    message.protocol = object.protocol ?? MeshGateway_Listener_Protocol.NONE;
    message.tls = (object.tls !== undefined && object.tls !== null)
      ? MeshGateway_TLS_Conf.fromPartial(object.tls)
      : undefined;
    message.tags = Object.entries(object.tags ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.crossMesh = object.crossMesh ?? false;
    message.resources = (object.resources !== undefined && object.resources !== null)
      ? MeshGateway_Listener_Resources.fromPartial(object.resources)
      : undefined;
    return message;
  },
};

function createBaseMeshGateway_Listener_Resources(): MeshGateway_Listener_Resources {
  return { connectionLimit: 0 };
}

export const MeshGateway_Listener_Resources = {
  fromJSON(object: any): MeshGateway_Listener_Resources {
    return { connectionLimit: isSet(object.connectionLimit) ? Number(object.connectionLimit) : 0 };
  },

  toJSON(message: MeshGateway_Listener_Resources): unknown {
    const obj: any = {};
    message.connectionLimit !== undefined && (obj.connectionLimit = Math.round(message.connectionLimit));
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGateway_Listener_Resources>): MeshGateway_Listener_Resources {
    const message = Object.create(createBaseMeshGateway_Listener_Resources()) as MeshGateway_Listener_Resources;
    message.connectionLimit = object.connectionLimit ?? 0;
    return message;
  },
};

function createBaseMeshGateway_Listener_TagsEntry(): MeshGateway_Listener_TagsEntry {
  return { key: "", value: "" };
}

export const MeshGateway_Listener_TagsEntry = {
  fromJSON(object: any): MeshGateway_Listener_TagsEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: MeshGateway_Listener_TagsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGateway_Listener_TagsEntry>): MeshGateway_Listener_TagsEntry {
    const message = Object.create(createBaseMeshGateway_Listener_TagsEntry()) as MeshGateway_Listener_TagsEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseMeshGateway_Conf(): MeshGateway_Conf {
  return { listeners: [] };
}

export const MeshGateway_Conf = {
  fromJSON(object: any): MeshGateway_Conf {
    return {
      listeners: Array.isArray(object?.listeners)
        ? object.listeners.map((e: any) => MeshGateway_Listener.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MeshGateway_Conf): unknown {
    const obj: any = {};
    if (message.listeners) {
      obj.listeners = message.listeners.map((e) => e ? MeshGateway_Listener.toJSON(e) : undefined);
    } else {
      obj.listeners = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGateway_Conf>): MeshGateway_Conf {
    const message = Object.create(createBaseMeshGateway_Conf()) as MeshGateway_Conf;
    message.listeners = object.listeners?.map((e) => MeshGateway_Listener.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMeshGateway_TagsEntry(): MeshGateway_TagsEntry {
  return { key: "", value: "" };
}

export const MeshGateway_TagsEntry = {
  fromJSON(object: any): MeshGateway_TagsEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: MeshGateway_TagsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGateway_TagsEntry>): MeshGateway_TagsEntry {
    const message = Object.create(createBaseMeshGateway_TagsEntry()) as MeshGateway_TagsEntry;
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
