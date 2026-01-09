import {
  formatIncompletePhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import {
  parsePhoneNumberWithError,
  CountryCode,
  PhoneNumber,
  ParseError,
} from "libphonenumber-js";

export class PhoneNumberError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = "PhoneNumberError";
    Object.setPrototypeOf(this, PhoneNumberError.prototype);
  }
}

export class InvalidPhoneNumberError extends PhoneNumberError {
  constructor(
    message: string,
    public readonly phoneNumber: string,
    originalError?: unknown
  ) {
    super(message, originalError);
    this.name = "InvalidPhoneNumberError";
    Object.setPrototypeOf(this, InvalidPhoneNumberError.prototype);
  }
}

type PhoneNumberFormat =
  | "E.164"
  | "International"
  | "National"
  | "RFC3966"
  | "National-No-Spaces";

interface FormatPhoneOptions {
  /** The country code to use for parsing the phone number (e.g., 'US', 'GB') */
  countryCode?: CountryCode;
  /** The format to return the phone number in */
  format?: PhoneNumberFormat;
  /** Whether to add left-to-right mark for RTL support */
  rtl?: boolean;
  /** Whether to throw errors on invalid phone numbers */
  strict?: boolean;
}

/**
 * Formats a phone number according to the specified options
 * @param phone The phone number to format
 * @param options Formatting options
 * @returns Formatted phone number or original string if parsing fails and not in strict mode
 * @throws {InvalidPhoneNumberError} When phone number is invalid and strict mode is true
 */
export function formatPhone(
  phone: string,
  options: FormatPhoneOptions = {}
): string {
  const {
    countryCode = "US",
    format = "International",
    rtl = true,
    strict = false,
  } = options;

  if (!phone?.trim()) {
    const error = new InvalidPhoneNumberError("Phone number is empty", phone);
    if (strict) throw error;
    return phone;
  }

  try {
    const cleaned = phone.replace(/\D/g, "");
    const parsed = parsePhoneNumberWithError(cleaned, countryCode);

    if (!parsed.isValid()) {
      throw new InvalidPhoneNumberError("Invalid phone number", phone);
    }

    let formatted: string;
    switch (format) {
      case "E.164":
        formatted = parsed.format("E.164");
        break;
      case "International":
        formatted = parsed.formatInternational();
        break;
      case "National":
        formatted = parsed.formatNational();
        break;
      case "RFC3966":
        formatted = parsed.format("RFC3966");
        break;
      case "National-No-Spaces":
        formatted = parsed.formatNational().replace(/\s+/g, "");
        break;
      default:
        formatted = parsed.formatInternational();
    }

    return rtl ? "\u200E" + formatted : formatted;
  } catch (error) {
    const errorMessage =
      error instanceof ParseError
        ? `Invalid phone number format: ${error.message}`
        : `Failed to parse phone number: ${
            error instanceof Error ? error.message : String(error)
          }`;

    const phoneError = new InvalidPhoneNumberError(errorMessage, phone, error);

    if (strict) {
      throw phoneError;
    }

    console.warn(phoneError.message, { phone, countryCode });
    return phone;
  }
}

/**
 * Extracts the country calling code from a phone number
 * @param phone The phone number to extract from
 * @returns The country calling code or null if not found
 */
export function getCountryCallingCode(phone: string): string | null {
  try {
    const parsed = parsePhoneNumberWithError(phone);
    return parsed.countryCallingCode ? `+${parsed.countryCallingCode}` : null;
  } catch {
    return null;
  }
}

/**
 * Checks if a phone number is valid for a specific country
 * @param phone The phone number to validate
 * @param countryCode The country code to validate against
 * @returns boolean indicating if the phone number is valid
 */
export function isValidPhoneNumber(
  phone: string,
  countryCode?: CountryCode
): boolean {
  try {
    const parsed = countryCode
      ? parsePhoneNumberWithError(phone, countryCode)
      : parsePhoneNumberWithError(phone);
    return parsed.isValid();
  } catch {
    return false;
  }
}
export function getCountryFromPhone(phone: string): string {
  const phoneNumber = parsePhoneNumberFromString(phone);

  return phoneNumber?.country ?? "";
}
