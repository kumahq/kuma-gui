/* eslint-disable */
import { Any } from "../../../../google/protobuf/any";
import { FractionalPercent } from "../../../type/percent";
import { SemanticVersion } from "../../../type/semantic_version";
import { Address } from "./address";
import { BackoffStrategy } from "./backoff";
import { HttpUri } from "./http_uri";

export const protobufPackage = "envoy.api.v2.core";

/**
 * Envoy supports :ref:`upstream priority routing
 * <arch_overview_http_routing_priority>` both at the route and the virtual
 * cluster level. The current priority implementation uses different connection
 * pool and circuit breaking settings for each priority level. This means that
 * even for HTTP/2 requests, two physical connections will be used to an
 * upstream host. In the future Envoy will likely support true HTTP/2 priority
 * over a single upstream connection.
 */
export enum RoutingPriority {
  DEFAULT = "DEFAULT",
  HIGH = "HIGH",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function routingPriorityFromJSON(object: any): RoutingPriority {
  switch (object) {
    case 0:
    case "DEFAULT":
      return RoutingPriority.DEFAULT;
    case 1:
    case "HIGH":
      return RoutingPriority.HIGH;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RoutingPriority.UNRECOGNIZED;
  }
}

export function routingPriorityToJSON(object: RoutingPriority): string {
  switch (object) {
    case RoutingPriority.DEFAULT:
      return "DEFAULT";
    case RoutingPriority.HIGH:
      return "HIGH";
    case RoutingPriority.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** HTTP request method. */
export enum RequestMethod {
  METHOD_UNSPECIFIED = "METHOD_UNSPECIFIED",
  GET = "GET",
  HEAD = "HEAD",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  CONNECT = "CONNECT",
  OPTIONS = "OPTIONS",
  TRACE = "TRACE",
  PATCH = "PATCH",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function requestMethodFromJSON(object: any): RequestMethod {
  switch (object) {
    case 0:
    case "METHOD_UNSPECIFIED":
      return RequestMethod.METHOD_UNSPECIFIED;
    case 1:
    case "GET":
      return RequestMethod.GET;
    case 2:
    case "HEAD":
      return RequestMethod.HEAD;
    case 3:
    case "POST":
      return RequestMethod.POST;
    case 4:
    case "PUT":
      return RequestMethod.PUT;
    case 5:
    case "DELETE":
      return RequestMethod.DELETE;
    case 6:
    case "CONNECT":
      return RequestMethod.CONNECT;
    case 7:
    case "OPTIONS":
      return RequestMethod.OPTIONS;
    case 8:
    case "TRACE":
      return RequestMethod.TRACE;
    case 9:
    case "PATCH":
      return RequestMethod.PATCH;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RequestMethod.UNRECOGNIZED;
  }
}

export function requestMethodToJSON(object: RequestMethod): string {
  switch (object) {
    case RequestMethod.METHOD_UNSPECIFIED:
      return "METHOD_UNSPECIFIED";
    case RequestMethod.GET:
      return "GET";
    case RequestMethod.HEAD:
      return "HEAD";
    case RequestMethod.POST:
      return "POST";
    case RequestMethod.PUT:
      return "PUT";
    case RequestMethod.DELETE:
      return "DELETE";
    case RequestMethod.CONNECT:
      return "CONNECT";
    case RequestMethod.OPTIONS:
      return "OPTIONS";
    case RequestMethod.TRACE:
      return "TRACE";
    case RequestMethod.PATCH:
      return "PATCH";
    case RequestMethod.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Identifies the direction of the traffic relative to the local Envoy. */
export enum TrafficDirection {
  /** UNSPECIFIED - Default option is unspecified. */
  UNSPECIFIED = "UNSPECIFIED",
  /** INBOUND - The transport is used for incoming traffic. */
  INBOUND = "INBOUND",
  /** OUTBOUND - The transport is used for outgoing traffic. */
  OUTBOUND = "OUTBOUND",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function trafficDirectionFromJSON(object: any): TrafficDirection {
  switch (object) {
    case 0:
    case "UNSPECIFIED":
      return TrafficDirection.UNSPECIFIED;
    case 1:
    case "INBOUND":
      return TrafficDirection.INBOUND;
    case 2:
    case "OUTBOUND":
      return TrafficDirection.OUTBOUND;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TrafficDirection.UNRECOGNIZED;
  }
}

export function trafficDirectionToJSON(object: TrafficDirection): string {
  switch (object) {
    case TrafficDirection.UNSPECIFIED:
      return "UNSPECIFIED";
    case TrafficDirection.INBOUND:
      return "INBOUND";
    case TrafficDirection.OUTBOUND:
      return "OUTBOUND";
    case TrafficDirection.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Identifies location of where either Envoy runs or where upstream hosts run. */
export interface Locality {
  /** Region this :ref:`zone <envoy_api_field_core.Locality.zone>` belongs to. */
  region: string;
  /**
   * Defines the local service zone where Envoy is running. Though optional, it
   * should be set if discovery service routing is used and the discovery
   * service exposes :ref:`zone data <envoy_api_field_endpoint.LocalityLbEndpoints.locality>`,
   * either in this message or via :option:`--service-zone`. The meaning of zone
   * is context dependent, e.g. `Availability Zone (AZ)
   * <https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html>`_
   * on AWS, `Zone <https://cloud.google.com/compute/docs/regions-zones/>`_ on
   * GCP, etc.
   */
  zone: string;
  /**
   * When used for locality of upstream hosts, this field further splits zone
   * into smaller chunks of sub-zones so they can be load balanced
   * independently.
   */
  subZone: string;
}

/**
 * BuildVersion combines SemVer version of extension with free-form build information
 * (i.e. 'alpha', 'private-build') as a set of strings.
 */
export interface BuildVersion {
  /** SemVer version of extension. */
  version:
    | SemanticVersion
    | undefined;
  /**
   * Free-form build information.
   * Envoy defines several well known keys in the source/common/version/version.h file
   */
  metadata: { [key: string]: any } | undefined;
}

/**
 * Version and identification for an Envoy extension.
 * [#next-free-field: 6]
 */
export interface Extension {
  /**
   * This is the name of the Envoy filter as specified in the Envoy
   * configuration, e.g. envoy.filters.http.router, com.acme.widget.
   */
  name: string;
  /**
   * Category of the extension.
   * Extension category names use reverse DNS notation. For instance "envoy.filters.listener"
   * for Envoy's built-in listener filters or "com.acme.filters.http" for HTTP filters from
   * acme.com vendor.
   * [#comment:TODO(yanavlasov): Link to the doc with existing envoy category names.]
   */
  category: string;
  /**
   * [#not-implemented-hide:] Type descriptor of extension configuration proto.
   * [#comment:TODO(yanavlasov): Link to the doc with existing configuration protos.]
   * [#comment:TODO(yanavlasov): Add tests when PR #9391 lands.]
   */
  typeDescriptor: string;
  /**
   * The version is a property of the extension and maintained independently
   * of other extensions and the Envoy API.
   * This field is not set when extension did not provide version information.
   */
  version:
    | BuildVersion
    | undefined;
  /** Indicates that the extension is present but was disabled via dynamic configuration. */
  disabled: boolean;
}

/**
 * Identifies a specific Envoy instance. The node identifier is presented to the
 * management server, which may use this identifier to distinguish per Envoy
 * configuration for serving.
 * [#next-free-field: 12]
 */
export interface Node {
  /**
   * An opaque node identifier for the Envoy node. This also provides the local
   * service node name. It should be set if any of the following features are
   * used: :ref:`statsd <arch_overview_statistics>`, :ref:`CDS
   * <config_cluster_manager_cds>`, and :ref:`HTTP tracing
   * <arch_overview_tracing>`, either in this message or via
   * :option:`--service-node`.
   */
  id: string;
  /**
   * Defines the local service cluster name where Envoy is running. Though
   * optional, it should be set if any of the following features are used:
   * :ref:`statsd <arch_overview_statistics>`, :ref:`health check cluster
   * verification
   * <envoy_api_field_core.HealthCheck.HttpHealthCheck.service_name_matcher>`,
   * :ref:`runtime override directory <envoy_api_msg_config.bootstrap.v2.Runtime>`,
   * :ref:`user agent addition
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.add_user_agent>`,
   * :ref:`HTTP global rate limiting <config_http_filters_rate_limit>`,
   * :ref:`CDS <config_cluster_manager_cds>`, and :ref:`HTTP tracing
   * <arch_overview_tracing>`, either in this message or via
   * :option:`--service-cluster`.
   */
  cluster: string;
  /**
   * Opaque metadata extending the node identifier. Envoy will pass this
   * directly to the management server.
   */
  metadata:
    | { [key: string]: any }
    | undefined;
  /** Locality specifying where the Envoy instance is running. */
  locality:
    | Locality
    | undefined;
  /**
   * This is motivated by informing a management server during canary which
   * version of Envoy is being tested in a heterogeneous fleet. This will be set
   * by Envoy in management server RPCs.
   * This field is deprecated in favor of the user_agent_name and user_agent_version values.
   *
   * @deprecated
   */
  buildVersion: string;
  /**
   * Free-form string that identifies the entity requesting config.
   * E.g. "envoy" or "grpc"
   */
  userAgentName: string;
  /**
   * Free-form string that identifies the version of the entity requesting config.
   * E.g. "1.12.2" or "abcd1234", or "SpecialEnvoyBuild"
   */
  userAgentVersion?:
    | string
    | undefined;
  /** Structured version of the entity requesting config. */
  userAgentBuildVersion?:
    | BuildVersion
    | undefined;
  /** List of extensions and their versions supported by the node. */
  extensions: Extension[];
  /**
   * Client feature support list. These are well known features described
   * in the Envoy API repository for a given major version of an API. Client features
   * use reverse DNS naming scheme, for example `com.acme.feature`.
   * See :ref:`the list of features <client_features>` that xDS client may
   * support.
   */
  clientFeatures: string[];
  /**
   * Known listening ports on the node as a generic hint to the management server
   * for filtering :ref:`listeners <config_listeners>` to be returned. For example,
   * if there is a listener bound to port 80, the list can optionally contain the
   * SocketAddress `(0.0.0.0,80)`. The field is optional and just a hint.
   */
  listeningAddresses: Address[];
}

/**
 * Metadata provides additional inputs to filters based on matched listeners,
 * filter chains, routes and endpoints. It is structured as a map, usually from
 * filter name (in reverse DNS format) to metadata specific to the filter. Metadata
 * key-values for a filter are merged as connection and request handling occurs,
 * with later values for the same key overriding earlier values.
 *
 * An example use of metadata is providing additional values to
 * http_connection_manager in the envoy.http_connection_manager.access_log
 * namespace.
 *
 * Another example use of metadata is to per service config info in cluster metadata, which may get
 * consumed by multiple filters.
 *
 * For load balancing, Metadata provides a means to subset cluster endpoints.
 * Endpoints have a Metadata object associated and routes contain a Metadata
 * object to match against. There are some well defined metadata used today for
 * this purpose:
 *
 * * ``{"envoy.lb": {"canary": <bool> }}`` This indicates the canary status of an
 *   endpoint and is also used during header processing
 *   (x-envoy-upstream-canary) and for stats purposes.
 * [#next-major-version: move to type/metadata/v2]
 */
export interface Metadata {
  /**
   * Key is the reverse DNS filter name, e.g. com.acme.widget. The envoy.*
   * namespace is reserved for Envoy's built-in filters.
   */
  filterMetadata: { [key: string]: { [key: string]: any } | undefined };
}

export interface Metadata_FilterMetadataEntry {
  key: string;
  value: { [key: string]: any } | undefined;
}

/** Runtime derived uint32 with a default when not specified. */
export interface RuntimeUInt32 {
  /** Default value if runtime value is not available. */
  defaultValue: number;
  /** Runtime key to get value for comparison. This value is used if defined. */
  runtimeKey: string;
}

/** Runtime derived double with a default when not specified. */
export interface RuntimeDouble {
  /** Default value if runtime value is not available. */
  defaultValue: number;
  /** Runtime key to get value for comparison. This value is used if defined. */
  runtimeKey: string;
}

/** Runtime derived bool with a default when not specified. */
export interface RuntimeFeatureFlag {
  /** Default value if runtime value is not available. */
  defaultValue:
    | boolean
    | undefined;
  /**
   * Runtime key to get value for comparison. This value is used if defined. The boolean value must
   * be represented via its
   * `canonical JSON encoding <https://developers.google.com/protocol-buffers/docs/proto3#json>`_.
   */
  runtimeKey: string;
}

/** Header name/value pair. */
export interface HeaderValue {
  /** Header name. */
  key: string;
  /**
   * Header value.
   *
   * The same :ref:`format specifier <config_access_log_format>` as used for
   * :ref:`HTTP access logging <config_access_log>` applies here, however
   * unknown header values are replaced with the empty string instead of `-`.
   */
  value: string;
}

/** Header name/value pair plus option to control append behavior. */
export interface HeaderValueOption {
  /** Header name/value pair that this option applies to. */
  header:
    | HeaderValue
    | undefined;
  /**
   * Should the value be appended? If true (default), the value is appended to
   * existing values.
   */
  append: boolean | undefined;
}

/** Wrapper for a set of headers. */
export interface HeaderMap {
  headers: HeaderValue[];
}

/** Data source consisting of either a file or an inline value. */
export interface DataSource {
  /** Local filesystem data source. */
  filename?:
    | string
    | undefined;
  /** Bytes inlined in the configuration. */
  inlineBytes?:
    | Uint8Array
    | undefined;
  /** String inlined in the configuration. */
  inlineString?: string | undefined;
}

/** The message specifies the retry policy of remote data source when fetching fails. */
export interface RetryPolicy {
  /**
   * Specifies parameters that control :ref:`retry backoff strategy <envoy_api_msg_core.BackoffStrategy>`.
   * This parameter is optional, in which case the default base interval is 1000 milliseconds. The
   * default maximum interval is 10 times the base interval.
   */
  retryBackOff:
    | BackoffStrategy
    | undefined;
  /**
   * Specifies the allowed number of retries. This parameter is optional and
   * defaults to 1.
   */
  numRetries: number | undefined;
}

/** The message specifies how to fetch data from remote and how to verify it. */
export interface RemoteDataSource {
  /** The HTTP URI to fetch the remote data. */
  httpUri:
    | HttpUri
    | undefined;
  /** SHA256 string for verifying data. */
  sha256: string;
  /** Retry policy for fetching remote data. */
  retryPolicy: RetryPolicy | undefined;
}

/** Async data source which support async data fetch. */
export interface AsyncDataSource {
  /** Local async data source. */
  local?:
    | DataSource
    | undefined;
  /** Remote async data source. */
  remote?: RemoteDataSource | undefined;
}

/**
 * Configuration for transport socket in :ref:`listeners <config_listeners>` and
 * :ref:`clusters <envoy_api_msg_Cluster>`. If the configuration is
 * empty, a default transport socket implementation and configuration will be
 * chosen based on the platform and existence of tls_context.
 */
export interface TransportSocket {
  /**
   * The name of the transport socket to instantiate. The name must match a supported transport
   * socket implementation.
   */
  name: string;
  /** @deprecated */
  config?: { [key: string]: any } | undefined;
  typedConfig?: Any | undefined;
}

/**
 * Runtime derived FractionalPercent with defaults for when the numerator or denominator is not
 * specified via a runtime key.
 *
 * .. note::
 *
 *   Parsing of the runtime key's data is implemented such that it may be represented as a
 *   :ref:`FractionalPercent <envoy_api_msg_type.FractionalPercent>` proto represented as JSON/YAML
 *   and may also be represented as an integer with the assumption that the value is an integral
 *   percentage out of 100. For instance, a runtime key lookup returning the value "42" would parse
 *   as a `FractionalPercent` whose numerator is 42 and denominator is HUNDRED.
 */
export interface RuntimeFractionalPercent {
  /** Default value if the runtime value's for the numerator/denominator keys are not available. */
  defaultValue:
    | FractionalPercent
    | undefined;
  /** Runtime key for a YAML representation of a FractionalPercent. */
  runtimeKey: string;
}

/** Identifies a specific ControlPlane instance that Envoy is connected to. */
export interface ControlPlane {
  /**
   * An opaque control plane identifier that uniquely identifies an instance
   * of control plane. This can be used to identify which control plane instance,
   * the Envoy is connected to.
   */
  identifier: string;
}

function createBaseLocality(): Locality {
  return { region: "", zone: "", subZone: "" };
}

export const Locality = {
  fromJSON(object: any): Locality {
    return {
      region: isSet(object.region) ? String(object.region) : "",
      zone: isSet(object.zone) ? String(object.zone) : "",
      subZone: isSet(object.subZone) ? String(object.subZone) : "",
    };
  },

  toJSON(message: Locality): unknown {
    const obj: any = {};
    message.region !== undefined && (obj.region = message.region);
    message.zone !== undefined && (obj.zone = message.zone);
    message.subZone !== undefined && (obj.subZone = message.subZone);
    return obj;
  },

  fromPartial(object: DeepPartial<Locality>): Locality {
    const message = Object.create(createBaseLocality()) as Locality;
    message.region = object.region ?? "";
    message.zone = object.zone ?? "";
    message.subZone = object.subZone ?? "";
    return message;
  },
};

function createBaseBuildVersion(): BuildVersion {
  return { version: undefined, metadata: undefined };
}

export const BuildVersion = {
  fromJSON(object: any): BuildVersion {
    return {
      version: isSet(object.version) ? SemanticVersion.fromJSON(object.version) : undefined,
      metadata: isObject(object.metadata) ? object.metadata : undefined,
    };
  },

  toJSON(message: BuildVersion): unknown {
    const obj: any = {};
    message.version !== undefined &&
      (obj.version = message.version ? SemanticVersion.toJSON(message.version) : undefined);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    return obj;
  },

  fromPartial(object: DeepPartial<BuildVersion>): BuildVersion {
    const message = Object.create(createBaseBuildVersion()) as BuildVersion;
    message.version = (object.version !== undefined && object.version !== null)
      ? SemanticVersion.fromPartial(object.version)
      : undefined;
    message.metadata = object.metadata ?? undefined;
    return message;
  },
};

function createBaseExtension(): Extension {
  return { name: "", category: "", typeDescriptor: "", version: undefined, disabled: false };
}

export const Extension = {
  fromJSON(object: any): Extension {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      category: isSet(object.category) ? String(object.category) : "",
      typeDescriptor: isSet(object.typeDescriptor) ? String(object.typeDescriptor) : "",
      version: isSet(object.version) ? BuildVersion.fromJSON(object.version) : undefined,
      disabled: isSet(object.disabled) ? Boolean(object.disabled) : false,
    };
  },

  toJSON(message: Extension): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.category !== undefined && (obj.category = message.category);
    message.typeDescriptor !== undefined && (obj.typeDescriptor = message.typeDescriptor);
    message.version !== undefined && (obj.version = message.version ? BuildVersion.toJSON(message.version) : undefined);
    message.disabled !== undefined && (obj.disabled = message.disabled);
    return obj;
  },

  fromPartial(object: DeepPartial<Extension>): Extension {
    const message = Object.create(createBaseExtension()) as Extension;
    message.name = object.name ?? "";
    message.category = object.category ?? "";
    message.typeDescriptor = object.typeDescriptor ?? "";
    message.version = (object.version !== undefined && object.version !== null)
      ? BuildVersion.fromPartial(object.version)
      : undefined;
    message.disabled = object.disabled ?? false;
    return message;
  },
};

function createBaseNode(): Node {
  return {
    id: "",
    cluster: "",
    metadata: undefined,
    locality: undefined,
    buildVersion: "",
    userAgentName: "",
    extensions: [],
    clientFeatures: [],
    listeningAddresses: [],
  };
}

export const Node = {
  fromJSON(object: any): Node {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      cluster: isSet(object.cluster) ? String(object.cluster) : "",
      metadata: isObject(object.metadata) ? object.metadata : undefined,
      locality: isSet(object.locality) ? Locality.fromJSON(object.locality) : undefined,
      buildVersion: isSet(object.buildVersion) ? String(object.buildVersion) : "",
      userAgentName: isSet(object.userAgentName) ? String(object.userAgentName) : "",
      userAgentVersion: isSet(object.userAgentVersion) ? String(object.userAgentVersion) : undefined,
      userAgentBuildVersion: isSet(object.userAgentBuildVersion)
        ? BuildVersion.fromJSON(object.userAgentBuildVersion)
        : undefined,
      extensions: Array.isArray(object?.extensions)
        ? object.extensions.map((e: any) => Extension.fromJSON(e))
        : [],
      clientFeatures: Array.isArray(object?.clientFeatures) ? object.clientFeatures.map((e: any) => String(e)) : [],
      listeningAddresses: Array.isArray(object?.listeningAddresses)
        ? object.listeningAddresses.map((e: any) => Address.fromJSON(e))
        : [],
    };
  },

  toJSON(message: Node): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.cluster !== undefined && (obj.cluster = message.cluster);
    message.metadata !== undefined && (obj.metadata = message.metadata);
    message.locality !== undefined && (obj.locality = message.locality ? Locality.toJSON(message.locality) : undefined);
    message.buildVersion !== undefined && (obj.buildVersion = message.buildVersion);
    message.userAgentName !== undefined && (obj.userAgentName = message.userAgentName);
    message.userAgentVersion !== undefined && (obj.userAgentVersion = message.userAgentVersion);
    message.userAgentBuildVersion !== undefined && (obj.userAgentBuildVersion = message.userAgentBuildVersion
      ? BuildVersion.toJSON(message.userAgentBuildVersion)
      : undefined);
    if (message.extensions) {
      obj.extensions = message.extensions.map((e) => e ? Extension.toJSON(e) : undefined);
    } else {
      obj.extensions = [];
    }
    if (message.clientFeatures) {
      obj.clientFeatures = message.clientFeatures.map((e) => e);
    } else {
      obj.clientFeatures = [];
    }
    if (message.listeningAddresses) {
      obj.listeningAddresses = message.listeningAddresses.map((e) => e ? Address.toJSON(e) : undefined);
    } else {
      obj.listeningAddresses = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Node>): Node {
    const message = Object.create(createBaseNode()) as Node;
    message.id = object.id ?? "";
    message.cluster = object.cluster ?? "";
    message.metadata = object.metadata ?? undefined;
    message.locality = (object.locality !== undefined && object.locality !== null)
      ? Locality.fromPartial(object.locality)
      : undefined;
    message.buildVersion = object.buildVersion ?? "";
    message.userAgentName = object.userAgentName ?? "";
    message.userAgentVersion = object.userAgentVersion ?? undefined;
    message.userAgentBuildVersion =
      (object.userAgentBuildVersion !== undefined && object.userAgentBuildVersion !== null)
        ? BuildVersion.fromPartial(object.userAgentBuildVersion)
        : undefined;
    message.extensions = object.extensions?.map((e) => Extension.fromPartial(e)) || [];
    message.clientFeatures = object.clientFeatures?.map((e) => e) || [];
    message.listeningAddresses = object.listeningAddresses?.map((e) => Address.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMetadata(): Metadata {
  return { filterMetadata: {} };
}

export const Metadata = {
  fromJSON(object: any): Metadata {
    return {
      filterMetadata: isObject(object.filterMetadata)
        ? Object.entries(object.filterMetadata).reduce<{ [key: string]: { [key: string]: any } | undefined }>(
          (acc, [key, value]) => {
            acc[key] = value as { [key: string]: any } | undefined;
            return acc;
          },
          {},
        )
        : {},
    };
  },

  toJSON(message: Metadata): unknown {
    const obj: any = {};
    obj.filterMetadata = {};
    if (message.filterMetadata) {
      Object.entries(message.filterMetadata).forEach(([k, v]) => {
        obj.filterMetadata[k] = v;
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Metadata>): Metadata {
    const message = Object.create(createBaseMetadata()) as Metadata;
    message.filterMetadata = Object.entries(object.filterMetadata ?? {}).reduce<
      { [key: string]: { [key: string]: any } | undefined }
    >((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseMetadata_FilterMetadataEntry(): Metadata_FilterMetadataEntry {
  return { key: "", value: undefined };
}

export const Metadata_FilterMetadataEntry = {
  fromJSON(object: any): Metadata_FilterMetadataEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isObject(object.value) ? object.value : undefined,
    };
  },

  toJSON(message: Metadata_FilterMetadataEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<Metadata_FilterMetadataEntry>): Metadata_FilterMetadataEntry {
    const message = Object.create(createBaseMetadata_FilterMetadataEntry()) as Metadata_FilterMetadataEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? undefined;
    return message;
  },
};

function createBaseRuntimeUInt32(): RuntimeUInt32 {
  return { defaultValue: 0, runtimeKey: "" };
}

export const RuntimeUInt32 = {
  fromJSON(object: any): RuntimeUInt32 {
    return {
      defaultValue: isSet(object.defaultValue) ? Number(object.defaultValue) : 0,
      runtimeKey: isSet(object.runtimeKey) ? String(object.runtimeKey) : "",
    };
  },

  toJSON(message: RuntimeUInt32): unknown {
    const obj: any = {};
    message.defaultValue !== undefined && (obj.defaultValue = Math.round(message.defaultValue));
    message.runtimeKey !== undefined && (obj.runtimeKey = message.runtimeKey);
    return obj;
  },

  fromPartial(object: DeepPartial<RuntimeUInt32>): RuntimeUInt32 {
    const message = Object.create(createBaseRuntimeUInt32()) as RuntimeUInt32;
    message.defaultValue = object.defaultValue ?? 0;
    message.runtimeKey = object.runtimeKey ?? "";
    return message;
  },
};

function createBaseRuntimeDouble(): RuntimeDouble {
  return { defaultValue: 0, runtimeKey: "" };
}

export const RuntimeDouble = {
  fromJSON(object: any): RuntimeDouble {
    return {
      defaultValue: isSet(object.defaultValue) ? Number(object.defaultValue) : 0,
      runtimeKey: isSet(object.runtimeKey) ? String(object.runtimeKey) : "",
    };
  },

  toJSON(message: RuntimeDouble): unknown {
    const obj: any = {};
    message.defaultValue !== undefined && (obj.defaultValue = message.defaultValue);
    message.runtimeKey !== undefined && (obj.runtimeKey = message.runtimeKey);
    return obj;
  },

  fromPartial(object: DeepPartial<RuntimeDouble>): RuntimeDouble {
    const message = Object.create(createBaseRuntimeDouble()) as RuntimeDouble;
    message.defaultValue = object.defaultValue ?? 0;
    message.runtimeKey = object.runtimeKey ?? "";
    return message;
  },
};

function createBaseRuntimeFeatureFlag(): RuntimeFeatureFlag {
  return { defaultValue: undefined, runtimeKey: "" };
}

export const RuntimeFeatureFlag = {
  fromJSON(object: any): RuntimeFeatureFlag {
    return {
      defaultValue: isSet(object.defaultValue) ? Boolean(object.defaultValue) : undefined,
      runtimeKey: isSet(object.runtimeKey) ? String(object.runtimeKey) : "",
    };
  },

  toJSON(message: RuntimeFeatureFlag): unknown {
    const obj: any = {};
    message.defaultValue !== undefined && (obj.defaultValue = message.defaultValue);
    message.runtimeKey !== undefined && (obj.runtimeKey = message.runtimeKey);
    return obj;
  },

  fromPartial(object: DeepPartial<RuntimeFeatureFlag>): RuntimeFeatureFlag {
    const message = Object.create(createBaseRuntimeFeatureFlag()) as RuntimeFeatureFlag;
    message.defaultValue = object.defaultValue ?? undefined;
    message.runtimeKey = object.runtimeKey ?? "";
    return message;
  },
};

function createBaseHeaderValue(): HeaderValue {
  return { key: "", value: "" };
}

export const HeaderValue = {
  fromJSON(object: any): HeaderValue {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: HeaderValue): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<HeaderValue>): HeaderValue {
    const message = Object.create(createBaseHeaderValue()) as HeaderValue;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseHeaderValueOption(): HeaderValueOption {
  return { header: undefined, append: undefined };
}

export const HeaderValueOption = {
  fromJSON(object: any): HeaderValueOption {
    return {
      header: isSet(object.header) ? HeaderValue.fromJSON(object.header) : undefined,
      append: isSet(object.append) ? Boolean(object.append) : undefined,
    };
  },

  toJSON(message: HeaderValueOption): unknown {
    const obj: any = {};
    message.header !== undefined && (obj.header = message.header ? HeaderValue.toJSON(message.header) : undefined);
    message.append !== undefined && (obj.append = message.append);
    return obj;
  },

  fromPartial(object: DeepPartial<HeaderValueOption>): HeaderValueOption {
    const message = Object.create(createBaseHeaderValueOption()) as HeaderValueOption;
    message.header = (object.header !== undefined && object.header !== null)
      ? HeaderValue.fromPartial(object.header)
      : undefined;
    message.append = object.append ?? undefined;
    return message;
  },
};

function createBaseHeaderMap(): HeaderMap {
  return { headers: [] };
}

export const HeaderMap = {
  fromJSON(object: any): HeaderMap {
    return { headers: Array.isArray(object?.headers) ? object.headers.map((e: any) => HeaderValue.fromJSON(e)) : [] };
  },

  toJSON(message: HeaderMap): unknown {
    const obj: any = {};
    if (message.headers) {
      obj.headers = message.headers.map((e) => e ? HeaderValue.toJSON(e) : undefined);
    } else {
      obj.headers = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<HeaderMap>): HeaderMap {
    const message = Object.create(createBaseHeaderMap()) as HeaderMap;
    message.headers = object.headers?.map((e) => HeaderValue.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDataSource(): DataSource {
  return {};
}

export const DataSource = {
  fromJSON(object: any): DataSource {
    return {
      filename: isSet(object.filename) ? String(object.filename) : undefined,
      inlineBytes: isSet(object.inlineBytes) ? bytesFromBase64(object.inlineBytes) : undefined,
      inlineString: isSet(object.inlineString) ? String(object.inlineString) : undefined,
    };
  },

  toJSON(message: DataSource): unknown {
    const obj: any = {};
    message.filename !== undefined && (obj.filename = message.filename);
    message.inlineBytes !== undefined &&
      (obj.inlineBytes = message.inlineBytes !== undefined ? base64FromBytes(message.inlineBytes) : undefined);
    message.inlineString !== undefined && (obj.inlineString = message.inlineString);
    return obj;
  },

  fromPartial(object: DeepPartial<DataSource>): DataSource {
    const message = Object.create(createBaseDataSource()) as DataSource;
    message.filename = object.filename ?? undefined;
    message.inlineBytes = object.inlineBytes ?? undefined;
    message.inlineString = object.inlineString ?? undefined;
    return message;
  },
};

function createBaseRetryPolicy(): RetryPolicy {
  return { retryBackOff: undefined, numRetries: undefined };
}

export const RetryPolicy = {
  fromJSON(object: any): RetryPolicy {
    return {
      retryBackOff: isSet(object.retryBackOff) ? BackoffStrategy.fromJSON(object.retryBackOff) : undefined,
      numRetries: isSet(object.numRetries) ? Number(object.numRetries) : undefined,
    };
  },

  toJSON(message: RetryPolicy): unknown {
    const obj: any = {};
    message.retryBackOff !== undefined &&
      (obj.retryBackOff = message.retryBackOff ? BackoffStrategy.toJSON(message.retryBackOff) : undefined);
    message.numRetries !== undefined && (obj.numRetries = message.numRetries);
    return obj;
  },

  fromPartial(object: DeepPartial<RetryPolicy>): RetryPolicy {
    const message = Object.create(createBaseRetryPolicy()) as RetryPolicy;
    message.retryBackOff = (object.retryBackOff !== undefined && object.retryBackOff !== null)
      ? BackoffStrategy.fromPartial(object.retryBackOff)
      : undefined;
    message.numRetries = object.numRetries ?? undefined;
    return message;
  },
};

function createBaseRemoteDataSource(): RemoteDataSource {
  return { httpUri: undefined, sha256: "", retryPolicy: undefined };
}

export const RemoteDataSource = {
  fromJSON(object: any): RemoteDataSource {
    return {
      httpUri: isSet(object.httpUri) ? HttpUri.fromJSON(object.httpUri) : undefined,
      sha256: isSet(object.sha256) ? String(object.sha256) : "",
      retryPolicy: isSet(object.retryPolicy) ? RetryPolicy.fromJSON(object.retryPolicy) : undefined,
    };
  },

  toJSON(message: RemoteDataSource): unknown {
    const obj: any = {};
    message.httpUri !== undefined && (obj.httpUri = message.httpUri ? HttpUri.toJSON(message.httpUri) : undefined);
    message.sha256 !== undefined && (obj.sha256 = message.sha256);
    message.retryPolicy !== undefined &&
      (obj.retryPolicy = message.retryPolicy ? RetryPolicy.toJSON(message.retryPolicy) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<RemoteDataSource>): RemoteDataSource {
    const message = Object.create(createBaseRemoteDataSource()) as RemoteDataSource;
    message.httpUri = (object.httpUri !== undefined && object.httpUri !== null)
      ? HttpUri.fromPartial(object.httpUri)
      : undefined;
    message.sha256 = object.sha256 ?? "";
    message.retryPolicy = (object.retryPolicy !== undefined && object.retryPolicy !== null)
      ? RetryPolicy.fromPartial(object.retryPolicy)
      : undefined;
    return message;
  },
};

function createBaseAsyncDataSource(): AsyncDataSource {
  return {};
}

export const AsyncDataSource = {
  fromJSON(object: any): AsyncDataSource {
    return {
      local: isSet(object.local) ? DataSource.fromJSON(object.local) : undefined,
      remote: isSet(object.remote) ? RemoteDataSource.fromJSON(object.remote) : undefined,
    };
  },

  toJSON(message: AsyncDataSource): unknown {
    const obj: any = {};
    message.local !== undefined && (obj.local = message.local ? DataSource.toJSON(message.local) : undefined);
    message.remote !== undefined && (obj.remote = message.remote ? RemoteDataSource.toJSON(message.remote) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<AsyncDataSource>): AsyncDataSource {
    const message = Object.create(createBaseAsyncDataSource()) as AsyncDataSource;
    message.local = (object.local !== undefined && object.local !== null)
      ? DataSource.fromPartial(object.local)
      : undefined;
    message.remote = (object.remote !== undefined && object.remote !== null)
      ? RemoteDataSource.fromPartial(object.remote)
      : undefined;
    return message;
  },
};

function createBaseTransportSocket(): TransportSocket {
  return { name: "" };
}

export const TransportSocket = {
  fromJSON(object: any): TransportSocket {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      config: isObject(object.config) ? object.config : undefined,
      typedConfig: isSet(object.typedConfig) ? Any.fromJSON(object.typedConfig) : undefined,
    };
  },

  toJSON(message: TransportSocket): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.config !== undefined && (obj.config = message.config);
    message.typedConfig !== undefined &&
      (obj.typedConfig = message.typedConfig ? Any.toJSON(message.typedConfig) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<TransportSocket>): TransportSocket {
    const message = Object.create(createBaseTransportSocket()) as TransportSocket;
    message.name = object.name ?? "";
    message.config = object.config ?? undefined;
    message.typedConfig = (object.typedConfig !== undefined && object.typedConfig !== null)
      ? Any.fromPartial(object.typedConfig)
      : undefined;
    return message;
  },
};

function createBaseRuntimeFractionalPercent(): RuntimeFractionalPercent {
  return { defaultValue: undefined, runtimeKey: "" };
}

export const RuntimeFractionalPercent = {
  fromJSON(object: any): RuntimeFractionalPercent {
    return {
      defaultValue: isSet(object.defaultValue) ? FractionalPercent.fromJSON(object.defaultValue) : undefined,
      runtimeKey: isSet(object.runtimeKey) ? String(object.runtimeKey) : "",
    };
  },

  toJSON(message: RuntimeFractionalPercent): unknown {
    const obj: any = {};
    message.defaultValue !== undefined &&
      (obj.defaultValue = message.defaultValue ? FractionalPercent.toJSON(message.defaultValue) : undefined);
    message.runtimeKey !== undefined && (obj.runtimeKey = message.runtimeKey);
    return obj;
  },

  fromPartial(object: DeepPartial<RuntimeFractionalPercent>): RuntimeFractionalPercent {
    const message = Object.create(createBaseRuntimeFractionalPercent()) as RuntimeFractionalPercent;
    message.defaultValue = (object.defaultValue !== undefined && object.defaultValue !== null)
      ? FractionalPercent.fromPartial(object.defaultValue)
      : undefined;
    message.runtimeKey = object.runtimeKey ?? "";
    return message;
  },
};

function createBaseControlPlane(): ControlPlane {
  return { identifier: "" };
}

export const ControlPlane = {
  fromJSON(object: any): ControlPlane {
    return { identifier: isSet(object.identifier) ? String(object.identifier) : "" };
  },

  toJSON(message: ControlPlane): unknown {
    const obj: any = {};
    message.identifier !== undefined && (obj.identifier = message.identifier);
    return obj;
  },

  fromPartial(object: DeepPartial<ControlPlane>): ControlPlane {
    const message = Object.create(createBaseControlPlane()) as ControlPlane;
    message.identifier = object.identifier ?? "";
    return message;
  },
};

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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
