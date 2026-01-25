"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import Text from "@/components/typography";

type RHFCheckboxFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;

  label?: string;
  description?: string;

  disabled?: boolean;

  className?: string;

  checkboxClassName?: string;
};

export function RHFCheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  checkboxClassName,
  ...props
}: RHFCheckboxFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className={cn("space-y-2", className)}
        >
          <div className="flex items-center gap-3">
            <Checkbox
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              className={checkboxClassName}
              {...props}
            />

            {(label || description) && (
              <div className="grid gap-1 leading-none">
                {label && (
                  <FieldLabel className="font-medium">
                    <Text as="p">{label}</Text>
                  </FieldLabel>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            )}
          </div>

          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
