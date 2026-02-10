"use client";

import * as React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { type DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import {
  startOfToday,
  endOfToday,
  startOfYesterday,
  endOfYesterday,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
const PREDEFINED_RANGES: {
  label: string;
  getRange: () => DateRange;
}[] = [
  {
    label: "Today",
    getRange: () => ({
      from: startOfToday(),
      to: endOfToday(),
    }),
  },
  {
    label: "Yesterday",
    getRange: () => ({
      from: startOfYesterday(),
      to: endOfYesterday(),
    }),
  },
  {
    label: "Last 7 Days",
    getRange: () => ({
      from: subDays(startOfToday(), 6),
      to: endOfToday(),
    }),
  },
  {
    label: "Last 30 Days",
    getRange: () => ({
      from: subDays(startOfToday(), 29),
      to: endOfToday(),
    }),
  },
  {
    label: "This Month",
    getRange: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "This Year",
    getRange: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    }),
  },
];

type RHFDateRangePickerFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
};
export function RHFDateRangePickerField<T extends FieldValues>({
  control,
  name,
  label,
}: RHFDateRangePickerFieldProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = field.value as DateRange | undefined;
        const formatted_range = value
          ? value.from && value.to
            ? `${format(value.from, "PPP")} - ${format(value.to, "PPP")}`
            : ""
          : "";
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>{label}</FieldLabel>

            <Popover
              open={open}
              onOpenChange={(o) => {
                setOpen(o);
                if (o) {
                  setTempRange(value);
                }
              }}
            >
              <PopoverTrigger asChild>
                <InputGroup>
                  <InputGroupAddon align={"inline-end"}>
                    <CalendarIcon className="opacity-50 dark:text-white" />
                  </InputGroupAddon>
                  <Input
                    value={formatted_range}
                    className="rtl:border-l-0 rtl:rounded-tl-none rtl:rounded-bl-none"
                    readOnly
                  />
                </InputGroup>
              </PopoverTrigger>

              <PopoverContent
                align="center"
                className="flex items-center  w-auto space-y-3 p-3"
              >
                <div className="flex flex-col gap-2">
                  {PREDEFINED_RANGES.map((preset) => (
                    <Button
                      key={preset.label}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setTempRange(preset.getRange())}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-col">
                  <Calendar
                    autoFocus
                    mode="range"
                    selected={tempRange}
                    defaultMonth={tempRange?.from}
                    onSelect={setTempRange}
                    numberOfMonths={2}
                  />

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTempRange(undefined);
                      }}
                    >
                      Clear
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTempRange(value);
                          setOpen(false);
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        disabled={!tempRange?.from || !tempRange?.to}
                        onClick={() => {
                          field.onChange(tempRange);
                          setOpen(false);
                        }}
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
