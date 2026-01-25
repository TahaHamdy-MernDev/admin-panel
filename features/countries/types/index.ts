export type CurrencyRow = {
  id: string;
  slug: string;
  image: string;
  name_en: string;
  country_en: string;
  name_ar: string;
  country_ar: string;
  created_at: Date;
  is_active: boolean;
};

export type CurrencyParams = {
  page: number;
  limit: number;
};
export const CURRENCY_QUERY_KEY = "currencies";
