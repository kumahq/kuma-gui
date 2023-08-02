/* eslint-disable */
import { Duration } from "../google/protobuf/duration";
import { Timestamp } from "../google/protobuf/timestamp";

export const protobufPackage = "validate";

/** WellKnownRegex contain some well-known patterns. */
export enum KnownRegex {
  UNKNOWN = "UNKNOWN",
  /** HTTP_HEADER_NAME - HTTP header name as defined by RFC 7230. */
  HTTP_HEADER_NAME = "HTTP_HEADER_NAME",
  /** HTTP_HEADER_VALUE - HTTP header value as defined by RFC 7230. */
  HTTP_HEADER_VALUE = "HTTP_HEADER_VALUE",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function knownRegexFromJSON(object: any): KnownRegex {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return KnownRegex.UNKNOWN;
    case 1:
    case "HTTP_HEADER_NAME":
      return KnownRegex.HTTP_HEADER_NAME;
    case 2:
    case "HTTP_HEADER_VALUE":
      return KnownRegex.HTTP_HEADER_VALUE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return KnownRegex.UNRECOGNIZED;
  }
}

export function knownRegexToJSON(object: KnownRegex): string {
  switch (object) {
    case KnownRegex.UNKNOWN:
      return "UNKNOWN";
    case KnownRegex.HTTP_HEADER_NAME:
      return "HTTP_HEADER_NAME";
    case KnownRegex.HTTP_HEADER_VALUE:
      return "HTTP_HEADER_VALUE";
    case KnownRegex.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/**
 * FieldRules encapsulates the rules for each type of field. Depending on the
 * field, the correct set should be used to ensure proper validations.
 */
export interface FieldRules {
  message:
    | MessageRules
    | undefined;
  /** Scalar Field Types */
  float?: FloatRules | undefined;
  double?: DoubleRules | undefined;
  int32?: Int32Rules | undefined;
  int64?: Int64Rules | undefined;
  uint32?: UInt32Rules | undefined;
  uint64?: UInt64Rules | undefined;
  sint32?: SInt32Rules | undefined;
  sint64?: SInt64Rules | undefined;
  fixed32?: Fixed32Rules | undefined;
  fixed64?: Fixed64Rules | undefined;
  sfixed32?: SFixed32Rules | undefined;
  sfixed64?: SFixed64Rules | undefined;
  bool?: BoolRules | undefined;
  string?: StringRules | undefined;
  bytes?:
    | BytesRules
    | undefined;
  /** Complex Field Types */
  enum?: EnumRules | undefined;
  repeated?: RepeatedRules | undefined;
  map?:
    | MapRules
    | undefined;
  /** Well-Known Field Types */
  any?: AnyRules | undefined;
  duration?: DurationRules | undefined;
  timestamp?: TimestampRules | undefined;
}

/** FloatRules describes the constraints applied to `float` values */
export interface FloatRules {
  /** Const specifies that this field must be exactly the specified value */
  const: number;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt: number;
  /**
   * Lte specifies that this field must be less than or equal to the
   * specified value, inclusive
   */
  lte: number;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive. If the value of Gt is larger than a specified Lt or Lte, the
   * range is reversed.
   */
  gt: number;
  /**
   * Gte specifies that this field must be greater than or equal to the
   * specified value, inclusive. If the value of Gte is larger than a
   * specified Lt or Lte, the range is reversed.
   */
  gte: number;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: number[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: number[];
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** DoubleRules describes the constraints applied to `double` values */
export interface DoubleRules {
  /** Const specifies that this field must be exactly the specified value */
  const: number;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt: number;
  /**
   * Lte specifies that this field must be less than or equal to the
   * specified value, inclusive
   */
  lte: number;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive. If the value of Gt is larger than a specified Lt or Lte, the
   * range is reversed.
   */
  gt: number;
  /**
   * Gte specifies that this field must be greater than or equal to the
   * specified value, inclusive. If the value of Gte is larger than a
   * specified Lt or Lte, the range is reversed.
   */
  gte: number;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: number[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: number[];
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** Int32Rules describes the constraints applied to `int32` values */
export interface Int32Rules {
  /** Const specifies that this field must be exactly the specified value */
  const: number;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt: number;
  /**
   * Lte specifies that this field must be less than or equal to the
   * specified value, inclusive
   */
  lte: number;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive. If the value of Gt is larger than a specified Lt or Lte, the
   * range is reversed.
   */
  gt: number;
  /**
   * Gte specifies that this field must be greater than or equal to the
   * specified value, inclusive. If the value of Gte is larger than a
   * specified Lt or Lte, the range is reversed.
   */
  gte: number;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: number[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: number[];
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** Int64Rules describes the constraints applied to `int64` values */
export interface Int64Rules {
  /** Const specifies that this field must be exactly the specified value */
  const: number;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt: number;
  /**
   * Lte specifies that this field must be less than or equal to the
   * specified value, inclusive
   */
  lte: number;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive. If the value of Gt is larger than a specified Lt or Lte, the
   * range is reversed.
   */
  gt: number;
  /**
   * Gte specifies that this field must be greater than or equal to the
   * specified value, inclusive. If the value of Gte is larger than a
   * specified Lt or Lte, the range is reversed.
   */
  gte: number;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: number[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: number[];
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** UInt32Rules describes the constraints applied to `uint32` values */
export interface UInt32Rules {
  /** Const specifies that this field must be exactly the specified value */
  const: number;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt: number;
  /**
   * Lte specifies that this field must be less than or equal to the
   * specified value, inclusive
   */
  lte: number;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive. If the value of Gt is larger than a specified Lt or Lte, the
   * range is reversed.
   */
  gt: number;
  /**
   * Gte specifies that this field must be greater than or equal to the
   * specified value, inclusive. If the value of Gte is larger than a
   * specified Lt or Lte, the range is reversed.
   */
  gte: number;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: number[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: number[];
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** UInt64Rules describes the constraints applied to `uint64` values */
export interface UInt64Rules {
  /** Const specifies that this field must be exactly the specified value */
  const: number;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt: number;
  /**
   * Lte specifies that this field must be less than or equal to the
   * specified value, inclusive
   */
  lte: number;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive. If the value of Gt is larger than a specified Lt or Lte, the
   * range is reversed.
   */
  gt: number;
  /**
   * Gte specifies that this field must be greater than or equal to the
   * specified value, inclusive. If the value of Gte is larger than a
   * specified Lt or Lte, the range is reversed.
   */
  gte: number;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: number[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: number[];
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** SInt32Rules describes the constraints applied to `sint32` values */
export interface SInt32Rules {
  /** Const specifies that this field must be exactly the specified value */
  const: number;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt: number;
  /**
   * Lte specifies that this field must be less than or equal to the
   * specified value, inclusive
   */
  lte: number;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive. If the value of Gt is larger than a specified Lt or Lte, the
   * range is reversed.
   */
  gt: number;
  /**
   * Gte specifies that this field must be greater than or equal to the
   * specified value, inclusive. If the value of Gte is larger than a
   * specified Lt or Lte, the range is reversed.
   */
  gte: number;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: number[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: number[];
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** SInt64Rules describes the constraints applied to `sint64` values */
export interface SInt64Rules {
  /** Const specifies that this field must be exactly the specified value */
  const: number;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt: number;
  /**
   * Lte specifies that this field must be less than or equal to the
   * specified value, inclusive
   */
  lte: number;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive. If the value of Gt is larger than a specified Lt or Lte, the
   * range is reversed.
   */
  gt: number;
  /**
   * Gte specifies that this field must be greater than or equal to the
   * specified value, inclusive. If the value of Gte is larger than a
   * specified Lt or Lte, the range is reversed.
   */
  gte: number;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: number[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: number[];
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** Fixed32Rules describes the constraints applied to `fixed32` values */
export interface Fixed32Rules {
  /** Const specifies that this field must be exactly the specified value */
  const: number;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt: number;
  /**
   * Lte specifies that this field must be less than or equal to the
   * specified value, inclusive
   */
  lte: number;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive. If the value of Gt is larger than a specified Lt or Lte, the
   * range is reversed.
   */
  gt: number;
  /**
   * Gte specifies that this field must be greater than or equal to the
   * specified value, inclusive. If the value of Gte is larger than a
   * specified Lt or Lte, the range is reversed.
   */
  gte: number;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: number[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: number[];
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** Fixed64Rules describes the constraints applied to `fixed64` values */
export interface Fixed64Rules {
  /** Const specifies that this field must be exactly the specified value */
  const: number;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt: number;
  /**
   * Lte specifies that this field must be less than or equal to the
   * specified value, inclusive
   */
  lte: number;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive. If the value of Gt is larger than a specified Lt or Lte, the
   * range is reversed.
   */
  gt: number;
  /**
   * Gte specifies that this field must be greater than or equal to the
   * specified value, inclusive. If the value of Gte is larger than a
   * specified Lt or Lte, the range is reversed.
   */
  gte: number;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: number[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: number[];
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** SFixed32Rules describes the constraints applied to `sfixed32` values */
export interface SFixed32Rules {
  /** Const specifies that this field must be exactly the specified value */
  const: number;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt: number;
  /**
   * Lte specifies that this field must be less than or equal to the
   * specified value, inclusive
   */
  lte: number;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive. If the value of Gt is larger than a specified Lt or Lte, the
   * range is reversed.
   */
  gt: number;
  /**
   * Gte specifies that this field must be greater than or equal to the
   * specified value, inclusive. If the value of Gte is larger than a
   * specified Lt or Lte, the range is reversed.
   */
  gte: number;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: number[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: number[];
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** SFixed64Rules describes the constraints applied to `sfixed64` values */
export interface SFixed64Rules {
  /** Const specifies that this field must be exactly the specified value */
  const: number;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt: number;
  /**
   * Lte specifies that this field must be less than or equal to the
   * specified value, inclusive
   */
  lte: number;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive. If the value of Gt is larger than a specified Lt or Lte, the
   * range is reversed.
   */
  gt: number;
  /**
   * Gte specifies that this field must be greater than or equal to the
   * specified value, inclusive. If the value of Gte is larger than a
   * specified Lt or Lte, the range is reversed.
   */
  gte: number;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: number[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: number[];
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** BoolRules describes the constraints applied to `bool` values */
export interface BoolRules {
  /** Const specifies that this field must be exactly the specified value */
  const: boolean;
}

/** StringRules describe the constraints applied to `string` values */
export interface StringRules {
  /** Const specifies that this field must be exactly the specified value */
  const: string;
  /**
   * Len specifies that this field must be the specified number of
   * characters (Unicode code points). Note that the number of
   * characters may differ from the number of bytes in the string.
   */
  len: number;
  /**
   * MinLen specifies that this field must be the specified number of
   * characters (Unicode code points) at a minimum. Note that the number of
   * characters may differ from the number of bytes in the string.
   */
  minLen: number;
  /**
   * MaxLen specifies that this field must be the specified number of
   * characters (Unicode code points) at a maximum. Note that the number of
   * characters may differ from the number of bytes in the string.
   */
  maxLen: number;
  /** LenBytes specifies that this field must be the specified number of bytes */
  lenBytes: number;
  /**
   * MinBytes specifies that this field must be the specified number of bytes
   * at a minimum
   */
  minBytes: number;
  /**
   * MaxBytes specifies that this field must be the specified number of bytes
   * at a maximum
   */
  maxBytes: number;
  /**
   * Pattern specifes that this field must match against the specified
   * regular expression (RE2 syntax). The included expression should elide
   * any delimiters.
   */
  pattern: string;
  /**
   * Prefix specifies that this field must have the specified substring at
   * the beginning of the string.
   */
  prefix: string;
  /**
   * Suffix specifies that this field must have the specified substring at
   * the end of the string.
   */
  suffix: string;
  /**
   * Contains specifies that this field must have the specified substring
   * anywhere in the string.
   */
  contains: string;
  /**
   * NotContains specifies that this field cannot have the specified substring
   * anywhere in the string.
   */
  notContains: string;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: string[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: string[];
  /**
   * Email specifies that the field must be a valid email address as
   * defined by RFC 5322
   */
  email?:
    | boolean
    | undefined;
  /**
   * Hostname specifies that the field must be a valid hostname as
   * defined by RFC 1034. This constraint does not support
   * internationalized domain names (IDNs).
   */
  hostname?:
    | boolean
    | undefined;
  /**
   * Ip specifies that the field must be a valid IP (v4 or v6) address.
   * Valid IPv6 addresses should not include surrounding square brackets.
   */
  ip?:
    | boolean
    | undefined;
  /** Ipv4 specifies that the field must be a valid IPv4 address. */
  ipv4?:
    | boolean
    | undefined;
  /**
   * Ipv6 specifies that the field must be a valid IPv6 address. Valid
   * IPv6 addresses should not include surrounding square brackets.
   */
  ipv6?:
    | boolean
    | undefined;
  /**
   * Uri specifies that the field must be a valid, absolute URI as defined
   * by RFC 3986
   */
  uri?:
    | boolean
    | undefined;
  /**
   * UriRef specifies that the field must be a valid URI as defined by RFC
   * 3986 and may be relative or absolute.
   */
  uriRef?:
    | boolean
    | undefined;
  /**
   * Address specifies that the field must be either a valid hostname as
   * defined by RFC 1034 (which does not support internationalized domain
   * names or IDNs), or it can be a valid IP (v4 or v6).
   */
  address?:
    | boolean
    | undefined;
  /**
   * Uuid specifies that the field must be a valid UUID as defined by
   * RFC 4122
   */
  uuid?:
    | boolean
    | undefined;
  /** WellKnownRegex specifies a common well known pattern defined as a regex. */
  wellKnownRegex?:
    | KnownRegex
    | undefined;
  /**
   * This applies to regexes HTTP_HEADER_NAME and HTTP_HEADER_VALUE to enable
   * strict header validation.
   * By default, this is true, and HTTP header validations are RFC-compliant.
   * Setting to false will enable a looser validations that only disallows
   * \r\n\0 characters, which can be used to bypass header matching rules.
   */
  strict: boolean;
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** BytesRules describe the constraints applied to `bytes` values */
export interface BytesRules {
  /** Const specifies that this field must be exactly the specified value */
  const: Uint8Array;
  /** Len specifies that this field must be the specified number of bytes */
  len: number;
  /**
   * MinLen specifies that this field must be the specified number of bytes
   * at a minimum
   */
  minLen: number;
  /**
   * MaxLen specifies that this field must be the specified number of bytes
   * at a maximum
   */
  maxLen: number;
  /**
   * Pattern specifes that this field must match against the specified
   * regular expression (RE2 syntax). The included expression should elide
   * any delimiters.
   */
  pattern: string;
  /**
   * Prefix specifies that this field must have the specified bytes at the
   * beginning of the string.
   */
  prefix: Uint8Array;
  /**
   * Suffix specifies that this field must have the specified bytes at the
   * end of the string.
   */
  suffix: Uint8Array;
  /**
   * Contains specifies that this field must have the specified bytes
   * anywhere in the string.
   */
  contains: Uint8Array;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: Uint8Array[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: Uint8Array[];
  /**
   * Ip specifies that the field must be a valid IP (v4 or v6) address in
   * byte format
   */
  ip?:
    | boolean
    | undefined;
  /**
   * Ipv4 specifies that the field must be a valid IPv4 address in byte
   * format
   */
  ipv4?:
    | boolean
    | undefined;
  /**
   * Ipv6 specifies that the field must be a valid IPv6 address in byte
   * format
   */
  ipv6?:
    | boolean
    | undefined;
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** EnumRules describe the constraints applied to enum values */
export interface EnumRules {
  /** Const specifies that this field must be exactly the specified value */
  const: number;
  /**
   * DefinedOnly specifies that this field must be only one of the defined
   * values for this enum, failing on any undefined value.
   */
  definedOnly: boolean;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: number[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: number[];
}

/**
 * MessageRules describe the constraints applied to embedded message values.
 * For message-type fields, validation is performed recursively.
 */
export interface MessageRules {
  /**
   * Skip specifies that the validation rules of this field should not be
   * evaluated
   */
  skip: boolean;
  /** Required specifies that this field must be set */
  required: boolean;
}

/** RepeatedRules describe the constraints applied to `repeated` values */
export interface RepeatedRules {
  /**
   * MinItems specifies that this field must have the specified number of
   * items at a minimum
   */
  minItems: number;
  /**
   * MaxItems specifies that this field must have the specified number of
   * items at a maximum
   */
  maxItems: number;
  /**
   * Unique specifies that all elements in this field must be unique. This
   * contraint is only applicable to scalar and enum types (messages are not
   * supported).
   */
  unique: boolean;
  /**
   * Items specifies the contraints to be applied to each item in the field.
   * Repeated message fields will still execute validation against each item
   * unless skip is specified here.
   */
  items:
    | FieldRules
    | undefined;
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/** MapRules describe the constraints applied to `map` values */
export interface MapRules {
  /**
   * MinPairs specifies that this field must have the specified number of
   * KVs at a minimum
   */
  minPairs: number;
  /**
   * MaxPairs specifies that this field must have the specified number of
   * KVs at a maximum
   */
  maxPairs: number;
  /**
   * NoSparse specifies values in this field cannot be unset. This only
   * applies to map's with message value types.
   */
  noSparse: boolean;
  /** Keys specifies the constraints to be applied to each key in the field. */
  keys:
    | FieldRules
    | undefined;
  /**
   * Values specifies the constraints to be applied to the value of each key
   * in the field. Message values will still have their validations evaluated
   * unless skip is specified here.
   */
  values:
    | FieldRules
    | undefined;
  /**
   * IgnoreEmpty specifies that the validation rules of this field should be
   * evaluated only if the field is not empty
   */
  ignoreEmpty: boolean;
}

/**
 * AnyRules describe constraints applied exclusively to the
 * `google.protobuf.Any` well-known type
 */
export interface AnyRules {
  /** Required specifies that this field must be set */
  required: boolean;
  /**
   * In specifies that this field's `type_url` must be equal to one of the
   * specified values.
   */
  in: string[];
  /**
   * NotIn specifies that this field's `type_url` must not be equal to any of
   * the specified values.
   */
  notIn: string[];
}

/**
 * DurationRules describe the constraints applied exclusively to the
 * `google.protobuf.Duration` well-known type
 */
export interface DurationRules {
  /** Required specifies that this field must be set */
  required: boolean;
  /** Const specifies that this field must be exactly the specified value */
  const:
    | Duration
    | undefined;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt:
    | Duration
    | undefined;
  /**
   * Lt specifies that this field must be less than the specified value,
   * inclusive
   */
  lte:
    | Duration
    | undefined;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive
   */
  gt:
    | Duration
    | undefined;
  /**
   * Gte specifies that this field must be greater than the specified value,
   * inclusive
   */
  gte:
    | Duration
    | undefined;
  /**
   * In specifies that this field must be equal to one of the specified
   * values
   */
  in: Duration[];
  /**
   * NotIn specifies that this field cannot be equal to one of the specified
   * values
   */
  notIn: Duration[];
}

/**
 * TimestampRules describe the constraints applied exclusively to the
 * `google.protobuf.Timestamp` well-known type
 */
export interface TimestampRules {
  /** Required specifies that this field must be set */
  required: boolean;
  /** Const specifies that this field must be exactly the specified value */
  const:
    | Date
    | undefined;
  /**
   * Lt specifies that this field must be less than the specified value,
   * exclusive
   */
  lt:
    | Date
    | undefined;
  /**
   * Lte specifies that this field must be less than the specified value,
   * inclusive
   */
  lte:
    | Date
    | undefined;
  /**
   * Gt specifies that this field must be greater than the specified value,
   * exclusive
   */
  gt:
    | Date
    | undefined;
  /**
   * Gte specifies that this field must be greater than the specified value,
   * inclusive
   */
  gte:
    | Date
    | undefined;
  /**
   * LtNow specifies that this must be less than the current time. LtNow
   * can only be used with the Within rule.
   */
  ltNow: boolean;
  /**
   * GtNow specifies that this must be greater than the current time. GtNow
   * can only be used with the Within rule.
   */
  gtNow: boolean;
  /**
   * Within specifies that this field must be within this duration of the
   * current time. This constraint can be used alone or with the LtNow and
   * GtNow rules.
   */
  within: Duration | undefined;
}

function createBaseFieldRules(): FieldRules {
  return { message: undefined };
}

export const FieldRules = {
  fromJSON(object: any): FieldRules {
    return {
      message: isSet(object.message) ? MessageRules.fromJSON(object.message) : undefined,
      float: isSet(object.float) ? FloatRules.fromJSON(object.float) : undefined,
      double: isSet(object.double) ? DoubleRules.fromJSON(object.double) : undefined,
      int32: isSet(object.int32) ? Int32Rules.fromJSON(object.int32) : undefined,
      int64: isSet(object.int64) ? Int64Rules.fromJSON(object.int64) : undefined,
      uint32: isSet(object.uint32) ? UInt32Rules.fromJSON(object.uint32) : undefined,
      uint64: isSet(object.uint64) ? UInt64Rules.fromJSON(object.uint64) : undefined,
      sint32: isSet(object.sint32) ? SInt32Rules.fromJSON(object.sint32) : undefined,
      sint64: isSet(object.sint64) ? SInt64Rules.fromJSON(object.sint64) : undefined,
      fixed32: isSet(object.fixed32) ? Fixed32Rules.fromJSON(object.fixed32) : undefined,
      fixed64: isSet(object.fixed64) ? Fixed64Rules.fromJSON(object.fixed64) : undefined,
      sfixed32: isSet(object.sfixed32) ? SFixed32Rules.fromJSON(object.sfixed32) : undefined,
      sfixed64: isSet(object.sfixed64) ? SFixed64Rules.fromJSON(object.sfixed64) : undefined,
      bool: isSet(object.bool) ? BoolRules.fromJSON(object.bool) : undefined,
      string: isSet(object.string) ? StringRules.fromJSON(object.string) : undefined,
      bytes: isSet(object.bytes) ? BytesRules.fromJSON(object.bytes) : undefined,
      enum: isSet(object.enum) ? EnumRules.fromJSON(object.enum) : undefined,
      repeated: isSet(object.repeated) ? RepeatedRules.fromJSON(object.repeated) : undefined,
      map: isSet(object.map) ? MapRules.fromJSON(object.map) : undefined,
      any: isSet(object.any) ? AnyRules.fromJSON(object.any) : undefined,
      duration: isSet(object.duration) ? DurationRules.fromJSON(object.duration) : undefined,
      timestamp: isSet(object.timestamp) ? TimestampRules.fromJSON(object.timestamp) : undefined,
    };
  },

  toJSON(message: FieldRules): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message ? MessageRules.toJSON(message.message) : undefined);
    message.float !== undefined && (obj.float = message.float ? FloatRules.toJSON(message.float) : undefined);
    message.double !== undefined && (obj.double = message.double ? DoubleRules.toJSON(message.double) : undefined);
    message.int32 !== undefined && (obj.int32 = message.int32 ? Int32Rules.toJSON(message.int32) : undefined);
    message.int64 !== undefined && (obj.int64 = message.int64 ? Int64Rules.toJSON(message.int64) : undefined);
    message.uint32 !== undefined && (obj.uint32 = message.uint32 ? UInt32Rules.toJSON(message.uint32) : undefined);
    message.uint64 !== undefined && (obj.uint64 = message.uint64 ? UInt64Rules.toJSON(message.uint64) : undefined);
    message.sint32 !== undefined && (obj.sint32 = message.sint32 ? SInt32Rules.toJSON(message.sint32) : undefined);
    message.sint64 !== undefined && (obj.sint64 = message.sint64 ? SInt64Rules.toJSON(message.sint64) : undefined);
    message.fixed32 !== undefined && (obj.fixed32 = message.fixed32 ? Fixed32Rules.toJSON(message.fixed32) : undefined);
    message.fixed64 !== undefined && (obj.fixed64 = message.fixed64 ? Fixed64Rules.toJSON(message.fixed64) : undefined);
    message.sfixed32 !== undefined &&
      (obj.sfixed32 = message.sfixed32 ? SFixed32Rules.toJSON(message.sfixed32) : undefined);
    message.sfixed64 !== undefined &&
      (obj.sfixed64 = message.sfixed64 ? SFixed64Rules.toJSON(message.sfixed64) : undefined);
    message.bool !== undefined && (obj.bool = message.bool ? BoolRules.toJSON(message.bool) : undefined);
    message.string !== undefined && (obj.string = message.string ? StringRules.toJSON(message.string) : undefined);
    message.bytes !== undefined && (obj.bytes = message.bytes ? BytesRules.toJSON(message.bytes) : undefined);
    message.enum !== undefined && (obj.enum = message.enum ? EnumRules.toJSON(message.enum) : undefined);
    message.repeated !== undefined &&
      (obj.repeated = message.repeated ? RepeatedRules.toJSON(message.repeated) : undefined);
    message.map !== undefined && (obj.map = message.map ? MapRules.toJSON(message.map) : undefined);
    message.any !== undefined && (obj.any = message.any ? AnyRules.toJSON(message.any) : undefined);
    message.duration !== undefined &&
      (obj.duration = message.duration ? DurationRules.toJSON(message.duration) : undefined);
    message.timestamp !== undefined &&
      (obj.timestamp = message.timestamp ? TimestampRules.toJSON(message.timestamp) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<FieldRules>): FieldRules {
    const message = Object.create(createBaseFieldRules()) as FieldRules;
    message.message = (object.message !== undefined && object.message !== null)
      ? MessageRules.fromPartial(object.message)
      : undefined;
    message.float = (object.float !== undefined && object.float !== null)
      ? FloatRules.fromPartial(object.float)
      : undefined;
    message.double = (object.double !== undefined && object.double !== null)
      ? DoubleRules.fromPartial(object.double)
      : undefined;
    message.int32 = (object.int32 !== undefined && object.int32 !== null)
      ? Int32Rules.fromPartial(object.int32)
      : undefined;
    message.int64 = (object.int64 !== undefined && object.int64 !== null)
      ? Int64Rules.fromPartial(object.int64)
      : undefined;
    message.uint32 = (object.uint32 !== undefined && object.uint32 !== null)
      ? UInt32Rules.fromPartial(object.uint32)
      : undefined;
    message.uint64 = (object.uint64 !== undefined && object.uint64 !== null)
      ? UInt64Rules.fromPartial(object.uint64)
      : undefined;
    message.sint32 = (object.sint32 !== undefined && object.sint32 !== null)
      ? SInt32Rules.fromPartial(object.sint32)
      : undefined;
    message.sint64 = (object.sint64 !== undefined && object.sint64 !== null)
      ? SInt64Rules.fromPartial(object.sint64)
      : undefined;
    message.fixed32 = (object.fixed32 !== undefined && object.fixed32 !== null)
      ? Fixed32Rules.fromPartial(object.fixed32)
      : undefined;
    message.fixed64 = (object.fixed64 !== undefined && object.fixed64 !== null)
      ? Fixed64Rules.fromPartial(object.fixed64)
      : undefined;
    message.sfixed32 = (object.sfixed32 !== undefined && object.sfixed32 !== null)
      ? SFixed32Rules.fromPartial(object.sfixed32)
      : undefined;
    message.sfixed64 = (object.sfixed64 !== undefined && object.sfixed64 !== null)
      ? SFixed64Rules.fromPartial(object.sfixed64)
      : undefined;
    message.bool = (object.bool !== undefined && object.bool !== null) ? BoolRules.fromPartial(object.bool) : undefined;
    message.string = (object.string !== undefined && object.string !== null)
      ? StringRules.fromPartial(object.string)
      : undefined;
    message.bytes = (object.bytes !== undefined && object.bytes !== null)
      ? BytesRules.fromPartial(object.bytes)
      : undefined;
    message.enum = (object.enum !== undefined && object.enum !== null) ? EnumRules.fromPartial(object.enum) : undefined;
    message.repeated = (object.repeated !== undefined && object.repeated !== null)
      ? RepeatedRules.fromPartial(object.repeated)
      : undefined;
    message.map = (object.map !== undefined && object.map !== null) ? MapRules.fromPartial(object.map) : undefined;
    message.any = (object.any !== undefined && object.any !== null) ? AnyRules.fromPartial(object.any) : undefined;
    message.duration = (object.duration !== undefined && object.duration !== null)
      ? DurationRules.fromPartial(object.duration)
      : undefined;
    message.timestamp = (object.timestamp !== undefined && object.timestamp !== null)
      ? TimestampRules.fromPartial(object.timestamp)
      : undefined;
    return message;
  },
};

function createBaseFloatRules(): FloatRules {
  return { const: 0, lt: 0, lte: 0, gt: 0, gte: 0, in: [], notIn: [], ignoreEmpty: false };
}

export const FloatRules = {
  fromJSON(object: any): FloatRules {
    return {
      const: isSet(object.const) ? Number(object.const) : 0,
      lt: isSet(object.lt) ? Number(object.lt) : 0,
      lte: isSet(object.lte) ? Number(object.lte) : 0,
      gt: isSet(object.gt) ? Number(object.gt) : 0,
      gte: isSet(object.gte) ? Number(object.gte) : 0,
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => Number(e))
        : [],
      notIn: Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Number(e))
        : [],
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: FloatRules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = message.const);
    message.lt !== undefined && (obj.lt = message.lt);
    message.lte !== undefined && (obj.lte = message.lte);
    message.gt !== undefined && (obj.gt = message.gt);
    message.gte !== undefined && (obj.gte = message.gte);
    if (message.in) {
      obj.in = message.in.map((e) => e);
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => e);
    } else {
      obj.notIn = [];
    }
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<FloatRules>): FloatRules {
    const message = Object.create(createBaseFloatRules()) as FloatRules;
    message.const = object.const ?? 0;
    message.lt = object.lt ?? 0;
    message.lte = object.lte ?? 0;
    message.gt = object.gt ?? 0;
    message.gte = object.gte ?? 0;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseDoubleRules(): DoubleRules {
  return { const: 0, lt: 0, lte: 0, gt: 0, gte: 0, in: [], notIn: [], ignoreEmpty: false };
}

export const DoubleRules = {
  fromJSON(object: any): DoubleRules {
    return {
      const: isSet(object.const) ? Number(object.const) : 0,
      lt: isSet(object.lt) ? Number(object.lt) : 0,
      lte: isSet(object.lte) ? Number(object.lte) : 0,
      gt: isSet(object.gt) ? Number(object.gt) : 0,
      gte: isSet(object.gte) ? Number(object.gte) : 0,
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => Number(e))
        : [],
      notIn: Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Number(e))
        : [],
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: DoubleRules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = message.const);
    message.lt !== undefined && (obj.lt = message.lt);
    message.lte !== undefined && (obj.lte = message.lte);
    message.gt !== undefined && (obj.gt = message.gt);
    message.gte !== undefined && (obj.gte = message.gte);
    if (message.in) {
      obj.in = message.in.map((e) => e);
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => e);
    } else {
      obj.notIn = [];
    }
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<DoubleRules>): DoubleRules {
    const message = Object.create(createBaseDoubleRules()) as DoubleRules;
    message.const = object.const ?? 0;
    message.lt = object.lt ?? 0;
    message.lte = object.lte ?? 0;
    message.gt = object.gt ?? 0;
    message.gte = object.gte ?? 0;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseInt32Rules(): Int32Rules {
  return { const: 0, lt: 0, lte: 0, gt: 0, gte: 0, in: [], notIn: [], ignoreEmpty: false };
}

export const Int32Rules = {
  fromJSON(object: any): Int32Rules {
    return {
      const: isSet(object.const) ? Number(object.const) : 0,
      lt: isSet(object.lt) ? Number(object.lt) : 0,
      lte: isSet(object.lte) ? Number(object.lte) : 0,
      gt: isSet(object.gt) ? Number(object.gt) : 0,
      gte: isSet(object.gte) ? Number(object.gte) : 0,
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => Number(e))
        : [],
      notIn: Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Number(e))
        : [],
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: Int32Rules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = Math.round(message.const));
    message.lt !== undefined && (obj.lt = Math.round(message.lt));
    message.lte !== undefined && (obj.lte = Math.round(message.lte));
    message.gt !== undefined && (obj.gt = Math.round(message.gt));
    message.gte !== undefined && (obj.gte = Math.round(message.gte));
    if (message.in) {
      obj.in = message.in.map((e) => Math.round(e));
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    } else {
      obj.notIn = [];
    }
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<Int32Rules>): Int32Rules {
    const message = Object.create(createBaseInt32Rules()) as Int32Rules;
    message.const = object.const ?? 0;
    message.lt = object.lt ?? 0;
    message.lte = object.lte ?? 0;
    message.gt = object.gt ?? 0;
    message.gte = object.gte ?? 0;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseInt64Rules(): Int64Rules {
  return { const: 0, lt: 0, lte: 0, gt: 0, gte: 0, in: [], notIn: [], ignoreEmpty: false };
}

export const Int64Rules = {
  fromJSON(object: any): Int64Rules {
    return {
      const: isSet(object.const) ? Number(object.const) : 0,
      lt: isSet(object.lt) ? Number(object.lt) : 0,
      lte: isSet(object.lte) ? Number(object.lte) : 0,
      gt: isSet(object.gt) ? Number(object.gt) : 0,
      gte: isSet(object.gte) ? Number(object.gte) : 0,
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => Number(e))
        : [],
      notIn: Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Number(e))
        : [],
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: Int64Rules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = Math.round(message.const));
    message.lt !== undefined && (obj.lt = Math.round(message.lt));
    message.lte !== undefined && (obj.lte = Math.round(message.lte));
    message.gt !== undefined && (obj.gt = Math.round(message.gt));
    message.gte !== undefined && (obj.gte = Math.round(message.gte));
    if (message.in) {
      obj.in = message.in.map((e) => Math.round(e));
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    } else {
      obj.notIn = [];
    }
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<Int64Rules>): Int64Rules {
    const message = Object.create(createBaseInt64Rules()) as Int64Rules;
    message.const = object.const ?? 0;
    message.lt = object.lt ?? 0;
    message.lte = object.lte ?? 0;
    message.gt = object.gt ?? 0;
    message.gte = object.gte ?? 0;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseUInt32Rules(): UInt32Rules {
  return { const: 0, lt: 0, lte: 0, gt: 0, gte: 0, in: [], notIn: [], ignoreEmpty: false };
}

export const UInt32Rules = {
  fromJSON(object: any): UInt32Rules {
    return {
      const: isSet(object.const) ? Number(object.const) : 0,
      lt: isSet(object.lt) ? Number(object.lt) : 0,
      lte: isSet(object.lte) ? Number(object.lte) : 0,
      gt: isSet(object.gt) ? Number(object.gt) : 0,
      gte: isSet(object.gte) ? Number(object.gte) : 0,
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => Number(e))
        : [],
      notIn: Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Number(e))
        : [],
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: UInt32Rules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = Math.round(message.const));
    message.lt !== undefined && (obj.lt = Math.round(message.lt));
    message.lte !== undefined && (obj.lte = Math.round(message.lte));
    message.gt !== undefined && (obj.gt = Math.round(message.gt));
    message.gte !== undefined && (obj.gte = Math.round(message.gte));
    if (message.in) {
      obj.in = message.in.map((e) => Math.round(e));
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    } else {
      obj.notIn = [];
    }
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<UInt32Rules>): UInt32Rules {
    const message = Object.create(createBaseUInt32Rules()) as UInt32Rules;
    message.const = object.const ?? 0;
    message.lt = object.lt ?? 0;
    message.lte = object.lte ?? 0;
    message.gt = object.gt ?? 0;
    message.gte = object.gte ?? 0;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseUInt64Rules(): UInt64Rules {
  return { const: 0, lt: 0, lte: 0, gt: 0, gte: 0, in: [], notIn: [], ignoreEmpty: false };
}

export const UInt64Rules = {
  fromJSON(object: any): UInt64Rules {
    return {
      const: isSet(object.const) ? Number(object.const) : 0,
      lt: isSet(object.lt) ? Number(object.lt) : 0,
      lte: isSet(object.lte) ? Number(object.lte) : 0,
      gt: isSet(object.gt) ? Number(object.gt) : 0,
      gte: isSet(object.gte) ? Number(object.gte) : 0,
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => Number(e))
        : [],
      notIn: Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Number(e))
        : [],
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: UInt64Rules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = Math.round(message.const));
    message.lt !== undefined && (obj.lt = Math.round(message.lt));
    message.lte !== undefined && (obj.lte = Math.round(message.lte));
    message.gt !== undefined && (obj.gt = Math.round(message.gt));
    message.gte !== undefined && (obj.gte = Math.round(message.gte));
    if (message.in) {
      obj.in = message.in.map((e) => Math.round(e));
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    } else {
      obj.notIn = [];
    }
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<UInt64Rules>): UInt64Rules {
    const message = Object.create(createBaseUInt64Rules()) as UInt64Rules;
    message.const = object.const ?? 0;
    message.lt = object.lt ?? 0;
    message.lte = object.lte ?? 0;
    message.gt = object.gt ?? 0;
    message.gte = object.gte ?? 0;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseSInt32Rules(): SInt32Rules {
  return { const: 0, lt: 0, lte: 0, gt: 0, gte: 0, in: [], notIn: [], ignoreEmpty: false };
}

export const SInt32Rules = {
  fromJSON(object: any): SInt32Rules {
    return {
      const: isSet(object.const) ? Number(object.const) : 0,
      lt: isSet(object.lt) ? Number(object.lt) : 0,
      lte: isSet(object.lte) ? Number(object.lte) : 0,
      gt: isSet(object.gt) ? Number(object.gt) : 0,
      gte: isSet(object.gte) ? Number(object.gte) : 0,
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => Number(e))
        : [],
      notIn: Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Number(e))
        : [],
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: SInt32Rules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = Math.round(message.const));
    message.lt !== undefined && (obj.lt = Math.round(message.lt));
    message.lte !== undefined && (obj.lte = Math.round(message.lte));
    message.gt !== undefined && (obj.gt = Math.round(message.gt));
    message.gte !== undefined && (obj.gte = Math.round(message.gte));
    if (message.in) {
      obj.in = message.in.map((e) => Math.round(e));
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    } else {
      obj.notIn = [];
    }
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<SInt32Rules>): SInt32Rules {
    const message = Object.create(createBaseSInt32Rules()) as SInt32Rules;
    message.const = object.const ?? 0;
    message.lt = object.lt ?? 0;
    message.lte = object.lte ?? 0;
    message.gt = object.gt ?? 0;
    message.gte = object.gte ?? 0;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseSInt64Rules(): SInt64Rules {
  return { const: 0, lt: 0, lte: 0, gt: 0, gte: 0, in: [], notIn: [], ignoreEmpty: false };
}

export const SInt64Rules = {
  fromJSON(object: any): SInt64Rules {
    return {
      const: isSet(object.const) ? Number(object.const) : 0,
      lt: isSet(object.lt) ? Number(object.lt) : 0,
      lte: isSet(object.lte) ? Number(object.lte) : 0,
      gt: isSet(object.gt) ? Number(object.gt) : 0,
      gte: isSet(object.gte) ? Number(object.gte) : 0,
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => Number(e))
        : [],
      notIn: Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Number(e))
        : [],
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: SInt64Rules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = Math.round(message.const));
    message.lt !== undefined && (obj.lt = Math.round(message.lt));
    message.lte !== undefined && (obj.lte = Math.round(message.lte));
    message.gt !== undefined && (obj.gt = Math.round(message.gt));
    message.gte !== undefined && (obj.gte = Math.round(message.gte));
    if (message.in) {
      obj.in = message.in.map((e) => Math.round(e));
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    } else {
      obj.notIn = [];
    }
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<SInt64Rules>): SInt64Rules {
    const message = Object.create(createBaseSInt64Rules()) as SInt64Rules;
    message.const = object.const ?? 0;
    message.lt = object.lt ?? 0;
    message.lte = object.lte ?? 0;
    message.gt = object.gt ?? 0;
    message.gte = object.gte ?? 0;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseFixed32Rules(): Fixed32Rules {
  return { const: 0, lt: 0, lte: 0, gt: 0, gte: 0, in: [], notIn: [], ignoreEmpty: false };
}

export const Fixed32Rules = {
  fromJSON(object: any): Fixed32Rules {
    return {
      const: isSet(object.const) ? Number(object.const) : 0,
      lt: isSet(object.lt) ? Number(object.lt) : 0,
      lte: isSet(object.lte) ? Number(object.lte) : 0,
      gt: isSet(object.gt) ? Number(object.gt) : 0,
      gte: isSet(object.gte) ? Number(object.gte) : 0,
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => Number(e))
        : [],
      notIn: Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Number(e))
        : [],
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: Fixed32Rules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = Math.round(message.const));
    message.lt !== undefined && (obj.lt = Math.round(message.lt));
    message.lte !== undefined && (obj.lte = Math.round(message.lte));
    message.gt !== undefined && (obj.gt = Math.round(message.gt));
    message.gte !== undefined && (obj.gte = Math.round(message.gte));
    if (message.in) {
      obj.in = message.in.map((e) => Math.round(e));
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    } else {
      obj.notIn = [];
    }
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<Fixed32Rules>): Fixed32Rules {
    const message = Object.create(createBaseFixed32Rules()) as Fixed32Rules;
    message.const = object.const ?? 0;
    message.lt = object.lt ?? 0;
    message.lte = object.lte ?? 0;
    message.gt = object.gt ?? 0;
    message.gte = object.gte ?? 0;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseFixed64Rules(): Fixed64Rules {
  return { const: 0, lt: 0, lte: 0, gt: 0, gte: 0, in: [], notIn: [], ignoreEmpty: false };
}

export const Fixed64Rules = {
  fromJSON(object: any): Fixed64Rules {
    return {
      const: isSet(object.const) ? Number(object.const) : 0,
      lt: isSet(object.lt) ? Number(object.lt) : 0,
      lte: isSet(object.lte) ? Number(object.lte) : 0,
      gt: isSet(object.gt) ? Number(object.gt) : 0,
      gte: isSet(object.gte) ? Number(object.gte) : 0,
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => Number(e))
        : [],
      notIn: Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Number(e))
        : [],
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: Fixed64Rules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = Math.round(message.const));
    message.lt !== undefined && (obj.lt = Math.round(message.lt));
    message.lte !== undefined && (obj.lte = Math.round(message.lte));
    message.gt !== undefined && (obj.gt = Math.round(message.gt));
    message.gte !== undefined && (obj.gte = Math.round(message.gte));
    if (message.in) {
      obj.in = message.in.map((e) => Math.round(e));
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    } else {
      obj.notIn = [];
    }
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<Fixed64Rules>): Fixed64Rules {
    const message = Object.create(createBaseFixed64Rules()) as Fixed64Rules;
    message.const = object.const ?? 0;
    message.lt = object.lt ?? 0;
    message.lte = object.lte ?? 0;
    message.gt = object.gt ?? 0;
    message.gte = object.gte ?? 0;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseSFixed32Rules(): SFixed32Rules {
  return { const: 0, lt: 0, lte: 0, gt: 0, gte: 0, in: [], notIn: [], ignoreEmpty: false };
}

export const SFixed32Rules = {
  fromJSON(object: any): SFixed32Rules {
    return {
      const: isSet(object.const) ? Number(object.const) : 0,
      lt: isSet(object.lt) ? Number(object.lt) : 0,
      lte: isSet(object.lte) ? Number(object.lte) : 0,
      gt: isSet(object.gt) ? Number(object.gt) : 0,
      gte: isSet(object.gte) ? Number(object.gte) : 0,
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => Number(e))
        : [],
      notIn: Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Number(e))
        : [],
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: SFixed32Rules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = Math.round(message.const));
    message.lt !== undefined && (obj.lt = Math.round(message.lt));
    message.lte !== undefined && (obj.lte = Math.round(message.lte));
    message.gt !== undefined && (obj.gt = Math.round(message.gt));
    message.gte !== undefined && (obj.gte = Math.round(message.gte));
    if (message.in) {
      obj.in = message.in.map((e) => Math.round(e));
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    } else {
      obj.notIn = [];
    }
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<SFixed32Rules>): SFixed32Rules {
    const message = Object.create(createBaseSFixed32Rules()) as SFixed32Rules;
    message.const = object.const ?? 0;
    message.lt = object.lt ?? 0;
    message.lte = object.lte ?? 0;
    message.gt = object.gt ?? 0;
    message.gte = object.gte ?? 0;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseSFixed64Rules(): SFixed64Rules {
  return { const: 0, lt: 0, lte: 0, gt: 0, gte: 0, in: [], notIn: [], ignoreEmpty: false };
}

export const SFixed64Rules = {
  fromJSON(object: any): SFixed64Rules {
    return {
      const: isSet(object.const) ? Number(object.const) : 0,
      lt: isSet(object.lt) ? Number(object.lt) : 0,
      lte: isSet(object.lte) ? Number(object.lte) : 0,
      gt: isSet(object.gt) ? Number(object.gt) : 0,
      gte: isSet(object.gte) ? Number(object.gte) : 0,
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => Number(e))
        : [],
      notIn: Array.isArray(object?.notIn)
        ? object.notIn.map((e: any) => Number(e))
        : [],
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: SFixed64Rules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = Math.round(message.const));
    message.lt !== undefined && (obj.lt = Math.round(message.lt));
    message.lte !== undefined && (obj.lte = Math.round(message.lte));
    message.gt !== undefined && (obj.gt = Math.round(message.gt));
    message.gte !== undefined && (obj.gte = Math.round(message.gte));
    if (message.in) {
      obj.in = message.in.map((e) => Math.round(e));
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    } else {
      obj.notIn = [];
    }
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<SFixed64Rules>): SFixed64Rules {
    const message = Object.create(createBaseSFixed64Rules()) as SFixed64Rules;
    message.const = object.const ?? 0;
    message.lt = object.lt ?? 0;
    message.lte = object.lte ?? 0;
    message.gt = object.gt ?? 0;
    message.gte = object.gte ?? 0;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseBoolRules(): BoolRules {
  return { const: false };
}

export const BoolRules = {
  fromJSON(object: any): BoolRules {
    return { const: isSet(object.const) ? Boolean(object.const) : false };
  },

  toJSON(message: BoolRules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = message.const);
    return obj;
  },

  fromPartial(object: DeepPartial<BoolRules>): BoolRules {
    const message = Object.create(createBaseBoolRules()) as BoolRules;
    message.const = object.const ?? false;
    return message;
  },
};

function createBaseStringRules(): StringRules {
  return {
    const: "",
    len: 0,
    minLen: 0,
    maxLen: 0,
    lenBytes: 0,
    minBytes: 0,
    maxBytes: 0,
    pattern: "",
    prefix: "",
    suffix: "",
    contains: "",
    notContains: "",
    in: [],
    notIn: [],
    strict: false,
    ignoreEmpty: false,
  };
}

export const StringRules = {
  fromJSON(object: any): StringRules {
    return {
      const: isSet(object.const) ? String(object.const) : "",
      len: isSet(object.len) ? Number(object.len) : 0,
      minLen: isSet(object.minLen) ? Number(object.minLen) : 0,
      maxLen: isSet(object.maxLen) ? Number(object.maxLen) : 0,
      lenBytes: isSet(object.lenBytes) ? Number(object.lenBytes) : 0,
      minBytes: isSet(object.minBytes) ? Number(object.minBytes) : 0,
      maxBytes: isSet(object.maxBytes) ? Number(object.maxBytes) : 0,
      pattern: isSet(object.pattern) ? String(object.pattern) : "",
      prefix: isSet(object.prefix) ? String(object.prefix) : "",
      suffix: isSet(object.suffix) ? String(object.suffix) : "",
      contains: isSet(object.contains) ? String(object.contains) : "",
      notContains: isSet(object.notContains) ? String(object.notContains) : "",
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => String(e))
        : [],
      notIn: Array.isArray(object?.notIn) ? object.notIn.map((e: any) => String(e)) : [],
      email: isSet(object.email) ? Boolean(object.email) : undefined,
      hostname: isSet(object.hostname) ? Boolean(object.hostname) : undefined,
      ip: isSet(object.ip) ? Boolean(object.ip) : undefined,
      ipv4: isSet(object.ipv4) ? Boolean(object.ipv4) : undefined,
      ipv6: isSet(object.ipv6) ? Boolean(object.ipv6) : undefined,
      uri: isSet(object.uri) ? Boolean(object.uri) : undefined,
      uriRef: isSet(object.uriRef) ? Boolean(object.uriRef) : undefined,
      address: isSet(object.address) ? Boolean(object.address) : undefined,
      uuid: isSet(object.uuid) ? Boolean(object.uuid) : undefined,
      wellKnownRegex: isSet(object.wellKnownRegex) ? knownRegexFromJSON(object.wellKnownRegex) : undefined,
      strict: isSet(object.strict) ? Boolean(object.strict) : false,
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: StringRules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = message.const);
    message.len !== undefined && (obj.len = Math.round(message.len));
    message.minLen !== undefined && (obj.minLen = Math.round(message.minLen));
    message.maxLen !== undefined && (obj.maxLen = Math.round(message.maxLen));
    message.lenBytes !== undefined && (obj.lenBytes = Math.round(message.lenBytes));
    message.minBytes !== undefined && (obj.minBytes = Math.round(message.minBytes));
    message.maxBytes !== undefined && (obj.maxBytes = Math.round(message.maxBytes));
    message.pattern !== undefined && (obj.pattern = message.pattern);
    message.prefix !== undefined && (obj.prefix = message.prefix);
    message.suffix !== undefined && (obj.suffix = message.suffix);
    message.contains !== undefined && (obj.contains = message.contains);
    message.notContains !== undefined && (obj.notContains = message.notContains);
    if (message.in) {
      obj.in = message.in.map((e) => e);
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => e);
    } else {
      obj.notIn = [];
    }
    message.email !== undefined && (obj.email = message.email);
    message.hostname !== undefined && (obj.hostname = message.hostname);
    message.ip !== undefined && (obj.ip = message.ip);
    message.ipv4 !== undefined && (obj.ipv4 = message.ipv4);
    message.ipv6 !== undefined && (obj.ipv6 = message.ipv6);
    message.uri !== undefined && (obj.uri = message.uri);
    message.uriRef !== undefined && (obj.uriRef = message.uriRef);
    message.address !== undefined && (obj.address = message.address);
    message.uuid !== undefined && (obj.uuid = message.uuid);
    message.wellKnownRegex !== undefined &&
      (obj.wellKnownRegex = message.wellKnownRegex !== undefined
        ? knownRegexToJSON(message.wellKnownRegex)
        : undefined);
    message.strict !== undefined && (obj.strict = message.strict);
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<StringRules>): StringRules {
    const message = Object.create(createBaseStringRules()) as StringRules;
    message.const = object.const ?? "";
    message.len = object.len ?? 0;
    message.minLen = object.minLen ?? 0;
    message.maxLen = object.maxLen ?? 0;
    message.lenBytes = object.lenBytes ?? 0;
    message.minBytes = object.minBytes ?? 0;
    message.maxBytes = object.maxBytes ?? 0;
    message.pattern = object.pattern ?? "";
    message.prefix = object.prefix ?? "";
    message.suffix = object.suffix ?? "";
    message.contains = object.contains ?? "";
    message.notContains = object.notContains ?? "";
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.email = object.email ?? undefined;
    message.hostname = object.hostname ?? undefined;
    message.ip = object.ip ?? undefined;
    message.ipv4 = object.ipv4 ?? undefined;
    message.ipv6 = object.ipv6 ?? undefined;
    message.uri = object.uri ?? undefined;
    message.uriRef = object.uriRef ?? undefined;
    message.address = object.address ?? undefined;
    message.uuid = object.uuid ?? undefined;
    message.wellKnownRegex = object.wellKnownRegex ?? undefined;
    message.strict = object.strict ?? false;
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseBytesRules(): BytesRules {
  return {
    const: new Uint8Array(),
    len: 0,
    minLen: 0,
    maxLen: 0,
    pattern: "",
    prefix: new Uint8Array(),
    suffix: new Uint8Array(),
    contains: new Uint8Array(),
    in: [],
    notIn: [],
    ignoreEmpty: false,
  };
}

export const BytesRules = {
  fromJSON(object: any): BytesRules {
    return {
      const: isSet(object.const) ? bytesFromBase64(object.const) : new Uint8Array(),
      len: isSet(object.len) ? Number(object.len) : 0,
      minLen: isSet(object.minLen) ? Number(object.minLen) : 0,
      maxLen: isSet(object.maxLen) ? Number(object.maxLen) : 0,
      pattern: isSet(object.pattern) ? String(object.pattern) : "",
      prefix: isSet(object.prefix) ? bytesFromBase64(object.prefix) : new Uint8Array(),
      suffix: isSet(object.suffix) ? bytesFromBase64(object.suffix) : new Uint8Array(),
      contains: isSet(object.contains) ? bytesFromBase64(object.contains) : new Uint8Array(),
      in: Array.isArray(object?.in)
        ? object.in.map((e: any) => bytesFromBase64(e))
        : [],
      notIn: Array.isArray(object?.notIn) ? object.notIn.map((e: any) => bytesFromBase64(e)) : [],
      ip: isSet(object.ip) ? Boolean(object.ip) : undefined,
      ipv4: isSet(object.ipv4) ? Boolean(object.ipv4) : undefined,
      ipv6: isSet(object.ipv6) ? Boolean(object.ipv6) : undefined,
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: BytesRules): unknown {
    const obj: any = {};
    message.const !== undefined &&
      (obj.const = base64FromBytes(message.const !== undefined ? message.const : new Uint8Array()));
    message.len !== undefined && (obj.len = Math.round(message.len));
    message.minLen !== undefined && (obj.minLen = Math.round(message.minLen));
    message.maxLen !== undefined && (obj.maxLen = Math.round(message.maxLen));
    message.pattern !== undefined && (obj.pattern = message.pattern);
    message.prefix !== undefined &&
      (obj.prefix = base64FromBytes(message.prefix !== undefined ? message.prefix : new Uint8Array()));
    message.suffix !== undefined &&
      (obj.suffix = base64FromBytes(message.suffix !== undefined ? message.suffix : new Uint8Array()));
    message.contains !== undefined &&
      (obj.contains = base64FromBytes(message.contains !== undefined ? message.contains : new Uint8Array()));
    if (message.in) {
      obj.in = message.in.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => base64FromBytes(e !== undefined ? e : new Uint8Array()));
    } else {
      obj.notIn = [];
    }
    message.ip !== undefined && (obj.ip = message.ip);
    message.ipv4 !== undefined && (obj.ipv4 = message.ipv4);
    message.ipv6 !== undefined && (obj.ipv6 = message.ipv6);
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<BytesRules>): BytesRules {
    const message = Object.create(createBaseBytesRules()) as BytesRules;
    message.const = object.const ?? new Uint8Array();
    message.len = object.len ?? 0;
    message.minLen = object.minLen ?? 0;
    message.maxLen = object.maxLen ?? 0;
    message.pattern = object.pattern ?? "";
    message.prefix = object.prefix ?? new Uint8Array();
    message.suffix = object.suffix ?? new Uint8Array();
    message.contains = object.contains ?? new Uint8Array();
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    message.ip = object.ip ?? undefined;
    message.ipv4 = object.ipv4 ?? undefined;
    message.ipv6 = object.ipv6 ?? undefined;
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseEnumRules(): EnumRules {
  return { const: 0, definedOnly: false, in: [], notIn: [] };
}

export const EnumRules = {
  fromJSON(object: any): EnumRules {
    return {
      const: isSet(object.const) ? Number(object.const) : 0,
      definedOnly: isSet(object.definedOnly) ? Boolean(object.definedOnly) : false,
      in: Array.isArray(object?.in) ? object.in.map((e: any) => Number(e)) : [],
      notIn: Array.isArray(object?.notIn) ? object.notIn.map((e: any) => Number(e)) : [],
    };
  },

  toJSON(message: EnumRules): unknown {
    const obj: any = {};
    message.const !== undefined && (obj.const = Math.round(message.const));
    message.definedOnly !== undefined && (obj.definedOnly = message.definedOnly);
    if (message.in) {
      obj.in = message.in.map((e) => Math.round(e));
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => Math.round(e));
    } else {
      obj.notIn = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<EnumRules>): EnumRules {
    const message = Object.create(createBaseEnumRules()) as EnumRules;
    message.const = object.const ?? 0;
    message.definedOnly = object.definedOnly ?? false;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    return message;
  },
};

function createBaseMessageRules(): MessageRules {
  return { skip: false, required: false };
}

export const MessageRules = {
  fromJSON(object: any): MessageRules {
    return {
      skip: isSet(object.skip) ? Boolean(object.skip) : false,
      required: isSet(object.required) ? Boolean(object.required) : false,
    };
  },

  toJSON(message: MessageRules): unknown {
    const obj: any = {};
    message.skip !== undefined && (obj.skip = message.skip);
    message.required !== undefined && (obj.required = message.required);
    return obj;
  },

  fromPartial(object: DeepPartial<MessageRules>): MessageRules {
    const message = Object.create(createBaseMessageRules()) as MessageRules;
    message.skip = object.skip ?? false;
    message.required = object.required ?? false;
    return message;
  },
};

function createBaseRepeatedRules(): RepeatedRules {
  return { minItems: 0, maxItems: 0, unique: false, items: undefined, ignoreEmpty: false };
}

export const RepeatedRules = {
  fromJSON(object: any): RepeatedRules {
    return {
      minItems: isSet(object.minItems) ? Number(object.minItems) : 0,
      maxItems: isSet(object.maxItems) ? Number(object.maxItems) : 0,
      unique: isSet(object.unique) ? Boolean(object.unique) : false,
      items: isSet(object.items) ? FieldRules.fromJSON(object.items) : undefined,
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: RepeatedRules): unknown {
    const obj: any = {};
    message.minItems !== undefined && (obj.minItems = Math.round(message.minItems));
    message.maxItems !== undefined && (obj.maxItems = Math.round(message.maxItems));
    message.unique !== undefined && (obj.unique = message.unique);
    message.items !== undefined && (obj.items = message.items ? FieldRules.toJSON(message.items) : undefined);
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<RepeatedRules>): RepeatedRules {
    const message = Object.create(createBaseRepeatedRules()) as RepeatedRules;
    message.minItems = object.minItems ?? 0;
    message.maxItems = object.maxItems ?? 0;
    message.unique = object.unique ?? false;
    message.items = (object.items !== undefined && object.items !== null)
      ? FieldRules.fromPartial(object.items)
      : undefined;
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseMapRules(): MapRules {
  return { minPairs: 0, maxPairs: 0, noSparse: false, keys: undefined, values: undefined, ignoreEmpty: false };
}

export const MapRules = {
  fromJSON(object: any): MapRules {
    return {
      minPairs: isSet(object.minPairs) ? Number(object.minPairs) : 0,
      maxPairs: isSet(object.maxPairs) ? Number(object.maxPairs) : 0,
      noSparse: isSet(object.noSparse) ? Boolean(object.noSparse) : false,
      keys: isSet(object.keys) ? FieldRules.fromJSON(object.keys) : undefined,
      values: isSet(object.values) ? FieldRules.fromJSON(object.values) : undefined,
      ignoreEmpty: isSet(object.ignoreEmpty) ? Boolean(object.ignoreEmpty) : false,
    };
  },

  toJSON(message: MapRules): unknown {
    const obj: any = {};
    message.minPairs !== undefined && (obj.minPairs = Math.round(message.minPairs));
    message.maxPairs !== undefined && (obj.maxPairs = Math.round(message.maxPairs));
    message.noSparse !== undefined && (obj.noSparse = message.noSparse);
    message.keys !== undefined && (obj.keys = message.keys ? FieldRules.toJSON(message.keys) : undefined);
    message.values !== undefined && (obj.values = message.values ? FieldRules.toJSON(message.values) : undefined);
    message.ignoreEmpty !== undefined && (obj.ignoreEmpty = message.ignoreEmpty);
    return obj;
  },

  fromPartial(object: DeepPartial<MapRules>): MapRules {
    const message = Object.create(createBaseMapRules()) as MapRules;
    message.minPairs = object.minPairs ?? 0;
    message.maxPairs = object.maxPairs ?? 0;
    message.noSparse = object.noSparse ?? false;
    message.keys = (object.keys !== undefined && object.keys !== null)
      ? FieldRules.fromPartial(object.keys)
      : undefined;
    message.values = (object.values !== undefined && object.values !== null)
      ? FieldRules.fromPartial(object.values)
      : undefined;
    message.ignoreEmpty = object.ignoreEmpty ?? false;
    return message;
  },
};

function createBaseAnyRules(): AnyRules {
  return { required: false, in: [], notIn: [] };
}

export const AnyRules = {
  fromJSON(object: any): AnyRules {
    return {
      required: isSet(object.required) ? Boolean(object.required) : false,
      in: Array.isArray(object?.in) ? object.in.map((e: any) => String(e)) : [],
      notIn: Array.isArray(object?.notIn) ? object.notIn.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: AnyRules): unknown {
    const obj: any = {};
    message.required !== undefined && (obj.required = message.required);
    if (message.in) {
      obj.in = message.in.map((e) => e);
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => e);
    } else {
      obj.notIn = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<AnyRules>): AnyRules {
    const message = Object.create(createBaseAnyRules()) as AnyRules;
    message.required = object.required ?? false;
    message.in = object.in?.map((e) => e) || [];
    message.notIn = object.notIn?.map((e) => e) || [];
    return message;
  },
};

function createBaseDurationRules(): DurationRules {
  return {
    required: false,
    const: undefined,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    in: [],
    notIn: [],
  };
}

export const DurationRules = {
  fromJSON(object: any): DurationRules {
    return {
      required: isSet(object.required) ? Boolean(object.required) : false,
      const: isSet(object.const) ? Duration.fromJSON(object.const) : undefined,
      lt: isSet(object.lt) ? Duration.fromJSON(object.lt) : undefined,
      lte: isSet(object.lte) ? Duration.fromJSON(object.lte) : undefined,
      gt: isSet(object.gt) ? Duration.fromJSON(object.gt) : undefined,
      gte: isSet(object.gte) ? Duration.fromJSON(object.gte) : undefined,
      in: Array.isArray(object?.in) ? object.in.map((e: any) => Duration.fromJSON(e)) : [],
      notIn: Array.isArray(object?.notIn) ? object.notIn.map((e: any) => Duration.fromJSON(e)) : [],
    };
  },

  toJSON(message: DurationRules): unknown {
    const obj: any = {};
    message.required !== undefined && (obj.required = message.required);
    message.const !== undefined && (obj.const = message.const ? Duration.toJSON(message.const) : undefined);
    message.lt !== undefined && (obj.lt = message.lt ? Duration.toJSON(message.lt) : undefined);
    message.lte !== undefined && (obj.lte = message.lte ? Duration.toJSON(message.lte) : undefined);
    message.gt !== undefined && (obj.gt = message.gt ? Duration.toJSON(message.gt) : undefined);
    message.gte !== undefined && (obj.gte = message.gte ? Duration.toJSON(message.gte) : undefined);
    if (message.in) {
      obj.in = message.in.map((e) => e ? Duration.toJSON(e) : undefined);
    } else {
      obj.in = [];
    }
    if (message.notIn) {
      obj.notIn = message.notIn.map((e) => e ? Duration.toJSON(e) : undefined);
    } else {
      obj.notIn = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<DurationRules>): DurationRules {
    const message = Object.create(createBaseDurationRules()) as DurationRules;
    message.required = object.required ?? false;
    message.const = (object.const !== undefined && object.const !== null)
      ? Duration.fromPartial(object.const)
      : undefined;
    message.lt = (object.lt !== undefined && object.lt !== null) ? Duration.fromPartial(object.lt) : undefined;
    message.lte = (object.lte !== undefined && object.lte !== null) ? Duration.fromPartial(object.lte) : undefined;
    message.gt = (object.gt !== undefined && object.gt !== null) ? Duration.fromPartial(object.gt) : undefined;
    message.gte = (object.gte !== undefined && object.gte !== null) ? Duration.fromPartial(object.gte) : undefined;
    message.in = object.in?.map((e) => Duration.fromPartial(e)) || [];
    message.notIn = object.notIn?.map((e) => Duration.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTimestampRules(): TimestampRules {
  return {
    required: false,
    const: undefined,
    lt: undefined,
    lte: undefined,
    gt: undefined,
    gte: undefined,
    ltNow: false,
    gtNow: false,
    within: undefined,
  };
}

export const TimestampRules = {
  fromJSON(object: any): TimestampRules {
    return {
      required: isSet(object.required) ? Boolean(object.required) : false,
      const: isSet(object.const) ? fromJsonTimestamp(object.const) : undefined,
      lt: isSet(object.lt) ? fromJsonTimestamp(object.lt) : undefined,
      lte: isSet(object.lte) ? fromJsonTimestamp(object.lte) : undefined,
      gt: isSet(object.gt) ? fromJsonTimestamp(object.gt) : undefined,
      gte: isSet(object.gte) ? fromJsonTimestamp(object.gte) : undefined,
      ltNow: isSet(object.ltNow) ? Boolean(object.ltNow) : false,
      gtNow: isSet(object.gtNow) ? Boolean(object.gtNow) : false,
      within: isSet(object.within) ? Duration.fromJSON(object.within) : undefined,
    };
  },

  toJSON(message: TimestampRules): unknown {
    const obj: any = {};
    message.required !== undefined && (obj.required = message.required);
    message.const !== undefined && (obj.const = message.const.toISOString());
    message.lt !== undefined && (obj.lt = message.lt.toISOString());
    message.lte !== undefined && (obj.lte = message.lte.toISOString());
    message.gt !== undefined && (obj.gt = message.gt.toISOString());
    message.gte !== undefined && (obj.gte = message.gte.toISOString());
    message.ltNow !== undefined && (obj.ltNow = message.ltNow);
    message.gtNow !== undefined && (obj.gtNow = message.gtNow);
    message.within !== undefined && (obj.within = message.within ? Duration.toJSON(message.within) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<TimestampRules>): TimestampRules {
    const message = Object.create(createBaseTimestampRules()) as TimestampRules;
    message.required = object.required ?? false;
    message.const = object.const ?? undefined;
    message.lt = object.lt ?? undefined;
    message.lte = object.lte ?? undefined;
    message.gt = object.gt ?? undefined;
    message.gte = object.gte ?? undefined;
    message.ltNow = object.ltNow ?? false;
    message.gtNow = object.gtNow ?? false;
    message.within = (object.within !== undefined && object.within !== null)
      ? Duration.fromPartial(object.within)
      : undefined;
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
