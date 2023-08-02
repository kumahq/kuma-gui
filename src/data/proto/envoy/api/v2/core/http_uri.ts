/* eslint-disable */
import { Duration } from "../../../../google/protobuf/duration";

export const protobufPackage = "envoy.api.v2.core";

/** Envoy external URI descriptor */
export interface HttpUri {
  /**
   * The HTTP server URI. It should be a full FQDN with protocol, host and path.
   *
   * Example:
   *
   * .. code-block:: yaml
   *
   *    uri: https://www.googleapis.com/oauth2/v1/certs
   */
  uri: string;
  /**
   * A cluster is created in the Envoy "cluster_manager" config
   * section. This field specifies the cluster name.
   *
   * Example:
   *
   * .. code-block:: yaml
   *
   *    cluster: jwks_cluster
   */
  cluster?:
    | string
    | undefined;
  /** Sets the maximum duration in milliseconds that a response can take to arrive upon request. */
  timeout: Duration | undefined;
}

function createBaseHttpUri(): HttpUri {
  return { uri: "", timeout: undefined };
}

export const HttpUri = {
  fromJSON(object: any): HttpUri {
    return {
      uri: isSet(object.uri) ? String(object.uri) : "",
      cluster: isSet(object.cluster) ? String(object.cluster) : undefined,
      timeout: isSet(object.timeout) ? Duration.fromJSON(object.timeout) : undefined,
    };
  },

  toJSON(message: HttpUri): unknown {
    const obj: any = {};
    message.uri !== undefined && (obj.uri = message.uri);
    message.cluster !== undefined && (obj.cluster = message.cluster);
    message.timeout !== undefined && (obj.timeout = message.timeout ? Duration.toJSON(message.timeout) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<HttpUri>): HttpUri {
    const message = Object.create(createBaseHttpUri()) as HttpUri;
    message.uri = object.uri ?? "";
    message.cluster = object.cluster ?? undefined;
    message.timeout = (object.timeout !== undefined && object.timeout !== null)
      ? Duration.fromPartial(object.timeout)
      : undefined;
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
