import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

type Props = {
  total_count: number;
  currentLimit: number;
};
type LimitOption = {
  label: string;
  value: number | "all";
};

export function generateLimitOptions(
  baseLimit: number,
  total: number,
  maxLimit = 200
): LimitOption[] {
  const options: LimitOption[] = [];

  const numericMax = Math.min(total, maxLimit);

  let current = baseLimit;

  while (current < numericMax) {
    options.push({
      label: String(current),
      value: current,
    });
    current += baseLimit;
  }
  options.push({
    label: String(numericMax),
    value: numericMax,
  });

  if (total > maxLimit) {
    options.push({
      label: "All",
      value: total,
    });
  }

  return options;
}
export function TableLimitSelect({ total_count, currentLimit }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const options = generateLimitOptions(25, total_count);

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("limit", value);
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  };

  const selectValue =
    currentLimit >= total_count ? String(total_count) : String(currentLimit);

  return (
    <Select value={selectValue} onValueChange={onChange}>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Rows per page" />
      </SelectTrigger>

      <SelectContent position="popper">
        {options.map((opt) => (
          <SelectItem key={opt.label} value={String(opt.value)}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
