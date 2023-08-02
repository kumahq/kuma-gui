/* eslint-disable */
import { Duration } from "../../../../google/protobuf/duration";

export const protobufPackage = "envoy.api.v2.core";

/** Configuration defining a jittered exponential back off strategy. */
export interface BackoffStrategy {
  /**
   * The base interval to be used for the next back off computation. It should
   * be greater than zero and less than or equal to :ref:`max_interval
   * <envoy_api_field_core.BackoffStrategy.max_interval>`.
   */
  baseInterval:
    | Duration
    | undefined;
  /**
   * Specifies the maximum interval between retries. This parameter is optional,
   * but must be greater than or equal to the :ref:`base_interval
   * <envoy_api_field_core.BackoffStrategy.base_interval>` if set. The default
   * is 10 times the :ref:`base_interval
   * <envoy_api_field_core.BackoffStrategy.base_interval>`.
   */
  maxInterval: Duration | undefined;
}

function createBaseBackoffStrategy(): BackoffStrategy {
  return { baseInterval: undefined, maxInterval: undefined };
}

export const BackoffStrategy = {
  fromJSON(object: any): BackoffStrategy {
    return {
      baseInterval: isSet(object.baseInterval) ? Duration.fromJSON(object.baseInterval) : undefined,
      maxInterval: isSet(object.maxInterval) ? Duration.fromJSON(object.maxInterval) : undefined,
    };
  },

  toJSON(message: BackoffStrategy): unknown {
    const obj: any = {};
    message.baseInterval !== undefined &&
      (obj.baseInterval = message.baseInterval ? Duration.toJSON(message.baseInterval) : undefined);
    message.maxInterval !== undefined &&
      (obj.maxInterval = message.maxInterval ? Duration.toJSON(message.maxInterval) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<BackoffStrategy>): BackoffStrategy {
    const message = Object.create(createBaseBackoffStrategy()) as BackoffStrategy;
    message.baseInterval = (object.baseInterval !== undefined && object.baseInterval !== null)
      ? Duration.fromPartial(object.baseInterval)
      : undefined;
    message.maxInterval = (object.maxInterval !== undefined && object.maxInterval !== null)
      ? Duration.fromPartial(object.maxInterval)
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
