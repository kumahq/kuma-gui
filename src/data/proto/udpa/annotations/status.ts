/* eslint-disable */

export const protobufPackage = "udpa.annotations";

export enum PackageVersionStatus {
  /** UNKNOWN - Unknown package version status. */
  UNKNOWN = "UNKNOWN",
  /** FROZEN - This version of the package is frozen. */
  FROZEN = "FROZEN",
  /** ACTIVE - This version of the package is the active development version. */
  ACTIVE = "ACTIVE",
  /**
   * NEXT_MAJOR_VERSION_CANDIDATE - This version of the package is the candidate for the next major version. It
   * is typically machine generated from the active development version.
   */
  NEXT_MAJOR_VERSION_CANDIDATE = "NEXT_MAJOR_VERSION_CANDIDATE",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function packageVersionStatusFromJSON(object: any): PackageVersionStatus {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return PackageVersionStatus.UNKNOWN;
    case 1:
    case "FROZEN":
      return PackageVersionStatus.FROZEN;
    case 2:
    case "ACTIVE":
      return PackageVersionStatus.ACTIVE;
    case 3:
    case "NEXT_MAJOR_VERSION_CANDIDATE":
      return PackageVersionStatus.NEXT_MAJOR_VERSION_CANDIDATE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PackageVersionStatus.UNRECOGNIZED;
  }
}

export function packageVersionStatusToJSON(object: PackageVersionStatus): string {
  switch (object) {
    case PackageVersionStatus.UNKNOWN:
      return "UNKNOWN";
    case PackageVersionStatus.FROZEN:
      return "FROZEN";
    case PackageVersionStatus.ACTIVE:
      return "ACTIVE";
    case PackageVersionStatus.NEXT_MAJOR_VERSION_CANDIDATE:
      return "NEXT_MAJOR_VERSION_CANDIDATE";
    case PackageVersionStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface StatusAnnotation {
  /** The entity is work-in-progress and subject to breaking changes. */
  workInProgress: boolean;
  /** The entity belongs to a package with the given version status. */
  packageVersionStatus: PackageVersionStatus;
}

function createBaseStatusAnnotation(): StatusAnnotation {
  return { workInProgress: false, packageVersionStatus: PackageVersionStatus.UNKNOWN };
}

export const StatusAnnotation = {
  fromJSON(object: any): StatusAnnotation {
    return {
      workInProgress: isSet(object.workInProgress) ? Boolean(object.workInProgress) : false,
      packageVersionStatus: isSet(object.packageVersionStatus)
        ? packageVersionStatusFromJSON(object.packageVersionStatus)
        : PackageVersionStatus.UNKNOWN,
    };
  },

  toJSON(message: StatusAnnotation): unknown {
    const obj: any = {};
    message.workInProgress !== undefined && (obj.workInProgress = message.workInProgress);
    message.packageVersionStatus !== undefined &&
      (obj.packageVersionStatus = packageVersionStatusToJSON(message.packageVersionStatus));
    return obj;
  },

  fromPartial(object: DeepPartial<StatusAnnotation>): StatusAnnotation {
    const message = Object.create(createBaseStatusAnnotation()) as StatusAnnotation;
    message.workInProgress = object.workInProgress ?? false;
    message.packageVersionStatus = object.packageVersionStatus ?? PackageVersionStatus.UNKNOWN;
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
