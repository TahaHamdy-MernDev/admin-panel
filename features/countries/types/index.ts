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
export type GovernorateRow = {
  id: number;
  name_ar: string;
  name_en: string;
};
export type DistrictRow = {
  id: number;
  name_ar: string;
  name_en: string;
};
export type DistrictParams = {

  governorate_id: number;
  page: number;
  limit: number;
};
export type GovernorateParams = {
  slug: string;
  page: number;
  limit: number;
};
export type CurrencyParams = {
  page: number;
  limit: number;
};
export const CURRENCY_QUERY_KEY = "currencies";
export const GOVERNORATES_QUERY_KEY = "governorates";
export const DISTRACTS_QUERY_KEY = "districts";
