/* eslint-disable */

export const protobufPackage = "kuma.mesh";

export interface KumaResourceOptions {
  /** Name of the Kuma resource struct. */
  name: string;
  /** Name and value of the modelResourceType constant. */
  type: string;
  /** True if this resource has global scope. Otherwise it will be mesh scope. */
  global: boolean;
  /** Name of the resource's Go package. */
  package: string;
  /** Whether to skip type registration for this resource. */
  skipRegistration: boolean;
  kds: KumaKdsOptions | undefined;
  ws:
    | KumaWsOptions
    | undefined;
  /** Whether scope is "Namespace"; Otherwise to "Cluster". */
  scopeNamespace: boolean;
  /** Whether to skip generation of native API helper functions. */
  skipKubernetesWrappers: boolean;
  /** Whether to generate Inspect API endpoint */
  allowToInspect: boolean;
  /**
   * If resource has more than one version, then the flag defines which version
   * is used in the storage. All other versions must be convertible to it.
   */
  storageVersion: boolean;
  /**
   * The name of the policy showed as plural to be displayed in the UI and maybe
   * CLI
   */
  pluralDisplayName: string;
  /**
   * Is Experimental indicates if a policy is in experimental state (might not
   * be production ready).
   */
  isExperimental: boolean;
}

export interface KumaWsOptions {
  /** Name is the name of the policy for resource name usage in path. */
  name: string;
  /**
   * Plural is only to be set if the plural of the resource is irregular (not
   * just adding a 's' at the end).
   */
  plural: string;
  /** ReadOnly if the resource is read only. */
  readOnly: boolean;
  /**
   * AdminOnly whether this entity requires admin auth to access these
   * endpoints.
   */
  adminOnly: boolean;
}

export interface KumaKdsOptions {
  /** SendToGlobal whether this entity will be sent from zone cp to global cp */
  sendToGlobal: boolean;
  /** SendToZone whether this entity will be sent from global cp to zone cp */
  sendToZone: boolean;
}

export interface KumaPolicyOptions {
  /** Whether to skip type registration for this resource. */
  skipRegistration: boolean;
  /**
   * An optional alternative plural form if this is unset default to a standard
   * derivation of the name
   */
  plural: string;
}

function createBaseKumaResourceOptions(): KumaResourceOptions {
  return {
    name: "",
    type: "",
    global: false,
    package: "",
    skipRegistration: false,
    kds: undefined,
    ws: undefined,
    scopeNamespace: false,
    skipKubernetesWrappers: false,
    allowToInspect: false,
    storageVersion: false,
    pluralDisplayName: "",
    isExperimental: false,
  };
}

export const KumaResourceOptions = {
  fromJSON(object: any): KumaResourceOptions {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      type: isSet(object.type) ? String(object.type) : "",
      global: isSet(object.global) ? Boolean(object.global) : false,
      package: isSet(object.package) ? String(object.package) : "",
      skipRegistration: isSet(object.skipRegistration) ? Boolean(object.skipRegistration) : false,
      kds: isSet(object.kds) ? KumaKdsOptions.fromJSON(object.kds) : undefined,
      ws: isSet(object.ws) ? KumaWsOptions.fromJSON(object.ws) : undefined,
      scopeNamespace: isSet(object.scopeNamespace) ? Boolean(object.scopeNamespace) : false,
      skipKubernetesWrappers: isSet(object.skipKubernetesWrappers) ? Boolean(object.skipKubernetesWrappers) : false,
      allowToInspect: isSet(object.allowToInspect) ? Boolean(object.allowToInspect) : false,
      storageVersion: isSet(object.storageVersion) ? Boolean(object.storageVersion) : false,
      pluralDisplayName: isSet(object.pluralDisplayName) ? String(object.pluralDisplayName) : "",
      isExperimental: isSet(object.isExperimental) ? Boolean(object.isExperimental) : false,
    };
  },

  toJSON(message: KumaResourceOptions): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.type !== undefined && (obj.type = message.type);
    message.global !== undefined && (obj.global = message.global);
    message.package !== undefined && (obj.package = message.package);
    message.skipRegistration !== undefined && (obj.skipRegistration = message.skipRegistration);
    message.kds !== undefined && (obj.kds = message.kds ? KumaKdsOptions.toJSON(message.kds) : undefined);
    message.ws !== undefined && (obj.ws = message.ws ? KumaWsOptions.toJSON(message.ws) : undefined);
    message.scopeNamespace !== undefined && (obj.scopeNamespace = message.scopeNamespace);
    message.skipKubernetesWrappers !== undefined && (obj.skipKubernetesWrappers = message.skipKubernetesWrappers);
    message.allowToInspect !== undefined && (obj.allowToInspect = message.allowToInspect);
    message.storageVersion !== undefined && (obj.storageVersion = message.storageVersion);
    message.pluralDisplayName !== undefined && (obj.pluralDisplayName = message.pluralDisplayName);
    message.isExperimental !== undefined && (obj.isExperimental = message.isExperimental);
    return obj;
  },

  fromPartial(object: DeepPartial<KumaResourceOptions>): KumaResourceOptions {
    const message = Object.create(createBaseKumaResourceOptions()) as KumaResourceOptions;
    message.name = object.name ?? "";
    message.type = object.type ?? "";
    message.global = object.global ?? false;
    message.package = object.package ?? "";
    message.skipRegistration = object.skipRegistration ?? false;
    message.kds = (object.kds !== undefined && object.kds !== null)
      ? KumaKdsOptions.fromPartial(object.kds)
      : undefined;
    message.ws = (object.ws !== undefined && object.ws !== null) ? KumaWsOptions.fromPartial(object.ws) : undefined;
    message.scopeNamespace = object.scopeNamespace ?? false;
    message.skipKubernetesWrappers = object.skipKubernetesWrappers ?? false;
    message.allowToInspect = object.allowToInspect ?? false;
    message.storageVersion = object.storageVersion ?? false;
    message.pluralDisplayName = object.pluralDisplayName ?? "";
    message.isExperimental = object.isExperimental ?? false;
    return message;
  },
};

function createBaseKumaWsOptions(): KumaWsOptions {
  return { name: "", plural: "", readOnly: false, adminOnly: false };
}

export const KumaWsOptions = {
  fromJSON(object: any): KumaWsOptions {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      plural: isSet(object.plural) ? String(object.plural) : "",
      readOnly: isSet(object.readOnly) ? Boolean(object.readOnly) : false,
      adminOnly: isSet(object.adminOnly) ? Boolean(object.adminOnly) : false,
    };
  },

  toJSON(message: KumaWsOptions): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.plural !== undefined && (obj.plural = message.plural);
    message.readOnly !== undefined && (obj.readOnly = message.readOnly);
    message.adminOnly !== undefined && (obj.adminOnly = message.adminOnly);
    return obj;
  },

  fromPartial(object: DeepPartial<KumaWsOptions>): KumaWsOptions {
    const message = Object.create(createBaseKumaWsOptions()) as KumaWsOptions;
    message.name = object.name ?? "";
    message.plural = object.plural ?? "";
    message.readOnly = object.readOnly ?? false;
    message.adminOnly = object.adminOnly ?? false;
    return message;
  },
};

function createBaseKumaKdsOptions(): KumaKdsOptions {
  return { sendToGlobal: false, sendToZone: false };
}

export const KumaKdsOptions = {
  fromJSON(object: any): KumaKdsOptions {
    return {
      sendToGlobal: isSet(object.sendToGlobal) ? Boolean(object.sendToGlobal) : false,
      sendToZone: isSet(object.sendToZone) ? Boolean(object.sendToZone) : false,
    };
  },

  toJSON(message: KumaKdsOptions): unknown {
    const obj: any = {};
    message.sendToGlobal !== undefined && (obj.sendToGlobal = message.sendToGlobal);
    message.sendToZone !== undefined && (obj.sendToZone = message.sendToZone);
    return obj;
  },

  fromPartial(object: DeepPartial<KumaKdsOptions>): KumaKdsOptions {
    const message = Object.create(createBaseKumaKdsOptions()) as KumaKdsOptions;
    message.sendToGlobal = object.sendToGlobal ?? false;
    message.sendToZone = object.sendToZone ?? false;
    return message;
  },
};

function createBaseKumaPolicyOptions(): KumaPolicyOptions {
  return { skipRegistration: false, plural: "" };
}

export const KumaPolicyOptions = {
  fromJSON(object: any): KumaPolicyOptions {
    return {
      skipRegistration: isSet(object.skipRegistration) ? Boolean(object.skipRegistration) : false,
      plural: isSet(object.plural) ? String(object.plural) : "",
    };
  },

  toJSON(message: KumaPolicyOptions): unknown {
    const obj: any = {};
    message.skipRegistration !== undefined && (obj.skipRegistration = message.skipRegistration);
    message.plural !== undefined && (obj.plural = message.plural);
    return obj;
  },

  fromPartial(object: DeepPartial<KumaPolicyOptions>): KumaPolicyOptions {
    const message = Object.create(createBaseKumaPolicyOptions()) as KumaPolicyOptions;
    message.skipRegistration = object.skipRegistration ?? false;
    message.plural = object.plural ?? "";
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
