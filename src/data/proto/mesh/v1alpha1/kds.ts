/* eslint-disable */
import { Observable } from "rxjs";
import { DiscoveryRequest, DiscoveryResponse } from "../../envoy/service/discovery/v3/discovery";
import { Any } from "../../google/protobuf/any";

export const protobufPackage = "kuma.mesh.v1alpha1";

export interface KumaResource {
  meta: KumaResource_Meta | undefined;
  spec: Any | undefined;
}

export interface KumaResource_Meta {
  name: string;
  mesh: string;
  version: string;
}

/**
 * XDSConfigRequest is a request for XDS Config Dump that is executed on Zone
 * CP.
 */
export interface XDSConfigRequest {
  /**
   * RequestID is a UUID of a request so we can correlate requests with response
   * on one stream.
   */
  requestId: string;
  /** Type of resource (Dataplane, ZoneIngress, ZoneEgress) */
  resourceType: string;
  /** Name of the resource on which we execute config dump. */
  resourceName: string;
  /**
   * Mesh of the resource on which we execute config dump. Should be empty for
   * ZoneIngress, ZoneEgress.
   */
  resourceMesh: string;
}

/**
 * XDSConfigRequest is a response containing result of XDS Config Dump execution
 * on Zone CP.
 */
export interface XDSConfigResponse {
  /** RequestID is a UUID that was set by the Global CP. */
  requestId: string;
  /** Error that was captured by the Zone CP when executing XDS Config Dump. */
  error?:
    | string
    | undefined;
  /** The XDS Config that is a successful result of XDS Config dump execution. */
  config?: Uint8Array | undefined;
}

/** StatsRequest is a request for kuma-dp stats that is executed on Zone CP. */
export interface StatsRequest {
  /**
   * RequestID is a UUID of a request so we can correlate requests with response
   * on one stream.
   */
  requestId: string;
  /** Type of resource (Dataplane, ZoneIngress, ZoneEgress) */
  resourceType: string;
  /** Name of the resource on which we execute kuma-dp stats request. */
  resourceName: string;
  /**
   * Mesh of the resource on which we execute kuma-dp stats request.
   * Should be empty for ZoneIngress, ZoneEgress.
   */
  resourceMesh: string;
}

/**
 * StatsResponse is a response containing result of kuma-dp stats execution on
 * Zone CP.
 */
export interface StatsResponse {
  /** RequestID is a UUID that was set by the Global CP. */
  requestId: string;
  /**
   * Error that was captured by the Zone CP when executing kuma-dp stats
   * request.
   */
  error?:
    | string
    | undefined;
  /** The stats content that is a successful result of kuma-dp stats execution. */
  stats?: Uint8Array | undefined;
}

/**
 * ClustersRequest is a request for kuma-dp clusters that is executed on Zone
 * CP.
 */
export interface ClustersRequest {
  /**
   * RequestID is a UUID of a request so we can correlate requests with response
   * on one stream.
   */
  requestId: string;
  /** Type of resource (Dataplane, ZoneIngress, ZoneEgress) */
  resourceType: string;
  /** Name of the resource on which we execute kuma-dp clusters request. */
  resourceName: string;
  /**
   * Mesh of the resource on which we execute kuma-dp clusters request.
   * Should be empty for ZoneIngress, ZoneEgress.
   */
  resourceMesh: string;
}

/**
 * ClustersResponse is a response containing result of kuma-dp clusters
 * execution on Zone CP.
 */
export interface ClustersResponse {
  /** RequestID is a UUID that was set by the Global CP. */
  requestId: string;
  /**
   * Error that was captured by the Zone CP when executing kuma-dp clusters
   * request.
   */
  error?:
    | string
    | undefined;
  /**
   * The clusters content that is a successful result of kuma-dp clusters
   * execution.
   */
  clusters?: Uint8Array | undefined;
}

function createBaseKumaResource(): KumaResource {
  return { meta: undefined, spec: undefined };
}

export const KumaResource = {
  fromJSON(object: any): KumaResource {
    return {
      meta: isSet(object.meta) ? KumaResource_Meta.fromJSON(object.meta) : undefined,
      spec: isSet(object.spec) ? Any.fromJSON(object.spec) : undefined,
    };
  },

  toJSON(message: KumaResource): unknown {
    const obj: any = {};
    message.meta !== undefined && (obj.meta = message.meta ? KumaResource_Meta.toJSON(message.meta) : undefined);
    message.spec !== undefined && (obj.spec = message.spec ? Any.toJSON(message.spec) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<KumaResource>): KumaResource {
    const message = Object.create(createBaseKumaResource()) as KumaResource;
    message.meta = (object.meta !== undefined && object.meta !== null)
      ? KumaResource_Meta.fromPartial(object.meta)
      : undefined;
    message.spec = (object.spec !== undefined && object.spec !== null) ? Any.fromPartial(object.spec) : undefined;
    return message;
  },
};

function createBaseKumaResource_Meta(): KumaResource_Meta {
  return { name: "", mesh: "", version: "" };
}

export const KumaResource_Meta = {
  fromJSON(object: any): KumaResource_Meta {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      mesh: isSet(object.mesh) ? String(object.mesh) : "",
      version: isSet(object.version) ? String(object.version) : "",
    };
  },

  toJSON(message: KumaResource_Meta): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.mesh !== undefined && (obj.mesh = message.mesh);
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },

  fromPartial(object: DeepPartial<KumaResource_Meta>): KumaResource_Meta {
    const message = Object.create(createBaseKumaResource_Meta()) as KumaResource_Meta;
    message.name = object.name ?? "";
    message.mesh = object.mesh ?? "";
    message.version = object.version ?? "";
    return message;
  },
};

function createBaseXDSConfigRequest(): XDSConfigRequest {
  return { requestId: "", resourceType: "", resourceName: "", resourceMesh: "" };
}

export const XDSConfigRequest = {
  fromJSON(object: any): XDSConfigRequest {
    return {
      requestId: isSet(object.requestId) ? String(object.requestId) : "",
      resourceType: isSet(object.resourceType) ? String(object.resourceType) : "",
      resourceName: isSet(object.resourceName) ? String(object.resourceName) : "",
      resourceMesh: isSet(object.resourceMesh) ? String(object.resourceMesh) : "",
    };
  },

  toJSON(message: XDSConfigRequest): unknown {
    const obj: any = {};
    message.requestId !== undefined && (obj.requestId = message.requestId);
    message.resourceType !== undefined && (obj.resourceType = message.resourceType);
    message.resourceName !== undefined && (obj.resourceName = message.resourceName);
    message.resourceMesh !== undefined && (obj.resourceMesh = message.resourceMesh);
    return obj;
  },

  fromPartial(object: DeepPartial<XDSConfigRequest>): XDSConfigRequest {
    const message = Object.create(createBaseXDSConfigRequest()) as XDSConfigRequest;
    message.requestId = object.requestId ?? "";
    message.resourceType = object.resourceType ?? "";
    message.resourceName = object.resourceName ?? "";
    message.resourceMesh = object.resourceMesh ?? "";
    return message;
  },
};

function createBaseXDSConfigResponse(): XDSConfigResponse {
  return { requestId: "" };
}

export const XDSConfigResponse = {
  fromJSON(object: any): XDSConfigResponse {
    return {
      requestId: isSet(object.requestId) ? String(object.requestId) : "",
      error: isSet(object.error) ? String(object.error) : undefined,
      config: isSet(object.config) ? bytesFromBase64(object.config) : undefined,
    };
  },

  toJSON(message: XDSConfigResponse): unknown {
    const obj: any = {};
    message.requestId !== undefined && (obj.requestId = message.requestId);
    message.error !== undefined && (obj.error = message.error);
    message.config !== undefined &&
      (obj.config = message.config !== undefined ? base64FromBytes(message.config) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<XDSConfigResponse>): XDSConfigResponse {
    const message = Object.create(createBaseXDSConfigResponse()) as XDSConfigResponse;
    message.requestId = object.requestId ?? "";
    message.error = object.error ?? undefined;
    message.config = object.config ?? undefined;
    return message;
  },
};

function createBaseStatsRequest(): StatsRequest {
  return { requestId: "", resourceType: "", resourceName: "", resourceMesh: "" };
}

export const StatsRequest = {
  fromJSON(object: any): StatsRequest {
    return {
      requestId: isSet(object.requestId) ? String(object.requestId) : "",
      resourceType: isSet(object.resourceType) ? String(object.resourceType) : "",
      resourceName: isSet(object.resourceName) ? String(object.resourceName) : "",
      resourceMesh: isSet(object.resourceMesh) ? String(object.resourceMesh) : "",
    };
  },

  toJSON(message: StatsRequest): unknown {
    const obj: any = {};
    message.requestId !== undefined && (obj.requestId = message.requestId);
    message.resourceType !== undefined && (obj.resourceType = message.resourceType);
    message.resourceName !== undefined && (obj.resourceName = message.resourceName);
    message.resourceMesh !== undefined && (obj.resourceMesh = message.resourceMesh);
    return obj;
  },

  fromPartial(object: DeepPartial<StatsRequest>): StatsRequest {
    const message = Object.create(createBaseStatsRequest()) as StatsRequest;
    message.requestId = object.requestId ?? "";
    message.resourceType = object.resourceType ?? "";
    message.resourceName = object.resourceName ?? "";
    message.resourceMesh = object.resourceMesh ?? "";
    return message;
  },
};

function createBaseStatsResponse(): StatsResponse {
  return { requestId: "" };
}

export const StatsResponse = {
  fromJSON(object: any): StatsResponse {
    return {
      requestId: isSet(object.requestId) ? String(object.requestId) : "",
      error: isSet(object.error) ? String(object.error) : undefined,
      stats: isSet(object.stats) ? bytesFromBase64(object.stats) : undefined,
    };
  },

  toJSON(message: StatsResponse): unknown {
    const obj: any = {};
    message.requestId !== undefined && (obj.requestId = message.requestId);
    message.error !== undefined && (obj.error = message.error);
    message.stats !== undefined &&
      (obj.stats = message.stats !== undefined ? base64FromBytes(message.stats) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<StatsResponse>): StatsResponse {
    const message = Object.create(createBaseStatsResponse()) as StatsResponse;
    message.requestId = object.requestId ?? "";
    message.error = object.error ?? undefined;
    message.stats = object.stats ?? undefined;
    return message;
  },
};

function createBaseClustersRequest(): ClustersRequest {
  return { requestId: "", resourceType: "", resourceName: "", resourceMesh: "" };
}

export const ClustersRequest = {
  fromJSON(object: any): ClustersRequest {
    return {
      requestId: isSet(object.requestId) ? String(object.requestId) : "",
      resourceType: isSet(object.resourceType) ? String(object.resourceType) : "",
      resourceName: isSet(object.resourceName) ? String(object.resourceName) : "",
      resourceMesh: isSet(object.resourceMesh) ? String(object.resourceMesh) : "",
    };
  },

  toJSON(message: ClustersRequest): unknown {
    const obj: any = {};
    message.requestId !== undefined && (obj.requestId = message.requestId);
    message.resourceType !== undefined && (obj.resourceType = message.resourceType);
    message.resourceName !== undefined && (obj.resourceName = message.resourceName);
    message.resourceMesh !== undefined && (obj.resourceMesh = message.resourceMesh);
    return obj;
  },

  fromPartial(object: DeepPartial<ClustersRequest>): ClustersRequest {
    const message = Object.create(createBaseClustersRequest()) as ClustersRequest;
    message.requestId = object.requestId ?? "";
    message.resourceType = object.resourceType ?? "";
    message.resourceName = object.resourceName ?? "";
    message.resourceMesh = object.resourceMesh ?? "";
    return message;
  },
};

function createBaseClustersResponse(): ClustersResponse {
  return { requestId: "" };
}

export const ClustersResponse = {
  fromJSON(object: any): ClustersResponse {
    return {
      requestId: isSet(object.requestId) ? String(object.requestId) : "",
      error: isSet(object.error) ? String(object.error) : undefined,
      clusters: isSet(object.clusters) ? bytesFromBase64(object.clusters) : undefined,
    };
  },

  toJSON(message: ClustersResponse): unknown {
    const obj: any = {};
    message.requestId !== undefined && (obj.requestId = message.requestId);
    message.error !== undefined && (obj.error = message.error);
    message.clusters !== undefined &&
      (obj.clusters = message.clusters !== undefined ? base64FromBytes(message.clusters) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ClustersResponse>): ClustersResponse {
    const message = Object.create(createBaseClustersResponse()) as ClustersResponse;
    message.requestId = object.requestId ?? "";
    message.error = object.error ?? undefined;
    message.clusters = object.clusters ?? undefined;
    return message;
  },
};

export interface KumaDiscoveryService {
  StreamKumaResources(request: Observable<DiscoveryRequest>): Observable<DiscoveryResponse>;
}

export interface GlobalKDSService {
  /**
   * StreamXDSConfigs is logically a service exposed by Zone CP so Global CP can
   * execute Config Dumps. It is however represented by bi-directional streaming
   * to leverage existing connection from Zone CP to Global CP.
   */
  StreamXDSConfigs(request: Observable<XDSConfigResponse>): Observable<XDSConfigRequest>;
  /**
   * StreamStats is logically a service exposed by Zone CP so Global CP can
   * execute kuma-dp stats requests. It is however represented by bi-directional
   * streaming to leverage existing connection from Zone CP to Global CP.
   */
  StreamStats(request: Observable<StatsResponse>): Observable<StatsRequest>;
  /**
   * StreamStats is logically a service exposed by Zone CP so Global CP can
   * execute kuma-dp clusters request. It is however represented by
   * bi-directional streaming to leverage existing connection from Zone CP to
   * Global CP.
   */
  StreamClusters(request: Observable<ClustersResponse>): Observable<ClustersRequest>;
}

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
