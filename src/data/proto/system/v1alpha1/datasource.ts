/* eslint-disable */

export const protobufPackage = "kuma.system.v1alpha1";

/** DataSource defines the source of bytes to use. */
export interface DataSource {
  /** Data source is a secret with given Secret key. */
  secret?:
    | string
    | undefined;
  /**
   * Data source is a path to a file.
   * Deprecated, use other sources of a data.
   */
  file?:
    | string
    | undefined;
  /** Data source is inline bytes. */
  inline?:
    | Uint8Array
    | undefined;
  /** Data source is inline string */
  inlineString?: string | undefined;
}

function createBaseDataSource(): DataSource {
  return {};
}

export const DataSource = {
  fromJSON(object: any): DataSource {
    return {
      secret: isSet(object.secret) ? String(object.secret) : undefined,
      file: isSet(object.file) ? String(object.file) : undefined,
      inline: isSet(object.inline) ? new Uint8Array(object.inline) : undefined,
      inlineString: isSet(object.inlineString) ? String(object.inlineString) : undefined,
    };
  },

  toJSON(message: DataSource): unknown {
    const obj: any = {};
    message.secret !== undefined && (obj.secret = message.secret);
    message.file !== undefined && (obj.file = message.file);
    message.inline !== undefined && (obj.inline = message.inline);
    message.inlineString !== undefined && (obj.inlineString = message.inlineString);
    return obj;
  },

  fromPartial(object: DeepPartial<DataSource>): DataSource {
    const message = Object.create(createBaseDataSource()) as DataSource;
    message.secret = object.secret ?? undefined;
    message.file = object.file ?? undefined;
    message.inline = object.inline ?? undefined;
    message.inlineString = object.inlineString ?? undefined;
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
