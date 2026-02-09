"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

type RHFTextareaFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  maxLength?: number;
  placeholder?: string;
  rows?: number;
  className?: string;
  border?: string;
};

export function RHFTextareaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  maxLength,
  placeholder,
  className,
  rows = 5,
  border,
}: RHFTextareaFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel>{label}</FieldLabel>}
          <InputGroup className={border}>
            <InputGroupTextarea
              {...field}
              rows={rows}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              className={className}
            />

            {maxLength && (
              <InputGroupAddon align="block-end">
                <InputGroupText>
                  {field.value?.length ?? 0}/{maxLength}
                </InputGroupText>
              </InputGroupAddon>
            )}
          </InputGroup>

          {description && <FieldDescription>{description}</FieldDescription>}

          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
