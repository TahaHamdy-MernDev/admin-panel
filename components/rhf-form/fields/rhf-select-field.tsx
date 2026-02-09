"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  label: string;
  value: string;
};

type RHFSelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options?: Option[];
  placeholder?: string;
  disabled?: boolean;
};

export function RHFSelectField<T extends FieldValues>({
  control,
  name,
  label,
  options = [],
  placeholder = "",
  disabled = false,
}: RHFSelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      aria-disabled={disabled}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} aria-disabled={disabled}>
          <FieldLabel>{label}</FieldLabel>

          <Select
            value={field.value ?? ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              aria-invalid={fieldState.invalid}
              aria-disabled={disabled}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent position="popper" aria-disabled={disabled}>
              {options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  disabled={disabled}
                  aria-disabled={disabled}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
