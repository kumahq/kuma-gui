/* eslint-disable */

export const protobufPackage = "kuma.mesh.v1alpha1";

/** MeshInsight defines the observed state of a Mesh. */
export interface MeshInsight {
  dataplanes: MeshInsight_DataplaneStat | undefined;
  policies: { [key: string]: MeshInsight_PolicyStat };
  dpVersions:
    | MeshInsight_DpVersions
    | undefined;
  /** mTLS statistics */
  mTLS: MeshInsight_MTLS | undefined;
  services: MeshInsight_ServiceStat | undefined;
  dataplanesByType: MeshInsight_DataplanesByType | undefined;
}

/** DataplaneStat defines statistic specifically for Dataplane */
export interface MeshInsight_DataplaneStat {
  total: number;
  online: number;
  offline: number;
  partiallyDegraded: number;
}

/** PolicyStat defines statistic for all policies in general */
export interface MeshInsight_PolicyStat {
  total: number;
}

export interface MeshInsight_PoliciesEntry {
  key: string;
  value: MeshInsight_PolicyStat | undefined;
}

/** DpVersions defines statistics grouped by dataplane versions */
export interface MeshInsight_DpVersions {
  /** Dataplane stats grouped by KumaDP version */
  kumaDp: { [key: string]: MeshInsight_DataplaneStat };
  /** Dataplane stats grouped by Envoy version */
  envoy: { [key: string]: MeshInsight_DataplaneStat };
}

export interface MeshInsight_DpVersions_KumaDpEntry {
  key: string;
  value: MeshInsight_DataplaneStat | undefined;
}

export interface MeshInsight_DpVersions_EnvoyEntry {
  key: string;
  value: MeshInsight_DataplaneStat | undefined;
}

export interface MeshInsight_MTLS {
  /** Dataplanes grouped by issued backends. */
  issuedBackends: { [key: string]: MeshInsight_DataplaneStat };
  /** Dataplanes grouped by supported backends. */
  supportedBackends: { [key: string]: MeshInsight_DataplaneStat };
}

export interface MeshInsight_MTLS_IssuedBackendsEntry {
  key: string;
  value: MeshInsight_DataplaneStat | undefined;
}

export interface MeshInsight_MTLS_SupportedBackendsEntry {
  key: string;
  value: MeshInsight_DataplaneStat | undefined;
}

/** ServiceStat defines statistics of mesh services */
export interface MeshInsight_ServiceStat {
  total: number;
  internal: number;
  external: number;
}

/** DataplanesByType defines statistics splitted by dataplane types */
export interface MeshInsight_DataplanesByType {
  standard: MeshInsight_DataplaneStat | undefined;
  gateway: MeshInsight_DataplaneStat | undefined;
}

function createBaseMeshInsight(): MeshInsight {
  return {
    dataplanes: undefined,
    policies: {},
    dpVersions: undefined,
    mTLS: undefined,
    services: undefined,
    dataplanesByType: undefined,
  };
}

export const MeshInsight = {
  fromJSON(object: any): MeshInsight {
    return {
      dataplanes: isSet(object.dataplanes) ? MeshInsight_DataplaneStat.fromJSON(object.dataplanes) : undefined,
      policies: isObject(object.policies)
        ? Object.entries(object.policies).reduce<{ [key: string]: MeshInsight_PolicyStat }>((acc, [key, value]) => {
          acc[key] = MeshInsight_PolicyStat.fromJSON(value);
          return acc;
        }, {})
        : {},
      dpVersions: isSet(object.dpVersions) ? MeshInsight_DpVersions.fromJSON(object.dpVersions) : undefined,
      mTLS: isSet(object.mTLS) ? MeshInsight_MTLS.fromJSON(object.mTLS) : undefined,
      services: isSet(object.services) ? MeshInsight_ServiceStat.fromJSON(object.services) : undefined,
      dataplanesByType: isSet(object.dataplanesByType)
        ? MeshInsight_DataplanesByType.fromJSON(object.dataplanesByType)
        : undefined,
    };
  },

  toJSON(message: MeshInsight): unknown {
    const obj: any = {};
    message.dataplanes !== undefined &&
      (obj.dataplanes = message.dataplanes ? MeshInsight_DataplaneStat.toJSON(message.dataplanes) : undefined);
    obj.policies = {};
    if (message.policies) {
      Object.entries(message.policies).forEach(([k, v]) => {
        obj.policies[k] = MeshInsight_PolicyStat.toJSON(v);
      });
    }
    message.dpVersions !== undefined &&
      (obj.dpVersions = message.dpVersions ? MeshInsight_DpVersions.toJSON(message.dpVersions) : undefined);
    message.mTLS !== undefined && (obj.mTLS = message.mTLS ? MeshInsight_MTLS.toJSON(message.mTLS) : undefined);
    message.services !== undefined &&
      (obj.services = message.services ? MeshInsight_ServiceStat.toJSON(message.services) : undefined);
    message.dataplanesByType !== undefined && (obj.dataplanesByType = message.dataplanesByType
      ? MeshInsight_DataplanesByType.toJSON(message.dataplanesByType)
      : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshInsight>): MeshInsight {
    const message = Object.create(createBaseMeshInsight()) as MeshInsight;
    message.dataplanes = (object.dataplanes !== undefined && object.dataplanes !== null)
      ? MeshInsight_DataplaneStat.fromPartial(object.dataplanes)
      : undefined;
    message.policies = Object.entries(object.policies ?? {}).reduce<{ [key: string]: MeshInsight_PolicyStat }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = MeshInsight_PolicyStat.fromPartial(value);
        }
        return acc;
      },
      {},
    );
    message.dpVersions = (object.dpVersions !== undefined && object.dpVersions !== null)
      ? MeshInsight_DpVersions.fromPartial(object.dpVersions)
      : undefined;
    message.mTLS = (object.mTLS !== undefined && object.mTLS !== null)
      ? MeshInsight_MTLS.fromPartial(object.mTLS)
      : undefined;
    message.services = (object.services !== undefined && object.services !== null)
      ? MeshInsight_ServiceStat.fromPartial(object.services)
      : undefined;
    message.dataplanesByType = (object.dataplanesByType !== undefined && object.dataplanesByType !== null)
      ? MeshInsight_DataplanesByType.fromPartial(object.dataplanesByType)
      : undefined;
    return message;
  },
};

function createBaseMeshInsight_DataplaneStat(): MeshInsight_DataplaneStat {
  return { total: 0, online: 0, offline: 0, partiallyDegraded: 0 };
}

export const MeshInsight_DataplaneStat = {
  fromJSON(object: any): MeshInsight_DataplaneStat {
    return {
      total: isSet(object.total) ? Number(object.total) : 0,
      online: isSet(object.online) ? Number(object.online) : 0,
      offline: isSet(object.offline) ? Number(object.offline) : 0,
      partiallyDegraded: isSet(object.partiallyDegraded) ? Number(object.partiallyDegraded) : 0,
    };
  },

  toJSON(message: MeshInsight_DataplaneStat): unknown {
    const obj: any = {};
    message.total !== undefined && (obj.total = Math.round(message.total));
    message.online !== undefined && (obj.online = Math.round(message.online));
    message.offline !== undefined && (obj.offline = Math.round(message.offline));
    message.partiallyDegraded !== undefined && (obj.partiallyDegraded = Math.round(message.partiallyDegraded));
    return obj;
  },

  fromPartial(object: DeepPartial<MeshInsight_DataplaneStat>): MeshInsight_DataplaneStat {
    const message = Object.create(createBaseMeshInsight_DataplaneStat()) as MeshInsight_DataplaneStat;
    message.total = object.total ?? 0;
    message.online = object.online ?? 0;
    message.offline = object.offline ?? 0;
    message.partiallyDegraded = object.partiallyDegraded ?? 0;
    return message;
  },
};

function createBaseMeshInsight_PolicyStat(): MeshInsight_PolicyStat {
  return { total: 0 };
}

export const MeshInsight_PolicyStat = {
  fromJSON(object: any): MeshInsight_PolicyStat {
    return { total: isSet(object.total) ? Number(object.total) : 0 };
  },

  toJSON(message: MeshInsight_PolicyStat): unknown {
    const obj: any = {};
    message.total !== undefined && (obj.total = Math.round(message.total));
    return obj;
  },

  fromPartial(object: DeepPartial<MeshInsight_PolicyStat>): MeshInsight_PolicyStat {
    const message = Object.create(createBaseMeshInsight_PolicyStat()) as MeshInsight_PolicyStat;
    message.total = object.total ?? 0;
    return message;
  },
};

function createBaseMeshInsight_PoliciesEntry(): MeshInsight_PoliciesEntry {
  return { key: "", value: undefined };
}

export const MeshInsight_PoliciesEntry = {
  fromJSON(object: any): MeshInsight_PoliciesEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? MeshInsight_PolicyStat.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: MeshInsight_PoliciesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? MeshInsight_PolicyStat.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshInsight_PoliciesEntry>): MeshInsight_PoliciesEntry {
    const message = Object.create(createBaseMeshInsight_PoliciesEntry()) as MeshInsight_PoliciesEntry;
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? MeshInsight_PolicyStat.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseMeshInsight_DpVersions(): MeshInsight_DpVersions {
  return { kumaDp: {}, envoy: {} };
}

export const MeshInsight_DpVersions = {
  fromJSON(object: any): MeshInsight_DpVersions {
    return {
      kumaDp: isObject(object.kumaDp)
        ? Object.entries(object.kumaDp).reduce<{ [key: string]: MeshInsight_DataplaneStat }>((acc, [key, value]) => {
          acc[key] = MeshInsight_DataplaneStat.fromJSON(value);
          return acc;
        }, {})
        : {},
      envoy: isObject(object.envoy)
        ? Object.entries(object.envoy).reduce<{ [key: string]: MeshInsight_DataplaneStat }>((acc, [key, value]) => {
          acc[key] = MeshInsight_DataplaneStat.fromJSON(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: MeshInsight_DpVersions): unknown {
    const obj: any = {};
    obj.kumaDp = {};
    if (message.kumaDp) {
      Object.entries(message.kumaDp).forEach(([k, v]) => {
        obj.kumaDp[k] = MeshInsight_DataplaneStat.toJSON(v);
      });
    }
    obj.envoy = {};
    if (message.envoy) {
      Object.entries(message.envoy).forEach(([k, v]) => {
        obj.envoy[k] = MeshInsight_DataplaneStat.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<MeshInsight_DpVersions>): MeshInsight_DpVersions {
    const message = Object.create(createBaseMeshInsight_DpVersions()) as MeshInsight_DpVersions;
    message.kumaDp = Object.entries(object.kumaDp ?? {}).reduce<{ [key: string]: MeshInsight_DataplaneStat }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = MeshInsight_DataplaneStat.fromPartial(value);
        }
        return acc;
      },
      {},
    );
    message.envoy = Object.entries(object.envoy ?? {}).reduce<{ [key: string]: MeshInsight_DataplaneStat }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = MeshInsight_DataplaneStat.fromPartial(value);
        }
        return acc;
      },
      {},
    );
    return message;
  },
};

function createBaseMeshInsight_DpVersions_KumaDpEntry(): MeshInsight_DpVersions_KumaDpEntry {
  return { key: "", value: undefined };
}

export const MeshInsight_DpVersions_KumaDpEntry = {
  fromJSON(object: any): MeshInsight_DpVersions_KumaDpEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? MeshInsight_DataplaneStat.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: MeshInsight_DpVersions_KumaDpEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? MeshInsight_DataplaneStat.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshInsight_DpVersions_KumaDpEntry>): MeshInsight_DpVersions_KumaDpEntry {
    const message = Object.create(createBaseMeshInsight_DpVersions_KumaDpEntry()) as MeshInsight_DpVersions_KumaDpEntry;
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? MeshInsight_DataplaneStat.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseMeshInsight_DpVersions_EnvoyEntry(): MeshInsight_DpVersions_EnvoyEntry {
  return { key: "", value: undefined };
}

export const MeshInsight_DpVersions_EnvoyEntry = {
  fromJSON(object: any): MeshInsight_DpVersions_EnvoyEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? MeshInsight_DataplaneStat.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: MeshInsight_DpVersions_EnvoyEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? MeshInsight_DataplaneStat.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshInsight_DpVersions_EnvoyEntry>): MeshInsight_DpVersions_EnvoyEntry {
    const message = Object.create(createBaseMeshInsight_DpVersions_EnvoyEntry()) as MeshInsight_DpVersions_EnvoyEntry;
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? MeshInsight_DataplaneStat.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseMeshInsight_MTLS(): MeshInsight_MTLS {
  return { issuedBackends: {}, supportedBackends: {} };
}

export const MeshInsight_MTLS = {
  fromJSON(object: any): MeshInsight_MTLS {
    return {
      issuedBackends: isObject(object.issuedBackends)
        ? Object.entries(object.issuedBackends).reduce<{ [key: string]: MeshInsight_DataplaneStat }>(
          (acc, [key, value]) => {
            acc[key] = MeshInsight_DataplaneStat.fromJSON(value);
            return acc;
          },
          {},
        )
        : {},
      supportedBackends: isObject(object.supportedBackends)
        ? Object.entries(object.supportedBackends).reduce<{ [key: string]: MeshInsight_DataplaneStat }>(
          (acc, [key, value]) => {
            acc[key] = MeshInsight_DataplaneStat.fromJSON(value);
            return acc;
          },
          {},
        )
        : {},
    };
  },

  toJSON(message: MeshInsight_MTLS): unknown {
    const obj: any = {};
    obj.issuedBackends = {};
    if (message.issuedBackends) {
      Object.entries(message.issuedBackends).forEach(([k, v]) => {
        obj.issuedBackends[k] = MeshInsight_DataplaneStat.toJSON(v);
      });
    }
    obj.supportedBackends = {};
    if (message.supportedBackends) {
      Object.entries(message.supportedBackends).forEach(([k, v]) => {
        obj.supportedBackends[k] = MeshInsight_DataplaneStat.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<MeshInsight_MTLS>): MeshInsight_MTLS {
    const message = Object.create(createBaseMeshInsight_MTLS()) as MeshInsight_MTLS;
    message.issuedBackends = Object.entries(object.issuedBackends ?? {}).reduce<
      { [key: string]: MeshInsight_DataplaneStat }
    >((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = MeshInsight_DataplaneStat.fromPartial(value);
      }
      return acc;
    }, {});
    message.supportedBackends = Object.entries(object.supportedBackends ?? {}).reduce<
      { [key: string]: MeshInsight_DataplaneStat }
    >((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = MeshInsight_DataplaneStat.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseMeshInsight_MTLS_IssuedBackendsEntry(): MeshInsight_MTLS_IssuedBackendsEntry {
  return { key: "", value: undefined };
}

export const MeshInsight_MTLS_IssuedBackendsEntry = {
  fromJSON(object: any): MeshInsight_MTLS_IssuedBackendsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? MeshInsight_DataplaneStat.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: MeshInsight_MTLS_IssuedBackendsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? MeshInsight_DataplaneStat.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshInsight_MTLS_IssuedBackendsEntry>): MeshInsight_MTLS_IssuedBackendsEntry {
    const message = Object.create(
      createBaseMeshInsight_MTLS_IssuedBackendsEntry(),
    ) as MeshInsight_MTLS_IssuedBackendsEntry;
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? MeshInsight_DataplaneStat.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseMeshInsight_MTLS_SupportedBackendsEntry(): MeshInsight_MTLS_SupportedBackendsEntry {
  return { key: "", value: undefined };
}

export const MeshInsight_MTLS_SupportedBackendsEntry = {
  fromJSON(object: any): MeshInsight_MTLS_SupportedBackendsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? MeshInsight_DataplaneStat.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: MeshInsight_MTLS_SupportedBackendsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? MeshInsight_DataplaneStat.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshInsight_MTLS_SupportedBackendsEntry>): MeshInsight_MTLS_SupportedBackendsEntry {
    const message = Object.create(
      createBaseMeshInsight_MTLS_SupportedBackendsEntry(),
    ) as MeshInsight_MTLS_SupportedBackendsEntry;
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? MeshInsight_DataplaneStat.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseMeshInsight_ServiceStat(): MeshInsight_ServiceStat {
  return { total: 0, internal: 0, external: 0 };
}

export const MeshInsight_ServiceStat = {
  fromJSON(object: any): MeshInsight_ServiceStat {
    return {
      total: isSet(object.total) ? Number(object.total) : 0,
      internal: isSet(object.internal) ? Number(object.internal) : 0,
      external: isSet(object.external) ? Number(object.external) : 0,
    };
  },

  toJSON(message: MeshInsight_ServiceStat): unknown {
    const obj: any = {};
    message.total !== undefined && (obj.total = Math.round(message.total));
    message.internal !== undefined && (obj.internal = Math.round(message.internal));
    message.external !== undefined && (obj.external = Math.round(message.external));
    return obj;
  },

  fromPartial(object: DeepPartial<MeshInsight_ServiceStat>): MeshInsight_ServiceStat {
    const message = Object.create(createBaseMeshInsight_ServiceStat()) as MeshInsight_ServiceStat;
    message.total = object.total ?? 0;
    message.internal = object.internal ?? 0;
    message.external = object.external ?? 0;
    return message;
  },
};

function createBaseMeshInsight_DataplanesByType(): MeshInsight_DataplanesByType {
  return { standard: undefined, gateway: undefined };
}

export const MeshInsight_DataplanesByType = {
  fromJSON(object: any): MeshInsight_DataplanesByType {
    return {
      standard: isSet(object.standard) ? MeshInsight_DataplaneStat.fromJSON(object.standard) : undefined,
      gateway: isSet(object.gateway) ? MeshInsight_DataplaneStat.fromJSON(object.gateway) : undefined,
    };
  },

  toJSON(message: MeshInsight_DataplanesByType): unknown {
    const obj: any = {};
    message.standard !== undefined &&
      (obj.standard = message.standard ? MeshInsight_DataplaneStat.toJSON(message.standard) : undefined);
    message.gateway !== undefined &&
      (obj.gateway = message.gateway ? MeshInsight_DataplaneStat.toJSON(message.gateway) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MeshInsight_DataplanesByType>): MeshInsight_DataplanesByType {
    const message = Object.create(createBaseMeshInsight_DataplanesByType()) as MeshInsight_DataplanesByType;
    message.standard = (object.standard !== undefined && object.standard !== null)
      ? MeshInsight_DataplaneStat.fromPartial(object.standard)
      : undefined;
    message.gateway = (object.gateway !== undefined && object.gateway !== null)
      ? MeshInsight_DataplaneStat.fromPartial(object.gateway)
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
