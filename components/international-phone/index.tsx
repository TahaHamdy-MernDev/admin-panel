import * as React from "react";
import * as RPNInput from "react-phone-number-input";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FlagComponent } from "./flags";
import { CountrySelect } from "./country-select";
import { InputGroup } from "../ui/input-group";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, value, ...props }, ref) => {
      return (
        // <InputGroup>
        <RPNInput.default
          ref={ref}
          className={cn("flex rtl:flex-row-reverse", className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          smartCaret={false}
          defaultCountry="EG"
          international
          value={value || undefined}
          /**
           * Handles the onChange event.
           *
           * react-phone-number-input might trigger the onChange event as undefined
           * when a valid phone number is not entered. To prevent this,
           * the value is coerced to an empty string.
           *
           * @param {E164Number | undefined} value - The entered value
           */
          onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
          {...props}
        />
        // </InputGroup>
      );
    }
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    className={cn(
      // "w-full",
      // "ltr:rounded-e-lg rtl:rounded-l-none rounded-s-none",
      "group/input-group border-input bg-background relative flex w-full items-center rounded-md border transition-[color,box-shadow] outline-none",
      "h-10 min-w-0 has-[>textarea]:h-auto",

      // Variants based on alignment.
      "has-[>[data-align=inline-start]]:[&>input]:pl-2 rtl:has-[>[data-align=inline-start]]:[&>input]:pr-2",
      "has-[>[data-align=inline-end]]:[&>input]:pr-2 rtl:has-[>[data-align=inline-end]]:[&>input]:pl-2",
      "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
      "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

      // Focus state.
      // "has-[[data-slot=input-group-control]:focus-visible]:border-primary has-[[data-slot=input-group-control]:focus-visible]:ring-primary/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]",

      // Error state.
      "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:bg-destructive/10 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",
      "rounded-l-none border-l-0 p-0",
      className
    )}
    dir="ltr"
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

export { PhoneInput };
