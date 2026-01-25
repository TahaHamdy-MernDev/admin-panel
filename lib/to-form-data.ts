export function toFormData(values: Record<string, unknown>) {
  const fd = new FormData();

  Object.entries(values).forEach(([key, val]) => {
    if (val === undefined || val === null) return;

    if (val instanceof File) {
      fd.append(key, val);
      return;
    }

    if (Array.isArray(val) && val.every((x) => x instanceof File)) {
      val.forEach((f) => fd.append(key, f));
      return;
    }

    fd.append(key, String(val));
  });

  return fd;
}
