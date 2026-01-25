"use client";

import * as React from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import Image from "next/image";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ImagePlus, UploadCloud, X, Trash2, Info } from "lucide-react";

type ImageValue = File | File[] | null;

type RHFImageUploadProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;

  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  disabled?: boolean;

  className?: string;
  dropzoneClassName?: string;

  /**
   * Optional previews for edit forms.
   * NOTE: These are for UI only. By default, the RHF field value remains File/File[].
   * If you need to submit existing URLs too, handle that outside this component.
   */
  initialUrls?: string[];
  initialUrl?: string;

  helperText?: string;

  /** UX toggles */
  showRequirements?: boolean; // small info row under dropzone
  showCapacityBar?: boolean; // progress bar for selected count
};

type PreviewItem = {
  id: string;
  url: string;
  file?: File;
  isInitial?: boolean;
};

const DEFAULT_ACCEPT = "image/*";
const K = {
  ENTER: "Enter",
  SPACE: " ",
};

function bytesFromMB(mb: number) {
  return mb * 1024 * 1024;
}
function isImage(file: File) {
  return file.type.startsWith("image/");
}
function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function RHFImageUpload<T extends FieldValues>({
  control,
  name,
  label,
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 5,
  accept = DEFAULT_ACCEPT,
  disabled = false,
  className,
  dropzoneClassName,
  initialUrl,
  initialUrls,
  helperText,
  showCapacityBar = true,
}: RHFImageUploadProps<T>) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [dragActive, setDragActive] = React.useState(false);
  const [localError, setLocalError] = React.useState<string | null>(null);

  // Hover/focus polish
  const [focused, setFocused] = React.useState(false);

  const [previews, setPreviews] = React.useState<PreviewItem[]>(() => {
    if (multiple) {
      const urls = initialUrls ?? [];
      return urls.map((u) => ({ id: uid(), url: u, isInitial: true }));
    }
    return initialUrl ? [{ id: uid(), url: initialUrl, isInitial: true }] : [];
  });

  // Clean up object URLs
  React.useEffect(() => {
    return () => {
      for (const p of previews) {
        if (p.file) URL.revokeObjectURL(p.url);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const validateFiles = (files: File[]) => {
    const maxBytes = bytesFromMB(maxSizeMB);

    for (const f of files) {
      if (!isImage(f)) return "Only image files are allowed.";
      if (f.size > maxBytes) return `Each image must be ≤ ${maxSizeMB}MB.`;
    }
    return null;
  };

  const mergeFilesWithLimit = (existing: File[], incoming: File[]) => {
    const room = Math.max(0, maxFiles - existing.length);
    if (room === 0) return existing;

    // Deduplicate by name+size+lastModified (reasonable UX)
    const existingKey = new Set(
      existing.map((f) => `${f.name}-${f.size}-${f.lastModified}`),
    );
    const filtered = incoming.filter(
      (f) => !existingKey.has(`${f.name}-${f.size}-${f.lastModified}`),
    );

    return [...existing, ...filtered.slice(0, room)];
  };

  const setFromFiles = (
    onChange: (v: ImageValue) => void,
    currentValue: ImageValue,
    files: FileList | null,
  ) => {
    setLocalError(null);
    if (!files || files.length === 0) return;

    const picked = Array.from(files);

    // Single: replace
    if (!multiple) {
      const nextFiles = [picked[0]];
      const err = validateFiles(nextFiles);
      if (err) return setLocalError(err);

      // Revoke old local previews
      setPreviews((prev) => {
        for (const p of prev) if (p.file) URL.revokeObjectURL(p.url);
        return [];
      });

      const nextPreview: PreviewItem = {
        id: uid(),
        url: URL.createObjectURL(nextFiles[0]),
        file: nextFiles[0],
        isInitial: false,
      };
      setPreviews([nextPreview]);
      onChange(nextFiles[0]);
      return;
    }

    // Multiple: append up to maxFiles
    const existingFiles = Array.isArray(currentValue) ? currentValue : [];
    const merged = mergeFilesWithLimit(existingFiles, picked);

    const err = validateFiles(merged);
    if (err) return setLocalError(err);

    // Build previews:
    // Keep initial previews (edit UX) and append new file previews.
    // NOTE: Form value is File[] only. InitialUrls are UI-only unless you manage them externally.
    const incomingMerged = merged.slice(existingFiles.length);

    if (incomingMerged.length === 0) return; // limit reached or duplicates

    const incomingPreviews: PreviewItem[] = incomingMerged.map((f) => ({
      id: uid(),
      url: URL.createObjectURL(f),
      file: f,
      isInitial: false,
    }));

    setPreviews((prev) => [...prev, ...incomingPreviews]);
    onChange(merged);
  };

  const removeAt = (
    index: number,
    value: ImageValue,
    onChange: (v: ImageValue) => void,
  ) => {
    setLocalError(null);

    const item = previews[index];

    // Update previews
    setPreviews((prev) => {
      const copy = [...prev];
      const removed = copy.splice(index, 1)[0];
      if (removed?.file) URL.revokeObjectURL(removed.url);
      return copy;
    });

    // Update RHF value (files only)
    if (!multiple) {
      onChange(null);
      return;
    }

    // If it was an initial URL preview, it isn't represented in the field value.
    // We only remove from File[] when item.file exists.
    if (!item?.file) return;

    const current = Array.isArray(value) ? value : [];
    const next = current.filter(
      (f) =>
        `${f.name}-${f.size}-${f.lastModified}` !==
        `${item.file!.name}-${item.file!.size}-${item.file!.lastModified}`,
    );
    onChange(next.length ? next : null);
  };

  const clearAll = (onChange: (v: ImageValue) => void) => {
    setLocalError(null);
    setPreviews((prev) => {
      for (const p of prev) if (p.file) URL.revokeObjectURL(p.url);
      return [];
    });
    onChange(null);
  };

  const onDrop = (
    e: React.DragEvent<HTMLDivElement>,
    onChange: (v: ImageValue) => void,
    currentValue: ImageValue,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const dt = e.dataTransfer;
    if (!dt?.files?.length) return;

    setFromFiles(onChange, currentValue, dt.files);
  };

  const onPaste = (
    e: React.ClipboardEvent<HTMLDivElement>,
    onChange: (v: ImageValue) => void,
    currentValue: ImageValue,
  ) => {
    if (disabled) return;

    const items = e.clipboardData?.items;
    if (!items?.length) return;

    const files: File[] = [];
    for (const it of items) {
      if (it.kind === "file") {
        const f = it.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length === 0) return;

    // mimic filelist
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    setFromFiles(onChange, currentValue, dt.files);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const showError = error?.message || localError;

        const selectedCount = multiple
          ? Array.isArray(value)
            ? value.length
            : 0
          : (value as ImageValue) instanceof File
            ? 1
            : 0;

        const capacity = multiple ? maxFiles : 1;
        const percent = Math.min(
          100,
          Math.round((selectedCount / capacity) * 100),
        );

        const limitReached = multiple && selectedCount >= maxFiles;

        return (
          <div className={cn("space-y-2", className)}>
            {label ? (
              <div className="flex items-center justify-between gap-2">
                <Label>{label}</Label>

                <div className="flex items-center gap-2">
                  {showCapacityBar ? (
                    <Badge variant="ghost" className="gap-1">
                      {multiple ? (
                        <>
                          <ImagePlus className="h-3.5 w-3.5" />
                          {selectedCount}/{maxFiles}
                        </>
                      ) : (
                        <>
                          <ImagePlus className="h-3.5 w-3.5" />
                          {previews.length ? "1/1" : "0/1"}
                        </>
                      )}
                    </Badge>
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* Hidden input */}
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              disabled={disabled}
              className="hidden"
              onChange={(e) =>
                setFromFiles(onChange, value as ImageValue, e.target.files)
              }
            />
            {/* Previews */}
            {previews.length > 0 ? (
              <ScrollArea
                className={cn(
                  "rounded-2xl border bg-card",
                  multiple ? "h-[340px]" : "h-auto",
                )}
              >
                <div
                  className={cn(
                    "p-3",
                    multiple
                      ? "grid grid-cols-2 gap-3 md:grid-cols-3"
                      : "grid grid-cols-1 gap-3",
                  )}
                >
                  {previews.map((p, idx) => (
                    <div
                      key={p.id}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border bg-background",
                        "transition-shadow hover:shadow-sm",
                      )}
                    >
                      <div
                        className={cn(
                          "relative w-full",
                          multiple ? "h-36 md:h-40" : "h-36 md:h-40",
                        )}
                      >
                        <Image
                          src={p.url}
                          alt={`preview-${idx}`}
                          fill
                          className="object-contain"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>

                      {/* Top badges */}
                      <div className="absolute left-2 top-2 flex gap-2">
                        {p.isInitial ? (
                          <Badge variant="secondary" className="rounded-full">
                            Existing
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="rounded-full">
                            New
                          </Badge>
                        )}
                      </div>

                      {/* Remove */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAt(idx, value as ImageValue, onChange);
                            }}
                            className={cn(
                              "absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full",
                              "bg-background/90 shadow-sm backdrop-blur",
                              "opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity",
                            )}
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Remove</TooltipContent>
                      </Tooltip>

                      {/* File meta */}
                      <div className="px-3 py-2">
                        {p.file ? (
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-xs font-medium">
                                {p.file.name}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {(p.file.size / 1024 / 1024).toFixed(2)}MB
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-muted-foreground">
                            Existing image
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : null}

            {/* Dropzone */}
            <div
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-card",
                "transition-all duration-200",
                "hover:shadow-sm",
                dragActive || focused
                  ? "border-foreground/35 ring-2 ring-foreground/10"
                  : "border-border",
                disabled ? "opacity-60 pointer-events-none" : "cursor-pointer",
                dropzoneClassName,
              )}
              role="button"
              tabIndex={0}
              aria-disabled={disabled}
              onClick={openPicker}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => {
                if (e.key === K.ENTER || e.key === K.SPACE) {
                  e.preventDefault();
                  openPicker();
                }
              }}
              onPaste={(e) => onPaste(e, onChange, value as ImageValue)}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!disabled) setDragActive(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!disabled) setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
              }}
              onDrop={(e) => onDrop(e, onChange, value as ImageValue)}
            >
              <div className="flex items-start gap-4 p-4 sm:p-5">
                <div
                  className={cn(
                    "rounded-2xl border bg-background p-3",
                    "transition-colors",
                    dragActive ? "border-foreground/30" : "border-border",
                  )}
                >
                  <UploadCloud className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold">
                      {limitReached
                        ? "Limit reached"
                        : previews.length
                          ? multiple
                            ? "Add more images"
                            : "Replace image"
                          : multiple
                            ? "Upload images"
                            : "Upload image"}
                    </div>

                    {dragActive ? (
                      <Badge className="rounded-full" variant="secondary">
                        Drop to upload
                      </Badge>
                    ) : null}
                  </div>



                  {helperText ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {helperText}
                    </p>
                  ) : null}

                  {showCapacityBar ? (
                    <div className="mt-3">
                      <Progress value={percent} />
                      <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>
                          {multiple
                            ? `Up to ${maxFiles} images`
                            : "Single image"}
                        </span>
                        <span>≤ {maxSizeMB}MB each</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {previews.length > 0 ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={disabled}
                          onClick={(e) => {
                            e.stopPropagation();
                            clearAll(onChange);
                          }}
                          aria-label="Clear"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Clear all</TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
              </div>

              {/* Premium hover sheen */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="absolute -inset-24 bg-gradient-to-br from-foreground/6 via-transparent to-transparent" />
              </div>

              {/* Drag overlay */}
              {dragActive ? (
                <div className="pointer-events-none absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-sm">
                  <div className="rounded-2xl border bg-card px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <UploadCloud className="h-4 w-4" />
                      Drop files to upload
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {multiple ? `Up to ${maxFiles} images` : "Single image"} •
                      ≤ {maxSizeMB}MB each
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={openPicker}
                disabled={disabled || (multiple && selectedCount >= maxFiles)}
              >
                {previews.length
                  ? multiple
                    ? "Add more"
                    : "Replace"
                  : "Choose"}
              </Button>

              {previews.length > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={disabled}
                  onClick={() => clearAll(onChange)}
                >
                  Clear
                </Button>
              ) : null}
            </div>

            {/* Errors */}
            {showError ? (
              <p className="text-sm text-destructive">{showError}</p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
