import { PlatformRoles } from "@/types/platform-roles.types";
import { CountryCode } from "libphonenumber-js";
export const STAFF_QUERY_KEY = "staff";

export type StaffRow = {
  id: string;
  firstName: string;
  lastName: string;
  code: string;
  email: string;
  phoneNumber: string;
  is_active: boolean;
  platform_role: PlatformRoles;
  country: CountryCode;
  createdAt: string;
};

export type StaffParams = {
  page: number;
  limit: number;
};
