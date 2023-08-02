/* eslint-disable */
import { SocketOption } from "./socket_option";

export const protobufPackage = "envoy.api.v2.core";

export interface Pipe {
  /**
   * Unix Domain Socket path. On Linux, paths starting with '@' will use the
   * abstract namespace. The starting '@' is replaced by a null byte by Envoy.
   * Paths starting with '@' will result in an error in environments other than
   * Linux.
   */
  path: string;
  /** The mode for the Pipe. Not applicable for abstract sockets. */
  mode: number;
}

/** [#next-free-field: 7] */
export interface SocketAddress {
  protocol: SocketAddress_Protocol;
  /**
   * The address for this socket. :ref:`Listeners <config_listeners>` will bind
   * to the address. An empty address is not allowed. Specify ``0.0.0.0`` or ``::``
   * to bind to any address. [#comment:TODO(zuercher) reinstate when implemented:
   * It is possible to distinguish a Listener address via the prefix/suffix matching
   * in :ref:`FilterChainMatch <envoy_api_msg_listener.FilterChainMatch>`.] When used
   * within an upstream :ref:`BindConfig <envoy_api_msg_core.BindConfig>`, the address
   * controls the source address of outbound connections. For :ref:`clusters
   * <envoy_api_msg_Cluster>`, the cluster type determines whether the
   * address must be an IP (*STATIC* or *EDS* clusters) or a hostname resolved by DNS
   * (*STRICT_DNS* or *LOGICAL_DNS* clusters). Address resolution can be customized
   * via :ref:`resolver_name <envoy_api_field_core.SocketAddress.resolver_name>`.
   */
  address: string;
  portValue?:
    | number
    | undefined;
  /**
   * This is only valid if :ref:`resolver_name
   * <envoy_api_field_core.SocketAddress.resolver_name>` is specified below and the
   * named resolver is capable of named port resolution.
   */
  namedPort?:
    | string
    | undefined;
  /**
   * The name of the custom resolver. This must have been registered with Envoy. If
   * this is empty, a context dependent default applies. If the address is a concrete
   * IP address, no resolution will occur. If address is a hostname this
   * should be set for resolution other than DNS. Specifying a custom resolver with
   * *STRICT_DNS* or *LOGICAL_DNS* will generate an error at runtime.
   */
  resolverName: string;
  /**
   * When binding to an IPv6 address above, this enables `IPv4 compatibility
   * <https://tools.ietf.org/html/rfc3493#page-11>`_. Binding to ``::`` will
   * allow both IPv4 and IPv6 connections, with peer IPv4 addresses mapped into
   * IPv6 space as ``::FFFF:<IPv4-address>``.
   */
  ipv4Compat: boolean;
}

export enum SocketAddress_Protocol {
  TCP = "TCP",
  UDP = "UDP",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function socketAddress_ProtocolFromJSON(object: any): SocketAddress_Protocol {
  switch (object) {
    case 0:
    case "TCP":
      return SocketAddress_Protocol.TCP;
    case 1:
    case "UDP":
      return SocketAddress_Protocol.UDP;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SocketAddress_Protocol.UNRECOGNIZED;
  }
}

export function socketAddress_ProtocolToJSON(object: SocketAddress_Protocol): string {
  switch (object) {
    case SocketAddress_Protocol.TCP:
      return "TCP";
    case SocketAddress_Protocol.UDP:
      return "UDP";
    case SocketAddress_Protocol.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface TcpKeepalive {
  /**
   * Maximum number of keepalive probes to send without response before deciding
   * the connection is dead. Default is to use the OS level configuration (unless
   * overridden, Linux defaults to 9.)
   */
  keepaliveProbes:
    | number
    | undefined;
  /**
   * The number of seconds a connection needs to be idle before keep-alive probes
   * start being sent. Default is to use the OS level configuration (unless
   * overridden, Linux defaults to 7200s (i.e., 2 hours.)
   */
  keepaliveTime:
    | number
    | undefined;
  /**
   * The number of seconds between keep-alive probes. Default is to use the OS
   * level configuration (unless overridden, Linux defaults to 75s.)
   */
  keepaliveInterval: number | undefined;
}

export interface BindConfig {
  /** The address to bind to when creating a socket. */
  sourceAddress:
    | SocketAddress
    | undefined;
  /**
   * Whether to set the *IP_FREEBIND* option when creating the socket. When this
   * flag is set to true, allows the :ref:`source_address
   * <envoy_api_field_UpstreamBindConfig.source_address>` to be an IP address
   * that is not configured on the system running Envoy. When this flag is set
   * to false, the option *IP_FREEBIND* is disabled on the socket. When this
   * flag is not set (default), the socket is not modified, i.e. the option is
   * neither enabled nor disabled.
   */
  freebind:
    | boolean
    | undefined;
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries.
   */
  socketOptions: SocketOption[];
}

/**
 * Addresses specify either a logical or physical address and port, which are
 * used to tell Envoy where to bind/listen, connect to upstream and find
 * management servers.
 */
export interface Address {
  socketAddress?: SocketAddress | undefined;
  pipe?: Pipe | undefined;
}

/**
 * CidrRange specifies an IP Address and a prefix length to construct
 * the subnet mask for a `CIDR <https://tools.ietf.org/html/rfc4632>`_ range.
 */
export interface CidrRange {
  /** IPv4 or IPv6 address, e.g. ``192.0.0.0`` or ``2001:db8::``. */
  addressPrefix: string;
  /** Length of prefix, e.g. 0, 32. Defaults to 0 when unset. */
  prefixLen: number | undefined;
}

function createBasePipe(): Pipe {
  return { path: "", mode: 0 };
}

export const Pipe = {
  fromJSON(object: any): Pipe {
    return { path: isSet(object.path) ? String(object.path) : "", mode: isSet(object.mode) ? Number(object.mode) : 0 };
  },

  toJSON(message: Pipe): unknown {
    const obj: any = {};
    message.path !== undefined && (obj.path = message.path);
    message.mode !== undefined && (obj.mode = Math.round(message.mode));
    return obj;
  },

  fromPartial(object: DeepPartial<Pipe>): Pipe {
    const message = Object.create(createBasePipe()) as Pipe;
    message.path = object.path ?? "";
    message.mode = object.mode ?? 0;
    return message;
  },
};

function createBaseSocketAddress(): SocketAddress {
  return { protocol: SocketAddress_Protocol.TCP, address: "", resolverName: "", ipv4Compat: false };
}

export const SocketAddress = {
  fromJSON(object: any): SocketAddress {
    return {
      protocol: isSet(object.protocol) ? socketAddress_ProtocolFromJSON(object.protocol) : SocketAddress_Protocol.TCP,
      address: isSet(object.address) ? String(object.address) : "",
      portValue: isSet(object.portValue) ? Number(object.portValue) : undefined,
      namedPort: isSet(object.namedPort) ? String(object.namedPort) : undefined,
      resolverName: isSet(object.resolverName) ? String(object.resolverName) : "",
      ipv4Compat: isSet(object.ipv4Compat) ? Boolean(object.ipv4Compat) : false,
    };
  },

  toJSON(message: SocketAddress): unknown {
    const obj: any = {};
    message.protocol !== undefined && (obj.protocol = socketAddress_ProtocolToJSON(message.protocol));
    message.address !== undefined && (obj.address = message.address);
    message.portValue !== undefined && (obj.portValue = Math.round(message.portValue));
    message.namedPort !== undefined && (obj.namedPort = message.namedPort);
    message.resolverName !== undefined && (obj.resolverName = message.resolverName);
    message.ipv4Compat !== undefined && (obj.ipv4Compat = message.ipv4Compat);
    return obj;
  },

  fromPartial(object: DeepPartial<SocketAddress>): SocketAddress {
    const message = Object.create(createBaseSocketAddress()) as SocketAddress;
    message.protocol = object.protocol ?? SocketAddress_Protocol.TCP;
    message.address = object.address ?? "";
    message.portValue = object.portValue ?? undefined;
    message.namedPort = object.namedPort ?? undefined;
    message.resolverName = object.resolverName ?? "";
    message.ipv4Compat = object.ipv4Compat ?? false;
    return message;
  },
};

function createBaseTcpKeepalive(): TcpKeepalive {
  return { keepaliveProbes: undefined, keepaliveTime: undefined, keepaliveInterval: undefined };
}

export const TcpKeepalive = {
  fromJSON(object: any): TcpKeepalive {
    return {
      keepaliveProbes: isSet(object.keepaliveProbes) ? Number(object.keepaliveProbes) : undefined,
      keepaliveTime: isSet(object.keepaliveTime) ? Number(object.keepaliveTime) : undefined,
      keepaliveInterval: isSet(object.keepaliveInterval) ? Number(object.keepaliveInterval) : undefined,
    };
  },

  toJSON(message: TcpKeepalive): unknown {
    const obj: any = {};
    message.keepaliveProbes !== undefined && (obj.keepaliveProbes = message.keepaliveProbes);
    message.keepaliveTime !== undefined && (obj.keepaliveTime = message.keepaliveTime);
    message.keepaliveInterval !== undefined && (obj.keepaliveInterval = message.keepaliveInterval);
    return obj;
  },

  fromPartial(object: DeepPartial<TcpKeepalive>): TcpKeepalive {
    const message = Object.create(createBaseTcpKeepalive()) as TcpKeepalive;
    message.keepaliveProbes = object.keepaliveProbes ?? undefined;
    message.keepaliveTime = object.keepaliveTime ?? undefined;
    message.keepaliveInterval = object.keepaliveInterval ?? undefined;
    return message;
  },
};

function createBaseBindConfig(): BindConfig {
  return { sourceAddress: undefined, freebind: undefined, socketOptions: [] };
}

export const BindConfig = {
  fromJSON(object: any): BindConfig {
    return {
      sourceAddress: isSet(object.sourceAddress) ? SocketAddress.fromJSON(object.sourceAddress) : undefined,
      freebind: isSet(object.freebind) ? Boolean(object.freebind) : undefined,
      socketOptions: Array.isArray(object?.socketOptions)
        ? object.socketOptions.map((e: any) => SocketOption.fromJSON(e))
        : [],
    };
  },

  toJSON(message: BindConfig): unknown {
    const obj: any = {};
    message.sourceAddress !== undefined &&
      (obj.sourceAddress = message.sourceAddress ? SocketAddress.toJSON(message.sourceAddress) : undefined);
    message.freebind !== undefined && (obj.freebind = message.freebind);
    if (message.socketOptions) {
      obj.socketOptions = message.socketOptions.map((e) => e ? SocketOption.toJSON(e) : undefined);
    } else {
      obj.socketOptions = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<BindConfig>): BindConfig {
    const message = Object.create(createBaseBindConfig()) as BindConfig;
    message.sourceAddress = (object.sourceAddress !== undefined && object.sourceAddress !== null)
      ? SocketAddress.fromPartial(object.sourceAddress)
      : undefined;
    message.freebind = object.freebind ?? undefined;
    message.socketOptions = object.socketOptions?.map((e) => SocketOption.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAddress(): Address {
  return {};
}

export const Address = {
  fromJSON(object: any): Address {
    return {
      socketAddress: isSet(object.socketAddress) ? SocketAddress.fromJSON(object.socketAddress) : undefined,
      pipe: isSet(object.pipe) ? Pipe.fromJSON(object.pipe) : undefined,
    };
  },

  toJSON(message: Address): unknown {
    const obj: any = {};
    message.socketAddress !== undefined &&
      (obj.socketAddress = message.socketAddress ? SocketAddress.toJSON(message.socketAddress) : undefined);
    message.pipe !== undefined && (obj.pipe = message.pipe ? Pipe.toJSON(message.pipe) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Address>): Address {
    const message = Object.create(createBaseAddress()) as Address;
    message.socketAddress = (object.socketAddress !== undefined && object.socketAddress !== null)
      ? SocketAddress.fromPartial(object.socketAddress)
      : undefined;
    message.pipe = (object.pipe !== undefined && object.pipe !== null) ? Pipe.fromPartial(object.pipe) : undefined;
    return message;
  },
};

function createBaseCidrRange(): CidrRange {
  return { addressPrefix: "", prefixLen: undefined };
}

export const CidrRange = {
  fromJSON(object: any): CidrRange {
    return {
      addressPrefix: isSet(object.addressPrefix) ? String(object.addressPrefix) : "",
      prefixLen: isSet(object.prefixLen) ? Number(object.prefixLen) : undefined,
    };
  },

  toJSON(message: CidrRange): unknown {
    const obj: any = {};
    message.addressPrefix !== undefined && (obj.addressPrefix = message.addressPrefix);
    message.prefixLen !== undefined && (obj.prefixLen = message.prefixLen);
    return obj;
  },

  fromPartial(object: DeepPartial<CidrRange>): CidrRange {
    const message = Object.create(createBaseCidrRange()) as CidrRange;
    message.addressPrefix = object.addressPrefix ?? "";
    message.prefixLen = object.prefixLen ?? undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
