/* eslint-disable */

export const protobufPackage = "kuma.mesh.v1alpha1";

/**
 * Metrics defines configuration for metrics that should be collected and
 * exposed by dataplanes.
 */
export interface Metrics {
  /** Name of the enabled backend */
  enabledBackend: string;
  /** List of available Metrics backends */
  backends: MetricsBackend[];
}

/** MetricsBackend defines metric backends */
export interface MetricsBackend {
  /** Name of the backend, can be then used in Mesh.metrics.enabledBackend */
  name: string;
  /** Type of the backend (Kuma ships with 'prometheus') */
  type: string;
  /** Configuration of the backend */
  conf: { [key: string]: any } | undefined;
}

/** PrometheusMetricsBackendConfig defines configuration of Prometheus backend */
export interface PrometheusMetricsBackendConfig {
  /**
   * Port on which a dataplane should expose HTTP endpoint with Prometheus
   * metrics.
   */
  port: number;
  /**
   * Path on which a dataplane should expose HTTP endpoint with Prometheus
   * metrics.
   */
  path: string;
  /**
   * Tags associated with an application this dataplane is deployed next to,
   * e.g. service=web, version=1.0.
   * `service` tag is mandatory.
   */
  tags: { [key: string]: string };
  /**
   * If true then endpoints for scraping metrics won't require mTLS even if mTLS
   * is enabled in Mesh. If nil, then it is treated as false.
   */
  skipMTLS:
    | boolean
    | undefined;
  /**
   * Map with the configuration of applications which metrics are going to be
   * scrapped by kuma-dp.
   */
  aggregate: PrometheusAggregateMetricsConfig[];
  /** Configuration of Envoy's metrics. */
  envoy: PrometheusEnvoyConfig | undefined;
}

export interface PrometheusMetricsBackendConfig_TagsEntry {
  key: string;
  value: string;
}

/**
 * PrometheusAggregateMetricsConfig defines endpoints that should be scrapped
 * by kuma-dp for prometheus metrics.
 * Any configuration change require sidecar restart.
 */
export interface PrometheusAggregateMetricsConfig {
  /** Name which identify given configuration. */
  name: string;
  /** Port on which a service expose HTTP endpoint with Prometheus metrics. */
  port: number;
  /** Path on which a service expose HTTP endpoint with Prometheus metrics. */
  path: string;
  /**
   * If false then the application won't be scrapped. If nil, then it is treated
   * as true and kuma-dp scrapes metrics from the service.
   */
  enabled:
    | boolean
    | undefined;
  /** Address on which a service expose HTTP endpoint with Prometheus metrics. */
  address: string;
}

/**
 * PrometheusEnvoyConfig defines filters that should be passed to Envoy
 * for filtering.
 */
export interface PrometheusEnvoyConfig {
  /**
   * FilterRegex value that is going to be passed to Envoy for filtering
   * Envoy metrics.
   */
  filterRegex: string;
  /**
   * If true then return metrics that Envoy has updated (counters incremented
   * at least once, gauges changed at least once, and histograms added to at
   * least once). If nil, then it is treated as false.
   */
  usedOnly: boolean | undefined;
}

function createBaseMetrics(): Metrics {
  return { enabledBackend: "", backends: [] };
}

export const Metrics = {
  fromJSON(object: any): Metrics {
    return {
      enabledBackend: isSet(object.enabledBackend) ? String(object.enabledBackend) : "",
      backends: Array.isArray(object?.backends) ? object.backends.map((e: any) => MetricsBackend.fromJSON(e)) : [],
    };
  },

  toJSON(message: Metrics): unknown {
    const obj: any = {};
    message.enabledBackend !== undefined && (obj.enabledBackend = message.enabledBackend);
    if (message.backends) {
      obj.backends = message.backends.map((e) => e ? MetricsBackend.toJSON(e) : undefined);
    } else {
      obj.backends = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Metrics>): Metrics {
    const message = Object.create(createBaseMetrics()) as Metrics;
    message.enabledBackend = object.enabledBackend ?? "";
    message.backends = object.backends?.map((e) => MetricsBackend.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMetricsBackend(): MetricsBackend {
  return { name: "", type: "", conf: undefined };
}

export const MetricsBackend = {
  fromJSON(object: any): MetricsBackend {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      type: isSet(object.type) ? String(object.type) : "",
      conf: isObject(object.conf) ? object.conf : undefined,
    };
  },

  toJSON(message: MetricsBackend): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.type !== undefined && (obj.type = message.type);
    message.conf !== undefined && (obj.conf = message.conf);
    return obj;
  },

  fromPartial(object: DeepPartial<MetricsBackend>): MetricsBackend {
    const message = Object.create(createBaseMetricsBackend()) as MetricsBackend;
    message.name = object.name ?? "";
    message.type = object.type ?? "";
    message.conf = object.conf ?? undefined;
    return message;
  },
};

function createBasePrometheusMetricsBackendConfig(): PrometheusMetricsBackendConfig {
  return { port: 0, path: "", tags: {}, skipMTLS: undefined, aggregate: [], envoy: undefined };
}

export const PrometheusMetricsBackendConfig = {
  fromJSON(object: any): PrometheusMetricsBackendConfig {
    return {
      port: isSet(object.port) ? Number(object.port) : 0,
      path: isSet(object.path) ? String(object.path) : "",
      tags: isObject(object.tags)
        ? Object.entries(object.tags).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      skipMTLS: isSet(object.skipMTLS) ? Boolean(object.skipMTLS) : undefined,
      aggregate: Array.isArray(object?.aggregate)
        ? object.aggregate.map((e: any) => PrometheusAggregateMetricsConfig.fromJSON(e))
        : [],
      envoy: isSet(object.envoy) ? PrometheusEnvoyConfig.fromJSON(object.envoy) : undefined,
    };
  },

  toJSON(message: PrometheusMetricsBackendConfig): unknown {
    const obj: any = {};
    message.port !== undefined && (obj.port = Math.round(message.port));
    message.path !== undefined && (obj.path = message.path);
    obj.tags = {};
    if (message.tags) {
      Object.entries(message.tags).forEach(([k, v]) => {
        obj.tags[k] = v;
      });
    }
    message.skipMTLS !== undefined && (obj.skipMTLS = message.skipMTLS);
    if (message.aggregate) {
      obj.aggregate = message.aggregate.map((e) => e ? PrometheusAggregateMetricsConfig.toJSON(e) : undefined);
    } else {
      obj.aggregate = [];
    }
    message.envoy !== undefined &&
      (obj.envoy = message.envoy ? PrometheusEnvoyConfig.toJSON(message.envoy) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<PrometheusMetricsBackendConfig>): PrometheusMetricsBackendConfig {
    const message = Object.create(createBasePrometheusMetricsBackendConfig()) as PrometheusMetricsBackendConfig;
    message.port = object.port ?? 0;
    message.path = object.path ?? "";
    message.tags = Object.entries(object.tags ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.skipMTLS = object.skipMTLS ?? undefined;
    message.aggregate = object.aggregate?.map((e) => PrometheusAggregateMetricsConfig.fromPartial(e)) || [];
    message.envoy = (object.envoy !== undefined && object.envoy !== null)
      ? PrometheusEnvoyConfig.fromPartial(object.envoy)
      : undefined;
    return message;
  },
};

function createBasePrometheusMetricsBackendConfig_TagsEntry(): PrometheusMetricsBackendConfig_TagsEntry {
  return { key: "", value: "" };
}

export const PrometheusMetricsBackendConfig_TagsEntry = {
  fromJSON(object: any): PrometheusMetricsBackendConfig_TagsEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: PrometheusMetricsBackendConfig_TagsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<PrometheusMetricsBackendConfig_TagsEntry>): PrometheusMetricsBackendConfig_TagsEntry {
    const message = Object.create(
      createBasePrometheusMetricsBackendConfig_TagsEntry(),
    ) as PrometheusMetricsBackendConfig_TagsEntry;
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBasePrometheusAggregateMetricsConfig(): PrometheusAggregateMetricsConfig {
  return { name: "", port: 0, path: "", enabled: undefined, address: "" };
}

export const PrometheusAggregateMetricsConfig = {
  fromJSON(object: any): PrometheusAggregateMetricsConfig {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      port: isSet(object.port) ? Number(object.port) : 0,
      path: isSet(object.path) ? String(object.path) : "",
      enabled: isSet(object.enabled) ? Boolean(object.enabled) : undefined,
      address: isSet(object.address) ? String(object.address) : "",
    };
  },

  toJSON(message: PrometheusAggregateMetricsConfig): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.port !== undefined && (obj.port = Math.round(message.port));
    message.path !== undefined && (obj.path = message.path);
    message.enabled !== undefined && (obj.enabled = message.enabled);
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial(object: DeepPartial<PrometheusAggregateMetricsConfig>): PrometheusAggregateMetricsConfig {
    const message = Object.create(createBasePrometheusAggregateMetricsConfig()) as PrometheusAggregateMetricsConfig;
    message.name = object.name ?? "";
    message.port = object.port ?? 0;
    message.path = object.path ?? "";
    message.enabled = object.enabled ?? undefined;
    message.address = object.address ?? "";
    return message;
  },
};

function createBasePrometheusEnvoyConfig(): PrometheusEnvoyConfig {
  return { filterRegex: "", usedOnly: undefined };
}

export const PrometheusEnvoyConfig = {
  fromJSON(object: any): PrometheusEnvoyConfig {
    return {
      filterRegex: isSet(object.filterRegex) ? String(object.filterRegex) : "",
      usedOnly: isSet(object.usedOnly) ? Boolean(object.usedOnly) : undefined,
    };
  },

  toJSON(message: PrometheusEnvoyConfig): unknown {
    const obj: any = {};
    message.filterRegex !== undefined && (obj.filterRegex = message.filterRegex);
    message.usedOnly !== undefined && (obj.usedOnly = message.usedOnly);
    return obj;
  },

  fromPartial(object: DeepPartial<PrometheusEnvoyConfig>): PrometheusEnvoyConfig {
    const message = Object.create(createBasePrometheusEnvoyConfig()) as PrometheusEnvoyConfig;
    message.filterRegex = object.filterRegex ?? "";
    message.usedOnly = object.usedOnly ?? undefined;
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
