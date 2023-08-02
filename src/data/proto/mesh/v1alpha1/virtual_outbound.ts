/* eslint-disable */
import { Selector } from "./selector";

export const protobufPackage = "kuma.mesh.v1alpha1";

/** VirtualOutbound defines how to generate hostname ports combination. */
export interface VirtualOutbound {
  /** List of selectors to match dataplanes that this policy applies to */
  selectors: Selector[];
  conf: VirtualOutbound_Conf | undefined;
}

export interface VirtualOutbound_Conf {
  /** Host the gotemplate to generate the hostname from the Parameters map */
  host: string;
  /** Port the gotemplate to generate the port from the Parameters map */
  port: string;
  /**
   * Parameters a mapping between tag keys and template parameter key. This
   * must always contain at least `kuma.io/service`
   */
  parameters: VirtualOutbound_Conf_TemplateParameter[];
}

/** A mapping between a template parameter and a dataplane outbound tag name. */
export interface VirtualOutbound_Conf_TemplateParameter {
  /** Name the name of the template parameter (must be alphanumeric). */
  name: string;
  /**
   * TagKey the name of the tag in the Kuma outbound (optional if absent it
   * will use Name).
   */
  tagKey: string;
}

function createBaseVirtualOutbound(): VirtualOutbound {
  return { selectors: [], conf: undefined };
}

export const VirtualOutbound = {
  fromJSON(object: any): VirtualOutbound {
    return {
      selectors: Array.isArray(object?.selectors) ? object.selectors.map((e: any) => Selector.fromJSON(e)) : [],
      conf: isSet(object.conf) ? VirtualOutbound_Conf.fromJSON(object.conf) : undefined,
    };
  },

  toJSON(message: VirtualOutbound): unknown {
    const obj: any = {};
    if (message.selectors) {
      obj.selectors = message.selectors.map((e) => e ? Selector.toJSON(e) : undefined);
    } else {
      obj.selectors = [];
    }
    message.conf !== undefined && (obj.conf = message.conf ? VirtualOutbound_Conf.toJSON(message.conf) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<VirtualOutbound>): VirtualOutbound {
    const message = Object.create(createBaseVirtualOutbound()) as VirtualOutbound;
    message.selectors = object.selectors?.map((e) => Selector.fromPartial(e)) || [];
    message.conf = (object.conf !== undefined && object.conf !== null)
      ? VirtualOutbound_Conf.fromPartial(object.conf)
      : undefined;
    return message;
  },
};

function createBaseVirtualOutbound_Conf(): VirtualOutbound_Conf {
  return { host: "", port: "", parameters: [] };
}

export const VirtualOutbound_Conf = {
  fromJSON(object: any): VirtualOutbound_Conf {
    return {
      host: isSet(object.host) ? String(object.host) : "",
      port: isSet(object.port) ? String(object.port) : "",
      parameters: Array.isArray(object?.parameters)
        ? object.parameters.map((e: any) => VirtualOutbound_Conf_TemplateParameter.fromJSON(e))
        : [],
    };
  },

  toJSON(message: VirtualOutbound_Conf): unknown {
    const obj: any = {};
    message.host !== undefined && (obj.host = message.host);
    message.port !== undefined && (obj.port = message.port);
    if (message.parameters) {
      obj.parameters = message.parameters.map((e) => e ? VirtualOutbound_Conf_TemplateParameter.toJSON(e) : undefined);
    } else {
      obj.parameters = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<VirtualOutbound_Conf>): VirtualOutbound_Conf {
    const message = Object.create(createBaseVirtualOutbound_Conf()) as VirtualOutbound_Conf;
    message.host = object.host ?? "";
    message.port = object.port ?? "";
    message.parameters = object.parameters?.map((e) => VirtualOutbound_Conf_TemplateParameter.fromPartial(e)) || [];
    return message;
  },
};

function createBaseVirtualOutbound_Conf_TemplateParameter(): VirtualOutbound_Conf_TemplateParameter {
  return { name: "", tagKey: "" };
}

export const VirtualOutbound_Conf_TemplateParameter = {
  fromJSON(object: any): VirtualOutbound_Conf_TemplateParameter {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      tagKey: isSet(object.tagKey) ? String(object.tagKey) : "",
    };
  },

  toJSON(message: VirtualOutbound_Conf_TemplateParameter): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.tagKey !== undefined && (obj.tagKey = message.tagKey);
    return obj;
  },

  fromPartial(object: DeepPartial<VirtualOutbound_Conf_TemplateParameter>): VirtualOutbound_Conf_TemplateParameter {
    const message = Object.create(
      createBaseVirtualOutbound_Conf_TemplateParameter(),
    ) as VirtualOutbound_Conf_TemplateParameter;
    message.name = object.name ?? "";
    message.tagKey = object.tagKey ?? "";
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
