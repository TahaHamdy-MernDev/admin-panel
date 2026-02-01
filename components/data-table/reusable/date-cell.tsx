import { formatDate } from "date-fns";

type DateFormat =
  | "yyyy-MM-dd"
  | "dd/MM/yyyy"
  | "MM/dd/yyyy"
  | "yyyy-MM-dd HH:mm a";
export function DateCell({
  date,
  format = "yyyy-MM-dd",
}: {
  date: string | Date;
  format?: DateFormat;
}) {
  if (!date) return "-";
  return formatDate(date, format);
}
