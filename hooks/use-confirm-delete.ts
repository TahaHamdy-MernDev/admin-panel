import { useState } from "react";

type ConfirmConfig = {
  title: string;
  description?: string;
};

export function useConfirmableDelete({
  onConfirm,
  confirm,
  onError,
}: {
  onConfirm: () => Promise<void>;
  confirm: ConfirmConfig;
  onError?: (error: unknown) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function confirmDelete() {
    try {
      setLoading(true);
      await onConfirm();
      setOpen(false);
    } catch (error) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    open,
    setOpen,
    loading,
    title: confirm.title,
    description: confirm.description,
    confirmDelete,
    cancel: () => setOpen(false),
  };
}
