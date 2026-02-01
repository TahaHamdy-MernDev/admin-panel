import { PlatformRoles } from "@/types/platform-roles.types";

export type LoginResponseData = {
  user: {
    id: number;
    email: string;
    role: string;
  };
};

export const CURRENT_USER_QUERY_KEY = "current-user";
export type CurrentUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  code: string;
  profile_photo: string;
  platform_role: PlatformRoles;
};
