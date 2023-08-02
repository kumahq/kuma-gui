/* eslint-disable */

export const protobufPackage = "udpa.annotations";

export interface MigrateAnnotation {
  /** Rename the message/enum/enum value in next version. */
  rename: string;
}

export interface FieldMigrateAnnotation {
  /** Rename the field in next version. */
  rename: string;
  /**
   * Add the field to a named oneof in next version. If this already exists, the
   * field will join its siblings under the oneof, otherwise a new oneof will be
   * created with the given name.
   */
  oneofPromotion: string;
}

export interface FileMigrateAnnotation {
  /**
   * Move all types in the file to another package, this implies changing proto
   * file path.
   */
  moveToPackage: string;
}

function createBaseMigrateAnnotation(): MigrateAnnotation {
  return { rename: "" };
}

export const MigrateAnnotation = {
  fromJSON(object: any): MigrateAnnotation {
    return { rename: isSet(object.rename) ? String(object.rename) : "" };
  },

  toJSON(message: MigrateAnnotation): unknown {
    const obj: any = {};
    message.rename !== undefined && (obj.rename = message.rename);
    return obj;
  },

  fromPartial(object: DeepPartial<MigrateAnnotation>): MigrateAnnotation {
    const message = Object.create(createBaseMigrateAnnotation()) as MigrateAnnotation;
    message.rename = object.rename ?? "";
    return message;
  },
};

function createBaseFieldMigrateAnnotation(): FieldMigrateAnnotation {
  return { rename: "", oneofPromotion: "" };
}

export const FieldMigrateAnnotation = {
  fromJSON(object: any): FieldMigrateAnnotation {
    return {
      rename: isSet(object.rename) ? String(object.rename) : "",
      oneofPromotion: isSet(object.oneofPromotion) ? String(object.oneofPromotion) : "",
    };
  },

  toJSON(message: FieldMigrateAnnotation): unknown {
    const obj: any = {};
    message.rename !== undefined && (obj.rename = message.rename);
    message.oneofPromotion !== undefined && (obj.oneofPromotion = message.oneofPromotion);
    return obj;
  },

  fromPartial(object: DeepPartial<FieldMigrateAnnotation>): FieldMigrateAnnotation {
    const message = Object.create(createBaseFieldMigrateAnnotation()) as FieldMigrateAnnotation;
    message.rename = object.rename ?? "";
    message.oneofPromotion = object.oneofPromotion ?? "";
    return message;
  },
};

function createBaseFileMigrateAnnotation(): FileMigrateAnnotation {
  return { moveToPackage: "" };
}

export const FileMigrateAnnotation = {
  fromJSON(object: any): FileMigrateAnnotation {
    return { moveToPackage: isSet(object.moveToPackage) ? String(object.moveToPackage) : "" };
  },

  toJSON(message: FileMigrateAnnotation): unknown {
    const obj: any = {};
    message.moveToPackage !== undefined && (obj.moveToPackage = message.moveToPackage);
    return obj;
  },

  fromPartial(object: DeepPartial<FileMigrateAnnotation>): FileMigrateAnnotation {
    const message = Object.create(createBaseFileMigrateAnnotation()) as FileMigrateAnnotation;
    message.moveToPackage = object.moveToPackage ?? "";
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
