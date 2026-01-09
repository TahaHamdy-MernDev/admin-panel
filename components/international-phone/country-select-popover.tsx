import * as React from "react";
import {
  Country,
  getCountryCallingCode,
  FlagProps,
} from "react-phone-number-input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "../ui/scroll-area";
import { CheckIcon } from "lucide-react";
import { FlagComponent } from "./flags";

type CountryEntry = { label: string; value: Country | undefined };

type Props = {
  selectedCountry: Country;
  countryList: CountryEntry[];
  onChange: (country: Country) => void;
  onSelectComplete: () => void;
};

export default function CountrySelectPopover({
  selectedCountry,
  countryList,
  onChange,
  onSelectComplete,
}: Props) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = React.useState("");

  return (
    <Command>
      <CommandInput
        value={searchValue}
        onValueChange={(value) => {
          setSearchValue(value);
          setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector(
              "[data-radix-scroll-area-viewport]"
            ) as HTMLElement | null;

            if (viewport) viewport.scrollTop = 0;
          }, 0);
        }}
        placeholder="Search country..."
      />

      <CommandList>
        <ScrollArea ref={scrollAreaRef} className="h-72">
          <CommandEmpty>No country found.</CommandEmpty>

          <CommandGroup>
            {countryList.map(({ value, label }) =>
              value ? (
                <CountrySelectOption
                  key={value}
                  country={value}
                  countryName={label}
                  selectedCountry={selectedCountry}
                  onChange={onChange}
                  onSelectComplete={onSelectComplete}
                />
              ) : null
            )}
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </Command>
  );
}

interface CountrySelectOptionProps extends FlagProps {
  selectedCountry: Country;
  onChange: (country: Country) => void;
  onSelectComplete: () => void;
}

function CountrySelectOption({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  return (
    <CommandItem className="gap-2" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-sm text-foreground/50">
        +{getCountryCallingCode(country)}
      </span>
      <CheckIcon
        className={`ltr:ml-auto rtl:mr-auto size-4 ${
          country === selectedCountry ? "opacity-100" : "opacity-0"
        }`}
      />
    </CommandItem>
  );
}
