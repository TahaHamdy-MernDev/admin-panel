export type AccountRow = {
  id: number;
  name: string;
  balance: number;
  created_at: string;
  is_active: boolean;
  is_default: boolean;
};
export type AccountsParams = {
  page: number;
  limit: number;
};

export enum TermType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export type TermRow = {
  id: number;
  name: string;
  type: (typeof TermType)[keyof typeof TermType];
  created_at: string;
};
export type TermsParams = {
  page: number;
  limit: number;
};
export type TransactionRow = {
  id: number;
  ref: string;
  amount: number;
  note?: string;
  date: string;
  created_at: string;
  term: {
    id: number;
    name: string;
  };
  account: {
    id: number;
    name: string;
  };
};

export type TransactionParams = {
  page: number;
  limit: number;
  type: string;
};
export type TransactionHelperRes = {
  accounts: {
    id: number;
    name: string;
    balance: number;
    is_default: boolean;
  }[];
  terms: {
    id: number;
    name: string;
    type: TermType;
    requires_employee: boolean;
  }[];
  staff?: {
    id: number;
    firstName: string;
    lastName: string;
  }[];
};
export const TRANSACTIONS_QUERY_KEY = "transactions";
export const ACCOUNTS_QUERY_KEY = "accounts";
export const TERMS_QUERY_KEY = "terms";
