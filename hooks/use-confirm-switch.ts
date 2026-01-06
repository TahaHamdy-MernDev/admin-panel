"use client";

import { useState } from "react";

type ConfirmConfig = {
  title: string;
  description?: string;
};

type UseConfirmableToggleOptions = {
  value?: boolean;
  defaultValue?: boolean;
  onConfirm: (value: boolean) => Promise<void>;
  confirmOn: ConfirmConfig;
  confirmOff: ConfirmConfig;
  onError?: (error: unknown) => void;
};

export function useConfirmableSwitch({
  value,
  defaultValue = false,
  onConfirm,
  confirmOn,
  confirmOff,
  onError,
}: UseConfirmableToggleOptions) {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [previousValue, setPreviousValue] = useState<boolean | null>(null);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentValue = isControlled ? value : internalValue;
  const config = pendingValue ? confirmOn : confirmOff;

  const requestToggle = (nextValue: boolean) => {
    setPendingValue(nextValue);
    setOpen(true);
  };

  const confirm = async () => {
    if (pendingValue === null) return;

    const optimisticValue = pendingValue;
    const rollbackValue = currentValue;

    setPreviousValue(rollbackValue);

    // ✅ optimistic update
    if (!isControlled) {
      setInternalValue(optimisticValue);
    }

    setOpen(false);
    setPendingValue(null);
    setLoading(true);

    try {
      await onConfirm(optimisticValue);
    } catch (error) {
      // ❌ rollback
      if (!isControlled) {
        setInternalValue(rollbackValue);
      }

      onError?.(error);
    } finally {
      setLoading(false);
      setPreviousValue(null);
    }
  };

  const cancel = () => {
    if (loading) return;
    setOpen(false);
    setPendingValue(null);
  };

  return {
    checked: currentValue,
    open,
    loading,
    title: config.title,
    description: config.description,
    requestToggle,
    confirm,
    cancel,
    setOpen,
  };
}
