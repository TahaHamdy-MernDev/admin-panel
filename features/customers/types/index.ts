export type Session = {
  id: number;
  browser: string;
  ip_address: string;
  created_at: string;
};

export type Owner = {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  is_active: boolean;
  createdAt: string;
  sessions: Session[];
};

export type TenantSubscription = {
  plan: {
    code: string;
    name: string;
  };
};

export type CustomerRow = {
  id: number;
  owner: Owner;
  tenantSubscriptions: TenantSubscription[];
};

export type Params = {
  page: number;
  limit: number;
};
export const CUSTOMERS_QUERY_KEY = "customers";
