"use client"

import { Control, Controller, FieldValues, Path } from "react-hook-form"
import {
  Field,
  FieldError,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

type RHFTextareaFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
  maxLength?: number
  rows?: number
}

export function RHFTextareaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  maxLength,
  rows = 5,
}: RHFTextareaFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>{label}</FieldLabel>

          <InputGroup>
            <InputGroupTextarea
              {...field}
              rows={rows}
              aria-invalid={fieldState.invalid}
            />

            {maxLength && (
              <InputGroupAddon align="block-end">
                <InputGroupText>
                  {field.value?.length ?? 0}/{maxLength}
                </InputGroupText>
              </InputGroupAddon>
            )}
          </InputGroup>

          {description && (
            <FieldDescription>{description}</FieldDescription>
          )}

          {fieldState.error && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  )
}
