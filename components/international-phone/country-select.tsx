"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Country } from "react-phone-number-input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { FlagComponent } from "./flags";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type CountryEntry = { label: string; value: Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: Country;
  options: CountryEntry[];
  onChange: (country: Country) => void;
};

const CountrySelectPopover = dynamic(() => import("./country-select-popover"), {
  ssr: false,
  loading: () => (
    <div className="w-[300px] flex flex-col gap-2 space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-9 w-full" />
      ))}
    </div>
  ),
});

export const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} modal onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 flex rtl:flex-row-reverse gap-1 ltr:rounded-e-none rtl:rounded-r-none rounded-s-lg border-r-0 px-3 focus:z-10 hover:bg-current/5"
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              "size-4 opacity-50",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <CountrySelectPopover
          selectedCountry={selectedCountry}
          countryList={countryList}
          onChange={onChange}
          onSelectComplete={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
};
