"use client";

import * as React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Check, CheckIcon, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SelectItem } from "@radix-ui/react-select";
import { Select, SelectContent } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";

type Option = {
  label: string | React.ReactNode;
  value: string;
};

type RHFCreatableSelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;

  options: Option[];
  placeholder?: string;

  /** text shown when typing a custom value */
  addLabel?: (value: string) => string; // e.g. v => `Add "${v}"`
  disabled?: boolean;
  className?: string;

  /** Optional: normalize typed value before saving */
  normalize?: (value: string) => string; // e.g. trim, uppercase
};

export function RHFCreatableSelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select…",
  addLabel = (v) => `Add "${v}"`,
  disabled,
  className,
  normalize = (v) => v.trim(),
}: RHFCreatableSelectFieldProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const currentValue = String(field.value ?? "");
        const selectedOption = options.find((o) => o.value === currentValue);
        const displayLabel = selectedOption?.label ?? (currentValue || "");

        const normalizedQuery = normalize(query);
        const canAdd =
          normalizedQuery.length > 0 &&
          !options.some(
            (o) => o.value.toLowerCase() === normalizedQuery.toLowerCase()
          );

        function commit(value: string) {
          const v = normalize(value);
          field.onChange(v);
          setOpen(false);
          setQuery("");
        }

        return (
          <Field data-invalid={fieldState.invalid} className={cn(className)}>
            <FieldLabel>{label}</FieldLabel>

            <Popover
              open={open}
              onOpenChange={(v) => (disabled ? null : setOpen(v))}
            >
              <PopoverTrigger className="w-full" asChild>
                <InputGroup>
                  <Input
                    type="text"
                    role="combobox"
                    readOnly
                    aria-expanded={open}
                    aria-invalid={fieldState.invalid}
                    value={displayLabel.toString() ?? placeholder}
                    disabled={disabled}
                  />
                </InputGroup>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0" align="center">
                <Command
                  // Enter will select the highlighted item, but we also handle adding directly
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canAdd) {
                      e.preventDefault();
                      commit(query);
                    }
                  }}
                >
                  <CommandInput
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Search or type…"
                    autoFocus
                  />

                  <CommandList>
                    <CommandEmpty>
                      {canAdd ? (
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-2 py-2 text-sm"
                          onClick={() => commit(query)}
                        >
                          <Plus className="h-4 w-4" />
                          {addLabel(normalizedQuery)}
                        </button>
                      ) : (
                        <div className="px-2 py-2 text-sm text-muted-foreground">
                          No results
                        </div>
                      )}
                    </CommandEmpty>

                    {/* Add row even if there are results */}
                    {canAdd && (
                      <CommandGroup>
                        <CommandItem
                          value={`__add__${normalizedQuery}`}
                          onSelect={() => commit(query)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {addLabel(normalizedQuery)}
                        </CommandItem>
                      </CommandGroup>
                    )}

                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          key={opt.value}
                          value={String(opt.label)}
                          onSelect={() => commit(opt.value)}
                        >
                          <span
                            data-slot="select-item-indicator"
                            className={cn(
                              "absolute ltr:right-2 rtl:left-2 flex size-3.5 items-center justify-center",
                              opt.value === currentValue
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          >
                            <CheckIcon />
                          </span>
                          {opt.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
