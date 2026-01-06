"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type RHFPasswordInputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
};

export function RHFPasswordInputField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
}: RHFPasswordInputFieldProps<T>) {
  const [type, setType] = useState("password");
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
              className="rtl:border-l-0 rtl:rounded-tl-none rtl:rounded-bl-none"
            />
            <InputGroupAddon align={"inline-end"}>
              <InputGroupButton
                onClick={() =>
                  setType(type === "password" ? "text" : "password")
                }
              >
                {type === "password" ? <Eye /> : <EyeOff />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
