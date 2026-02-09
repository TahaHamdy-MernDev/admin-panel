"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PlanForm } from "./plan-form";
import { createPlanSchema, type PlanFormInput } from "../../schema";
import { useUpdatePlanMutation } from "../../api/use-update-plan-mutation";
import { useRouter } from "@/i18n/navigation";

type UpdatePlanFormProps = {
  code: string;
  initialValues: PlanFormInput;
};

export default function UpdatePlanForm({
  code,
  initialValues,
}: UpdatePlanFormProps) {
  const router = useRouter();
  const mutation = useUpdatePlanMutation();

  const form = useForm<PlanFormInput>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [initialValues, form]);

  async function onSubmit(values: PlanFormInput) {
    await mutation.mutateAsync({ payload: values, code });
  }

  return (
    <PlanForm
      form={form}
      onSubmit={onSubmit}
      loading={mutation.isPending}
      mode="update"
    />
  );
}
