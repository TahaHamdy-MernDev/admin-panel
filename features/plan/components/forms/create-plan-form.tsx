"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PlanForm } from "./plan-form";
import { useCreatePlanMutation } from "../../api/use-create-plan-mutation";
import { createPlanSchema, PlanFormInput } from "../../schema";
import { PlatformEnum } from "@/features/integrations/constants";
import { BillingTypeEnum, PlanIntervalEnum } from "../../constants";
import { UserRolesEnum } from "@/features/customers/constants";
import { enumValues } from "@/lib/zod-enum";
import { useRouter } from "@/i18n/navigation";
const ROLE_KEYS = enumValues(UserRolesEnum);
const PLATFORM_KEYS = enumValues(PlatformEnum);

export default function CreatePlanForm() {
  const router = useRouter();
  const mutation = useCreatePlanMutation();

  const form = useForm<PlanFormInput>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: getCreateDefaults(),
  });

  async function onSubmit(values: PlanFormInput) {
    await mutation.mutateAsync(values);
    router.back();
  }

  return (
    <PlanForm
      form={form}
      onSubmit={onSubmit}
      loading={mutation.isPending}
      i18nNamespace="plans.create"
      mode="create"
    />
  );
}

function getCreateDefaults(): PlanFormInput {
  return {
    name: "",
    billing_type: BillingTypeEnum.PAY_AS_YOU_GO,
    trial_days: "7",
    price: {
      interval: PlanIntervalEnum.PAY_AS_YOU_GO,
      price_egp: "",
      price_usd: "",
    },
    usage_prices: [{ amount_per_confirmed_order: "" }],
    role_limits: ROLE_KEYS.map((role) => ({
      role: role as UserRolesEnum,
      max_users: "0",
    })),
    store_limits: PLATFORM_KEYS.map((platform) => ({
      platform: platform as PlatformEnum,
      max_stores: "0",
    })),
    order_limits: { max_orders_daily: "0", max_orders_total: "0" },
    product_limits: { max_products: "0", max_products_stock_logs: "0" },
  };
}
