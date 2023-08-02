/* eslint-disable */

export const protobufPackage = "doc";

export interface Config {
  type: Config_Type;
  name: string;
  fileName: string;
  templateName: string;
}

export enum Config_Type {
  Undefined = "Undefined",
  Policy = "Policy",
  Proxy = "Proxy",
  Other = "Other",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function config_TypeFromJSON(object: any): Config_Type {
  switch (object) {
    case 0:
    case "Undefined":
      return Config_Type.Undefined;
    case 1:
    case "Policy":
      return Config_Type.Policy;
    case 2:
    case "Proxy":
      return Config_Type.Proxy;
    case 99:
    case "Other":
      return Config_Type.Other;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Config_Type.UNRECOGNIZED;
  }
}

export function config_TypeToJSON(object: Config_Type): string {
  switch (object) {
    case Config_Type.Undefined:
      return "Undefined";
    case Config_Type.Policy:
      return "Policy";
    case Config_Type.Proxy:
      return "Proxy";
    case Config_Type.Other:
      return "Other";
    case Config_Type.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBaseConfig(): Config {
  return { type: Config_Type.Undefined, name: "", fileName: "", templateName: "" };
}

export const Config = {
  fromJSON(object: any): Config {
    return {
      type: isSet(object.type) ? config_TypeFromJSON(object.type) : Config_Type.Undefined,
      name: isSet(object.name) ? String(object.name) : "",
      fileName: isSet(object.fileName) ? String(object.fileName) : "",
      templateName: isSet(object.templateName) ? String(object.templateName) : "",
    };
  },

  toJSON(message: Config): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = config_TypeToJSON(message.type));
    message.name !== undefined && (obj.name = message.name);
    message.fileName !== undefined && (obj.fileName = message.fileName);
    message.templateName !== undefined && (obj.templateName = message.templateName);
    return obj;
  },

  fromPartial(object: DeepPartial<Config>): Config {
    const message = Object.create(createBaseConfig()) as Config;
    message.type = object.type ?? Config_Type.Undefined;
    message.name = object.name ?? "";
    message.fileName = object.fileName ?? "";
    message.templateName = object.templateName ?? "";
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
