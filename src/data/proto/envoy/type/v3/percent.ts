/* eslint-disable */

export const protobufPackage = "envoy.type.v3";

/** Identifies a percentage, in the range [0.0, 100.0]. */
export interface Percent {
  value: number;
}

/**
 * A fractional percentage is used in cases in which for performance reasons performing floating
 * point to integer conversions during randomness calculations is undesirable. The message includes
 * both a numerator and denominator that together determine the final fractional value.
 *
 * * **Example**: 1/100 = 1%.
 * * **Example**: 3/10000 = 0.03%.
 */
export interface FractionalPercent {
  /** Specifies the numerator. Defaults to 0. */
  numerator: number;
  /**
   * Specifies the denominator. If the denominator specified is less than the numerator, the final
   * fractional percentage is capped at 1 (100%).
   */
  denominator: FractionalPercent_DenominatorType;
}

/** Fraction percentages support several fixed denominator values. */
export enum FractionalPercent_DenominatorType {
  /**
   * HUNDRED - 100.
   *
   * **Example**: 1/100 = 1%.
   */
  HUNDRED = "HUNDRED",
  /**
   * TEN_THOUSAND - 10,000.
   *
   * **Example**: 1/10000 = 0.01%.
   */
  TEN_THOUSAND = "TEN_THOUSAND",
  /**
   * MILLION - 1,000,000.
   *
   * **Example**: 1/1000000 = 0.0001%.
   */
  MILLION = "MILLION",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function fractionalPercent_DenominatorTypeFromJSON(object: any): FractionalPercent_DenominatorType {
  switch (object) {
    case 0:
    case "HUNDRED":
      return FractionalPercent_DenominatorType.HUNDRED;
    case 1:
    case "TEN_THOUSAND":
      return FractionalPercent_DenominatorType.TEN_THOUSAND;
    case 2:
    case "MILLION":
      return FractionalPercent_DenominatorType.MILLION;
    case -1:
    case "UNRECOGNIZED":
    default:
      return FractionalPercent_DenominatorType.UNRECOGNIZED;
  }
}

export function fractionalPercent_DenominatorTypeToJSON(object: FractionalPercent_DenominatorType): string {
  switch (object) {
    case FractionalPercent_DenominatorType.HUNDRED:
      return "HUNDRED";
    case FractionalPercent_DenominatorType.TEN_THOUSAND:
      return "TEN_THOUSAND";
    case FractionalPercent_DenominatorType.MILLION:
      return "MILLION";
    case FractionalPercent_DenominatorType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

function createBasePercent(): Percent {
  return { value: 0 };
}

export const Percent = {
  fromJSON(object: any): Percent {
    return { value: isSet(object.value) ? Number(object.value) : 0 };
  },

  toJSON(message: Percent): unknown {
    const obj: any = {};
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<Percent>): Percent {
    const message = Object.create(createBasePercent()) as Percent;
    message.value = object.value ?? 0;
    return message;
  },
};

function createBaseFractionalPercent(): FractionalPercent {
  return { numerator: 0, denominator: FractionalPercent_DenominatorType.HUNDRED };
}

export const FractionalPercent = {
  fromJSON(object: any): FractionalPercent {
    return {
      numerator: isSet(object.numerator) ? Number(object.numerator) : 0,
      denominator: isSet(object.denominator)
        ? fractionalPercent_DenominatorTypeFromJSON(object.denominator)
        : FractionalPercent_DenominatorType.HUNDRED,
    };
  },

  toJSON(message: FractionalPercent): unknown {
    const obj: any = {};
    message.numerator !== undefined && (obj.numerator = Math.round(message.numerator));
    message.denominator !== undefined &&
      (obj.denominator = fractionalPercent_DenominatorTypeToJSON(message.denominator));
    return obj;
  },

  fromPartial(object: DeepPartial<FractionalPercent>): FractionalPercent {
    const message = Object.create(createBaseFractionalPercent()) as FractionalPercent;
    message.numerator = object.numerator ?? 0;
    message.denominator = object.denominator ?? FractionalPercent_DenominatorType.HUNDRED;
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
