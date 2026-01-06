"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";

type RHFInputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
};

export function RHFInputField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  type = "text",
}: RHFInputFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>{label}</FieldLabel>
          <InputGroup>
            <Input
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              type={type}
            />
          </InputGroup>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
