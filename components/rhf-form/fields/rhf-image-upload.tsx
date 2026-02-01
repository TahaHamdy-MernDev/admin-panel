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
import { Card, CardContent } from "@/components/ui/card";

import { ImagePlus, UploadCloud, X } from "lucide-react";

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

  initialUrls?: string[];
  initialUrl?: string;

  helperText?: string;

  showRequirements?: boolean;
  showCapacityBar?: boolean;
};

type PreviewItem = {
  id: string;
  url: string;
  file?: File;
  isInitial?: boolean;
};

const DEFAULT_ACCEPT = "image/*";
const K = { ENTER: "Enter", SPACE: " " };

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
  const [focused, setFocused] = React.useState(false);

  const [previews, setPreviews] = React.useState<PreviewItem[]>(() => {
    if (multiple) {
      const urls = initialUrls ?? [];
      return urls.map((u) => ({ id: uid(), url: u, isInitial: true }));
    }
    return initialUrl ? [{ id: uid(), url: initialUrl, isInitial: true }] : [];
  });

  React.useEffect(() => {
    return () => {
      for (const p of previews) if (p.file) URL.revokeObjectURL(p.url);
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

    if (!multiple) {
      const nextFiles = [picked[0]];
      const err = validateFiles(nextFiles);
      if (err) return setLocalError(err);

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

    const existingFiles = Array.isArray(currentValue) ? currentValue : [];
    const merged = mergeFilesWithLimit(existingFiles, picked);

    const err = validateFiles(merged);
    if (err) return setLocalError(err);

    const incomingMerged = merged.slice(existingFiles.length);
    if (incomingMerged.length === 0) return;

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

    setPreviews((prev) => {
      const copy = [...prev];
      const removed = copy.splice(index, 1)[0];
      if (removed?.file) URL.revokeObjectURL(removed.url);
      return copy;
    });

    if (!multiple) {
      onChange(null);
      return;
    }
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

    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    setFromFiles(onChange, currentValue, dt.files);
  };

  const DropTile = ({
    title,
    subtitle,
    disabledTile,
    limitReached,
    percent,
    onClick,
    onKeyDown,
    onFocus,
    onBlur,
    onPaste,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
  }: {
    title: string;
    subtitle: string;
    disabledTile: boolean;
    limitReached: boolean;
    percent: number;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onFocus: () => void;
    onBlur: () => void;
    onPaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  }) => {
    return (
      <Card
        className={cn(
          "relative overflow-hidden rounded-2xl h-48",
          "border",
          dragActive
            ? "border-foreground/35 ring-2 ring-foreground/10"
            : "border-border",
          disabledTile ? "opacity-60 pointer-events-none" : "cursor-pointer",
          dropzoneClassName,
          "shadow-none bg-background"
        )}
        role="button"
        tabIndex={0}
        aria-disabled={disabledTile}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <CardContent className="p-0 h-40 flex items-center justify-center w-full">
          <div className="grid aspect-square px-5 text-center h-full">
            <div className="space-y-2">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border bg-background">
                <UploadCloud className="h-6 w-6 text-muted-foreground" />
              </div>

              <div className="text-sm font-semibold">{title}</div>
              <div className="text-xs text-muted-foreground">{subtitle}</div>

              {helperText ? (
                <div className="pt-1 text-xs text-muted-foreground">
                  {helperText}
                </div>
              ) : null}

              {showCapacityBar ? (
                <div className="pt-3">
                  <Progress value={percent} />
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {limitReached ? "Limit reached" : `≤ ${maxSizeMB}MB each`}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {dragActive ? (
            <div className="pointer-events-none absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-sm">
              <div className="rounded-2xl border bg-card px-4 py-3 shadow-sm">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                  <UploadCloud className="h-4 w-4" />
                  Drop to upload
                </div>
                <div className="mt-1 text-center text-xs text-muted-foreground">
                  {multiple ? `Up to ${maxFiles} images` : "Single image"} • ≤{" "}
                  {maxSizeMB}MB
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
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
          : value
            ? 1
            : 0;

        const capacity = multiple ? maxFiles : 1;
        const percent = Math.min(
          100,
          Math.round((selectedCount / capacity) * 100),
        );

        const limitReached = multiple && selectedCount >= maxFiles;

        const hasPreview = previews.length > 0;
        const isSingleMode = !multiple;
        const singlePreview = isSingleMode && previews.length === 1;

        const uploadTitle = hasPreview
          ? isSingleMode
            ? "Replace image"
            : "Add images"
          : multiple
            ? "Upload images"
            : "Upload image";

        const uploadSubtitle = "Click or drag & drop";

        const commonTileHandlers = {
          onClick: openPicker,
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === K.ENTER || e.key === K.SPACE) {
              e.preventDefault();
              openPicker();
            }
          },
          onPaste: (e: React.ClipboardEvent<HTMLDivElement>) =>
            onPaste(e, onChange, value as ImageValue),
          onDragEnter: (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) setDragActive(true);
          },
          onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) setDragActive(true);
          },
          onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          },
          onDrop: (e: React.DragEvent<HTMLDivElement>) =>
            onDrop(e, onChange, value as ImageValue),
        };

        return (
          <div className={cn("space-y-3", className)}>
            {/* Header */}
            {label ? (
              <div className="flex items-center justify-between gap-2">
                <Label>{label}</Label>

                <div className="flex items-center gap-2">
                  <Badge variant="ghost" className="gap-1">
                    <ImagePlus className="h-3.5 w-3.5" />
                    {multiple
                      ? `${selectedCount}/${maxFiles}`
                      : hasPreview
                        ? "1/1"
                        : "0/1"}
                  </Badge>

                  {hasPreview ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={disabled}
                      onClick={() => clearAll(onChange)}
                      className="h-8"
                    >
                      Clear
                    </Button>
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

            {/* SINGLE MODE: one card only (either upload or preview+overlay) */}
            {isSingleMode ? (
              singlePreview ? (
                <Card className="group overflow-hidden rounded-2xl py-0">
                  <CardContent className="relative p-0 h-48">
                    <div className="relative h-full w-full bg-muted">
                      <Image
                        src={previews[0].url}
                        alt="preview"
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="absolute left-3 top-3">
                      <Badge variant="secondary" className="rounded-full">
                        {previews[0].isInitial ? "Existing" : "New"}
                      </Badge>
                    </div>

                    {/* overlay actions (no extra card below) */}
                    <div className="absolute right-3 top-3 flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={disabled}
                            onClick={(e) => {
                              e.stopPropagation();
                              openPicker();
                            }}
                          >
                            Replace
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Choose a new image</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAt(0, value as ImageValue, onChange);
                            }}
                            className={cn(
                              "inline-flex h-9 w-9 items-center justify-center rounded-full",
                              "bg-background/90 shadow-sm backdrop-blur",
                            )}
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Remove</TooltipContent>
                      </Tooltip>
                    </div>

                    {previews[0].file ? (
                      <div className="border-t px-4 py-3">
                        <div className="truncate text-sm font-medium">
                          {previews[0].file.name}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {(previews[0].file.size / 1024 / 1024).toFixed(2)}MB
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ) : (
                <div className="h-48">
                  <DropTile
                    title={uploadTitle}
                    subtitle={uploadSubtitle}
                    disabledTile={disabled}
                    limitReached={false}
                    percent={percent}
                    {...commonTileHandlers}
                  />
                </div>
              )
            ) : null}

            {/* MULTIPLE MODE: 3-col grid with an "upload tile" inside the grid */}
            {multiple ? (
              <ScrollArea
                className={cn(
                  "rounded-2xl border bg-card",
                  previews.length > 6 ? "h-36" : "h-auto",
                )}
              >
                <div className="p-3 h-36">
                  <div className="grid grid-cols-3 gap-3 ">
                    <DropTile
                      title={uploadTitle}
                      subtitle={
                        limitReached ? "Max files reached" : uploadSubtitle
                      }
                      disabledTile={disabled || limitReached}
                      limitReached={limitReached}
                      percent={percent}
                      {...commonTileHandlers}
                    />

                    {previews.map((p, idx) => (
                      <Card
                        key={p.id}
                        className="group relative overflow-hidden rounded-2xl"
                      >
                        <CardContent className="p-0 h-40">
                          <div className="relative aspect-square w-full bg-muted">
                            <Image
                              src={p.url}
                              alt={`preview-${idx}`}
                              fill
                              className="object-contain"
                            />

                            <div className="absolute left-2 top-2">
                              <Badge
                                variant="secondary"
                                className="rounded-full"
                              >
                                {p.isInitial ? "Existing" : "New"}
                              </Badge>
                            </div>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeAt(
                                      idx,
                                      value as ImageValue,
                                      onChange,
                                    );
                                  }}
                                  className={cn(
                                    "absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full",
                                    "bg-background/90 shadow-sm backdrop-blur",
                                  )}
                                  aria-label="Remove image"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Remove</TooltipContent>
                            </Tooltip>
                          </div>

                          {p.file ? (
                            <div className="border-t px-3 py-2">
                              <div className="truncate text-xs font-medium">
                                {p.file.name}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {(p.file.size / 1024 / 1024).toFixed(2)}MB
                              </div>
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            ) : null}

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
