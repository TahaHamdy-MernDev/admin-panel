export enum IntegrationProvider {
  Shopify = "Shopify",
  WooCommerce = "WooCommerce",
  Salla = "Salla",
  EasyOrder = "EasyOrder",
  BOSTA = "BOSTA",
  Other = "Other",
}
export interface IntegrationRow {
  id: number;
  provider: IntegrationProvider;
  image: string;
  created_at: string;
  is_active: boolean;
  is_visible: boolean;
}

export interface IntegrationParams {
  page: number;
  limit: number;
}

export const INTEGRATION_QUERY_KEY = "integrations";
