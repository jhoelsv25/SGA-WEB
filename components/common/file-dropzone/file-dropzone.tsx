"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Upload01Icon,
  File02Icon,
  Delete02Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import type { FileDropzoneProps } from "./types";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

const DEFAULT_ACCEPT = ".xlsx,.xls,.csv";
const DEFAULT_FORMATS = ["XLSX", "XLS", "CSV"];
const DEFAULT_MAX_SIZE = 25 * 1024 * 1024; // 25 MB

export function FileDropzone({
  file,
  onFileSelect,
  accept = DEFAULT_ACCEPT,
  acceptedFormats = DEFAULT_FORMATS,
  maxSizeBytes = DEFAULT_MAX_SIZE,
  title = "Haz clic para seleccionar o arrastra el archivo",
  description = "Archivos Excel (.xlsx, .xls) o CSV delimitados por comas",
  disabled = false,
  className,
  error: externalError,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const activeError = externalError || internalError;

  const validateFile = React.useCallback(
    (candidate: File): boolean => {
      setInternalError(null);

      // Validar tamaño
      if (candidate.size > maxSizeBytes) {
        setInternalError(
          `El archivo supera el tamaño máximo permitido (${formatBytes(maxSizeBytes)}).`,
        );
        return false;
      }

      // Validar extensión
      const ext = `.${candidate.name.split(".").pop()?.toLowerCase()}`;
      const allowedExtensions = accept.split(",").map((a) => a.trim().toLowerCase());

      if (
        allowedExtensions.length > 0 &&
        !allowedExtensions.includes(ext) &&
        !allowedExtensions.includes("*")
      ) {
        setInternalError(
          `Formato de archivo no válido (${ext}). Se aceptan: ${acceptedFormats.join(", ")}.`,
        );
        return false;
      }

      return true;
    },
    [accept, acceptedFormats, maxSizeBytes],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (validateFile(selected)) {
        onFileSelect(selected);
      } else {
        onFileSelect(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      if (validateFile(dropped)) {
        onFileSelect(dropped);
      } else {
        onFileSelect(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    setInternalError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            "focus-visible:ring-primary/40 focus-visible:border-primary relative flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-150 outline-none focus-visible:ring-2",
            isDragging
              ? "border-primary bg-primary/10 scale-[1.005]"
              : "border-border/70 bg-muted/20 hover:border-primary/50 hover:bg-muted/30",
            disabled && "cursor-not-allowed opacity-60",
            activeError && "border-destructive/60 bg-destructive/5",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            aria-label="Seleccionar archivo"
            aria-required={true}
            accept={accept}
            disabled={disabled}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl shadow-2xs">
            <HugeiconsIcon icon={Upload01Icon} size={22} strokeWidth={2} />
          </div>

          <div className="space-y-0.5">
            <p className="text-foreground text-xs font-semibold">{title}</p>
            <p className="text-muted-foreground text-xs">
              {description} (hasta {formatBytes(maxSizeBytes)})
            </p>
          </div>

          {acceptedFormats.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {acceptedFormats.map((fmt) => (
                <span
                  key={fmt}
                  className="border-border/70 bg-background text-muted-foreground rounded-md border px-2 py-0.5 font-mono text-xs font-bold"
                >
                  {fmt}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="border-border/70 bg-card flex items-center justify-between rounded-xl border p-3.5 shadow-2xs">
          <div className="flex min-w-0 items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
              <HugeiconsIcon icon={File02Icon} size={20} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-foreground truncate text-xs font-semibold">{file.name}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground font-mono">{formatBytes(file.size)}</span>
                <span className="text-muted-foreground/60">•</span>
                <span className="text-success inline-flex items-center gap-1 font-medium">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
                  Archivo cargado
                </span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive size-8 shrink-0 rounded-lg"
            title="Quitar archivo"
            aria-label="Quitar archivo"
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
          </Button>
        </div>
      )}

      {activeError ? (
        <div className="text-destructive flex items-center gap-1.5 px-1 text-xs font-medium">
          <HugeiconsIcon icon={AlertCircleIcon} size={14} className="shrink-0" />
          <span>{activeError}</span>
        </div>
      ) : null}
    </div>
  );
}
