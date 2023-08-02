/* eslint-disable */
import { HttpMethod, httpMethodFromJSON, httpMethodToJSON } from "./http_method";
import { Selector } from "./selector";

export const protobufPackage = "kuma.mesh.v1alpha1";

export interface MeshGatewayRoute {
  /** Selectors is used to match this resource to MeshGateway listener. */
  selectors: Selector[];
  /** Conf specifies the route configuration. */
  conf: MeshGatewayRoute_Conf | undefined;
}

/** Backend selects a target for HTTP request forwarding. */
export interface MeshGatewayRoute_Backend {
  /**
   * Weight is the proportion of requests this backend will receive
   * when a forwarding rules specifies multiple backends. Traffic
   * weight is computed as "weight/sum(all weights)".
   *
   * A weight of 0 means that the destination will be ignored.
   */
  weight: number;
  /**
   * Destination is a selector to match the individual endpoints to
   * which the gateway will forward.
   */
  destination: { [key: string]: string };
}

export interface MeshGatewayRoute_Backend_DestinationEntry {
  key: string;
  value: string;
}

/** TCP routes are valid for listeners that accept connections over TCP. */
export interface MeshGatewayRoute_TcpRoute {
  rules: MeshGatewayRoute_TcpRoute_Rule[];
}

/** repeated Match matches = 1; */
export interface MeshGatewayRoute_TcpRoute_Rule {
  backends: MeshGatewayRoute_Backend[];
}

/**
 * HTTP routes are valid for listeners that accept HTTP/1.1 and HTTP/2 over
 * both TCP and TLS.
 */
export interface MeshGatewayRoute_HttpRoute {
  /**
   * Hostnames lists the server names for which this route is valid. The
   * hostnames are matched against the TLS Server Name Indication extension
   * if this is a TLS session. They are also matched against the HTTP host
   * (authority) header in the client's HTTP request.
   */
  hostnames: string[];
  /** Rules specifies how the gateway should match and process HTTP requests. */
  rules: MeshGatewayRoute_HttpRoute_Rule[];
}

/**
 * Match specifies the criteria for when a HTTP request matches a rule.
 * The match is only considered successful if all of the specified
 * conditions succeed (AND semantics). At least one match condition
 * must be given.
 */
export interface MeshGatewayRoute_HttpRoute_Match {
  path: MeshGatewayRoute_HttpRoute_Match_Path | undefined;
  method: HttpMethod;
  headers: MeshGatewayRoute_HttpRoute_Match_Header[];
  queryParameters: MeshGatewayRoute_HttpRoute_Match_Query[];
}

/**
 * Path matches may be "EXACT", "PREFIX", or "REGEX" matches. If
 * the match type is not specified, "EXACT" is the default.
 */
export interface MeshGatewayRoute_HttpRoute_Match_Path {
  match: MeshGatewayRoute_HttpRoute_Match_Path_MatchType;
  /**
   * Value is the path to match against. For EXACT and PREFIX match
   * types, it must be a HTTP URI path. For the REGEX match type,
   * it must be a RE2 regular expression.
   * Note that a PREFIX match succeeds only if the prefix is the
   * the entire path or is followed by a /. I.e. a prefix of the
   * path in terms of path elements.
   */
  value: string;
}

export enum MeshGatewayRoute_HttpRoute_Match_Path_MatchType {
  EXACT = "EXACT",
  PREFIX = "PREFIX",
  REGEX = "REGEX",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function meshGatewayRoute_HttpRoute_Match_Path_MatchTypeFromJSON(
  object: any,
): MeshGatewayRoute_HttpRoute_Match_Path_MatchType {
  switch (object) {
    case 0:
    case "EXACT":
      return MeshGatewayRoute_HttpRoute_Match_Path_MatchType.EXACT;
    case 1:
    case "PREFIX":
      return MeshGatewayRoute_HttpRoute_Match_Path_MatchType.PREFIX;
    case 2:
    case "REGEX":
      return MeshGatewayRoute_HttpRoute_Match_Path_MatchType.REGEX;
    case -1:
    case "UNRECOGNIZED":
    default:
      return MeshGatewayRoute_HttpRoute_Match_Path_MatchType.UNRECOGNIZED;
  }
}

export function meshGatewayRoute_HttpRoute_Match_Path_MatchTypeToJSON(
  object: MeshGatewayRoute_HttpRoute_Match_Path_MatchType,
): string {
  switch (object) {
    case MeshGatewayRoute_HttpRoute_Match_Path_MatchType.EXACT:
      return "EXACT";
    case MeshGatewayRoute_HttpRoute_Match_Path_MatchType.PREFIX:
      return "PREFIX";
    case MeshGatewayRoute_HttpRoute_Match_Path_MatchType.REGEX:
      return "REGEX";
    case MeshGatewayRoute_HttpRoute_Match_Path_MatchType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/**
 * Header matches a value in a HTTP request header. Not that if
 * the header is defined to have multiple values, a REGEX match
 * must be used to match a specific value.
 */
export interface MeshGatewayRoute_HttpRoute_Match_Header {
  match: MeshGatewayRoute_HttpRoute_Match_Header_MatchType;
  /** Name of the HTTP header containing the value to match. */
  name: string;
  /** Value that the HTTP header value should be matched against. */
  value: string;
}

export enum MeshGatewayRoute_HttpRoute_Match_Header_MatchType {
  EXACT = "EXACT",
  REGEX = "REGEX",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function meshGatewayRoute_HttpRoute_Match_Header_MatchTypeFromJSON(
  object: any,
): MeshGatewayRoute_HttpRoute_Match_Header_MatchType {
  switch (object) {
    case 0:
    case "EXACT":
      return MeshGatewayRoute_HttpRoute_Match_Header_MatchType.EXACT;
    case 1:
    case "REGEX":
      return MeshGatewayRoute_HttpRoute_Match_Header_MatchType.REGEX;
    case -1:
    case "UNRECOGNIZED":
    default:
      return MeshGatewayRoute_HttpRoute_Match_Header_MatchType.UNRECOGNIZED;
  }
}

export function meshGatewayRoute_HttpRoute_Match_Header_MatchTypeToJSON(
  object: MeshGatewayRoute_HttpRoute_Match_Header_MatchType,
): string {
  switch (object) {
    case MeshGatewayRoute_HttpRoute_Match_Header_MatchType.EXACT:
      return "EXACT";
    case MeshGatewayRoute_HttpRoute_Match_Header_MatchType.REGEX:
      return "REGEX";
    case MeshGatewayRoute_HttpRoute_Match_Header_MatchType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Query matches against HTTP request query parameters. */
export interface MeshGatewayRoute_HttpRoute_Match_Query {
  match: MeshGatewayRoute_HttpRoute_Match_Query_MatchType;
  /** Name of the query parameter containing the value to match. */
  name: string;
  /** Value that the query parameter value should be matched against. */
  value: string;
}

export enum MeshGatewayRoute_HttpRoute_Match_Query_MatchType {
  EXACT = "EXACT",
  REGEX = "REGEX",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function meshGatewayRoute_HttpRoute_Match_Query_MatchTypeFromJSON(
  object: any,
): MeshGatewayRoute_HttpRoute_Match_Query_MatchType {
  switch (object) {
    case 0:
    case "EXACT":
      return MeshGatewayRoute_HttpRoute_Match_Query_MatchType.EXACT;
    case 1:
    case "REGEX":
      return MeshGatewayRoute_HttpRoute_Match_Query_MatchType.REGEX;
    case -1:
    case "UNRECOGNIZED":
    default:
      return MeshGatewayRoute_HttpRoute_Match_Query_MatchType.UNRECOGNIZED;
  }
}

export function meshGatewayRoute_HttpRoute_Match_Query_MatchTypeToJSON(
  object: MeshGatewayRoute_HttpRoute_Match_Query_MatchType,
): string {
  switch (object) {
    case MeshGatewayRoute_HttpRoute_Match_Query_MatchType.EXACT:
      return "EXACT";
    case MeshGatewayRoute_HttpRoute_Match_Query_MatchType.REGEX:
      return "REGEX";
    case MeshGatewayRoute_HttpRoute_Match_Query_MatchType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface MeshGatewayRoute_HttpRoute_Filter {
  requestHeader?: MeshGatewayRoute_HttpRoute_Filter_HeaderFilter | undefined;
  mirror?: MeshGatewayRoute_HttpRoute_Filter_Mirror | undefined;
  redirect?: MeshGatewayRoute_HttpRoute_Filter_Redirect | undefined;
  rewrite?: MeshGatewayRoute_HttpRoute_Filter_Rewrite | undefined;
  responseHeader?: MeshGatewayRoute_HttpRoute_Filter_HeaderFilter | undefined;
}

export interface MeshGatewayRoute_HttpRoute_Filter_HeaderFilter {
  set: MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header[];
  add: MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header[];
  remove: string[];
}

export interface MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header {
  name: string;
  value: string;
}

/**
 * The mirror filter sends a percentage of HTTP requests to the
 * given backend. The gateway ignores any responses to these requests.
 */
export interface MeshGatewayRoute_HttpRoute_Filter_Mirror {
  /**
   * Backend denotes the service to which requests will be mirrored. The
   * "weight" field must not be given.
   */
  backend:
    | MeshGatewayRoute_Backend
    | undefined;
  /**
   * Percentage specifies the percentage of requests to mirror to
   * the backend (in the range 0.0 - 100.0, inclusive).
   */
  percentage: number | undefined;
}

/**
 * The redirect filter responds to the HTTP request immediately,
 * without forwarding it to any backend. The response is a HTTP
 * redirect message.
 */
export interface MeshGatewayRoute_HttpRoute_Filter_Redirect {
  /** The scheme for the redirect URL. Usually "http" or "https". */
  scheme: string;
  /** The hostname to redirect to. */
  hostname: string;
  /** The port to redirect to. */
  port: number;
  /** The HTTP response status code. This must be in the range 300 - 308. */
  statusCode: number;
}

export interface MeshGatewayRoute_HttpRoute_Filter_Rewrite {
  replaceFull?:
    | string
    | undefined;
  /**
   * Note that rewriting "/prefix" to "/" will do the right thing:
   * - the path "/prefix" is rewritten to "/"
   * - the path "/prefix/rest" is rewritten to "/rest"
   */
  replacePrefixMatch?: string | undefined;
}

export interface MeshGatewayRoute_HttpRoute_Rule {
  /**
   * Matches are checked in order. If any match is successful, the
   * rule is selected (OR semantics).
   */
  matches: MeshGatewayRoute_HttpRoute_Match[];
  /**
   * Filters are request processing steps that are applied to
   * matched requests.
   *
   * If the redirect filter is specified, it must be the only
   * filter given.
   */
  filters: MeshGatewayRoute_HttpRoute_Filter[];
  /**
   * Backends is the set of services to which the gateway will
   * forward requests. If a redirect filter is specified, no
   * backends are allowed. Otherwise, at least one backend
   * must be given.
   */
  backends: MeshGatewayRoute_Backend[];
}

export interface MeshGatewayRoute_Conf {
  tcp?: MeshGatewayRoute_TcpRoute | undefined;
  http?: MeshGatewayRoute_HttpRoute | undefined;
}

function createBaseMeshGatewayRoute(): MeshGatewayRoute {
  return { selectors: [], conf: undefined };
}

export const MeshGatewayRoute = {
  fromJSON(object: any): MeshGatewayRoute {
    return {
      selectors: Array.isArray(object?.selectors) ? object.selectors.map((e: any) => Selector.fromJSON(e)) : [],
      conf: isSet(object.conf) ? MeshGatewayRoute_Conf.fromJSON(object.conf) : undefined,
    };
  },

  toJSON(message: MeshGatewayRoute): unknown {
    const obj: any = {};
    if (message.selectors) {
      obj.selectors = message.selectors.map((e) => e ? Selector.toJSON(e) : undefined);
    } else {
      obj.selectors = [];
    }
    message.conf !== undefined && (obj.conf = message.conf ? MeshGatewayRoute_Conf.toJSON(message.conf) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGatewayRoute>): MeshGatewayRoute {
    const message = Object.create(createBaseMeshGatewayRoute()) as MeshGatewayRoute;
    message.selectors = object.selectors?.map((e) => Selector.fromPartial(e)) || [];
    message.conf = (object.conf !== undefined && object.conf !== null)
      ? MeshGatewayRoute_Conf.fromPartial(object.conf)
      : undefined;
    return message;
  },
};

function createBaseMeshGatewayRoute_Backend(): MeshGatewayRoute_Backend {
  return { weight: 0, destination: {} };
}

export const MeshGatewayRoute_Backend = {
  fromJSON(object: any): MeshGatewayRoute_Backend {
    return {
      weight: isSet(object.weight) ? Number(object.weight) : 0,
      destination: isObject(object.destination)
        ? Object.entries(object.destination).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: MeshGatewayRoute_Backend): unknown {
    const obj: any = {};
    message.weight !== undefined && (obj.weight = Math.round(message.weight));
    obj.destination = {};
    if (message.destination) {
      Object.entries(message.destination).forEach(([k, v]) => {
        obj.destination[k] = v;
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGatewayRoute_Backend>): MeshGatewayRoute_Backend {
    const message = Object.create(createBaseMeshGatewayRoute_Backend()) as MeshGatewayRoute_Backend;
    message.weight = object.weight ?? 0;
    message.destination = Object.entries(object.destination ?? {}).reduce<{ [key: string]: string }>(
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

function createBaseMeshGatewayRoute_Backend_DestinationEntry(): MeshGatewayRoute_Backend_DestinationEntry {
  return { key: "", value: "" };
}

export const MeshGatewayRoute_Backend_DestinationEntry = {
  fromJSON(object: any): MeshGatewayRoute_Backend_DestinationEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: MeshGatewayRoute_Backend_DestinationEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MeshGatewayRoute_Backend_DestinationEntry>,
  ): MeshGatewayRoute_Backend_DestinationEntry {
    const message = Object.create(
      createBaseMeshGatewayRoute_Backend_DestinationEntry(),
    ) as MeshGatewayRoute_Backend_DestinationEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseMeshGatewayRoute_TcpRoute(): MeshGatewayRoute_TcpRoute {
  return { rules: [] };
}

export const MeshGatewayRoute_TcpRoute = {
  fromJSON(object: any): MeshGatewayRoute_TcpRoute {
    return {
      rules: Array.isArray(object?.rules)
        ? object.rules.map((e: any) => MeshGatewayRoute_TcpRoute_Rule.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MeshGatewayRoute_TcpRoute): unknown {
    const obj: any = {};
    if (message.rules) {
      obj.rules = message.rules.map((e) => e ? MeshGatewayRoute_TcpRoute_Rule.toJSON(e) : undefined);
    } else {
      obj.rules = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGatewayRoute_TcpRoute>): MeshGatewayRoute_TcpRoute {
    const message = Object.create(createBaseMeshGatewayRoute_TcpRoute()) as MeshGatewayRoute_TcpRoute;
    message.rules = object.rules?.map((e) => MeshGatewayRoute_TcpRoute_Rule.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMeshGatewayRoute_TcpRoute_Rule(): MeshGatewayRoute_TcpRoute_Rule {
  return { backends: [] };
}

export const MeshGatewayRoute_TcpRoute_Rule = {
  fromJSON(object: any): MeshGatewayRoute_TcpRoute_Rule {
    return {
      backends: Array.isArray(object?.backends)
        ? object.backends.map((e: any) => MeshGatewayRoute_Backend.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MeshGatewayRoute_TcpRoute_Rule): unknown {
    const obj: any = {};
    if (message.backends) {
      obj.backends = message.backends.map((e) => e ? MeshGatewayRoute_Backend.toJSON(e) : undefined);
    } else {
      obj.backends = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGatewayRoute_TcpRoute_Rule>): MeshGatewayRoute_TcpRoute_Rule {
    const message = Object.create(createBaseMeshGatewayRoute_TcpRoute_Rule()) as MeshGatewayRoute_TcpRoute_Rule;
    message.backends = object.backends?.map((e) => MeshGatewayRoute_Backend.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMeshGatewayRoute_HttpRoute(): MeshGatewayRoute_HttpRoute {
  return { hostnames: [], rules: [] };
}

export const MeshGatewayRoute_HttpRoute = {
  fromJSON(object: any): MeshGatewayRoute_HttpRoute {
    return {
      hostnames: Array.isArray(object?.hostnames) ? object.hostnames.map((e: any) => String(e)) : [],
      rules: Array.isArray(object?.rules)
        ? object.rules.map((e: any) => MeshGatewayRoute_HttpRoute_Rule.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MeshGatewayRoute_HttpRoute): unknown {
    const obj: any = {};
    if (message.hostnames) {
      obj.hostnames = message.hostnames.map((e) => e);
    } else {
      obj.hostnames = [];
    }
    if (message.rules) {
      obj.rules = message.rules.map((e) => e ? MeshGatewayRoute_HttpRoute_Rule.toJSON(e) : undefined);
    } else {
      obj.rules = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGatewayRoute_HttpRoute>): MeshGatewayRoute_HttpRoute {
    const message = Object.create(createBaseMeshGatewayRoute_HttpRoute()) as MeshGatewayRoute_HttpRoute;
    message.hostnames = object.hostnames?.map((e) => e) || [];
    message.rules = object.rules?.map((e) => MeshGatewayRoute_HttpRoute_Rule.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMeshGatewayRoute_HttpRoute_Match(): MeshGatewayRoute_HttpRoute_Match {
  return { path: undefined, method: HttpMethod.NONE, headers: [], queryParameters: [] };
}

export const MeshGatewayRoute_HttpRoute_Match = {
  fromJSON(object: any): MeshGatewayRoute_HttpRoute_Match {
    return {
      path: isSet(object.path) ? MeshGatewayRoute_HttpRoute_Match_Path.fromJSON(object.path) : undefined,
      method: isSet(object.method) ? httpMethodFromJSON(object.method) : HttpMethod.NONE,
      headers: Array.isArray(object?.headers)
        ? object.headers.map((e: any) => MeshGatewayRoute_HttpRoute_Match_Header.fromJSON(e))
        : [],
      queryParameters: Array.isArray(object?.queryParameters)
        ? object.queryParameters.map((e: any) => MeshGatewayRoute_HttpRoute_Match_Query.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MeshGatewayRoute_HttpRoute_Match): unknown {
    const obj: any = {};
    message.path !== undefined &&
      (obj.path = message.path ? MeshGatewayRoute_HttpRoute_Match_Path.toJSON(message.path) : undefined);
    message.method !== undefined && (obj.method = httpMethodToJSON(message.method));
    if (message.headers) {
      obj.headers = message.headers.map((e) => e ? MeshGatewayRoute_HttpRoute_Match_Header.toJSON(e) : undefined);
    } else {
      obj.headers = [];
    }
    if (message.queryParameters) {
      obj.queryParameters = message.queryParameters.map((e) =>
        e ? MeshGatewayRoute_HttpRoute_Match_Query.toJSON(e) : undefined
      );
    } else {
      obj.queryParameters = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGatewayRoute_HttpRoute_Match>): MeshGatewayRoute_HttpRoute_Match {
    const message = Object.create(createBaseMeshGatewayRoute_HttpRoute_Match()) as MeshGatewayRoute_HttpRoute_Match;
    message.path = (object.path !== undefined && object.path !== null)
      ? MeshGatewayRoute_HttpRoute_Match_Path.fromPartial(object.path)
      : undefined;
    message.method = object.method ?? HttpMethod.NONE;
    message.headers = object.headers?.map((e) => MeshGatewayRoute_HttpRoute_Match_Header.fromPartial(e)) || [];
    message.queryParameters =
      object.queryParameters?.map((e) => MeshGatewayRoute_HttpRoute_Match_Query.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMeshGatewayRoute_HttpRoute_Match_Path(): MeshGatewayRoute_HttpRoute_Match_Path {
  return { match: MeshGatewayRoute_HttpRoute_Match_Path_MatchType.EXACT, value: "" };
}

export const MeshGatewayRoute_HttpRoute_Match_Path = {
  fromJSON(object: any): MeshGatewayRoute_HttpRoute_Match_Path {
    return {
      match: isSet(object.match)
        ? meshGatewayRoute_HttpRoute_Match_Path_MatchTypeFromJSON(object.match)
        : MeshGatewayRoute_HttpRoute_Match_Path_MatchType.EXACT,
      value: isSet(object.value) ? String(object.value) : "",
    };
  },

  toJSON(message: MeshGatewayRoute_HttpRoute_Match_Path): unknown {
    const obj: any = {};
    message.match !== undefined && (obj.match = meshGatewayRoute_HttpRoute_Match_Path_MatchTypeToJSON(message.match));
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGatewayRoute_HttpRoute_Match_Path>): MeshGatewayRoute_HttpRoute_Match_Path {
    const message = Object.create(
      createBaseMeshGatewayRoute_HttpRoute_Match_Path(),
    ) as MeshGatewayRoute_HttpRoute_Match_Path;
    message.match = object.match ?? MeshGatewayRoute_HttpRoute_Match_Path_MatchType.EXACT;
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseMeshGatewayRoute_HttpRoute_Match_Header(): MeshGatewayRoute_HttpRoute_Match_Header {
  return { match: MeshGatewayRoute_HttpRoute_Match_Header_MatchType.EXACT, name: "", value: "" };
}

export const MeshGatewayRoute_HttpRoute_Match_Header = {
  fromJSON(object: any): MeshGatewayRoute_HttpRoute_Match_Header {
    return {
      match: isSet(object.match)
        ? meshGatewayRoute_HttpRoute_Match_Header_MatchTypeFromJSON(object.match)
        : MeshGatewayRoute_HttpRoute_Match_Header_MatchType.EXACT,
      name: isSet(object.name) ? String(object.name) : "",
      value: isSet(object.value) ? String(object.value) : "",
    };
  },

  toJSON(message: MeshGatewayRoute_HttpRoute_Match_Header): unknown {
    const obj: any = {};
    message.match !== undefined && (obj.match = meshGatewayRoute_HttpRoute_Match_Header_MatchTypeToJSON(message.match));
    message.name !== undefined && (obj.name = message.name);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGatewayRoute_HttpRoute_Match_Header>): MeshGatewayRoute_HttpRoute_Match_Header {
    const message = Object.create(
      createBaseMeshGatewayRoute_HttpRoute_Match_Header(),
    ) as MeshGatewayRoute_HttpRoute_Match_Header;
    message.match = object.match ?? MeshGatewayRoute_HttpRoute_Match_Header_MatchType.EXACT;
    message.name = object.name ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseMeshGatewayRoute_HttpRoute_Match_Query(): MeshGatewayRoute_HttpRoute_Match_Query {
  return { match: MeshGatewayRoute_HttpRoute_Match_Query_MatchType.EXACT, name: "", value: "" };
}

export const MeshGatewayRoute_HttpRoute_Match_Query = {
  fromJSON(object: any): MeshGatewayRoute_HttpRoute_Match_Query {
    return {
      match: isSet(object.match)
        ? meshGatewayRoute_HttpRoute_Match_Query_MatchTypeFromJSON(object.match)
        : MeshGatewayRoute_HttpRoute_Match_Query_MatchType.EXACT,
      name: isSet(object.name) ? String(object.name) : "",
      value: isSet(object.value) ? String(object.value) : "",
    };
  },

  toJSON(message: MeshGatewayRoute_HttpRoute_Match_Query): unknown {
    const obj: any = {};
    message.match !== undefined && (obj.match = meshGatewayRoute_HttpRoute_Match_Query_MatchTypeToJSON(message.match));
    message.name !== undefined && (obj.name = message.name);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGatewayRoute_HttpRoute_Match_Query>): MeshGatewayRoute_HttpRoute_Match_Query {
    const message = Object.create(
      createBaseMeshGatewayRoute_HttpRoute_Match_Query(),
    ) as MeshGatewayRoute_HttpRoute_Match_Query;
    message.match = object.match ?? MeshGatewayRoute_HttpRoute_Match_Query_MatchType.EXACT;
    message.name = object.name ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseMeshGatewayRoute_HttpRoute_Filter(): MeshGatewayRoute_HttpRoute_Filter {
  return {};
}

export const MeshGatewayRoute_HttpRoute_Filter = {
  fromJSON(object: any): MeshGatewayRoute_HttpRoute_Filter {
    return {
      requestHeader: isSet(object.requestHeader)
        ? MeshGatewayRoute_HttpRoute_Filter_HeaderFilter.fromJSON(object.requestHeader)
        : undefined,
      mirror: isSet(object.mirror) ? MeshGatewayRoute_HttpRoute_Filter_Mirror.fromJSON(object.mirror) : undefined,
      redirect: isSet(object.redirect)
        ? MeshGatewayRoute_HttpRoute_Filter_Redirect.fromJSON(object.redirect)
        : undefined,
      rewrite: isSet(object.rewrite) ? MeshGatewayRoute_HttpRoute_Filter_Rewrite.fromJSON(object.rewrite) : undefined,
      responseHeader: isSet(object.responseHeader)
        ? MeshGatewayRoute_HttpRoute_Filter_HeaderFilter.fromJSON(object.responseHeader)
        : undefined,
    };
  },

  toJSON(message: MeshGatewayRoute_HttpRoute_Filter): unknown {
    const obj: any = {};
    message.requestHeader !== undefined && (obj.requestHeader = message.requestHeader
      ? MeshGatewayRoute_HttpRoute_Filter_HeaderFilter.toJSON(message.requestHeader)
      : undefined);
    message.mirror !== undefined &&
      (obj.mirror = message.mirror ? MeshGatewayRoute_HttpRoute_Filter_Mirror.toJSON(message.mirror) : undefined);
    message.redirect !== undefined &&
      (obj.redirect = message.redirect
        ? MeshGatewayRoute_HttpRoute_Filter_Redirect.toJSON(message.redirect)
        : undefined);
    message.rewrite !== undefined &&
      (obj.rewrite = message.rewrite ? MeshGatewayRoute_HttpRoute_Filter_Rewrite.toJSON(message.rewrite) : undefined);
    message.responseHeader !== undefined && (obj.responseHeader = message.responseHeader
      ? MeshGatewayRoute_HttpRoute_Filter_HeaderFilter.toJSON(message.responseHeader)
      : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGatewayRoute_HttpRoute_Filter>): MeshGatewayRoute_HttpRoute_Filter {
    const message = Object.create(createBaseMeshGatewayRoute_HttpRoute_Filter()) as MeshGatewayRoute_HttpRoute_Filter;
    message.requestHeader = (object.requestHeader !== undefined && object.requestHeader !== null)
      ? MeshGatewayRoute_HttpRoute_Filter_HeaderFilter.fromPartial(object.requestHeader)
      : undefined;
    message.mirror = (object.mirror !== undefined && object.mirror !== null)
      ? MeshGatewayRoute_HttpRoute_Filter_Mirror.fromPartial(object.mirror)
      : undefined;
    message.redirect = (object.redirect !== undefined && object.redirect !== null)
      ? MeshGatewayRoute_HttpRoute_Filter_Redirect.fromPartial(object.redirect)
      : undefined;
    message.rewrite = (object.rewrite !== undefined && object.rewrite !== null)
      ? MeshGatewayRoute_HttpRoute_Filter_Rewrite.fromPartial(object.rewrite)
      : undefined;
    message.responseHeader = (object.responseHeader !== undefined && object.responseHeader !== null)
      ? MeshGatewayRoute_HttpRoute_Filter_HeaderFilter.fromPartial(object.responseHeader)
      : undefined;
    return message;
  },
};

function createBaseMeshGatewayRoute_HttpRoute_Filter_HeaderFilter(): MeshGatewayRoute_HttpRoute_Filter_HeaderFilter {
  return { set: [], add: [], remove: [] };
}

export const MeshGatewayRoute_HttpRoute_Filter_HeaderFilter = {
  fromJSON(object: any): MeshGatewayRoute_HttpRoute_Filter_HeaderFilter {
    return {
      set: Array.isArray(object?.set)
        ? object.set.map((e: any) => MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header.fromJSON(e))
        : [],
      add: Array.isArray(object?.add)
        ? object.add.map((e: any) => MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header.fromJSON(e))
        : [],
      remove: Array.isArray(object?.remove)
        ? object.remove.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: MeshGatewayRoute_HttpRoute_Filter_HeaderFilter): unknown {
    const obj: any = {};
    if (message.set) {
      obj.set = message.set.map((e) => e ? MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header.toJSON(e) : undefined);
    } else {
      obj.set = [];
    }
    if (message.add) {
      obj.add = message.add.map((e) => e ? MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header.toJSON(e) : undefined);
    } else {
      obj.add = [];
    }
    if (message.remove) {
      obj.remove = message.remove.map((e) => e);
    } else {
      obj.remove = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<MeshGatewayRoute_HttpRoute_Filter_HeaderFilter>,
  ): MeshGatewayRoute_HttpRoute_Filter_HeaderFilter {
    const message = Object.create(
      createBaseMeshGatewayRoute_HttpRoute_Filter_HeaderFilter(),
    ) as MeshGatewayRoute_HttpRoute_Filter_HeaderFilter;
    message.set = object.set?.map((e) => MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header.fromPartial(e)) || [];
    message.add = object.add?.map((e) => MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header.fromPartial(e)) || [];
    message.remove = object.remove?.map((e) => e) || [];
    return message;
  },
};

function createBaseMeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header(): MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header {
  return { name: "", value: "" };
}

export const MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header = {
  fromJSON(object: any): MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      value: isSet(object.value) ? String(object.value) : "",
    };
  },

  toJSON(message: MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header>,
  ): MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header {
    const message = Object.create(
      createBaseMeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header(),
    ) as MeshGatewayRoute_HttpRoute_Filter_HeaderFilter_Header;
    message.name = object.name ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseMeshGatewayRoute_HttpRoute_Filter_Mirror(): MeshGatewayRoute_HttpRoute_Filter_Mirror {
  return { backend: undefined, percentage: undefined };
}

export const MeshGatewayRoute_HttpRoute_Filter_Mirror = {
  fromJSON(object: any): MeshGatewayRoute_HttpRoute_Filter_Mirror {
    return {
      backend: isSet(object.backend) ? MeshGatewayRoute_Backend.fromJSON(object.backend) : undefined,
      percentage: isSet(object.percentage) ? Number(object.percentage) : undefined,
    };
  },

  toJSON(message: MeshGatewayRoute_HttpRoute_Filter_Mirror): unknown {
    const obj: any = {};
    message.backend !== undefined &&
      (obj.backend = message.backend ? MeshGatewayRoute_Backend.toJSON(message.backend) : undefined);
    message.percentage !== undefined && (obj.percentage = message.percentage);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGatewayRoute_HttpRoute_Filter_Mirror>): MeshGatewayRoute_HttpRoute_Filter_Mirror {
    const message = Object.create(
      createBaseMeshGatewayRoute_HttpRoute_Filter_Mirror(),
    ) as MeshGatewayRoute_HttpRoute_Filter_Mirror;
    message.backend = (object.backend !== undefined && object.backend !== null)
      ? MeshGatewayRoute_Backend.fromPartial(object.backend)
      : undefined;
    message.percentage = object.percentage ?? undefined;
    return message;
  },
};

function createBaseMeshGatewayRoute_HttpRoute_Filter_Redirect(): MeshGatewayRoute_HttpRoute_Filter_Redirect {
  return { scheme: "", hostname: "", port: 0, statusCode: 0 };
}

export const MeshGatewayRoute_HttpRoute_Filter_Redirect = {
  fromJSON(object: any): MeshGatewayRoute_HttpRoute_Filter_Redirect {
    return {
      scheme: isSet(object.scheme) ? String(object.scheme) : "",
      hostname: isSet(object.hostname) ? String(object.hostname) : "",
      port: isSet(object.port) ? Number(object.port) : 0,
      statusCode: isSet(object.statusCode) ? Number(object.statusCode) : 0,
    };
  },

  toJSON(message: MeshGatewayRoute_HttpRoute_Filter_Redirect): unknown {
    const obj: any = {};
    message.scheme !== undefined && (obj.scheme = message.scheme);
    message.hostname !== undefined && (obj.hostname = message.hostname);
    message.port !== undefined && (obj.port = Math.round(message.port));
    message.statusCode !== undefined && (obj.statusCode = Math.round(message.statusCode));
    return obj;
  },

  fromPartial(
    object: DeepPartial<MeshGatewayRoute_HttpRoute_Filter_Redirect>,
  ): MeshGatewayRoute_HttpRoute_Filter_Redirect {
    const message = Object.create(
      createBaseMeshGatewayRoute_HttpRoute_Filter_Redirect(),
    ) as MeshGatewayRoute_HttpRoute_Filter_Redirect;
    message.scheme = object.scheme ?? "";
    message.hostname = object.hostname ?? "";
    message.port = object.port ?? 0;
    message.statusCode = object.statusCode ?? 0;
    return message;
  },
};

function createBaseMeshGatewayRoute_HttpRoute_Filter_Rewrite(): MeshGatewayRoute_HttpRoute_Filter_Rewrite {
  return {};
}

export const MeshGatewayRoute_HttpRoute_Filter_Rewrite = {
  fromJSON(object: any): MeshGatewayRoute_HttpRoute_Filter_Rewrite {
    return {
      replaceFull: isSet(object.replaceFull) ? String(object.replaceFull) : undefined,
      replacePrefixMatch: isSet(object.replacePrefixMatch) ? String(object.replacePrefixMatch) : undefined,
    };
  },

  toJSON(message: MeshGatewayRoute_HttpRoute_Filter_Rewrite): unknown {
    const obj: any = {};
    message.replaceFull !== undefined && (obj.replaceFull = message.replaceFull);
    message.replacePrefixMatch !== undefined && (obj.replacePrefixMatch = message.replacePrefixMatch);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MeshGatewayRoute_HttpRoute_Filter_Rewrite>,
  ): MeshGatewayRoute_HttpRoute_Filter_Rewrite {
    const message = Object.create(
      createBaseMeshGatewayRoute_HttpRoute_Filter_Rewrite(),
    ) as MeshGatewayRoute_HttpRoute_Filter_Rewrite;
    message.replaceFull = object.replaceFull ?? undefined;
    message.replacePrefixMatch = object.replacePrefixMatch ?? undefined;
    return message;
  },
};

function createBaseMeshGatewayRoute_HttpRoute_Rule(): MeshGatewayRoute_HttpRoute_Rule {
  return { matches: [], filters: [], backends: [] };
}

export const MeshGatewayRoute_HttpRoute_Rule = {
  fromJSON(object: any): MeshGatewayRoute_HttpRoute_Rule {
    return {
      matches: Array.isArray(object?.matches)
        ? object.matches.map((e: any) => MeshGatewayRoute_HttpRoute_Match.fromJSON(e))
        : [],
      filters: Array.isArray(object?.filters)
        ? object.filters.map((e: any) => MeshGatewayRoute_HttpRoute_Filter.fromJSON(e))
        : [],
      backends: Array.isArray(object?.backends)
        ? object.backends.map((e: any) => MeshGatewayRoute_Backend.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MeshGatewayRoute_HttpRoute_Rule): unknown {
    const obj: any = {};
    if (message.matches) {
      obj.matches = message.matches.map((e) => e ? MeshGatewayRoute_HttpRoute_Match.toJSON(e) : undefined);
    } else {
      obj.matches = [];
    }
    if (message.filters) {
      obj.filters = message.filters.map((e) => e ? MeshGatewayRoute_HttpRoute_Filter.toJSON(e) : undefined);
    } else {
      obj.filters = [];
    }
    if (message.backends) {
      obj.backends = message.backends.map((e) => e ? MeshGatewayRoute_Backend.toJSON(e) : undefined);
    } else {
      obj.backends = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGatewayRoute_HttpRoute_Rule>): MeshGatewayRoute_HttpRoute_Rule {
    const message = Object.create(createBaseMeshGatewayRoute_HttpRoute_Rule()) as MeshGatewayRoute_HttpRoute_Rule;
    message.matches = object.matches?.map((e) => MeshGatewayRoute_HttpRoute_Match.fromPartial(e)) || [];
    message.filters = object.filters?.map((e) => MeshGatewayRoute_HttpRoute_Filter.fromPartial(e)) || [];
    message.backends = object.backends?.map((e) => MeshGatewayRoute_Backend.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMeshGatewayRoute_Conf(): MeshGatewayRoute_Conf {
  return {};
}

export const MeshGatewayRoute_Conf = {
  fromJSON(object: any): MeshGatewayRoute_Conf {
    return {
      tcp: isSet(object.tcp) ? MeshGatewayRoute_TcpRoute.fromJSON(object.tcp) : undefined,
      http: isSet(object.http) ? MeshGatewayRoute_HttpRoute.fromJSON(object.http) : undefined,
    };
  },

  toJSON(message: MeshGatewayRoute_Conf): unknown {
    const obj: any = {};
    message.tcp !== undefined && (obj.tcp = message.tcp ? MeshGatewayRoute_TcpRoute.toJSON(message.tcp) : undefined);
    message.http !== undefined &&
      (obj.http = message.http ? MeshGatewayRoute_HttpRoute.toJSON(message.http) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshGatewayRoute_Conf>): MeshGatewayRoute_Conf {
    const message = Object.create(createBaseMeshGatewayRoute_Conf()) as MeshGatewayRoute_Conf;
    message.tcp = (object.tcp !== undefined && object.tcp !== null)
      ? MeshGatewayRoute_TcpRoute.fromPartial(object.tcp)
      : undefined;
    message.http = (object.http !== undefined && object.http !== null)
      ? MeshGatewayRoute_HttpRoute.fromPartial(object.http)
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
