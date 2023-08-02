/* eslint-disable */
import { ZoneIngress } from "./zone_ingress";
import { ZoneIngressInsight } from "./zone_ingress_insight";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** ZoneIngressOverview defines the projected state of a ZoneIngress. */
export interface ZoneIngressOverview {
  zoneIngress: ZoneIngress | undefined;
  zoneIngressInsight: ZoneIngressInsight | undefined;
}

function createBaseZoneIngressOverview(): ZoneIngressOverview {
  return { zoneIngress: undefined, zoneIngressInsight: undefined };
}

export const ZoneIngressOverview = {
  fromJSON(object: any): ZoneIngressOverview {
    return {
      zoneIngress: isSet(object.zoneIngress) ? ZoneIngress.fromJSON(object.zoneIngress) : undefined,
      zoneIngressInsight: isSet(object.zoneIngressInsight)
        ? ZoneIngressInsight.fromJSON(object.zoneIngressInsight)
        : undefined,
    };
  },

  toJSON(message: ZoneIngressOverview): unknown {
    const obj: any = {};
    message.zoneIngress !== undefined &&
      (obj.zoneIngress = message.zoneIngress ? ZoneIngress.toJSON(message.zoneIngress) : undefined);
    message.zoneIngressInsight !== undefined && (obj.zoneIngressInsight = message.zoneIngressInsight
      ? ZoneIngressInsight.toJSON(message.zoneIngressInsight)
      : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ZoneIngressOverview>): ZoneIngressOverview {
    const message = Object.create(createBaseZoneIngressOverview()) as ZoneIngressOverview;
    message.zoneIngress = (object.zoneIngress !== undefined && object.zoneIngress !== null)
      ? ZoneIngress.fromPartial(object.zoneIngress)
      : undefined;
    message.zoneIngressInsight = (object.zoneIngressInsight !== undefined && object.zoneIngressInsight !== null)
      ? ZoneIngressInsight.fromPartial(object.zoneIngressInsight)
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
