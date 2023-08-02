/* eslint-disable */
import { Any } from "../../../../google/protobuf/any";
import { Duration } from "../../../../google/protobuf/duration";
import { Status } from "../../../../google/rpc/status";
import { ControlPlane, Metadata, Node } from "../../../config/core/v3/base";

export const protobufPackage = "envoy.service.discovery.v3";

/** Specifies a resource to be subscribed to. */
export interface ResourceLocator {
  /** The resource name to subscribe to. */
  name: string;
  /**
   * A set of dynamic parameters used to match against the dynamic parameter
   * constraints on the resource. This allows clients to select between
   * multiple variants of the same resource.
   */
  dynamicParameters: { [key: string]: string };
}

export interface ResourceLocator_DynamicParametersEntry {
  key: string;
  value: string;
}

/** Specifies a concrete resource name. */
export interface ResourceName {
  /** The name of the resource. */
  name: string;
  /**
   * Dynamic parameter constraints associated with this resource. To be used by client-side caches
   * (including xDS proxies) when matching subscribed resource locators.
   */
  dynamicParameterConstraints: DynamicParameterConstraints | undefined;
}

/**
 * A DiscoveryRequest requests a set of versioned resources of the same type for
 * a given Envoy node on some API.
 * [#next-free-field: 8]
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
   * [#not-implemented-hide:]
   * Alternative to ``resource_names`` field that allows specifying dynamic
   * parameters along with each resource name. Clients that populate this
   * field must be able to handle responses from the server where resources
   * are wrapped in a Resource message.
   * Note that it is legal for a request to have some resources listed
   * in ``resource_names`` and others in ``resource_locators``.
   */
  resourceLocators: ResourceLocator[];
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
   * This is populated when the previous :ref:`DiscoveryResponse <envoy_v3_api_msg_service.discovery.v3.DiscoveryResponse>`
   * failed to update configuration. The ``message`` field in ``error_details`` provides the Envoy
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
  /** The control plane instance that sent the response. */
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
 * [#next-free-field: 10]
 */
export interface DeltaDiscoveryRequest {
  /** The node making the request. */
  node:
    | Node
    | undefined;
  /**
   * Type of the resource that is being requested, e.g.
   * ``type.googleapis.com/envoy.api.v2.ClusterLoadAssignment``. This does not need to be set if
   * resources are only referenced via ``xds_resource_subscribe`` and
   * ``xds_resources_unsubscribe``.
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
   * [#not-implemented-hide:]
   * Alternative to ``resource_names_subscribe`` field that allows specifying dynamic parameters
   * along with each resource name.
   * Note that it is legal for a request to have some resources listed
   * in ``resource_names_subscribe`` and others in ``resource_locators_subscribe``.
   */
  resourceLocatorsSubscribe: ResourceLocator[];
  /**
   * [#not-implemented-hide:]
   * Alternative to ``resource_names_unsubscribe`` field that allows specifying dynamic parameters
   * along with each resource name.
   * Note that it is legal for a request to have some resources listed
   * in ``resource_names_unsubscribe`` and others in ``resource_locators_unsubscribe``.
   */
  resourceLocatorsUnsubscribe: ResourceLocator[];
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
   * This is populated when the previous :ref:`DiscoveryResponse <envoy_v3_api_msg_service.discovery.v3.DiscoveryResponse>`
   * failed to update configuration. The ``message`` field in ``error_details``
   * provides the Envoy internal exception related to the failure.
   */
  errorDetail: Status | undefined;
}

export interface DeltaDiscoveryRequest_InitialResourceVersionsEntry {
  key: string;
  value: string;
}

/** [#next-free-field: 9] */
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
   * Alternative to removed_resources that allows specifying which variant of
   * a resource is being removed. This variant must be used for any resource
   * for which dynamic parameter constraints were sent to the client.
   */
  removedResourceNames: ResourceName[];
  /**
   * The nonce provides a way for DeltaDiscoveryRequests to uniquely
   * reference a DeltaDiscoveryResponse when (N)ACKing. The nonce is required.
   */
  nonce: string;
  /**
   * [#not-implemented-hide:]
   * The control plane instance that sent the response.
   */
  controlPlane: ControlPlane | undefined;
}

/**
 * A set of dynamic parameter constraints associated with a variant of an individual xDS resource.
 * These constraints determine whether the resource matches a subscription based on the set of
 * dynamic parameters in the subscription, as specified in the
 * :ref:`ResourceLocator.dynamic_parameters<envoy_v3_api_field_service.discovery.v3.ResourceLocator.dynamic_parameters>`
 * field. This allows xDS implementations (clients, servers, and caching proxies) to determine
 * which variant of a resource is appropriate for a given client.
 */
export interface DynamicParameterConstraints {
  /** A single constraint to evaluate. */
  constraint?:
    | DynamicParameterConstraints_SingleConstraint
    | undefined;
  /**
   * A list of constraints that match if any one constraint in the list
   * matches.
   */
  orConstraints?:
    | DynamicParameterConstraints_ConstraintList
    | undefined;
  /** A list of constraints that must all match. */
  andConstraints?:
    | DynamicParameterConstraints_ConstraintList
    | undefined;
  /** The inverse (NOT) of a set of constraints. */
  notConstraints?: DynamicParameterConstraints | undefined;
}

/** A single constraint for a given key. */
export interface DynamicParameterConstraints_SingleConstraint {
  /** The key to match against. */
  key: string;
  /** Matches this exact value. */
  value?:
    | string
    | undefined;
  /**
   * Key is present (matches any value except for the key being absent).
   * This allows setting a default constraint for clients that do
   * not send a key at all, while there may be other clients that need
   * special configuration based on that key.
   */
  exists?: DynamicParameterConstraints_SingleConstraint_Exists | undefined;
}

export interface DynamicParameterConstraints_SingleConstraint_Exists {
}

export interface DynamicParameterConstraints_ConstraintList {
  constraints: DynamicParameterConstraints[];
}

/** [#next-free-field: 10] */
export interface Resource {
  /**
   * The resource's name, to distinguish it from others of the same type of resource.
   * Only one of ``name`` or ``resource_name`` may be set.
   */
  name: string;
  /**
   * Alternative to the ``name`` field, to be used when the server supports
   * multiple variants of the named resource that are differentiated by
   * dynamic parameter constraints.
   * Only one of ``name`` or ``resource_name`` may be set.
   */
  resourceName:
    | ResourceName
    | undefined;
  /** The aliases are a list of other names that this resource can go by. */
  aliases: string[];
  /**
   * The resource level version. It allows xDS to track the state of individual
   * resources.
   */
  version: string;
  /** The resource being tracked. */
  resource:
    | Any
    | undefined;
  /**
   * Time-to-live value for the resource. For each resource, a timer is started. The timer is
   * reset each time the resource is received with a new TTL. If the resource is received with
   * no TTL set, the timer is removed for the resource. Upon expiration of the timer, the
   * configuration for the resource will be removed.
   *
   * The TTL can be refreshed or changed by sending a response that doesn't change the resource
   * version. In this case the resource field does not need to be populated, which allows for
   * light-weight "heartbeat" updates to keep a resource with a TTL alive.
   *
   * The TTL feature is meant to support configurations that should be removed in the event of
   * a management server failure. For example, the feature may be used for fault injection
   * testing where the fault injection should be terminated in the event that Envoy loses contact
   * with the management server.
   */
  ttl:
    | Duration
    | undefined;
  /**
   * Cache control properties for the resource.
   * [#not-implemented-hide:]
   */
  cacheControl:
    | Resource_CacheControl
    | undefined;
  /**
   * The Metadata field can be used to provide additional information for the resource.
   * E.g. the trace data for debugging.
   */
  metadata: Metadata | undefined;
}

/**
 * Cache control properties for the resource.
 * [#not-implemented-hide:]
 */
export interface Resource_CacheControl {
  /**
   * If true, xDS proxies may not cache this resource.
   * Note that this does not apply to clients other than xDS proxies, which must cache resources
   * for their own use, regardless of the value of this field.
   */
  doNotCache: boolean;
}

function createBaseResourceLocator(): ResourceLocator {
  return { name: "", dynamicParameters: {} };
}

export const ResourceLocator = {
  fromJSON(object: any): ResourceLocator {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      dynamicParameters: isObject(object.dynamicParameters)
        ? Object.entries(object.dynamicParameters).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: ResourceLocator): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    obj.dynamicParameters = {};
    if (message.dynamicParameters) {
      Object.entries(message.dynamicParameters).forEach(([k, v]) => {
        obj.dynamicParameters[k] = v;
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ResourceLocator>): ResourceLocator {
    const message = Object.create(createBaseResourceLocator()) as ResourceLocator;
    message.name = object.name ?? "";
    message.dynamicParameters = Object.entries(object.dynamicParameters ?? {}).reduce<{ [key: string]: string }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      },
      {},
    );
    return message;
  },
};

function createBaseResourceLocator_DynamicParametersEntry(): ResourceLocator_DynamicParametersEntry {
  return { key: "", value: "" };
}

export const ResourceLocator_DynamicParametersEntry = {
  fromJSON(object: any): ResourceLocator_DynamicParametersEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: ResourceLocator_DynamicParametersEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<ResourceLocator_DynamicParametersEntry>): ResourceLocator_DynamicParametersEntry {
    const message = Object.create(
      createBaseResourceLocator_DynamicParametersEntry(),
    ) as ResourceLocator_DynamicParametersEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseResourceName(): ResourceName {
  return { name: "", dynamicParameterConstraints: undefined };
}

export const ResourceName = {
  fromJSON(object: any): ResourceName {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      dynamicParameterConstraints: isSet(object.dynamicParameterConstraints)
        ? DynamicParameterConstraints.fromJSON(object.dynamicParameterConstraints)
        : undefined,
    };
  },

  toJSON(message: ResourceName): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.dynamicParameterConstraints !== undefined &&
      (obj.dynamicParameterConstraints = message.dynamicParameterConstraints
        ? DynamicParameterConstraints.toJSON(message.dynamicParameterConstraints)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ResourceName>): ResourceName {
    const message = Object.create(createBaseResourceName()) as ResourceName;
    message.name = object.name ?? "";
    message.dynamicParameterConstraints =
      (object.dynamicParameterConstraints !== undefined && object.dynamicParameterConstraints !== null)
        ? DynamicParameterConstraints.fromPartial(object.dynamicParameterConstraints)
        : undefined;
    return message;
  },
};

function createBaseDiscoveryRequest(): DiscoveryRequest {
  return {
    versionInfo: "",
    node: undefined,
    resourceNames: [],
    resourceLocators: [],
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
      resourceLocators: Array.isArray(object?.resourceLocators)
        ? object.resourceLocators.map((e: any) => ResourceLocator.fromJSON(e))
        : [],
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
    if (message.resourceLocators) {
      obj.resourceLocators = message.resourceLocators.map((e) => e ? ResourceLocator.toJSON(e) : undefined);
    } else {
      obj.resourceLocators = [];
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
    message.resourceLocators = object.resourceLocators?.map((e) => ResourceLocator.fromPartial(e)) || [];
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
    resourceLocatorsSubscribe: [],
    resourceLocatorsUnsubscribe: [],
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
      resourceLocatorsSubscribe: Array.isArray(object?.resourceLocatorsSubscribe)
        ? object.resourceLocatorsSubscribe.map((e: any) => ResourceLocator.fromJSON(e))
        : [],
      resourceLocatorsUnsubscribe: Array.isArray(object?.resourceLocatorsUnsubscribe)
        ? object.resourceLocatorsUnsubscribe.map((e: any) => ResourceLocator.fromJSON(e))
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
    if (message.resourceLocatorsSubscribe) {
      obj.resourceLocatorsSubscribe = message.resourceLocatorsSubscribe.map((e) =>
        e ? ResourceLocator.toJSON(e) : undefined
      );
    } else {
      obj.resourceLocatorsSubscribe = [];
    }
    if (message.resourceLocatorsUnsubscribe) {
      obj.resourceLocatorsUnsubscribe = message.resourceLocatorsUnsubscribe.map((e) =>
        e ? ResourceLocator.toJSON(e) : undefined
      );
    } else {
      obj.resourceLocatorsUnsubscribe = [];
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
    message.resourceLocatorsSubscribe = object.resourceLocatorsSubscribe?.map((e) => ResourceLocator.fromPartial(e)) ||
      [];
    message.resourceLocatorsUnsubscribe =
      object.resourceLocatorsUnsubscribe?.map((e) => ResourceLocator.fromPartial(e)) || [];
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
  return {
    systemVersionInfo: "",
    resources: [],
    typeUrl: "",
    removedResources: [],
    removedResourceNames: [],
    nonce: "",
    controlPlane: undefined,
  };
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
      removedResourceNames: Array.isArray(object?.removedResourceNames)
        ? object.removedResourceNames.map((e: any) => ResourceName.fromJSON(e))
        : [],
      nonce: isSet(object.nonce) ? String(object.nonce) : "",
      controlPlane: isSet(object.controlPlane) ? ControlPlane.fromJSON(object.controlPlane) : undefined,
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
    if (message.removedResourceNames) {
      obj.removedResourceNames = message.removedResourceNames.map((e) => e ? ResourceName.toJSON(e) : undefined);
    } else {
      obj.removedResourceNames = [];
    }
    message.nonce !== undefined && (obj.nonce = message.nonce);
    message.controlPlane !== undefined &&
      (obj.controlPlane = message.controlPlane ? ControlPlane.toJSON(message.controlPlane) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<DeltaDiscoveryResponse>): DeltaDiscoveryResponse {
    const message = Object.create(createBaseDeltaDiscoveryResponse()) as DeltaDiscoveryResponse;
    message.systemVersionInfo = object.systemVersionInfo ?? "";
    message.resources = object.resources?.map((e) => Resource.fromPartial(e)) || [];
    message.typeUrl = object.typeUrl ?? "";
    message.removedResources = object.removedResources?.map((e) => e) || [];
    message.removedResourceNames = object.removedResourceNames?.map((e) => ResourceName.fromPartial(e)) || [];
    message.nonce = object.nonce ?? "";
    message.controlPlane = (object.controlPlane !== undefined && object.controlPlane !== null)
      ? ControlPlane.fromPartial(object.controlPlane)
      : undefined;
    return message;
  },
};

function createBaseDynamicParameterConstraints(): DynamicParameterConstraints {
  return {};
}

export const DynamicParameterConstraints = {
  fromJSON(object: any): DynamicParameterConstraints {
    return {
      constraint: isSet(object.constraint)
        ? DynamicParameterConstraints_SingleConstraint.fromJSON(object.constraint)
        : undefined,
      orConstraints: isSet(object.orConstraints)
        ? DynamicParameterConstraints_ConstraintList.fromJSON(object.orConstraints)
        : undefined,
      andConstraints: isSet(object.andConstraints)
        ? DynamicParameterConstraints_ConstraintList.fromJSON(object.andConstraints)
        : undefined,
      notConstraints: isSet(object.notConstraints)
        ? DynamicParameterConstraints.fromJSON(object.notConstraints)
        : undefined,
    };
  },

  toJSON(message: DynamicParameterConstraints): unknown {
    const obj: any = {};
    message.constraint !== undefined && (obj.constraint = message.constraint
      ? DynamicParameterConstraints_SingleConstraint.toJSON(message.constraint)
      : undefined);
    message.orConstraints !== undefined && (obj.orConstraints = message.orConstraints
      ? DynamicParameterConstraints_ConstraintList.toJSON(message.orConstraints)
      : undefined);
    message.andConstraints !== undefined && (obj.andConstraints = message.andConstraints
      ? DynamicParameterConstraints_ConstraintList.toJSON(message.andConstraints)
      : undefined);
    message.notConstraints !== undefined && (obj.notConstraints = message.notConstraints
      ? DynamicParameterConstraints.toJSON(message.notConstraints)
      : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<DynamicParameterConstraints>): DynamicParameterConstraints {
    const message = Object.create(createBaseDynamicParameterConstraints()) as DynamicParameterConstraints;
    message.constraint = (object.constraint !== undefined && object.constraint !== null)
      ? DynamicParameterConstraints_SingleConstraint.fromPartial(object.constraint)
      : undefined;
    message.orConstraints = (object.orConstraints !== undefined && object.orConstraints !== null)
      ? DynamicParameterConstraints_ConstraintList.fromPartial(object.orConstraints)
      : undefined;
    message.andConstraints = (object.andConstraints !== undefined && object.andConstraints !== null)
      ? DynamicParameterConstraints_ConstraintList.fromPartial(object.andConstraints)
      : undefined;
    message.notConstraints = (object.notConstraints !== undefined && object.notConstraints !== null)
      ? DynamicParameterConstraints.fromPartial(object.notConstraints)
      : undefined;
    return message;
  },
};

function createBaseDynamicParameterConstraints_SingleConstraint(): DynamicParameterConstraints_SingleConstraint {
  return { key: "" };
}

export const DynamicParameterConstraints_SingleConstraint = {
  fromJSON(object: any): DynamicParameterConstraints_SingleConstraint {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? String(object.value) : undefined,
      exists: isSet(object.exists)
        ? DynamicParameterConstraints_SingleConstraint_Exists.fromJSON(object.exists)
        : undefined,
    };
  },

  toJSON(message: DynamicParameterConstraints_SingleConstraint): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    message.exists !== undefined && (obj.exists = message.exists
      ? DynamicParameterConstraints_SingleConstraint_Exists.toJSON(message.exists)
      : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DynamicParameterConstraints_SingleConstraint>,
  ): DynamicParameterConstraints_SingleConstraint {
    const message = Object.create(
      createBaseDynamicParameterConstraints_SingleConstraint(),
    ) as DynamicParameterConstraints_SingleConstraint;
    message.key = object.key ?? "";
    message.value = object.value ?? undefined;
    message.exists = (object.exists !== undefined && object.exists !== null)
      ? DynamicParameterConstraints_SingleConstraint_Exists.fromPartial(object.exists)
      : undefined;
    return message;
  },
};

function createBaseDynamicParameterConstraints_SingleConstraint_Exists(): DynamicParameterConstraints_SingleConstraint_Exists {
  return {};
}

export const DynamicParameterConstraints_SingleConstraint_Exists = {
  fromJSON(_: any): DynamicParameterConstraints_SingleConstraint_Exists {
    return {};
  },

  toJSON(_: DynamicParameterConstraints_SingleConstraint_Exists): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<DynamicParameterConstraints_SingleConstraint_Exists>,
  ): DynamicParameterConstraints_SingleConstraint_Exists {
    const message = Object.create(
      createBaseDynamicParameterConstraints_SingleConstraint_Exists(),
    ) as DynamicParameterConstraints_SingleConstraint_Exists;
    return message;
  },
};

function createBaseDynamicParameterConstraints_ConstraintList(): DynamicParameterConstraints_ConstraintList {
  return { constraints: [] };
}

export const DynamicParameterConstraints_ConstraintList = {
  fromJSON(object: any): DynamicParameterConstraints_ConstraintList {
    return {
      constraints: Array.isArray(object?.constraints)
        ? object.constraints.map((e: any) => DynamicParameterConstraints.fromJSON(e))
        : [],
    };
  },

  toJSON(message: DynamicParameterConstraints_ConstraintList): unknown {
    const obj: any = {};
    if (message.constraints) {
      obj.constraints = message.constraints.map((e) => e ? DynamicParameterConstraints.toJSON(e) : undefined);
    } else {
      obj.constraints = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<DynamicParameterConstraints_ConstraintList>,
  ): DynamicParameterConstraints_ConstraintList {
    const message = Object.create(
      createBaseDynamicParameterConstraints_ConstraintList(),
    ) as DynamicParameterConstraints_ConstraintList;
    message.constraints = object.constraints?.map((e) => DynamicParameterConstraints.fromPartial(e)) || [];
    return message;
  },
};

function createBaseResource(): Resource {
  return {
    name: "",
    resourceName: undefined,
    aliases: [],
    version: "",
    resource: undefined,
    ttl: undefined,
    cacheControl: undefined,
    metadata: undefined,
  };
}

export const Resource = {
  fromJSON(object: any): Resource {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      resourceName: isSet(object.resourceName) ? ResourceName.fromJSON(object.resourceName) : undefined,
      aliases: Array.isArray(object?.aliases) ? object.aliases.map((e: any) => String(e)) : [],
      version: isSet(object.version) ? String(object.version) : "",
      resource: isSet(object.resource) ? Any.fromJSON(object.resource) : undefined,
      ttl: isSet(object.ttl) ? Duration.fromJSON(object.ttl) : undefined,
      cacheControl: isSet(object.cacheControl) ? Resource_CacheControl.fromJSON(object.cacheControl) : undefined,
      metadata: isSet(object.metadata) ? Metadata.fromJSON(object.metadata) : undefined,
    };
  },

  toJSON(message: Resource): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.resourceName !== undefined &&
      (obj.resourceName = message.resourceName ? ResourceName.toJSON(message.resourceName) : undefined);
    if (message.aliases) {
      obj.aliases = message.aliases.map((e) => e);
    } else {
      obj.aliases = [];
    }
    message.version !== undefined && (obj.version = message.version);
    message.resource !== undefined && (obj.resource = message.resource ? Any.toJSON(message.resource) : undefined);
    message.ttl !== undefined && (obj.ttl = message.ttl ? Duration.toJSON(message.ttl) : undefined);
    message.cacheControl !== undefined &&
      (obj.cacheControl = message.cacheControl ? Resource_CacheControl.toJSON(message.cacheControl) : undefined);
    message.metadata !== undefined && (obj.metadata = message.metadata ? Metadata.toJSON(message.metadata) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Resource>): Resource {
    const message = Object.create(createBaseResource()) as Resource;
    message.name = object.name ?? "";
    message.resourceName = (object.resourceName !== undefined && object.resourceName !== null)
      ? ResourceName.fromPartial(object.resourceName)
      : undefined;
    message.aliases = object.aliases?.map((e) => e) || [];
    message.version = object.version ?? "";
    message.resource = (object.resource !== undefined && object.resource !== null)
      ? Any.fromPartial(object.resource)
      : undefined;
    message.ttl = (object.ttl !== undefined && object.ttl !== null) ? Duration.fromPartial(object.ttl) : undefined;
    message.cacheControl = (object.cacheControl !== undefined && object.cacheControl !== null)
      ? Resource_CacheControl.fromPartial(object.cacheControl)
      : undefined;
    message.metadata = (object.metadata !== undefined && object.metadata !== null)
      ? Metadata.fromPartial(object.metadata)
      : undefined;
    return message;
  },
};

function createBaseResource_CacheControl(): Resource_CacheControl {
  return { doNotCache: false };
}

export const Resource_CacheControl = {
  fromJSON(object: any): Resource_CacheControl {
    return { doNotCache: isSet(object.doNotCache) ? Boolean(object.doNotCache) : false };
  },

  toJSON(message: Resource_CacheControl): unknown {
    const obj: any = {};
    message.doNotCache !== undefined && (obj.doNotCache = message.doNotCache);
    return obj;
  },

  fromPartial(object: DeepPartial<Resource_CacheControl>): Resource_CacheControl {
    const message = Object.create(createBaseResource_CacheControl()) as Resource_CacheControl;
    message.doNotCache = object.doNotCache ?? false;
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
