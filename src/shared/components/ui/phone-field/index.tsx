"use client";

import {
  AsYouType,
  type CountryCode,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js/min";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type Key, ListLayout, Virtualizer } from "react-aria-components";

import { Button } from "../button";
import { ListBox } from "../list-box";
import { PopoverContent } from "../popover";
import { Select } from "../select";
import type { TextFieldProps } from "../text-field";
import { TextField } from "../text-field";

// Common country codes for initial load (most frequently used)
const COMMON_COUNTRIES = [
  {
    code: "US" as CountryCode,
    name: "United States",
    flag: "🇺🇸",
    prefix: "+1",
  },
  {
    code: "GB" as CountryCode,
    name: "United Kingdom",
    flag: "🇬🇧",
    prefix: "+44",
  },
  { code: "ES" as CountryCode, name: "Spain", flag: "🇪🇸", prefix: "+34" },
  { code: "FR" as CountryCode, name: "France", flag: "🇫🇷", prefix: "+33" },
  { code: "DE" as CountryCode, name: "Germany", flag: "🇩🇪", prefix: "+49" },
];

// Convert country code to flag emoji
function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Get example phone number for a country
async function getExampleForCountry(countryCode: CountryCode): Promise<string> {
  try {
    const examples = await import("libphonenumber-js/examples.mobile.json");
    const example = getExampleNumber(countryCode, examples.default);
    return example ? example.formatNational() : "";
  } catch (error) {
    console.warn("Failed to load phone examples:", error);
    return "";
  }
}

interface PhoneFieldProps
  extends Omit<
    TextFieldProps,
    "type" | "onChange" | "isRevealable" | "prefix" | "value"
  > {
  value?: string;
  onChange?: (value: string) => void;
  defaultCountry?: CountryCode;
  onCountryChange?: (country: CountryCode) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export const PhoneField = ({
  value = "",
  onChange,
  defaultCountry = "ES" as CountryCode,
  onCountryChange,
  onValidityChange,
  ...props
}: PhoneFieldProps) => {
  // Detect initial country from the value
  const initialCountry = useMemo(() => {
    if (value) {
      try {
        const parsedNumber = parsePhoneNumberFromString(value);
        if (parsedNumber?.country) return parsedNumber.country;
      } catch (e) {}
    }
    return defaultCountry;
  }, [value, defaultCountry]);

  // States
  const [allCountries, setAllCountries] = useState(COMMON_COUNTRIES);
  const [selectedCountry, setSelectedCountry] =
    useState<CountryCode>(initialCountry);
  const [displayValue, setDisplayValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Initialize display value and country list
  useEffect(() => {
    // Format initial display value
    if (value) {
      try {
        const parsedNumber = parsePhoneNumberFromString(value, {
          defaultCountry: selectedCountry,
        });
        if (parsedNumber) {
          const national = parsedNumber.nationalNumber?.toString() || "";
          const formatter = new AsYouType(selectedCountry);
          setDisplayValue(formatter.input(national));
          setIsValid(parsedNumber.isValid());
        } else {
          setDisplayValue(value);
        }
      } catch (e) {
        setDisplayValue(value);
      }
    }

    // Load all countries
    const countries = getCountries()
      .map((code: string) => ({
        code: code as CountryCode,
        name:
          new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code,
        flag: getFlagEmoji(code),
        prefix: `+${getCountryCallingCode(code as CountryCode)}`,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    setAllCountries(countries);
  }, []);

  // Extract national number from full phone number
  const nationalNumber = useMemo(() => {
    if (!value) return "";

    try {
      const parsedNumber = parsePhoneNumberFromString(value, {
        defaultCountry: selectedCountry,
      });
      return parsedNumber?.nationalNumber?.toString() || "";
    } catch (e) {
      // Basic fallback for initial render
      const countryData = COMMON_COUNTRIES.find(
        (c) => c.code === selectedCountry,
      );
      const prefix = countryData?.prefix || "";
      return value.startsWith(prefix)
        ? value.substring(prefix.length).trim()
        : value;
    }
  }, [value, selectedCountry]);

  // Get placeholder based on selected country
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    getExampleForCountry(selectedCountry).then(setPlaceholder);
  }, [selectedCountry]);

  // Handle text input changes
  const handleChange = useCallback(
    (input: string) => {
      // Format the input for display
      const formatter = new AsYouType(selectedCountry);
      const formatted = formatter.input(input);
      setDisplayValue(formatted);

      // Get the actual phone number with country code
      const countryData = allCountries.find((c) => c.code === selectedCountry);
      if (!countryData) return;

      const digitsOnly = input.replace(/\D/g, "");
      const fullNumber = `${countryData.prefix}${digitsOnly}`;

      // Validate phone number
      let validationResult = false;
      try {
        validationResult = isValidPhoneNumber(fullNumber, selectedCountry);
        setIsValid(validationResult);
      } catch (e) {
        setIsValid(false);
        validationResult = false;
      }

      // Notify parent about validity change
      onValidityChange?.(validationResult);

      // Only call onChange if the value has changed
      if (fullNumber !== value) {
        onChange?.(fullNumber);
      }
    },
    [allCountries, selectedCountry, value, onChange, onValidityChange],
  );

  // Handle country selection from dropdown
  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      if (key) {
        const newCountry = key.toString() as CountryCode;
        setSelectedCountry(newCountry);
        setIsOpen(false);

        // Update the phone number with new country code
        if (nationalNumber) {
          const countryData = allCountries.find((c) => c.code === newCountry);
          if (!countryData) return;

          const digitsOnly = nationalNumber.replace(/\D/g, "");
          const fullNumber = `${countryData.prefix}${digitsOnly}`;

          onChange?.(fullNumber);

          // Re-format display value
          const formatter = new AsYouType(newCountry);
          setDisplayValue(formatter.input(digitsOnly));

          // Re-validate with new country code
          let validationResult = false;
          try {
            validationResult = isValidPhoneNumber(fullNumber, newCountry);
            setIsValid(validationResult);
            onValidityChange?.(validationResult);
          } catch (e) {
            setIsValid(false);
            onValidityChange?.(false);
          }
        }

        // Notify about country change
        onCountryChange?.(newCountry);
      }
    },
    [nationalNumber, allCountries, onChange, onCountryChange, onValidityChange],
  );

  // Generate country prefix button
  const countryPrefix = useMemo(() => {
    const countryData = allCountries.find((c) => c.code === selectedCountry);
    return (
      <Button
        size="small"
        intent="plain"
        className="flex items-center gap-1 px-1.5 outline-none"
        onPress={() => setIsOpen(!isOpen)}
        ref={triggerRef}
      >
        <span className="mr-1">{countryData?.flag}</span>
        <span className="text-xs font-medium">{countryData?.prefix}</span>
      </Button>
    );
  }, [selectedCountry, isOpen, allCountries]);

  const layout = useMemo(() => {
    return new ListLayout({
      rowHeight: 36,
      padding: 4,
    });
  }, []);

  return (
    <div className="relative">
      <TextField
        {...props}
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        prefix={countryPrefix}
        errorMessage={!isValid && value ? "Invalid phone number" : undefined}
      />

      <Select onSelectionChange={handleSelectionChange}>
        <Select.Trigger className="sr-only hidden">
          Select country
        </Select.Trigger>

        <PopoverContent
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          triggerRef={triggerRef}
          showArrow={false}
          respectScreen={false}
          className="sm:w-[260px] w-[260px]"
        >
          <Virtualizer layout={layout}>
            <ListBox.Picker
              aria-label="Country Items"
              items={allCountries}
              className={"p-0"}
            >
              {(country) => (
                <Select.Option
                  id={country.code}
                  textValue={country.name}
                  className="flex items-center gap-2"
                >
                  <span className="mr-1">{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="ml-auto text-xs text-muted-fg">
                    {country.prefix}
                  </span>
                </Select.Option>
              )}
            </ListBox.Picker>
          </Virtualizer>
        </PopoverContent>
      </Select>
    </div>
  );
};
