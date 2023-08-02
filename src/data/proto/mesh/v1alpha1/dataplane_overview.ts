/* eslint-disable */
import { Dataplane } from "./dataplane";
import { DataplaneInsight } from "./dataplane_insight";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** DataplaneOverview defines the projected state of a Dataplane. */
export interface DataplaneOverview {
  dataplane: Dataplane | undefined;
  dataplaneInsight: DataplaneInsight | undefined;
}

function createBaseDataplaneOverview(): DataplaneOverview {
  return { dataplane: undefined, dataplaneInsight: undefined };
}

export const DataplaneOverview = {
  fromJSON(object: any): DataplaneOverview {
    return {
      dataplane: isSet(object.dataplane) ? Dataplane.fromJSON(object.dataplane) : undefined,
      dataplaneInsight: isSet(object.dataplaneInsight) ? DataplaneInsight.fromJSON(object.dataplaneInsight) : undefined,
    };
  },

  toJSON(message: DataplaneOverview): unknown {
    const obj: any = {};
    message.dataplane !== undefined &&
      (obj.dataplane = message.dataplane ? Dataplane.toJSON(message.dataplane) : undefined);
    message.dataplaneInsight !== undefined &&
      (obj.dataplaneInsight = message.dataplaneInsight ? DataplaneInsight.toJSON(message.dataplaneInsight) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<DataplaneOverview>): DataplaneOverview {
    const message = Object.create(createBaseDataplaneOverview()) as DataplaneOverview;
    message.dataplane = (object.dataplane !== undefined && object.dataplane !== null)
      ? Dataplane.fromPartial(object.dataplane)
      : undefined;
    message.dataplaneInsight = (object.dataplaneInsight !== undefined && object.dataplaneInsight !== null)
      ? DataplaneInsight.fromPartial(object.dataplaneInsight)
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
