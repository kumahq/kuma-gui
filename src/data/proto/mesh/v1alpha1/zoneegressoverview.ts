/* eslint-disable */
import { ZoneEgress } from "./zoneegress";
import { ZoneEgressInsight } from "./zoneegressinsight";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** ZoneEgressOverview defines the projected state of a ZoneEgress. */
export interface ZoneEgressOverview {
  zoneEgress: ZoneEgress | undefined;
  zoneEgressInsight: ZoneEgressInsight | undefined;
}

function createBaseZoneEgressOverview(): ZoneEgressOverview {
  return { zoneEgress: undefined, zoneEgressInsight: undefined };
}

export const ZoneEgressOverview = {
  fromJSON(object: any): ZoneEgressOverview {
    return {
      zoneEgress: isSet(object.zoneEgress) ? ZoneEgress.fromJSON(object.zoneEgress) : undefined,
      zoneEgressInsight: isSet(object.zoneEgressInsight)
        ? ZoneEgressInsight.fromJSON(object.zoneEgressInsight)
        : undefined,
    };
  },

  toJSON(message: ZoneEgressOverview): unknown {
    const obj: any = {};
    message.zoneEgress !== undefined &&
      (obj.zoneEgress = message.zoneEgress ? ZoneEgress.toJSON(message.zoneEgress) : undefined);
    message.zoneEgressInsight !== undefined && (obj.zoneEgressInsight = message.zoneEgressInsight
      ? ZoneEgressInsight.toJSON(message.zoneEgressInsight)
      : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ZoneEgressOverview>): ZoneEgressOverview {
    const message = Object.create(createBaseZoneEgressOverview()) as ZoneEgressOverview;
    message.zoneEgress = (object.zoneEgress !== undefined && object.zoneEgress !== null)
      ? ZoneEgress.fromPartial(object.zoneEgress)
      : undefined;
    message.zoneEgressInsight = (object.zoneEgressInsight !== undefined && object.zoneEgressInsight !== null)
      ? ZoneEgressInsight.fromPartial(object.zoneEgressInsight)
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
