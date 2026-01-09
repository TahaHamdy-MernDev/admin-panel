import { PhoneInput } from "@/components/international-phone";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

type RHFInternationalPhoneFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
};
export function RHFInternationalPhoneField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
}: RHFInternationalPhoneFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>{label}</FieldLabel>
         
            <PhoneInput
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
      

          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
