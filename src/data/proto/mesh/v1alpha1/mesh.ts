/* eslint-disable */
import { Duration } from "../../google/protobuf/duration";
import { Metrics } from "./metrics";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** Mesh defines configuration of a single mesh. */
export interface Mesh {
  /**
   * mTLS settings.
   * +optional
   */
  mtls:
    | Mesh_Mtls
    | undefined;
  /**
   * Tracing settings.
   * +optional
   */
  tracing:
    | Tracing
    | undefined;
  /**
   * Logging settings.
   * +optional
   */
  logging:
    | Logging
    | undefined;
  /**
   * Configuration for metrics collected and exposed by dataplanes.
   *
   * Settings defined here become defaults for every dataplane in a given Mesh.
   * Additionally, it is also possible to further customize this configuration
   * for each dataplane individually using Dataplane resource.
   * +optional
   */
  metrics:
    | Metrics
    | undefined;
  /** Networking settings of the mesh */
  networking:
    | Networking
    | undefined;
  /** Routing settings of the mesh */
  routing:
    | Routing
    | undefined;
  /** Constraints that applies to the mesh and its entities */
  constraints: Mesh_Constraints | undefined;
}

/** mTLS settings of a Mesh. */
export interface Mesh_Mtls {
  /** Name of the enabled backend */
  enabledBackend: string;
  /** List of available Certificate Authority backends */
  backends: CertificateAuthorityBackend[];
}

/** Constraints to apply to the mesh and its entities */
export interface Mesh_Constraints {
  /**
   * DataplaneProxyMembership defines a set of requirements for data plane
   * proxies to be a member of the mesh.
   */
  dataplaneProxy: Mesh_DataplaneProxyConstraints | undefined;
}

export interface Mesh_DataplaneProxyConstraints {
  /**
   * Requirements defines a set of requirements that data plane proxies must
   * fulfill in order to join the mesh. A data plane proxy must fulfill at
   * least one requirement in order to join the mesh. Empty list of allowed
   * requirements means that any proxy that is not explicitly denied can join.
   */
  requirements: Mesh_DataplaneProxyConstraints_Rules[];
  /**
   * Restrictions defines a set of restrictions that data plane proxies cannot
   * fulfill in order to join the mesh. A data plane proxy cannot fulfill any
   * requirement in order to join the mesh.
   * Restrictions takes precedence over requirements.
   */
  restrictions: Mesh_DataplaneProxyConstraints_Rules[];
}

/**
 * Rules defines a set of rules for data plane proxies to be member of the
 * mesh.
 */
export interface Mesh_DataplaneProxyConstraints_Rules {
  /**
   * Tags defines set of required tags. You can specify '*' in value to
   * require non empty value of tag
   */
  tags: { [key: string]: string };
}

export interface Mesh_DataplaneProxyConstraints_Rules_TagsEntry {
  key: string;
  value: string;
}

/** CertificateAuthorityBackend defines Certificate Authority backend */
export interface CertificateAuthorityBackend {
  /** Name of the backend */
  name: string;
  /**
   * Type of the backend. Has to be one of the loaded plugins (Kuma ships with
   * builtin and provided)
   */
  type: string;
  /** Dataplane certificate settings */
  dpCert:
    | CertificateAuthorityBackend_DpCert
    | undefined;
  /** Configuration of the backend */
  conf:
    | { [key: string]: any }
    | undefined;
  /**
   * Mode defines the behaviour of inbound listeners with regard to traffic
   * encryption
   */
  mode: CertificateAuthorityBackend_Mode;
  rootChain: CertificateAuthorityBackend_RootChain | undefined;
}

export enum CertificateAuthorityBackend_Mode {
  /**
   * STRICT - A STRICT mode implies that the server validates the connection and
   * accepts only encrypted TLS traffic
   */
  STRICT = "STRICT",
  /**
   * PERMISSIVE - A PERMISSIVE mode implies that the outbounds encrypt traffic the same way
   * it happens in strict mode, but inbounds accept both TLS and plaintext
   * traffic. This allows applications residing in the mesh to accept requests
   * from outside of the mesh.
   */
  PERMISSIVE = "PERMISSIVE",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function certificateAuthorityBackend_ModeFromJSON(object: any): CertificateAuthorityBackend_Mode {
  switch (object) {
    case 0:
    case "STRICT":
      return CertificateAuthorityBackend_Mode.STRICT;
    case 1:
    case "PERMISSIVE":
      return CertificateAuthorityBackend_Mode.PERMISSIVE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return CertificateAuthorityBackend_Mode.UNRECOGNIZED;
  }
}

export function certificateAuthorityBackend_ModeToJSON(object: CertificateAuthorityBackend_Mode): string {
  switch (object) {
    case CertificateAuthorityBackend_Mode.STRICT:
      return "STRICT";
    case CertificateAuthorityBackend_Mode.PERMISSIVE:
      return "PERMISSIVE";
    case CertificateAuthorityBackend_Mode.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** DpCert defines settings for certificates generated for Dataplanes */
export interface CertificateAuthorityBackend_DpCert {
  /** Rotation settings */
  rotation:
    | CertificateAuthorityBackend_DpCert_Rotation
    | undefined;
  /** Timeout on request to CA for DP certificate generation and retrieval */
  requestTimeout: Duration | undefined;
}

/** Rotation defines rotation settings for Dataplane certificate */
export interface CertificateAuthorityBackend_DpCert_Rotation {
  /** Time after which generated certificate for Dataplane will expire */
  expiration: string;
}

/** RootChain defines settings related to CA root certificate chain. */
export interface CertificateAuthorityBackend_RootChain {
  /** Timeout on request for to CA for root certificate chain. */
  requestTimeout: Duration | undefined;
}

/** Networking defines the networking configuration of the mesh */
export interface Networking {
  /** Outbound settings */
  outbound: Networking_Outbound | undefined;
}

/** Outbound describes the common mesh outbound settings */
export interface Networking_Outbound {
  /** Control the passthrough cluster */
  passthrough: boolean | undefined;
}

/** Tracing defines tracing configuration of the mesh. */
export interface Tracing {
  /** Name of the default backend */
  defaultBackend: string;
  /** List of available tracing backends */
  backends: TracingBackend[];
}

/**
 * TracingBackend defines tracing backend available to mesh. Backends can be
 * used in TrafficTrace rules.
 */
export interface TracingBackend {
  /**
   * Name of the backend, can be then used in Mesh.tracing.defaultBackend or in
   * TrafficTrace
   */
  name: string;
  /**
   * Percentage of traces that will be sent to the backend (range 0.0 - 100.0).
   * Empty value defaults to 100.0%
   */
  sampling:
    | number
    | undefined;
  /** Type of the backend (Kuma ships with 'zipkin') */
  type: string;
  /** Configuration of the backend */
  conf: { [key: string]: any } | undefined;
}

export interface DatadogTracingBackendConfig {
  /** Address of datadog collector. */
  address: string;
  /** Port of datadog collector */
  port: number;
  /**
   * Determines if datadog service name should be split based on traffic
   * direction and destination. For example, with `splitService: true` and a
   * `backend` service that communicates with a couple of databases, you would
   * get service names like `backend_INBOUND`, `backend_OUTBOUND_db1`, and
   * `backend_OUTBOUND_db2` in Datadog. Default: false
   */
  splitService: boolean;
}

export interface ZipkinTracingBackendConfig {
  /** Address of Zipkin collector. */
  url: string;
  /** Generate 128bit traces. Default: false */
  traceId128bit: boolean;
  /**
   * Version of the API. values: httpJson, httpJsonV1, httpProto. Default:
   * httpJson see
   * https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/trace/v3/trace.proto#envoy-v3-api-enum-config-trace-v3-zipkinconfig-collectorendpointversion
   */
  apiVersion: string;
  /**
   * Determines whether client and server spans will share the same span
   * context. Default: true.
   * https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/trace/v3/zipkin.proto#config-trace-v3-zipkinconfig
   */
  sharedSpanContext: boolean | undefined;
}

export interface Logging {
  /** Name of the default backend */
  defaultBackend: string;
  /** List of available logging backends */
  backends: LoggingBackend[];
}

/**
 * LoggingBackend defines logging backend available to mesh. Backends can be
 * used in TrafficLog rules.
 */
export interface LoggingBackend {
  /**
   * Name of the backend, can be then used in Mesh.logging.defaultBackend or in
   * TrafficLogging
   */
  name: string;
  /**
   * Format of access logs. Placeholders available on
   * https://www.envoyproxy.io/docs/envoy/latest/configuration/observability/access_log
   */
  format: string;
  /** Type of the backend (Kuma ships with 'tcp' and 'file') */
  type: string;
  /** Configuration of the backend */
  conf: { [key: string]: any } | undefined;
}

/** FileLoggingBackendConfig defines configuration for file based access logs */
export interface FileLoggingBackendConfig {
  /** Path to a file that logs will be written to */
  path: string;
}

/** TcpLoggingBackendConfig defines configuration for TCP based access logs */
export interface TcpLoggingBackendConfig {
  /** Address to TCP service that will receive logs */
  address: string;
}

/** Routing defines configuration for the routing in the mesh */
export interface Routing {
  /** Enable the Locality Aware Load Balancing */
  localityAwareLoadBalancing: boolean;
  /**
   * Enable routing traffic to services in other zone or external services
   * through ZoneEgress. Default: false
   */
  zoneEgress: boolean;
}

function createBaseMesh(): Mesh {
  return {
    mtls: undefined,
    tracing: undefined,
    logging: undefined,
    metrics: undefined,
    networking: undefined,
    routing: undefined,
    constraints: undefined,
  };
}

export const Mesh = {
  fromJSON(object: any): Mesh {
    return {
      mtls: isSet(object.mtls) ? Mesh_Mtls.fromJSON(object.mtls) : undefined,
      tracing: isSet(object.tracing) ? Tracing.fromJSON(object.tracing) : undefined,
      logging: isSet(object.logging) ? Logging.fromJSON(object.logging) : undefined,
      metrics: isSet(object.metrics) ? Metrics.fromJSON(object.metrics) : undefined,
      networking: isSet(object.networking) ? Networking.fromJSON(object.networking) : undefined,
      routing: isSet(object.routing) ? Routing.fromJSON(object.routing) : undefined,
      constraints: isSet(object.constraints) ? Mesh_Constraints.fromJSON(object.constraints) : undefined,
    };
  },

  toJSON(message: Mesh): unknown {
    const obj: any = {};
    message.mtls !== undefined && (obj.mtls = message.mtls ? Mesh_Mtls.toJSON(message.mtls) : undefined);
    message.tracing !== undefined && (obj.tracing = message.tracing ? Tracing.toJSON(message.tracing) : undefined);
    message.logging !== undefined && (obj.logging = message.logging ? Logging.toJSON(message.logging) : undefined);
    message.metrics !== undefined && (obj.metrics = message.metrics ? Metrics.toJSON(message.metrics) : undefined);
    message.networking !== undefined &&
      (obj.networking = message.networking ? Networking.toJSON(message.networking) : undefined);
    message.routing !== undefined && (obj.routing = message.routing ? Routing.toJSON(message.routing) : undefined);
    message.constraints !== undefined &&
      (obj.constraints = message.constraints ? Mesh_Constraints.toJSON(message.constraints) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Mesh>): Mesh {
    const message = Object.create(createBaseMesh()) as Mesh;
    message.mtls = (object.mtls !== undefined && object.mtls !== null) ? Mesh_Mtls.fromPartial(object.mtls) : undefined;
    message.tracing = (object.tracing !== undefined && object.tracing !== null)
      ? Tracing.fromPartial(object.tracing)
      : undefined;
    message.logging = (object.logging !== undefined && object.logging !== null)
      ? Logging.fromPartial(object.logging)
      : undefined;
    message.metrics = (object.metrics !== undefined && object.metrics !== null)
      ? Metrics.fromPartial(object.metrics)
      : undefined;
    message.networking = (object.networking !== undefined && object.networking !== null)
      ? Networking.fromPartial(object.networking)
      : undefined;
    message.routing = (object.routing !== undefined && object.routing !== null)
      ? Routing.fromPartial(object.routing)
      : undefined;
    message.constraints = (object.constraints !== undefined && object.constraints !== null)
      ? Mesh_Constraints.fromPartial(object.constraints)
      : undefined;
    return message;
  },
};

function createBaseMesh_Mtls(): Mesh_Mtls {
  return { enabledBackend: "", backends: [] };
}

export const Mesh_Mtls = {
  fromJSON(object: any): Mesh_Mtls {
    return {
      enabledBackend: isSet(object.enabledBackend) ? String(object.enabledBackend) : "",
      backends: Array.isArray(object?.backends)
        ? object.backends.map((e: any) => CertificateAuthorityBackend.fromJSON(e))
        : [],
    };
  },

  toJSON(message: Mesh_Mtls): unknown {
    const obj: any = {};
    message.enabledBackend !== undefined && (obj.enabledBackend = message.enabledBackend);
    if (message.backends) {
      obj.backends = message.backends.map((e) => e ? CertificateAuthorityBackend.toJSON(e) : undefined);
    } else {
      obj.backends = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Mesh_Mtls>): Mesh_Mtls {
    const message = Object.create(createBaseMesh_Mtls()) as Mesh_Mtls;
    message.enabledBackend = object.enabledBackend ?? "";
    message.backends = object.backends?.map((e) => CertificateAuthorityBackend.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMesh_Constraints(): Mesh_Constraints {
  return { dataplaneProxy: undefined };
}

export const Mesh_Constraints = {
  fromJSON(object: any): Mesh_Constraints {
    return {
      dataplaneProxy: isSet(object.dataplaneProxy)
        ? Mesh_DataplaneProxyConstraints.fromJSON(object.dataplaneProxy)
        : undefined,
    };
  },

  toJSON(message: Mesh_Constraints): unknown {
    const obj: any = {};
    message.dataplaneProxy !== undefined && (obj.dataplaneProxy = message.dataplaneProxy
      ? Mesh_DataplaneProxyConstraints.toJSON(message.dataplaneProxy)
      : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Mesh_Constraints>): Mesh_Constraints {
    const message = Object.create(createBaseMesh_Constraints()) as Mesh_Constraints;
    message.dataplaneProxy = (object.dataplaneProxy !== undefined && object.dataplaneProxy !== null)
      ? Mesh_DataplaneProxyConstraints.fromPartial(object.dataplaneProxy)
      : undefined;
    return message;
  },
};

function createBaseMesh_DataplaneProxyConstraints(): Mesh_DataplaneProxyConstraints {
  return { requirements: [], restrictions: [] };
}

export const Mesh_DataplaneProxyConstraints = {
  fromJSON(object: any): Mesh_DataplaneProxyConstraints {
    return {
      requirements: Array.isArray(object?.requirements)
        ? object.requirements.map((e: any) => Mesh_DataplaneProxyConstraints_Rules.fromJSON(e))
        : [],
      restrictions: Array.isArray(object?.restrictions)
        ? object.restrictions.map((e: any) => Mesh_DataplaneProxyConstraints_Rules.fromJSON(e))
        : [],
    };
  },

  toJSON(message: Mesh_DataplaneProxyConstraints): unknown {
    const obj: any = {};
    if (message.requirements) {
      obj.requirements = message.requirements.map((e) =>
        e ? Mesh_DataplaneProxyConstraints_Rules.toJSON(e) : undefined
      );
    } else {
      obj.requirements = [];
    }
    if (message.restrictions) {
      obj.restrictions = message.restrictions.map((e) =>
        e ? Mesh_DataplaneProxyConstraints_Rules.toJSON(e) : undefined
      );
    } else {
      obj.restrictions = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Mesh_DataplaneProxyConstraints>): Mesh_DataplaneProxyConstraints {
    const message = Object.create(createBaseMesh_DataplaneProxyConstraints()) as Mesh_DataplaneProxyConstraints;
    message.requirements = object.requirements?.map((e) => Mesh_DataplaneProxyConstraints_Rules.fromPartial(e)) || [];
    message.restrictions = object.restrictions?.map((e) => Mesh_DataplaneProxyConstraints_Rules.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMesh_DataplaneProxyConstraints_Rules(): Mesh_DataplaneProxyConstraints_Rules {
  return { tags: {} };
}

export const Mesh_DataplaneProxyConstraints_Rules = {
  fromJSON(object: any): Mesh_DataplaneProxyConstraints_Rules {
    return {
      tags: isObject(object.tags)
        ? Object.entries(object.tags).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: Mesh_DataplaneProxyConstraints_Rules): unknown {
    const obj: any = {};
    obj.tags = {};
    if (message.tags) {
      Object.entries(message.tags).forEach(([k, v]) => {
        obj.tags[k] = v;
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Mesh_DataplaneProxyConstraints_Rules>): Mesh_DataplaneProxyConstraints_Rules {
    const message = Object.create(
      createBaseMesh_DataplaneProxyConstraints_Rules(),
    ) as Mesh_DataplaneProxyConstraints_Rules;
    message.tags = Object.entries(object.tags ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseMesh_DataplaneProxyConstraints_Rules_TagsEntry(): Mesh_DataplaneProxyConstraints_Rules_TagsEntry {
  return { key: "", value: "" };
}

export const Mesh_DataplaneProxyConstraints_Rules_TagsEntry = {
  fromJSON(object: any): Mesh_DataplaneProxyConstraints_Rules_TagsEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: Mesh_DataplaneProxyConstraints_Rules_TagsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<Mesh_DataplaneProxyConstraints_Rules_TagsEntry>,
  ): Mesh_DataplaneProxyConstraints_Rules_TagsEntry {
    const message = Object.create(
      createBaseMesh_DataplaneProxyConstraints_Rules_TagsEntry(),
    ) as Mesh_DataplaneProxyConstraints_Rules_TagsEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseCertificateAuthorityBackend(): CertificateAuthorityBackend {
  return {
    name: "",
    type: "",
    dpCert: undefined,
    conf: undefined,
    mode: CertificateAuthorityBackend_Mode.STRICT,
    rootChain: undefined,
  };
}

export const CertificateAuthorityBackend = {
  fromJSON(object: any): CertificateAuthorityBackend {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      type: isSet(object.type) ? String(object.type) : "",
      dpCert: isSet(object.dpCert) ? CertificateAuthorityBackend_DpCert.fromJSON(object.dpCert) : undefined,
      conf: isObject(object.conf) ? object.conf : undefined,
      mode: isSet(object.mode)
        ? certificateAuthorityBackend_ModeFromJSON(object.mode)
        : CertificateAuthorityBackend_Mode.STRICT,
      rootChain: isSet(object.rootChain) ? CertificateAuthorityBackend_RootChain.fromJSON(object.rootChain) : undefined,
    };
  },

  toJSON(message: CertificateAuthorityBackend): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.type !== undefined && (obj.type = message.type);
    message.dpCert !== undefined &&
      (obj.dpCert = message.dpCert ? CertificateAuthorityBackend_DpCert.toJSON(message.dpCert) : undefined);
    message.conf !== undefined && (obj.conf = message.conf);
    message.mode !== undefined && (obj.mode = certificateAuthorityBackend_ModeToJSON(message.mode));
    message.rootChain !== undefined &&
      (obj.rootChain = message.rootChain ? CertificateAuthorityBackend_RootChain.toJSON(message.rootChain) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<CertificateAuthorityBackend>): CertificateAuthorityBackend {
    const message = Object.create(createBaseCertificateAuthorityBackend()) as CertificateAuthorityBackend;
    message.name = object.name ?? "";
    message.type = object.type ?? "";
    message.dpCert = (object.dpCert !== undefined && object.dpCert !== null)
      ? CertificateAuthorityBackend_DpCert.fromPartial(object.dpCert)
      : undefined;
    message.conf = object.conf ?? undefined;
    message.mode = object.mode ?? CertificateAuthorityBackend_Mode.STRICT;
    message.rootChain = (object.rootChain !== undefined && object.rootChain !== null)
      ? CertificateAuthorityBackend_RootChain.fromPartial(object.rootChain)
      : undefined;
    return message;
  },
};

function createBaseCertificateAuthorityBackend_DpCert(): CertificateAuthorityBackend_DpCert {
  return { rotation: undefined, requestTimeout: undefined };
}

export const CertificateAuthorityBackend_DpCert = {
  fromJSON(object: any): CertificateAuthorityBackend_DpCert {
    return {
      rotation: isSet(object.rotation)
        ? CertificateAuthorityBackend_DpCert_Rotation.fromJSON(object.rotation)
        : undefined,
      requestTimeout: isSet(object.requestTimeout) ? Duration.fromJSON(object.requestTimeout) : undefined,
    };
  },

  toJSON(message: CertificateAuthorityBackend_DpCert): unknown {
    const obj: any = {};
    message.rotation !== undefined && (obj.rotation = message.rotation
      ? CertificateAuthorityBackend_DpCert_Rotation.toJSON(message.rotation)
      : undefined);
    message.requestTimeout !== undefined &&
      (obj.requestTimeout = message.requestTimeout ? Duration.toJSON(message.requestTimeout) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<CertificateAuthorityBackend_DpCert>): CertificateAuthorityBackend_DpCert {
    const message = Object.create(createBaseCertificateAuthorityBackend_DpCert()) as CertificateAuthorityBackend_DpCert;
    message.rotation = (object.rotation !== undefined && object.rotation !== null)
      ? CertificateAuthorityBackend_DpCert_Rotation.fromPartial(object.rotation)
      : undefined;
    message.requestTimeout = (object.requestTimeout !== undefined && object.requestTimeout !== null)
      ? Duration.fromPartial(object.requestTimeout)
      : undefined;
    return message;
  },
};

function createBaseCertificateAuthorityBackend_DpCert_Rotation(): CertificateAuthorityBackend_DpCert_Rotation {
  return { expiration: "" };
}

export const CertificateAuthorityBackend_DpCert_Rotation = {
  fromJSON(object: any): CertificateAuthorityBackend_DpCert_Rotation {
    return { expiration: isSet(object.expiration) ? String(object.expiration) : "" };
  },

  toJSON(message: CertificateAuthorityBackend_DpCert_Rotation): unknown {
    const obj: any = {};
    message.expiration !== undefined && (obj.expiration = message.expiration);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CertificateAuthorityBackend_DpCert_Rotation>,
  ): CertificateAuthorityBackend_DpCert_Rotation {
    const message = Object.create(
      createBaseCertificateAuthorityBackend_DpCert_Rotation(),
    ) as CertificateAuthorityBackend_DpCert_Rotation;
    message.expiration = object.expiration ?? "";
    return message;
  },
};

function createBaseCertificateAuthorityBackend_RootChain(): CertificateAuthorityBackend_RootChain {
  return { requestTimeout: undefined };
}

export const CertificateAuthorityBackend_RootChain = {
  fromJSON(object: any): CertificateAuthorityBackend_RootChain {
    return { requestTimeout: isSet(object.requestTimeout) ? Duration.fromJSON(object.requestTimeout) : undefined };
  },

  toJSON(message: CertificateAuthorityBackend_RootChain): unknown {
    const obj: any = {};
    message.requestTimeout !== undefined &&
      (obj.requestTimeout = message.requestTimeout ? Duration.toJSON(message.requestTimeout) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<CertificateAuthorityBackend_RootChain>): CertificateAuthorityBackend_RootChain {
    const message = Object.create(
      createBaseCertificateAuthorityBackend_RootChain(),
    ) as CertificateAuthorityBackend_RootChain;
    message.requestTimeout = (object.requestTimeout !== undefined && object.requestTimeout !== null)
      ? Duration.fromPartial(object.requestTimeout)
      : undefined;
    return message;
  },
};

function createBaseNetworking(): Networking {
  return { outbound: undefined };
}

export const Networking = {
  fromJSON(object: any): Networking {
    return { outbound: isSet(object.outbound) ? Networking_Outbound.fromJSON(object.outbound) : undefined };
  },

  toJSON(message: Networking): unknown {
    const obj: any = {};
    message.outbound !== undefined &&
      (obj.outbound = message.outbound ? Networking_Outbound.toJSON(message.outbound) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Networking>): Networking {
    const message = Object.create(createBaseNetworking()) as Networking;
    message.outbound = (object.outbound !== undefined && object.outbound !== null)
      ? Networking_Outbound.fromPartial(object.outbound)
      : undefined;
    return message;
  },
};

function createBaseNetworking_Outbound(): Networking_Outbound {
  return { passthrough: undefined };
}

export const Networking_Outbound = {
  fromJSON(object: any): Networking_Outbound {
    return { passthrough: isSet(object.passthrough) ? Boolean(object.passthrough) : undefined };
  },

  toJSON(message: Networking_Outbound): unknown {
    const obj: any = {};
    message.passthrough !== undefined && (obj.passthrough = message.passthrough);
    return obj;
  },

  fromPartial(object: DeepPartial<Networking_Outbound>): Networking_Outbound {
    const message = Object.create(createBaseNetworking_Outbound()) as Networking_Outbound;
    message.passthrough = object.passthrough ?? undefined;
    return message;
  },
};

function createBaseTracing(): Tracing {
  return { defaultBackend: "", backends: [] };
}

export const Tracing = {
  fromJSON(object: any): Tracing {
    return {
      defaultBackend: isSet(object.defaultBackend) ? String(object.defaultBackend) : "",
      backends: Array.isArray(object?.backends) ? object.backends.map((e: any) => TracingBackend.fromJSON(e)) : [],
    };
  },

  toJSON(message: Tracing): unknown {
    const obj: any = {};
    message.defaultBackend !== undefined && (obj.defaultBackend = message.defaultBackend);
    if (message.backends) {
      obj.backends = message.backends.map((e) => e ? TracingBackend.toJSON(e) : undefined);
    } else {
      obj.backends = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Tracing>): Tracing {
    const message = Object.create(createBaseTracing()) as Tracing;
    message.defaultBackend = object.defaultBackend ?? "";
    message.backends = object.backends?.map((e) => TracingBackend.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTracingBackend(): TracingBackend {
  return { name: "", sampling: undefined, type: "", conf: undefined };
}

export const TracingBackend = {
  fromJSON(object: any): TracingBackend {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      sampling: isSet(object.sampling) ? Number(object.sampling) : undefined,
      type: isSet(object.type) ? String(object.type) : "",
      conf: isObject(object.conf) ? object.conf : undefined,
    };
  },

  toJSON(message: TracingBackend): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.sampling !== undefined && (obj.sampling = message.sampling);
    message.type !== undefined && (obj.type = message.type);
    message.conf !== undefined && (obj.conf = message.conf);
    return obj;
  },

  fromPartial(object: DeepPartial<TracingBackend>): TracingBackend {
    const message = Object.create(createBaseTracingBackend()) as TracingBackend;
    message.name = object.name ?? "";
    message.sampling = object.sampling ?? undefined;
    message.type = object.type ?? "";
    message.conf = object.conf ?? undefined;
    return message;
  },
};

function createBaseDatadogTracingBackendConfig(): DatadogTracingBackendConfig {
  return { address: "", port: 0, splitService: false };
}

export const DatadogTracingBackendConfig = {
  fromJSON(object: any): DatadogTracingBackendConfig {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      port: isSet(object.port) ? Number(object.port) : 0,
      splitService: isSet(object.splitService) ? Boolean(object.splitService) : false,
    };
  },

  toJSON(message: DatadogTracingBackendConfig): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.port !== undefined && (obj.port = Math.round(message.port));
    message.splitService !== undefined && (obj.splitService = message.splitService);
    return obj;
  },

  fromPartial(object: DeepPartial<DatadogTracingBackendConfig>): DatadogTracingBackendConfig {
    const message = Object.create(createBaseDatadogTracingBackendConfig()) as DatadogTracingBackendConfig;
    message.address = object.address ?? "";
    message.port = object.port ?? 0;
    message.splitService = object.splitService ?? false;
    return message;
  },
};

function createBaseZipkinTracingBackendConfig(): ZipkinTracingBackendConfig {
  return { url: "", traceId128bit: false, apiVersion: "", sharedSpanContext: undefined };
}

export const ZipkinTracingBackendConfig = {
  fromJSON(object: any): ZipkinTracingBackendConfig {
    return {
      url: isSet(object.url) ? String(object.url) : "",
      traceId128bit: isSet(object.traceId128bit) ? Boolean(object.traceId128bit) : false,
      apiVersion: isSet(object.apiVersion) ? String(object.apiVersion) : "",
      sharedSpanContext: isSet(object.sharedSpanContext) ? Boolean(object.sharedSpanContext) : undefined,
    };
  },

  toJSON(message: ZipkinTracingBackendConfig): unknown {
    const obj: any = {};
    message.url !== undefined && (obj.url = message.url);
    message.traceId128bit !== undefined && (obj.traceId128bit = message.traceId128bit);
    message.apiVersion !== undefined && (obj.apiVersion = message.apiVersion);
    message.sharedSpanContext !== undefined && (obj.sharedSpanContext = message.sharedSpanContext);
    return obj;
  },

  fromPartial(object: DeepPartial<ZipkinTracingBackendConfig>): ZipkinTracingBackendConfig {
    const message = Object.create(createBaseZipkinTracingBackendConfig()) as ZipkinTracingBackendConfig;
    message.url = object.url ?? "";
    message.traceId128bit = object.traceId128bit ?? false;
    message.apiVersion = object.apiVersion ?? "";
    message.sharedSpanContext = object.sharedSpanContext ?? undefined;
    return message;
  },
};

function createBaseLogging(): Logging {
  return { defaultBackend: "", backends: [] };
}

export const Logging = {
  fromJSON(object: any): Logging {
    return {
      defaultBackend: isSet(object.defaultBackend) ? String(object.defaultBackend) : "",
      backends: Array.isArray(object?.backends) ? object.backends.map((e: any) => LoggingBackend.fromJSON(e)) : [],
    };
  },

  toJSON(message: Logging): unknown {
    const obj: any = {};
    message.defaultBackend !== undefined && (obj.defaultBackend = message.defaultBackend);
    if (message.backends) {
      obj.backends = message.backends.map((e) => e ? LoggingBackend.toJSON(e) : undefined);
    } else {
      obj.backends = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Logging>): Logging {
    const message = Object.create(createBaseLogging()) as Logging;
    message.defaultBackend = object.defaultBackend ?? "";
    message.backends = object.backends?.map((e) => LoggingBackend.fromPartial(e)) || [];
    return message;
  },
};

function createBaseLoggingBackend(): LoggingBackend {
  return { name: "", format: "", type: "", conf: undefined };
}

export const LoggingBackend = {
  fromJSON(object: any): LoggingBackend {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      format: isSet(object.format) ? String(object.format) : "",
      type: isSet(object.type) ? String(object.type) : "",
      conf: isObject(object.conf) ? object.conf : undefined,
    };
  },

  toJSON(message: LoggingBackend): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.format !== undefined && (obj.format = message.format);
    message.type !== undefined && (obj.type = message.type);
    message.conf !== undefined && (obj.conf = message.conf);
    return obj;
  },

  fromPartial(object: DeepPartial<LoggingBackend>): LoggingBackend {
    const message = Object.create(createBaseLoggingBackend()) as LoggingBackend;
    message.name = object.name ?? "";
    message.format = object.format ?? "";
    message.type = object.type ?? "";
    message.conf = object.conf ?? undefined;
    return message;
  },
};

function createBaseFileLoggingBackendConfig(): FileLoggingBackendConfig {
  return { path: "" };
}

export const FileLoggingBackendConfig = {
  fromJSON(object: any): FileLoggingBackendConfig {
    return { path: isSet(object.path) ? String(object.path) : "" };
  },

  toJSON(message: FileLoggingBackendConfig): unknown {
    const obj: any = {};
    message.path !== undefined && (obj.path = message.path);
    return obj;
  },

  fromPartial(object: DeepPartial<FileLoggingBackendConfig>): FileLoggingBackendConfig {
    const message = Object.create(createBaseFileLoggingBackendConfig()) as FileLoggingBackendConfig;
    message.path = object.path ?? "";
    return message;
  },
};

function createBaseTcpLoggingBackendConfig(): TcpLoggingBackendConfig {
  return { address: "" };
}

export const TcpLoggingBackendConfig = {
  fromJSON(object: any): TcpLoggingBackendConfig {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: TcpLoggingBackendConfig): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial(object: DeepPartial<TcpLoggingBackendConfig>): TcpLoggingBackendConfig {
    const message = Object.create(createBaseTcpLoggingBackendConfig()) as TcpLoggingBackendConfig;
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseRouting(): Routing {
  return { localityAwareLoadBalancing: false, zoneEgress: false };
}

export const Routing = {
  fromJSON(object: any): Routing {
    return {
      localityAwareLoadBalancing: isSet(object.localityAwareLoadBalancing)
        ? Boolean(object.localityAwareLoadBalancing)
        : false,
      zoneEgress: isSet(object.zoneEgress) ? Boolean(object.zoneEgress) : false,
    };
  },

  toJSON(message: Routing): unknown {
    const obj: any = {};
    message.localityAwareLoadBalancing !== undefined &&
      (obj.localityAwareLoadBalancing = message.localityAwareLoadBalancing);
    message.zoneEgress !== undefined && (obj.zoneEgress = message.zoneEgress);
    return obj;
  },

  fromPartial(object: DeepPartial<Routing>): Routing {
    const message = Object.create(createBaseRouting()) as Routing;
    message.localityAwareLoadBalancing = object.localityAwareLoadBalancing ?? false;
    message.zoneEgress = object.zoneEgress ?? false;
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
