/* eslint-disable */
import { Duration } from "../../google/protobuf/duration";
import { EnvoyAdmin } from "./envoy_admin";
import { MetricsBackend } from "./metrics";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** Dataplane defines a configuration of a side-car proxy. */
export interface Dataplane {
  /**
   * Networking describes inbound and outbound interfaces of the data plane
   * proxy.
   */
  networking:
    | Dataplane_Networking
    | undefined;
  /**
   * Configuration for metrics that should be collected and exposed by the
   * data plane proxy.
   *
   * Settings defined here will override their respective defaults
   * defined at a Mesh level.
   */
  metrics:
    | MetricsBackend
    | undefined;
  /**
   * Probes describe a list of endpoints that will be exposed without mTLS.
   * This is useful to expose the health endpoints of the application so the
   * orchestration system (e.g. Kubernetes) can still health check the
   * application.
   *
   * See
   * https://kuma.io/docs/latest/policies/service-health-probes/#virtual-probes
   * for more information.
   */
  probes: Dataplane_Probes | undefined;
}

/** Networking describes inbound and outbound interfaces of a data plane proxy. */
export interface Dataplane_Networking {
  /**
   * IP on which the data plane proxy is accessible to the control plane and
   * other data plane proxies in the same network. This can also be a
   * hostname, in which case the control plane will periodically resolve it.
   */
  address: string;
  /**
   * In some situations, a data plane proxy resides in a private network (e.g.
   * Docker) and is not reachable via `address` to other data plane proxies.
   * `advertisedAddress` is configured with a routable address for such data
   * plane proxy so that other proxies in the mesh can connect to it over
   * `advertisedAddress` and not via address.
   *
   * Envoy still binds to the `address`, not `advertisedAddress`.
   */
  advertisedAddress: string;
  /** Gateway describes a configuration of the gateway of the data plane proxy. */
  gateway:
    | Dataplane_Networking_Gateway
    | undefined;
  /**
   * Inbound describes a list of inbound interfaces of the data plane proxy.
   *
   * Inbound describes a service implemented by the data plane proxy.
   * All incoming traffic to a data plane proxy is going through inbound
   * listeners. For every defined Inbound there is a corresponding Envoy
   * Listener.
   */
  inbound: Dataplane_Networking_Inbound[];
  /**
   * Outbound describes a list of services consumed by the data plane proxy.
   * For every defined Outbound, there is a corresponding Envoy Listener.
   */
  outbound: Dataplane_Networking_Outbound[];
  /**
   * TransparentProxying describes the configuration for transparent proxying.
   * It is used by default on Kubernetes.
   */
  transparentProxying:
    | Dataplane_Networking_TransparentProxying
    | undefined;
  /**
   * Admin describes configuration related to Envoy Admin API.
   * Due to security, all the Envoy Admin endpoints are exposed only on
   * localhost. Additionally, Envoy will expose `/ready` endpoint on
   * `networking.address` for health checking systems to be able to check the
   * state of Envoy. The rest of the endpoints exposed on `networking.address`
   * are always protected by mTLS and only meant to be consumed internally by
   * the control plane.
   */
  admin: EnvoyAdmin | undefined;
}

/**
 * Inbound describes a service implemented by the data plane proxy.
 * All incoming traffic to a data plane proxy are going through inbound
 * listeners. For every defined Inbound there is a corresponding Envoy
 * Listener.
 */
export interface Dataplane_Networking_Inbound {
  /**
   * Port of the inbound interface that will forward requests to the
   * service.
   *
   * When transparent proxying is used, it is a port on which the service is
   * listening to. When transparent proxying is not used, Envoy will bind to
   * this port.
   */
  port: number;
  /**
   * Port of the service that requests will be forwarded to.
   * Defaults to the same value as `port`.
   */
  servicePort: number;
  /**
   * Address of the service that requests will be forwarded to.
   * Defaults to 'inbound.address', since Kuma DP should be deployed next
   * to the service. When `KUMA_DEFAULTS_ENABLE_LOCALHOST_INBOUND_CLUSTERS`
   * is true, this defaults to `127.0.0.1`.
   */
  serviceAddress: string;
  /**
   * Address on which inbound listener will be exposed.
   * Defaults to `networking.address`.
   */
  address: string;
  /**
   * Tags associated with an application this data plane proxy is deployed
   * next to, e.g. `kuma.io/service=web`, `version=1.0`. You can then
   * reference these tags in policies like MeshTrafficPermission.
   * `kuma.io/service` tag is mandatory.
   */
  tags: { [key: string]: string };
  /**
   * Health describes the status of an inbound.
   * If 'health' is nil we consider data plane proxy as healthy.
   * Unhealthy data plane proxies are excluded from Endpoints Discovery
   * Service (EDS). On Kubernetes, it is filled automatically by the control
   * plane if Pod has readiness probe configured. On Universal, it can be
   * set by the external health checking system, but the most common way is
   * to use service probes.
   *
   * See https://kuma.io/docs/latest/documentation/health for more
   * information.
   */
  health:
    | Dataplane_Networking_Inbound_Health
    | undefined;
  /**
   * ServiceProbe defines parameters for probing the service next to
   * sidecar. When service probe is defined, Envoy will periodically health
   * check the application next to it and report the status to the control
   * plane. On Kubernetes, Kuma deployments rely on Kubernetes probes so
   * this is not used.
   *
   * See https://kuma.io/docs/latest/documentation/health for more
   * information.
   */
  serviceProbe: Dataplane_Networking_Inbound_ServiceProbe | undefined;
}

export interface Dataplane_Networking_Inbound_TagsEntry {
  key: string;
  value: string;
}

/** Health describes the status of an inbound */
export interface Dataplane_Networking_Inbound_Health {
  /**
   * Ready indicates if the data plane proxy is ready to serve the
   * traffic.
   */
  ready: boolean;
}

/** ServiceProbe defines parameters for probing service's port */
export interface Dataplane_Networking_Inbound_ServiceProbe {
  /** Interval between consecutive health checks. */
  interval:
    | Duration
    | undefined;
  /** Maximum time to wait for a health check response. */
  timeout:
    | Duration
    | undefined;
  /**
   * Number of consecutive unhealthy checks before considering a host
   * unhealthy.
   */
  unhealthyThreshold:
    | number
    | undefined;
  /**
   * Number of consecutive healthy checks before considering a host
   * healthy.
   */
  healthyThreshold:
    | number
    | undefined;
  /** Tcp checker tries to establish tcp connection with destination */
  tcp: Dataplane_Networking_Inbound_ServiceProbe_Tcp | undefined;
}

export interface Dataplane_Networking_Inbound_ServiceProbe_Tcp {
}

/**
 * Outbound describes a service consumed by the data plane proxy.
 * For every defined Outbound there is a corresponding Envoy Listener.
 */
export interface Dataplane_Networking_Outbound {
  /**
   * IP on which the consumed service will be available to this data plane
   * proxy. On Kubernetes, it's usually ClusterIP of a Service or PodIP of a
   * Headless Service. Defaults to 127.0.0.1
   */
  address: string;
  /**
   * Port on which the consumed service will be available to this data plane
   * proxy. When transparent proxying is not used, Envoy will bind to this
   * port.
   */
  port: number;
  /**
   * DEPRECATED: use `networking.outbound[].tags['kuma.io/service']`
   * Service name identified by the value of `kuma.io/service`.
   *
   * @deprecated
   */
  service: string;
  /**
   * Tags of consumed data plane proxies.
   * `kuma.io/service` tag is required.
   * These tags can then be referenced in `destinations` section of policies
   * like TrafficRoute or in `to` section in policies like MeshAccessLog. It
   * is recommended to only use `kuma.io/service`. If you need to consume
   * specific data plane proxy of a service (for example: `version=v2`) the
   * better practice is to use TrafficRoute.
   */
  tags: { [key: string]: string };
}

export interface Dataplane_Networking_Outbound_TagsEntry {
  key: string;
  value: string;
}

/** Gateway describes a service that ingress should not be proxied. */
export interface Dataplane_Networking_Gateway {
  /**
   * Tags associated with a gateway of this data plane to, e.g.
   * `kuma.io/service=gateway`, `env=prod`. `kuma.io/service` tag is
   * mandatory.
   */
  tags: { [key: string]: string };
  /**
   * Type of gateway this data plane proxy manages.
   * There are two types: `DELEGATED` and `BUILTIN`. Defaults to
   * `DELEGATED`.
   *
   * A `DELEGATED` gateway is an independently deployed proxy (e.g., Kong,
   * Contour, etc) that receives inbound traffic that is not proxied by
   * Kuma, and it sends outbound traffic into the data plane proxy.
   *
   * The `BUILTIN` gateway type causes the data plane proxy itself to be
   * configured as a gateway.
   *
   * See https://kuma.io/docs/latest/explore/gateway/ for more information.
   */
  type: Dataplane_Networking_Gateway_GatewayType;
}

export enum Dataplane_Networking_Gateway_GatewayType {
  /**
   * DELEGATED - A `DELEGATED` gateway is an independently deployed proxy that
   * receives inbound traffic that is not proxied by Kuma, and
   * it sends outbound traffic into the data plane proxy.
   */
  DELEGATED = "DELEGATED",
  /**
   * BUILTIN - The `BUILTIN` gateway type configures data plane proxy itself as a
   * gateway.
   */
  BUILTIN = "BUILTIN",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function dataplane_Networking_Gateway_GatewayTypeFromJSON(
  object: any,
): Dataplane_Networking_Gateway_GatewayType {
  switch (object) {
    case 0:
    case "DELEGATED":
      return Dataplane_Networking_Gateway_GatewayType.DELEGATED;
    case 1:
    case "BUILTIN":
      return Dataplane_Networking_Gateway_GatewayType.BUILTIN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Dataplane_Networking_Gateway_GatewayType.UNRECOGNIZED;
  }
}

export function dataplane_Networking_Gateway_GatewayTypeToJSON(
  object: Dataplane_Networking_Gateway_GatewayType,
): string {
  switch (object) {
    case Dataplane_Networking_Gateway_GatewayType.DELEGATED:
      return "DELEGATED";
    case Dataplane_Networking_Gateway_GatewayType.BUILTIN:
      return "BUILTIN";
    case Dataplane_Networking_Gateway_GatewayType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Dataplane_Networking_Gateway_TagsEntry {
  key: string;
  value: string;
}

/** TransparentProxying describes configuration for transparent proxying. */
export interface Dataplane_Networking_TransparentProxying {
  /** Port on which all inbound traffic is being transparently redirected. */
  redirectPortInbound: number;
  /** Port on which all outbound traffic is being transparently redirected. */
  redirectPortOutbound: number;
  /**
   * List of services that will be accessed directly via IP:PORT
   * Use `*` to indicate direct access to every service in the Mesh.
   * Using `*` to directly access every service is a resource-intensive
   * operation, use it only if needed.
   */
  directAccessServices: string[];
  /**
   * Port on which all IPv6 inbound traffic is being transparently
   * redirected.
   */
  redirectPortInboundV6: number;
  /**
   * List of reachable services (represented by the value of
   * `kuma.io/service`) via transparent proxying. Setting an explicit list
   * can dramatically improve the performance of the mesh. If not specified,
   * all services in the mesh are reachable.
   */
  reachableServices: string[];
}

export interface Dataplane_Probes {
  /**
   * Port on which the probe endpoints will be exposed. This cannot overlap
   * with any other ports.
   */
  port: number;
  /** List of endpoints to expose without mTLS. */
  endpoints: Dataplane_Probes_Endpoint[];
}

export interface Dataplane_Probes_Endpoint {
  /**
   * Inbound port is a port of the application from which we expose the
   * endpoint.
   */
  inboundPort: number;
  /**
   * Inbound path is a path of the application from which we expose the
   * endpoint. It is recommended to be as specific as possible.
   */
  inboundPath: string;
  /** Path is a path on which we expose inbound path on the probes port. */
  path: string;
}

function createBaseDataplane(): Dataplane {
  return { networking: undefined, metrics: undefined, probes: undefined };
}

export const Dataplane = {
  fromJSON(object: any): Dataplane {
    return {
      networking: isSet(object.networking) ? Dataplane_Networking.fromJSON(object.networking) : undefined,
      metrics: isSet(object.metrics) ? MetricsBackend.fromJSON(object.metrics) : undefined,
      probes: isSet(object.probes) ? Dataplane_Probes.fromJSON(object.probes) : undefined,
    };
  },

  toJSON(message: Dataplane): unknown {
    const obj: any = {};
    message.networking !== undefined &&
      (obj.networking = message.networking ? Dataplane_Networking.toJSON(message.networking) : undefined);
    message.metrics !== undefined &&
      (obj.metrics = message.metrics ? MetricsBackend.toJSON(message.metrics) : undefined);
    message.probes !== undefined && (obj.probes = message.probes ? Dataplane_Probes.toJSON(message.probes) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Dataplane>): Dataplane {
    const message = Object.create(createBaseDataplane()) as Dataplane;
    message.networking = (object.networking !== undefined && object.networking !== null)
      ? Dataplane_Networking.fromPartial(object.networking)
      : undefined;
    message.metrics = (object.metrics !== undefined && object.metrics !== null)
      ? MetricsBackend.fromPartial(object.metrics)
      : undefined;
    message.probes = (object.probes !== undefined && object.probes !== null)
      ? Dataplane_Probes.fromPartial(object.probes)
      : undefined;
    return message;
  },
};

function createBaseDataplane_Networking(): Dataplane_Networking {
  return {
    address: "",
    advertisedAddress: "",
    gateway: undefined,
    inbound: [],
    outbound: [],
    transparentProxying: undefined,
    admin: undefined,
  };
}

export const Dataplane_Networking = {
  fromJSON(object: any): Dataplane_Networking {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      advertisedAddress: isSet(object.advertisedAddress) ? String(object.advertisedAddress) : "",
      gateway: isSet(object.gateway) ? Dataplane_Networking_Gateway.fromJSON(object.gateway) : undefined,
      inbound: Array.isArray(object?.inbound)
        ? object.inbound.map((e: any) => Dataplane_Networking_Inbound.fromJSON(e))
        : [],
      outbound: Array.isArray(object?.outbound)
        ? object.outbound.map((e: any) => Dataplane_Networking_Outbound.fromJSON(e))
        : [],
      transparentProxying: isSet(object.transparentProxying)
        ? Dataplane_Networking_TransparentProxying.fromJSON(object.transparentProxying)
        : undefined,
      admin: isSet(object.admin) ? EnvoyAdmin.fromJSON(object.admin) : undefined,
    };
  },

  toJSON(message: Dataplane_Networking): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.advertisedAddress !== undefined && (obj.advertisedAddress = message.advertisedAddress);
    message.gateway !== undefined &&
      (obj.gateway = message.gateway ? Dataplane_Networking_Gateway.toJSON(message.gateway) : undefined);
    if (message.inbound) {
      obj.inbound = message.inbound.map((e) => e ? Dataplane_Networking_Inbound.toJSON(e) : undefined);
    } else {
      obj.inbound = [];
    }
    if (message.outbound) {
      obj.outbound = message.outbound.map((e) => e ? Dataplane_Networking_Outbound.toJSON(e) : undefined);
    } else {
      obj.outbound = [];
    }
    message.transparentProxying !== undefined && (obj.transparentProxying = message.transparentProxying
      ? Dataplane_Networking_TransparentProxying.toJSON(message.transparentProxying)
      : undefined);
    message.admin !== undefined && (obj.admin = message.admin ? EnvoyAdmin.toJSON(message.admin) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Dataplane_Networking>): Dataplane_Networking {
    const message = Object.create(createBaseDataplane_Networking()) as Dataplane_Networking;
    message.address = object.address ?? "";
    message.advertisedAddress = object.advertisedAddress ?? "";
    message.gateway = (object.gateway !== undefined && object.gateway !== null)
      ? Dataplane_Networking_Gateway.fromPartial(object.gateway)
      : undefined;
    message.inbound = object.inbound?.map((e) => Dataplane_Networking_Inbound.fromPartial(e)) || [];
    message.outbound = object.outbound?.map((e) => Dataplane_Networking_Outbound.fromPartial(e)) || [];
    message.transparentProxying = (object.transparentProxying !== undefined && object.transparentProxying !== null)
      ? Dataplane_Networking_TransparentProxying.fromPartial(object.transparentProxying)
      : undefined;
    message.admin = (object.admin !== undefined && object.admin !== null)
      ? EnvoyAdmin.fromPartial(object.admin)
      : undefined;
    return message;
  },
};

function createBaseDataplane_Networking_Inbound(): Dataplane_Networking_Inbound {
  return {
    port: 0,
    servicePort: 0,
    serviceAddress: "",
    address: "",
    tags: {},
    health: undefined,
    serviceProbe: undefined,
  };
}

export const Dataplane_Networking_Inbound = {
  fromJSON(object: any): Dataplane_Networking_Inbound {
    return {
      port: isSet(object.port) ? Number(object.port) : 0,
      servicePort: isSet(object.servicePort) ? Number(object.servicePort) : 0,
      serviceAddress: isSet(object.serviceAddress) ? String(object.serviceAddress) : "",
      address: isSet(object.address) ? String(object.address) : "",
      tags: isObject(object.tags)
        ? Object.entries(object.tags).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      health: isSet(object.health) ? Dataplane_Networking_Inbound_Health.fromJSON(object.health) : undefined,
      serviceProbe: isSet(object.serviceProbe)
        ? Dataplane_Networking_Inbound_ServiceProbe.fromJSON(object.serviceProbe)
        : undefined,
    };
  },

  toJSON(message: Dataplane_Networking_Inbound): unknown {
    const obj: any = {};
    message.port !== undefined && (obj.port = Math.round(message.port));
    message.servicePort !== undefined && (obj.servicePort = Math.round(message.servicePort));
    message.serviceAddress !== undefined && (obj.serviceAddress = message.serviceAddress);
    message.address !== undefined && (obj.address = message.address);
    obj.tags = {};
    if (message.tags) {
      Object.entries(message.tags).forEach(([k, v]) => {
        obj.tags[k] = v;
      });
    }
    message.health !== undefined &&
      (obj.health = message.health ? Dataplane_Networking_Inbound_Health.toJSON(message.health) : undefined);
    message.serviceProbe !== undefined && (obj.serviceProbe = message.serviceProbe
      ? Dataplane_Networking_Inbound_ServiceProbe.toJSON(message.serviceProbe)
      : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Dataplane_Networking_Inbound>): Dataplane_Networking_Inbound {
    const message = Object.create(createBaseDataplane_Networking_Inbound()) as Dataplane_Networking_Inbound;
    message.port = object.port ?? 0;
    message.servicePort = object.servicePort ?? 0;
    message.serviceAddress = object.serviceAddress ?? "";
    message.address = object.address ?? "";
    message.tags = Object.entries(object.tags ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.health = (object.health !== undefined && object.health !== null)
      ? Dataplane_Networking_Inbound_Health.fromPartial(object.health)
      : undefined;
    message.serviceProbe = (object.serviceProbe !== undefined && object.serviceProbe !== null)
      ? Dataplane_Networking_Inbound_ServiceProbe.fromPartial(object.serviceProbe)
      : undefined;
    return message;
  },
};

function createBaseDataplane_Networking_Inbound_TagsEntry(): Dataplane_Networking_Inbound_TagsEntry {
  return { key: "", value: "" };
}

export const Dataplane_Networking_Inbound_TagsEntry = {
  fromJSON(object: any): Dataplane_Networking_Inbound_TagsEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: Dataplane_Networking_Inbound_TagsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<Dataplane_Networking_Inbound_TagsEntry>): Dataplane_Networking_Inbound_TagsEntry {
    const message = Object.create(
      createBaseDataplane_Networking_Inbound_TagsEntry(),
    ) as Dataplane_Networking_Inbound_TagsEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseDataplane_Networking_Inbound_Health(): Dataplane_Networking_Inbound_Health {
  return { ready: false };
}

export const Dataplane_Networking_Inbound_Health = {
  fromJSON(object: any): Dataplane_Networking_Inbound_Health {
    return { ready: isSet(object.ready) ? Boolean(object.ready) : false };
  },

  toJSON(message: Dataplane_Networking_Inbound_Health): unknown {
    const obj: any = {};
    message.ready !== undefined && (obj.ready = message.ready);
    return obj;
  },

  fromPartial(object: DeepPartial<Dataplane_Networking_Inbound_Health>): Dataplane_Networking_Inbound_Health {
    const message = Object.create(
      createBaseDataplane_Networking_Inbound_Health(),
    ) as Dataplane_Networking_Inbound_Health;
    message.ready = object.ready ?? false;
    return message;
  },
};

function createBaseDataplane_Networking_Inbound_ServiceProbe(): Dataplane_Networking_Inbound_ServiceProbe {
  return {
    interval: undefined,
    timeout: undefined,
    unhealthyThreshold: undefined,
    healthyThreshold: undefined,
    tcp: undefined,
  };
}

export const Dataplane_Networking_Inbound_ServiceProbe = {
  fromJSON(object: any): Dataplane_Networking_Inbound_ServiceProbe {
    return {
      interval: isSet(object.interval) ? Duration.fromJSON(object.interval) : undefined,
      timeout: isSet(object.timeout) ? Duration.fromJSON(object.timeout) : undefined,
      unhealthyThreshold: isSet(object.unhealthyThreshold) ? Number(object.unhealthyThreshold) : undefined,
      healthyThreshold: isSet(object.healthyThreshold) ? Number(object.healthyThreshold) : undefined,
      tcp: isSet(object.tcp) ? Dataplane_Networking_Inbound_ServiceProbe_Tcp.fromJSON(object.tcp) : undefined,
    };
  },

  toJSON(message: Dataplane_Networking_Inbound_ServiceProbe): unknown {
    const obj: any = {};
    message.interval !== undefined && (obj.interval = message.interval ? Duration.toJSON(message.interval) : undefined);
    message.timeout !== undefined && (obj.timeout = message.timeout ? Duration.toJSON(message.timeout) : undefined);
    message.unhealthyThreshold !== undefined && (obj.unhealthyThreshold = message.unhealthyThreshold);
    message.healthyThreshold !== undefined && (obj.healthyThreshold = message.healthyThreshold);
    message.tcp !== undefined &&
      (obj.tcp = message.tcp ? Dataplane_Networking_Inbound_ServiceProbe_Tcp.toJSON(message.tcp) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<Dataplane_Networking_Inbound_ServiceProbe>,
  ): Dataplane_Networking_Inbound_ServiceProbe {
    const message = Object.create(
      createBaseDataplane_Networking_Inbound_ServiceProbe(),
    ) as Dataplane_Networking_Inbound_ServiceProbe;
    message.interval = (object.interval !== undefined && object.interval !== null)
      ? Duration.fromPartial(object.interval)
      : undefined;
    message.timeout = (object.timeout !== undefined && object.timeout !== null)
      ? Duration.fromPartial(object.timeout)
      : undefined;
    message.unhealthyThreshold = object.unhealthyThreshold ?? undefined;
    message.healthyThreshold = object.healthyThreshold ?? undefined;
    message.tcp = (object.tcp !== undefined && object.tcp !== null)
      ? Dataplane_Networking_Inbound_ServiceProbe_Tcp.fromPartial(object.tcp)
      : undefined;
    return message;
  },
};

function createBaseDataplane_Networking_Inbound_ServiceProbe_Tcp(): Dataplane_Networking_Inbound_ServiceProbe_Tcp {
  return {};
}

export const Dataplane_Networking_Inbound_ServiceProbe_Tcp = {
  fromJSON(_: any): Dataplane_Networking_Inbound_ServiceProbe_Tcp {
    return {};
  },

  toJSON(_: Dataplane_Networking_Inbound_ServiceProbe_Tcp): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<Dataplane_Networking_Inbound_ServiceProbe_Tcp>,
  ): Dataplane_Networking_Inbound_ServiceProbe_Tcp {
    const message = Object.create(
      createBaseDataplane_Networking_Inbound_ServiceProbe_Tcp(),
    ) as Dataplane_Networking_Inbound_ServiceProbe_Tcp;
    return message;
  },
};

function createBaseDataplane_Networking_Outbound(): Dataplane_Networking_Outbound {
  return { address: "", port: 0, service: "", tags: {} };
}

export const Dataplane_Networking_Outbound = {
  fromJSON(object: any): Dataplane_Networking_Outbound {
    return {
      address: isSet(object.address) ? String(object.address) : "",
      port: isSet(object.port) ? Number(object.port) : 0,
      service: isSet(object.service) ? String(object.service) : "",
      tags: isObject(object.tags)
        ? Object.entries(object.tags).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: Dataplane_Networking_Outbound): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.port !== undefined && (obj.port = Math.round(message.port));
    message.service !== undefined && (obj.service = message.service);
    obj.tags = {};
    if (message.tags) {
      Object.entries(message.tags).forEach(([k, v]) => {
        obj.tags[k] = v;
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Dataplane_Networking_Outbound>): Dataplane_Networking_Outbound {
    const message = Object.create(createBaseDataplane_Networking_Outbound()) as Dataplane_Networking_Outbound;
    message.address = object.address ?? "";
    message.port = object.port ?? 0;
    message.service = object.service ?? "";
    message.tags = Object.entries(object.tags ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseDataplane_Networking_Outbound_TagsEntry(): Dataplane_Networking_Outbound_TagsEntry {
  return { key: "", value: "" };
}

export const Dataplane_Networking_Outbound_TagsEntry = {
  fromJSON(object: any): Dataplane_Networking_Outbound_TagsEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: Dataplane_Networking_Outbound_TagsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<Dataplane_Networking_Outbound_TagsEntry>): Dataplane_Networking_Outbound_TagsEntry {
    const message = Object.create(
      createBaseDataplane_Networking_Outbound_TagsEntry(),
    ) as Dataplane_Networking_Outbound_TagsEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseDataplane_Networking_Gateway(): Dataplane_Networking_Gateway {
  return { tags: {}, type: Dataplane_Networking_Gateway_GatewayType.DELEGATED };
}

export const Dataplane_Networking_Gateway = {
  fromJSON(object: any): Dataplane_Networking_Gateway {
    return {
      tags: isObject(object.tags)
        ? Object.entries(object.tags).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      type: isSet(object.type)
        ? dataplane_Networking_Gateway_GatewayTypeFromJSON(object.type)
        : Dataplane_Networking_Gateway_GatewayType.DELEGATED,
    };
  },

  toJSON(message: Dataplane_Networking_Gateway): unknown {
    const obj: any = {};
    obj.tags = {};
    if (message.tags) {
      Object.entries(message.tags).forEach(([k, v]) => {
        obj.tags[k] = v;
      });
    }
    message.type !== undefined && (obj.type = dataplane_Networking_Gateway_GatewayTypeToJSON(message.type));
    return obj;
  },

  fromPartial(object: DeepPartial<Dataplane_Networking_Gateway>): Dataplane_Networking_Gateway {
    const message = Object.create(createBaseDataplane_Networking_Gateway()) as Dataplane_Networking_Gateway;
    message.tags = Object.entries(object.tags ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.type = object.type ?? Dataplane_Networking_Gateway_GatewayType.DELEGATED;
    return message;
  },
};

function createBaseDataplane_Networking_Gateway_TagsEntry(): Dataplane_Networking_Gateway_TagsEntry {
  return { key: "", value: "" };
}

export const Dataplane_Networking_Gateway_TagsEntry = {
  fromJSON(object: any): Dataplane_Networking_Gateway_TagsEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: Dataplane_Networking_Gateway_TagsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<Dataplane_Networking_Gateway_TagsEntry>): Dataplane_Networking_Gateway_TagsEntry {
    const message = Object.create(
      createBaseDataplane_Networking_Gateway_TagsEntry(),
    ) as Dataplane_Networking_Gateway_TagsEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseDataplane_Networking_TransparentProxying(): Dataplane_Networking_TransparentProxying {
  return {
    redirectPortInbound: 0,
    redirectPortOutbound: 0,
    directAccessServices: [],
    redirectPortInboundV6: 0,
    reachableServices: [],
  };
}

export const Dataplane_Networking_TransparentProxying = {
  fromJSON(object: any): Dataplane_Networking_TransparentProxying {
    return {
      redirectPortInbound: isSet(object.redirectPortInbound) ? Number(object.redirectPortInbound) : 0,
      redirectPortOutbound: isSet(object.redirectPortOutbound) ? Number(object.redirectPortOutbound) : 0,
      directAccessServices: Array.isArray(object?.directAccessServices)
        ? object.directAccessServices.map((e: any) => String(e))
        : [],
      redirectPortInboundV6: isSet(object.redirectPortInboundV6) ? Number(object.redirectPortInboundV6) : 0,
      reachableServices: Array.isArray(object?.reachableServices)
        ? object.reachableServices.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: Dataplane_Networking_TransparentProxying): unknown {
    const obj: any = {};
    message.redirectPortInbound !== undefined && (obj.redirectPortInbound = Math.round(message.redirectPortInbound));
    message.redirectPortOutbound !== undefined && (obj.redirectPortOutbound = Math.round(message.redirectPortOutbound));
    if (message.directAccessServices) {
      obj.directAccessServices = message.directAccessServices.map((e) => e);
    } else {
      obj.directAccessServices = [];
    }
    message.redirectPortInboundV6 !== undefined &&
      (obj.redirectPortInboundV6 = Math.round(message.redirectPortInboundV6));
    if (message.reachableServices) {
      obj.reachableServices = message.reachableServices.map((e) => e);
    } else {
      obj.reachableServices = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Dataplane_Networking_TransparentProxying>): Dataplane_Networking_TransparentProxying {
    const message = Object.create(
      createBaseDataplane_Networking_TransparentProxying(),
    ) as Dataplane_Networking_TransparentProxying;
    message.redirectPortInbound = object.redirectPortInbound ?? 0;
    message.redirectPortOutbound = object.redirectPortOutbound ?? 0;
    message.directAccessServices = object.directAccessServices?.map((e) => e) || [];
    message.redirectPortInboundV6 = object.redirectPortInboundV6 ?? 0;
    message.reachableServices = object.reachableServices?.map((e) => e) || [];
    return message;
  },
};

function createBaseDataplane_Probes(): Dataplane_Probes {
  return { port: 0, endpoints: [] };
}

export const Dataplane_Probes = {
  fromJSON(object: any): Dataplane_Probes {
    return {
      port: isSet(object.port) ? Number(object.port) : 0,
      endpoints: Array.isArray(object?.endpoints)
        ? object.endpoints.map((e: any) => Dataplane_Probes_Endpoint.fromJSON(e))
        : [],
    };
  },

  toJSON(message: Dataplane_Probes): unknown {
    const obj: any = {};
    message.port !== undefined && (obj.port = Math.round(message.port));
    if (message.endpoints) {
      obj.endpoints = message.endpoints.map((e) => e ? Dataplane_Probes_Endpoint.toJSON(e) : undefined);
    } else {
      obj.endpoints = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Dataplane_Probes>): Dataplane_Probes {
    const message = Object.create(createBaseDataplane_Probes()) as Dataplane_Probes;
    message.port = object.port ?? 0;
    message.endpoints = object.endpoints?.map((e) => Dataplane_Probes_Endpoint.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDataplane_Probes_Endpoint(): Dataplane_Probes_Endpoint {
  return { inboundPort: 0, inboundPath: "", path: "" };
}

export const Dataplane_Probes_Endpoint = {
  fromJSON(object: any): Dataplane_Probes_Endpoint {
    return {
      inboundPort: isSet(object.inboundPort) ? Number(object.inboundPort) : 0,
      inboundPath: isSet(object.inboundPath) ? String(object.inboundPath) : "",
      path: isSet(object.path) ? String(object.path) : "",
    };
  },

  toJSON(message: Dataplane_Probes_Endpoint): unknown {
    const obj: any = {};
    message.inboundPort !== undefined && (obj.inboundPort = Math.round(message.inboundPort));
    message.inboundPath !== undefined && (obj.inboundPath = message.inboundPath);
    message.path !== undefined && (obj.path = message.path);
    return obj;
  },

  fromPartial(object: DeepPartial<Dataplane_Probes_Endpoint>): Dataplane_Probes_Endpoint {
    const message = Object.create(createBaseDataplane_Probes_Endpoint()) as Dataplane_Probes_Endpoint;
    message.inboundPort = object.inboundPort ?? 0;
    message.inboundPath = object.inboundPath ?? "";
    message.path = object.path ?? "";
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
