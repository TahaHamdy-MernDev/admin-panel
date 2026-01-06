import { getLangDir, isRtlLang } from "rtl-detect";
import { useLocale } from "next-intl";

interface LocaleDirection {
  dir: "rtl" | "ltr";
  is_rtl: boolean;
}

export const useLocaleDirection = (): LocaleDirection => {
  const locale: string = useLocale();
  const dir: "rtl" | "ltr" = getLangDir(locale);
  const is_rtl: boolean = isRtlLang(locale) ?? false;
  return { dir, is_rtl };
};
