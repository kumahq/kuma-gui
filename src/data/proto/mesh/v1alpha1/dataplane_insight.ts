/* eslint-disable */
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** DataplaneInsight defines the observed state of a Dataplane. */
export interface DataplaneInsight {
  /** List of ADS subscriptions created by a given Dataplane. */
  subscriptions: DiscoverySubscription[];
  /** Insights about mTLS for Dataplane. */
  mTLS: DataplaneInsight_MTLS | undefined;
}

/** MTLS defines insights for mTLS */
export interface DataplaneInsight_MTLS {
  /**
   * Expiration time of the last certificate that was generated for a
   * Dataplane.
   */
  certificateExpirationTime:
    | Date
    | undefined;
  /** Time on which the last certificate was generated. */
  lastCertificateRegeneration:
    | Date
    | undefined;
  /** Number of certificate regenerations for a Dataplane. */
  certificateRegenerations: number;
  /** Backend that was used to generate current certificate */
  issuedBackend: string;
  /** Supported backends (CA). */
  supportedBackends: string[];
}

/**
 * DiscoverySubscription describes a single ADS subscription
 * created by a Dataplane to the Control Plane.
 * Ideally, there should be only one such subscription per Dataplane lifecycle.
 * Presence of multiple subscriptions might indicate one of the following
 * events:
 * - transient loss of network connection between Dataplane and Control Plane
 * - Dataplane restart (i.e. hot restart or crash)
 * - Control Plane restart (i.e. rolling update or crash)
 * - etc
 */
export interface DiscoverySubscription {
  /** Unique id per ADS subscription. */
  id: string;
  /** Control Plane instance that handled given subscription. */
  controlPlaneInstanceId: string;
  /** Time when a given Dataplane connected to the Control Plane. */
  connectTime:
    | Date
    | undefined;
  /** Time when a given Dataplane disconnected from the Control Plane. */
  disconnectTime:
    | Date
    | undefined;
  /** Status of the ADS subscription. */
  status:
    | DiscoverySubscriptionStatus
    | undefined;
  /** Version of Envoy and Kuma dataplane */
  version:
    | Version
    | undefined;
  /**
   * Generation is an integer number which is periodically increased by the
   * status sink
   */
  generation: number;
}

/** DiscoverySubscriptionStatus defines status of an ADS subscription. */
export interface DiscoverySubscriptionStatus {
  /** Time when status of a given ADS subscription was most recently updated. */
  lastUpdateTime:
    | Date
    | undefined;
  /** Total defines an aggregate over individual xDS stats. */
  total:
    | DiscoveryServiceStats
    | undefined;
  /** CDS defines all CDS stats. */
  cds:
    | DiscoveryServiceStats
    | undefined;
  /** EDS defines all EDS stats. */
  eds:
    | DiscoveryServiceStats
    | undefined;
  /** LDS defines all LDS stats. */
  lds:
    | DiscoveryServiceStats
    | undefined;
  /** RDS defines all RDS stats. */
  rds: DiscoveryServiceStats | undefined;
}

/** DiscoveryServiceStats defines all stats over a single xDS service. */
export interface DiscoveryServiceStats {
  /** Number of xDS responses sent to the Dataplane. */
  responsesSent: number;
  /** Number of xDS responses ACKed by the Dataplane. */
  responsesAcknowledged: number;
  /** Number of xDS responses NACKed by the Dataplane. */
  responsesRejected: number;
}

/** Version defines version of Kuma Dataplane and Envoy */
export interface Version {
  /** Version of Kuma Dataplane */
  kumaDp:
    | KumaDpVersion
    | undefined;
  /** Version of Envoy */
  envoy:
    | EnvoyVersion
    | undefined;
  /** Versions of other dependencies, i.e. CoreDNS */
  dependencies: { [key: string]: string };
}

export interface Version_DependenciesEntry {
  key: string;
  value: string;
}

/** KumaDpVersion describes details of Kuma Dataplane version */
export interface KumaDpVersion {
  /** Version number of Kuma Dataplane */
  version: string;
  /** Git tag of Kuma Dataplane version */
  gitTag: string;
  /** Git commit of Kuma Dataplane version */
  gitCommit: string;
  /** Build date of Kuma Dataplane version */
  buildDate: string;
  /** True iff Kuma DP version is compatible with Kuma CP version */
  kumaCpCompatible: boolean;
}

/** EnvoyVersion describes details of Envoy version */
export interface EnvoyVersion {
  /** Version number of Envoy */
  version: string;
  /** Full build tag of Envoy version */
  build: string;
  /** True iff Envoy version is compatible with Kuma DP version */
  kumaDpCompatible: boolean;
}

function createBaseDataplaneInsight(): DataplaneInsight {
  return { subscriptions: [], mTLS: undefined };
}

export const DataplaneInsight = {
  fromJSON(object: any): DataplaneInsight {
    return {
      subscriptions: Array.isArray(object?.subscriptions)
        ? object.subscriptions.map((e: any) => DiscoverySubscription.fromJSON(e))
        : [],
      mTLS: isSet(object.mTLS) ? DataplaneInsight_MTLS.fromJSON(object.mTLS) : undefined,
    };
  },

  toJSON(message: DataplaneInsight): unknown {
    const obj: any = {};
    if (message.subscriptions) {
      obj.subscriptions = message.subscriptions.map((e) => e ? DiscoverySubscription.toJSON(e) : undefined);
    } else {
      obj.subscriptions = [];
    }
    message.mTLS !== undefined && (obj.mTLS = message.mTLS ? DataplaneInsight_MTLS.toJSON(message.mTLS) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<DataplaneInsight>): DataplaneInsight {
    const message = Object.create(createBaseDataplaneInsight()) as DataplaneInsight;
    message.subscriptions = object.subscriptions?.map((e) => DiscoverySubscription.fromPartial(e)) || [];
    message.mTLS = (object.mTLS !== undefined && object.mTLS !== null)
      ? DataplaneInsight_MTLS.fromPartial(object.mTLS)
      : undefined;
    return message;
  },
};

function createBaseDataplaneInsight_MTLS(): DataplaneInsight_MTLS {
  return {
    certificateExpirationTime: undefined,
    lastCertificateRegeneration: undefined,
    certificateRegenerations: 0,
    issuedBackend: "",
    supportedBackends: [],
  };
}

export const DataplaneInsight_MTLS = {
  fromJSON(object: any): DataplaneInsight_MTLS {
    return {
      certificateExpirationTime: isSet(object.certificateExpirationTime)
        ? fromJsonTimestamp(object.certificateExpirationTime)
        : undefined,
      lastCertificateRegeneration: isSet(object.lastCertificateRegeneration)
        ? fromJsonTimestamp(object.lastCertificateRegeneration)
        : undefined,
      certificateRegenerations: isSet(object.certificateRegenerations) ? Number(object.certificateRegenerations) : 0,
      issuedBackend: isSet(object.issuedBackend) ? String(object.issuedBackend) : "",
      supportedBackends: Array.isArray(object?.supportedBackends)
        ? object.supportedBackends.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: DataplaneInsight_MTLS): unknown {
    const obj: any = {};
    message.certificateExpirationTime !== undefined &&
      (obj.certificateExpirationTime = message.certificateExpirationTime.toISOString());
    message.lastCertificateRegeneration !== undefined &&
      (obj.lastCertificateRegeneration = message.lastCertificateRegeneration.toISOString());
    message.certificateRegenerations !== undefined &&
      (obj.certificateRegenerations = Math.round(message.certificateRegenerations));
    message.issuedBackend !== undefined && (obj.issuedBackend = message.issuedBackend);
    if (message.supportedBackends) {
      obj.supportedBackends = message.supportedBackends.map((e) => e);
    } else {
      obj.supportedBackends = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<DataplaneInsight_MTLS>): DataplaneInsight_MTLS {
    const message = Object.create(createBaseDataplaneInsight_MTLS()) as DataplaneInsight_MTLS;
    message.certificateExpirationTime = object.certificateExpirationTime ?? undefined;
    message.lastCertificateRegeneration = object.lastCertificateRegeneration ?? undefined;
    message.certificateRegenerations = object.certificateRegenerations ?? 0;
    message.issuedBackend = object.issuedBackend ?? "";
    message.supportedBackends = object.supportedBackends?.map((e) => e) || [];
    return message;
  },
};

function createBaseDiscoverySubscription(): DiscoverySubscription {
  return {
    id: "",
    controlPlaneInstanceId: "",
    connectTime: undefined,
    disconnectTime: undefined,
    status: undefined,
    version: undefined,
    generation: 0,
  };
}

export const DiscoverySubscription = {
  fromJSON(object: any): DiscoverySubscription {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      controlPlaneInstanceId: isSet(object.controlPlaneInstanceId) ? String(object.controlPlaneInstanceId) : "",
      connectTime: isSet(object.connectTime) ? fromJsonTimestamp(object.connectTime) : undefined,
      disconnectTime: isSet(object.disconnectTime) ? fromJsonTimestamp(object.disconnectTime) : undefined,
      status: isSet(object.status) ? DiscoverySubscriptionStatus.fromJSON(object.status) : undefined,
      version: isSet(object.version) ? Version.fromJSON(object.version) : undefined,
      generation: isSet(object.generation) ? Number(object.generation) : 0,
    };
  },

  toJSON(message: DiscoverySubscription): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.controlPlaneInstanceId !== undefined && (obj.controlPlaneInstanceId = message.controlPlaneInstanceId);
    message.connectTime !== undefined && (obj.connectTime = message.connectTime.toISOString());
    message.disconnectTime !== undefined && (obj.disconnectTime = message.disconnectTime.toISOString());
    message.status !== undefined &&
      (obj.status = message.status ? DiscoverySubscriptionStatus.toJSON(message.status) : undefined);
    message.version !== undefined && (obj.version = message.version ? Version.toJSON(message.version) : undefined);
    message.generation !== undefined && (obj.generation = Math.round(message.generation));
    return obj;
  },

  fromPartial(object: DeepPartial<DiscoverySubscription>): DiscoverySubscription {
    const message = Object.create(createBaseDiscoverySubscription()) as DiscoverySubscription;
    message.id = object.id ?? "";
    message.controlPlaneInstanceId = object.controlPlaneInstanceId ?? "";
    message.connectTime = object.connectTime ?? undefined;
    message.disconnectTime = object.disconnectTime ?? undefined;
    message.status = (object.status !== undefined && object.status !== null)
      ? DiscoverySubscriptionStatus.fromPartial(object.status)
      : undefined;
    message.version = (object.version !== undefined && object.version !== null)
      ? Version.fromPartial(object.version)
      : undefined;
    message.generation = object.generation ?? 0;
    return message;
  },
};

function createBaseDiscoverySubscriptionStatus(): DiscoverySubscriptionStatus {
  return {
    lastUpdateTime: undefined,
    total: undefined,
    cds: undefined,
    eds: undefined,
    lds: undefined,
    rds: undefined,
  };
}

export const DiscoverySubscriptionStatus = {
  fromJSON(object: any): DiscoverySubscriptionStatus {
    return {
      lastUpdateTime: isSet(object.lastUpdateTime) ? fromJsonTimestamp(object.lastUpdateTime) : undefined,
      total: isSet(object.total) ? DiscoveryServiceStats.fromJSON(object.total) : undefined,
      cds: isSet(object.cds) ? DiscoveryServiceStats.fromJSON(object.cds) : undefined,
      eds: isSet(object.eds) ? DiscoveryServiceStats.fromJSON(object.eds) : undefined,
      lds: isSet(object.lds) ? DiscoveryServiceStats.fromJSON(object.lds) : undefined,
      rds: isSet(object.rds) ? DiscoveryServiceStats.fromJSON(object.rds) : undefined,
    };
  },

  toJSON(message: DiscoverySubscriptionStatus): unknown {
    const obj: any = {};
    message.lastUpdateTime !== undefined && (obj.lastUpdateTime = message.lastUpdateTime.toISOString());
    message.total !== undefined &&
      (obj.total = message.total ? DiscoveryServiceStats.toJSON(message.total) : undefined);
    message.cds !== undefined && (obj.cds = message.cds ? DiscoveryServiceStats.toJSON(message.cds) : undefined);
    message.eds !== undefined && (obj.eds = message.eds ? DiscoveryServiceStats.toJSON(message.eds) : undefined);
    message.lds !== undefined && (obj.lds = message.lds ? DiscoveryServiceStats.toJSON(message.lds) : undefined);
    message.rds !== undefined && (obj.rds = message.rds ? DiscoveryServiceStats.toJSON(message.rds) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<DiscoverySubscriptionStatus>): DiscoverySubscriptionStatus {
    const message = Object.create(createBaseDiscoverySubscriptionStatus()) as DiscoverySubscriptionStatus;
    message.lastUpdateTime = object.lastUpdateTime ?? undefined;
    message.total = (object.total !== undefined && object.total !== null)
      ? DiscoveryServiceStats.fromPartial(object.total)
      : undefined;
    message.cds = (object.cds !== undefined && object.cds !== null)
      ? DiscoveryServiceStats.fromPartial(object.cds)
      : undefined;
    message.eds = (object.eds !== undefined && object.eds !== null)
      ? DiscoveryServiceStats.fromPartial(object.eds)
      : undefined;
    message.lds = (object.lds !== undefined && object.lds !== null)
      ? DiscoveryServiceStats.fromPartial(object.lds)
      : undefined;
    message.rds = (object.rds !== undefined && object.rds !== null)
      ? DiscoveryServiceStats.fromPartial(object.rds)
      : undefined;
    return message;
  },
};

function createBaseDiscoveryServiceStats(): DiscoveryServiceStats {
  return { responsesSent: 0, responsesAcknowledged: 0, responsesRejected: 0 };
}

export const DiscoveryServiceStats = {
  fromJSON(object: any): DiscoveryServiceStats {
    return {
      responsesSent: isSet(object.responsesSent) ? Number(object.responsesSent) : 0,
      responsesAcknowledged: isSet(object.responsesAcknowledged) ? Number(object.responsesAcknowledged) : 0,
      responsesRejected: isSet(object.responsesRejected) ? Number(object.responsesRejected) : 0,
    };
  },

  toJSON(message: DiscoveryServiceStats): unknown {
    const obj: any = {};
    message.responsesSent !== undefined && (obj.responsesSent = Math.round(message.responsesSent));
    message.responsesAcknowledged !== undefined &&
      (obj.responsesAcknowledged = Math.round(message.responsesAcknowledged));
    message.responsesRejected !== undefined && (obj.responsesRejected = Math.round(message.responsesRejected));
    return obj;
  },

  fromPartial(object: DeepPartial<DiscoveryServiceStats>): DiscoveryServiceStats {
    const message = Object.create(createBaseDiscoveryServiceStats()) as DiscoveryServiceStats;
    message.responsesSent = object.responsesSent ?? 0;
    message.responsesAcknowledged = object.responsesAcknowledged ?? 0;
    message.responsesRejected = object.responsesRejected ?? 0;
    return message;
  },
};

function createBaseVersion(): Version {
  return { kumaDp: undefined, envoy: undefined, dependencies: {} };
}

export const Version = {
  fromJSON(object: any): Version {
    return {
      kumaDp: isSet(object.kumaDp) ? KumaDpVersion.fromJSON(object.kumaDp) : undefined,
      envoy: isSet(object.envoy) ? EnvoyVersion.fromJSON(object.envoy) : undefined,
      dependencies: isObject(object.dependencies)
        ? Object.entries(object.dependencies).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: Version): unknown {
    const obj: any = {};
    message.kumaDp !== undefined && (obj.kumaDp = message.kumaDp ? KumaDpVersion.toJSON(message.kumaDp) : undefined);
    message.envoy !== undefined && (obj.envoy = message.envoy ? EnvoyVersion.toJSON(message.envoy) : undefined);
    obj.dependencies = {};
    if (message.dependencies) {
      Object.entries(message.dependencies).forEach(([k, v]) => {
        obj.dependencies[k] = v;
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Version>): Version {
    const message = Object.create(createBaseVersion()) as Version;
    message.kumaDp = (object.kumaDp !== undefined && object.kumaDp !== null)
      ? KumaDpVersion.fromPartial(object.kumaDp)
      : undefined;
    message.envoy = (object.envoy !== undefined && object.envoy !== null)
      ? EnvoyVersion.fromPartial(object.envoy)
      : undefined;
    message.dependencies = Object.entries(object.dependencies ?? {}).reduce<{ [key: string]: string }>(
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

function createBaseVersion_DependenciesEntry(): Version_DependenciesEntry {
  return { key: "", value: "" };
}

export const Version_DependenciesEntry = {
  fromJSON(object: any): Version_DependenciesEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: Version_DependenciesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<Version_DependenciesEntry>): Version_DependenciesEntry {
    const message = Object.create(createBaseVersion_DependenciesEntry()) as Version_DependenciesEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseKumaDpVersion(): KumaDpVersion {
  return { version: "", gitTag: "", gitCommit: "", buildDate: "", kumaCpCompatible: false };
}

export const KumaDpVersion = {
  fromJSON(object: any): KumaDpVersion {
    return {
      version: isSet(object.version) ? String(object.version) : "",
      gitTag: isSet(object.gitTag) ? String(object.gitTag) : "",
      gitCommit: isSet(object.gitCommit) ? String(object.gitCommit) : "",
      buildDate: isSet(object.buildDate) ? String(object.buildDate) : "",
      kumaCpCompatible: isSet(object.kumaCpCompatible) ? Boolean(object.kumaCpCompatible) : false,
    };
  },

  toJSON(message: KumaDpVersion): unknown {
    const obj: any = {};
    message.version !== undefined && (obj.version = message.version);
    message.gitTag !== undefined && (obj.gitTag = message.gitTag);
    message.gitCommit !== undefined && (obj.gitCommit = message.gitCommit);
    message.buildDate !== undefined && (obj.buildDate = message.buildDate);
    message.kumaCpCompatible !== undefined && (obj.kumaCpCompatible = message.kumaCpCompatible);
    return obj;
  },

  fromPartial(object: DeepPartial<KumaDpVersion>): KumaDpVersion {
    const message = Object.create(createBaseKumaDpVersion()) as KumaDpVersion;
    message.version = object.version ?? "";
    message.gitTag = object.gitTag ?? "";
    message.gitCommit = object.gitCommit ?? "";
    message.buildDate = object.buildDate ?? "";
    message.kumaCpCompatible = object.kumaCpCompatible ?? false;
    return message;
  },
};

function createBaseEnvoyVersion(): EnvoyVersion {
  return { version: "", build: "", kumaDpCompatible: false };
}

export const EnvoyVersion = {
  fromJSON(object: any): EnvoyVersion {
    return {
      version: isSet(object.version) ? String(object.version) : "",
      build: isSet(object.build) ? String(object.build) : "",
      kumaDpCompatible: isSet(object.kumaDpCompatible) ? Boolean(object.kumaDpCompatible) : false,
    };
  },

  toJSON(message: EnvoyVersion): unknown {
    const obj: any = {};
    message.version !== undefined && (obj.version = message.version);
    message.build !== undefined && (obj.build = message.build);
    message.kumaDpCompatible !== undefined && (obj.kumaDpCompatible = message.kumaDpCompatible);
    return obj;
  },

  fromPartial(object: DeepPartial<EnvoyVersion>): EnvoyVersion {
    const message = Object.create(createBaseEnvoyVersion()) as EnvoyVersion;
    message.version = object.version ?? "";
    message.build = object.build ?? "";
    message.kumaDpCompatible = object.kumaDpCompatible ?? false;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
