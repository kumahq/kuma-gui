/* eslint-disable */
import { Any } from "../../../google/protobuf/any";
import { Status } from "../../../google/rpc/status";
import { ControlPlane, Node } from "./core/base";

export const protobufPackage = "envoy.api.v2";

/**
 * A DiscoveryRequest requests a set of versioned resources of the same type for
 * a given Envoy node on some API.
 * [#next-free-field: 7]
 */
export interface DiscoveryRequest {
  /**
   * The version_info provided in the request messages will be the version_info
   * received with the most recent successfully processed response or empty on
   * the first request. It is expected that no new request is sent after a
   * response is received until the Envoy instance is ready to ACK/NACK the new
   * configuration. ACK/NACK takes place by returning the new API config version
   * as applied or the previous API config version respectively. Each type_url
   * (see below) has an independent version associated with it.
   */
  versionInfo: string;
  /** The node making the request. */
  node:
    | Node
    | undefined;
  /**
   * List of resources to subscribe to, e.g. list of cluster names or a route
   * configuration name. If this is empty, all resources for the API are
   * returned. LDS/CDS may have empty resource_names, which will cause all
   * resources for the Envoy instance to be returned. The LDS and CDS responses
   * will then imply a number of resources that need to be fetched via EDS/RDS,
   * which will be explicitly enumerated in resource_names.
   */
  resourceNames: string[];
  /**
   * Type of the resource that is being requested, e.g.
   * "type.googleapis.com/envoy.api.v2.ClusterLoadAssignment". This is implicit
   * in requests made via singleton xDS APIs such as CDS, LDS, etc. but is
   * required for ADS.
   */
  typeUrl: string;
  /**
   * nonce corresponding to DiscoveryResponse being ACK/NACKed. See above
   * discussion on version_info and the DiscoveryResponse nonce comment. This
   * may be empty only if 1) this is a non-persistent-stream xDS such as HTTP,
   * or 2) the client has not yet accepted an update in this xDS stream (unlike
   * delta, where it is populated only for new explicit ACKs).
   */
  responseNonce: string;
  /**
   * This is populated when the previous :ref:`DiscoveryResponse <envoy_api_msg_DiscoveryResponse>`
   * failed to update configuration. The *message* field in *error_details* provides the Envoy
   * internal exception related to the failure. It is only intended for consumption during manual
   * debugging, the string provided is not guaranteed to be stable across Envoy versions.
   */
  errorDetail: Status | undefined;
}

/** [#next-free-field: 7] */
export interface DiscoveryResponse {
  /** The version of the response data. */
  versionInfo: string;
  /** The response resources. These resources are typed and depend on the API being called. */
  resources: Any[];
  /**
   * [#not-implemented-hide:]
   * Canary is used to support two Envoy command line flags:
   *
   * * --terminate-on-canary-transition-failure. When set, Envoy is able to
   *   terminate if it detects that configuration is stuck at canary. Consider
   *   this example sequence of updates:
   *   - Management server applies a canary config successfully.
   *   - Management server rolls back to a production config.
   *   - Envoy rejects the new production config.
   *   Since there is no sensible way to continue receiving configuration
   *   updates, Envoy will then terminate and apply production config from a
   *   clean slate.
   * * --dry-run-canary. When set, a canary response will never be applied, only
   *   validated via a dry run.
   */
  canary: boolean;
  /**
   * Type URL for resources. Identifies the xDS API when muxing over ADS.
   * Must be consistent with the type_url in the 'resources' repeated Any (if non-empty).
   */
  typeUrl: string;
  /**
   * For gRPC based subscriptions, the nonce provides a way to explicitly ack a
   * specific DiscoveryResponse in a following DiscoveryRequest. Additional
   * messages may have been sent by Envoy to the management server for the
   * previous version on the stream prior to this DiscoveryResponse, that were
   * unprocessed at response send time. The nonce allows the management server
   * to ignore any further DiscoveryRequests for the previous version until a
   * DiscoveryRequest bearing the nonce. The nonce is optional and is not
   * required for non-stream based xDS implementations.
   */
  nonce: string;
  /**
   * [#not-implemented-hide:]
   * The control plane instance that sent the response.
   */
  controlPlane: ControlPlane | undefined;
}

/**
 * DeltaDiscoveryRequest and DeltaDiscoveryResponse are used in a new gRPC
 * endpoint for Delta xDS.
 *
 * With Delta xDS, the DeltaDiscoveryResponses do not need to include a full
 * snapshot of the tracked resources. Instead, DeltaDiscoveryResponses are a
 * diff to the state of a xDS client.
 * In Delta XDS there are per-resource versions, which allow tracking state at
 * the resource granularity.
 * An xDS Delta session is always in the context of a gRPC bidirectional
 * stream. This allows the xDS server to keep track of the state of xDS clients
 * connected to it.
 *
 * In Delta xDS the nonce field is required and used to pair
 * DeltaDiscoveryResponse to a DeltaDiscoveryRequest ACK or NACK.
 * Optionally, a response message level system_version_info is present for
 * debugging purposes only.
 *
 * DeltaDiscoveryRequest plays two independent roles. Any DeltaDiscoveryRequest
 * can be either or both of: [1] informing the server of what resources the
 * client has gained/lost interest in (using resource_names_subscribe and
 * resource_names_unsubscribe), or [2] (N)ACKing an earlier resource update from
 * the server (using response_nonce, with presence of error_detail making it a NACK).
 * Additionally, the first message (for a given type_url) of a reconnected gRPC stream
 * has a third role: informing the server of the resources (and their versions)
 * that the client already possesses, using the initial_resource_versions field.
 *
 * As with state-of-the-world, when multiple resource types are multiplexed (ADS),
 * all requests/acknowledgments/updates are logically walled off by type_url:
 * a Cluster ACK exists in a completely separate world from a prior Route NACK.
 * In particular, initial_resource_versions being sent at the "start" of every
 * gRPC stream actually entails a message for each type_url, each with its own
 * initial_resource_versions.
 * [#next-free-field: 8]
 */
export interface DeltaDiscoveryRequest {
  /** The node making the request. */
  node:
    | Node
    | undefined;
  /**
   * Type of the resource that is being requested, e.g.
   * "type.googleapis.com/envoy.api.v2.ClusterLoadAssignment".
   */
  typeUrl: string;
  /**
   * DeltaDiscoveryRequests allow the client to add or remove individual
   * resources to the set of tracked resources in the context of a stream.
   * All resource names in the resource_names_subscribe list are added to the
   * set of tracked resources and all resource names in the resource_names_unsubscribe
   * list are removed from the set of tracked resources.
   *
   * *Unlike* state-of-the-world xDS, an empty resource_names_subscribe or
   * resource_names_unsubscribe list simply means that no resources are to be
   * added or removed to the resource list.
   * *Like* state-of-the-world xDS, the server must send updates for all tracked
   * resources, but can also send updates for resources the client has not subscribed to.
   *
   * NOTE: the server must respond with all resources listed in resource_names_subscribe,
   * even if it believes the client has the most recent version of them. The reason:
   * the client may have dropped them, but then regained interest before it had a chance
   * to send the unsubscribe message. See DeltaSubscriptionStateTest.RemoveThenAdd.
   *
   * These two fields can be set in any DeltaDiscoveryRequest, including ACKs
   * and initial_resource_versions.
   *
   * A list of Resource names to add to the list of tracked resources.
   */
  resourceNamesSubscribe: string[];
  /** A list of Resource names to remove from the list of tracked resources. */
  resourceNamesUnsubscribe: string[];
  /**
   * Informs the server of the versions of the resources the xDS client knows of, to enable the
   * client to continue the same logical xDS session even in the face of gRPC stream reconnection.
   * It will not be populated: [1] in the very first stream of a session, since the client will
   * not yet have any resources,  [2] in any message after the first in a stream (for a given
   * type_url), since the server will already be correctly tracking the client's state.
   * (In ADS, the first message *of each type_url* of a reconnected stream populates this map.)
   * The map's keys are names of xDS resources known to the xDS client.
   * The map's values are opaque resource versions.
   */
  initialResourceVersions: { [key: string]: string };
  /**
   * When the DeltaDiscoveryRequest is a ACK or NACK message in response
   * to a previous DeltaDiscoveryResponse, the response_nonce must be the
   * nonce in the DeltaDiscoveryResponse.
   * Otherwise (unlike in DiscoveryRequest) response_nonce must be omitted.
   */
  responseNonce: string;
  /**
   * This is populated when the previous :ref:`DiscoveryResponse <envoy_api_msg_DiscoveryResponse>`
   * failed to update configuration. The *message* field in *error_details*
   * provides the Envoy internal exception related to the failure.
   */
  errorDetail: Status | undefined;
}

export interface DeltaDiscoveryRequest_InitialResourceVersionsEntry {
  key: string;
  value: string;
}

/** [#next-free-field: 7] */
export interface DeltaDiscoveryResponse {
  /** The version of the response data (used for debugging). */
  systemVersionInfo: string;
  /**
   * The response resources. These are typed resources, whose types must match
   * the type_url field.
   */
  resources: Resource[];
  /**
   * Type URL for resources. Identifies the xDS API when muxing over ADS.
   * Must be consistent with the type_url in the Any within 'resources' if 'resources' is non-empty.
   */
  typeUrl: string;
  /**
   * Resources names of resources that have be deleted and to be removed from the xDS Client.
   * Removed resources for missing resources can be ignored.
   */
  removedResources: string[];
  /**
   * The nonce provides a way for DeltaDiscoveryRequests to uniquely
   * reference a DeltaDiscoveryResponse when (N)ACKing. The nonce is required.
   */
  nonce: string;
}

export interface Resource {
  /** The resource's name, to distinguish it from others of the same type of resource. */
  name: string;
  /** The aliases are a list of other names that this resource can go by. */
  aliases: string[];
  /**
   * The resource level version. It allows xDS to track the state of individual
   * resources.
   */
  version: string;
  /** The resource being tracked. */
  resource: Any | undefined;
}

function createBaseDiscoveryRequest(): DiscoveryRequest {
  return {
    versionInfo: "",
    node: undefined,
    resourceNames: [],
    typeUrl: "",
    responseNonce: "",
    errorDetail: undefined,
  };
}

export const DiscoveryRequest = {
  fromJSON(object: any): DiscoveryRequest {
    return {
      versionInfo: isSet(object.versionInfo) ? String(object.versionInfo) : "",
      node: isSet(object.node) ? Node.fromJSON(object.node) : undefined,
      resourceNames: Array.isArray(object?.resourceNames) ? object.resourceNames.map((e: any) => String(e)) : [],
      typeUrl: isSet(object.typeUrl) ? String(object.typeUrl) : "",
      responseNonce: isSet(object.responseNonce) ? String(object.responseNonce) : "",
      errorDetail: isSet(object.errorDetail) ? Status.fromJSON(object.errorDetail) : undefined,
    };
  },

  toJSON(message: DiscoveryRequest): unknown {
    const obj: any = {};
    message.versionInfo !== undefined && (obj.versionInfo = message.versionInfo);
    message.node !== undefined && (obj.node = message.node ? Node.toJSON(message.node) : undefined);
    if (message.resourceNames) {
      obj.resourceNames = message.resourceNames.map((e) => e);
    } else {
      obj.resourceNames = [];
    }
    message.typeUrl !== undefined && (obj.typeUrl = message.typeUrl);
    message.responseNonce !== undefined && (obj.responseNonce = message.responseNonce);
    message.errorDetail !== undefined &&
      (obj.errorDetail = message.errorDetail ? Status.toJSON(message.errorDetail) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<DiscoveryRequest>): DiscoveryRequest {
    const message = Object.create(createBaseDiscoveryRequest()) as DiscoveryRequest;
    message.versionInfo = object.versionInfo ?? "";
    message.node = (object.node !== undefined && object.node !== null) ? Node.fromPartial(object.node) : undefined;
    message.resourceNames = object.resourceNames?.map((e) => e) || [];
    message.typeUrl = object.typeUrl ?? "";
    message.responseNonce = object.responseNonce ?? "";
    message.errorDetail = (object.errorDetail !== undefined && object.errorDetail !== null)
      ? Status.fromPartial(object.errorDetail)
      : undefined;
    return message;
  },
};

function createBaseDiscoveryResponse(): DiscoveryResponse {
  return { versionInfo: "", resources: [], canary: false, typeUrl: "", nonce: "", controlPlane: undefined };
}

export const DiscoveryResponse = {
  fromJSON(object: any): DiscoveryResponse {
    return {
      versionInfo: isSet(object.versionInfo) ? String(object.versionInfo) : "",
      resources: Array.isArray(object?.resources) ? object.resources.map((e: any) => Any.fromJSON(e)) : [],
      canary: isSet(object.canary) ? Boolean(object.canary) : false,
      typeUrl: isSet(object.typeUrl) ? String(object.typeUrl) : "",
      nonce: isSet(object.nonce) ? String(object.nonce) : "",
      controlPlane: isSet(object.controlPlane) ? ControlPlane.fromJSON(object.controlPlane) : undefined,
    };
  },

  toJSON(message: DiscoveryResponse): unknown {
    const obj: any = {};
    message.versionInfo !== undefined && (obj.versionInfo = message.versionInfo);
    if (message.resources) {
      obj.resources = message.resources.map((e) => e ? Any.toJSON(e) : undefined);
    } else {
      obj.resources = [];
    }
    message.canary !== undefined && (obj.canary = message.canary);
    message.typeUrl !== undefined && (obj.typeUrl = message.typeUrl);
    message.nonce !== undefined && (obj.nonce = message.nonce);
    message.controlPlane !== undefined &&
      (obj.controlPlane = message.controlPlane ? ControlPlane.toJSON(message.controlPlane) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<DiscoveryResponse>): DiscoveryResponse {
    const message = Object.create(createBaseDiscoveryResponse()) as DiscoveryResponse;
    message.versionInfo = object.versionInfo ?? "";
    message.resources = object.resources?.map((e) => Any.fromPartial(e)) || [];
    message.canary = object.canary ?? false;
    message.typeUrl = object.typeUrl ?? "";
    message.nonce = object.nonce ?? "";
    message.controlPlane = (object.controlPlane !== undefined && object.controlPlane !== null)
      ? ControlPlane.fromPartial(object.controlPlane)
      : undefined;
    return message;
  },
};

function createBaseDeltaDiscoveryRequest(): DeltaDiscoveryRequest {
  return {
    node: undefined,
    typeUrl: "",
    resourceNamesSubscribe: [],
    resourceNamesUnsubscribe: [],
    initialResourceVersions: {},
    responseNonce: "",
    errorDetail: undefined,
  };
}

export const DeltaDiscoveryRequest = {
  fromJSON(object: any): DeltaDiscoveryRequest {
    return {
      node: isSet(object.node) ? Node.fromJSON(object.node) : undefined,
      typeUrl: isSet(object.typeUrl) ? String(object.typeUrl) : "",
      resourceNamesSubscribe: Array.isArray(object?.resourceNamesSubscribe)
        ? object.resourceNamesSubscribe.map((e: any) => String(e))
        : [],
      resourceNamesUnsubscribe: Array.isArray(object?.resourceNamesUnsubscribe)
        ? object.resourceNamesUnsubscribe.map((e: any) => String(e))
        : [],
      initialResourceVersions: isObject(object.initialResourceVersions)
        ? Object.entries(object.initialResourceVersions).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      responseNonce: isSet(object.responseNonce) ? String(object.responseNonce) : "",
      errorDetail: isSet(object.errorDetail) ? Status.fromJSON(object.errorDetail) : undefined,
    };
  },

  toJSON(message: DeltaDiscoveryRequest): unknown {
    const obj: any = {};
    message.node !== undefined && (obj.node = message.node ? Node.toJSON(message.node) : undefined);
    message.typeUrl !== undefined && (obj.typeUrl = message.typeUrl);
    if (message.resourceNamesSubscribe) {
      obj.resourceNamesSubscribe = message.resourceNamesSubscribe.map((e) => e);
    } else {
      obj.resourceNamesSubscribe = [];
    }
    if (message.resourceNamesUnsubscribe) {
      obj.resourceNamesUnsubscribe = message.resourceNamesUnsubscribe.map((e) => e);
    } else {
      obj.resourceNamesUnsubscribe = [];
    }
    obj.initialResourceVersions = {};
    if (message.initialResourceVersions) {
      Object.entries(message.initialResourceVersions).forEach(([k, v]) => {
        obj.initialResourceVersions[k] = v;
      });
    }
    message.responseNonce !== undefined && (obj.responseNonce = message.responseNonce);
    message.errorDetail !== undefined &&
      (obj.errorDetail = message.errorDetail ? Status.toJSON(message.errorDetail) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<DeltaDiscoveryRequest>): DeltaDiscoveryRequest {
    const message = Object.create(createBaseDeltaDiscoveryRequest()) as DeltaDiscoveryRequest;
    message.node = (object.node !== undefined && object.node !== null) ? Node.fromPartial(object.node) : undefined;
    message.typeUrl = object.typeUrl ?? "";
    message.resourceNamesSubscribe = object.resourceNamesSubscribe?.map((e) => e) || [];
    message.resourceNamesUnsubscribe = object.resourceNamesUnsubscribe?.map((e) => e) || [];
    message.initialResourceVersions = Object.entries(object.initialResourceVersions ?? {}).reduce<
      { [key: string]: string }
    >((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.responseNonce = object.responseNonce ?? "";
    message.errorDetail = (object.errorDetail !== undefined && object.errorDetail !== null)
      ? Status.fromPartial(object.errorDetail)
      : undefined;
    return message;
  },
};

function createBaseDeltaDiscoveryRequest_InitialResourceVersionsEntry(): DeltaDiscoveryRequest_InitialResourceVersionsEntry {
  return { key: "", value: "" };
}

export const DeltaDiscoveryRequest_InitialResourceVersionsEntry = {
  fromJSON(object: any): DeltaDiscoveryRequest_InitialResourceVersionsEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: DeltaDiscoveryRequest_InitialResourceVersionsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DeltaDiscoveryRequest_InitialResourceVersionsEntry>,
  ): DeltaDiscoveryRequest_InitialResourceVersionsEntry {
    const message = Object.create(
      createBaseDeltaDiscoveryRequest_InitialResourceVersionsEntry(),
    ) as DeltaDiscoveryRequest_InitialResourceVersionsEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseDeltaDiscoveryResponse(): DeltaDiscoveryResponse {
  return { systemVersionInfo: "", resources: [], typeUrl: "", removedResources: [], nonce: "" };
}

export const DeltaDiscoveryResponse = {
  fromJSON(object: any): DeltaDiscoveryResponse {
    return {
      systemVersionInfo: isSet(object.systemVersionInfo) ? String(object.systemVersionInfo) : "",
      resources: Array.isArray(object?.resources) ? object.resources.map((e: any) => Resource.fromJSON(e)) : [],
      typeUrl: isSet(object.typeUrl) ? String(object.typeUrl) : "",
      removedResources: Array.isArray(object?.removedResources)
        ? object.removedResources.map((e: any) => String(e))
        : [],
      nonce: isSet(object.nonce) ? String(object.nonce) : "",
    };
  },

  toJSON(message: DeltaDiscoveryResponse): unknown {
    const obj: any = {};
    message.systemVersionInfo !== undefined && (obj.systemVersionInfo = message.systemVersionInfo);
    if (message.resources) {
      obj.resources = message.resources.map((e) => e ? Resource.toJSON(e) : undefined);
    } else {
      obj.resources = [];
    }
    message.typeUrl !== undefined && (obj.typeUrl = message.typeUrl);
    if (message.removedResources) {
      obj.removedResources = message.removedResources.map((e) => e);
    } else {
      obj.removedResources = [];
    }
    message.nonce !== undefined && (obj.nonce = message.nonce);
    return obj;
  },

  fromPartial(object: DeepPartial<DeltaDiscoveryResponse>): DeltaDiscoveryResponse {
    const message = Object.create(createBaseDeltaDiscoveryResponse()) as DeltaDiscoveryResponse;
    message.systemVersionInfo = object.systemVersionInfo ?? "";
    message.resources = object.resources?.map((e) => Resource.fromPartial(e)) || [];
    message.typeUrl = object.typeUrl ?? "";
    message.removedResources = object.removedResources?.map((e) => e) || [];
    message.nonce = object.nonce ?? "";
    return message;
  },
};

function createBaseResource(): Resource {
  return { name: "", aliases: [], version: "", resource: undefined };
}

export const Resource = {
  fromJSON(object: any): Resource {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      aliases: Array.isArray(object?.aliases) ? object.aliases.map((e: any) => String(e)) : [],
      version: isSet(object.version) ? String(object.version) : "",
      resource: isSet(object.resource) ? Any.fromJSON(object.resource) : undefined,
    };
  },

  toJSON(message: Resource): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    if (message.aliases) {
      obj.aliases = message.aliases.map((e) => e);
    } else {
      obj.aliases = [];
    }
    message.version !== undefined && (obj.version = message.version);
    message.resource !== undefined && (obj.resource = message.resource ? Any.toJSON(message.resource) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Resource>): Resource {
    const message = Object.create(createBaseResource()) as Resource;
    message.name = object.name ?? "";
    message.aliases = object.aliases?.map((e) => e) || [];
    message.version = object.version ?? "";
    message.resource = (object.resource !== undefined && object.resource !== null)
      ? Any.fromPartial(object.resource)
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
