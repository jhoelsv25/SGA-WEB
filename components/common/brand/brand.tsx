import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BrandMarkProps, BrandProps, BrandSize, BrandWordmarkProps } from "./types";

const sizeConfig: Record<
  BrandSize,
  {
    markSize: number;
    wordmarkWidth: number;
    wordmarkHeight: number;
    titleClass: string;
    subtitleClass: string;
    gapClass: string;
  }
> = {
  xs: {
    markSize: 20,
    wordmarkWidth: 70,
    wordmarkHeight: 30,
    titleClass: "text-xs font-bold",
    subtitleClass: "text-xs font-medium tracking-wider",
    gapClass: "gap-1.5",
  },
  sm: {
    markSize: 28,
    wordmarkWidth: 90,
    wordmarkHeight: 40,
    titleClass: "text-sm font-bold",
    subtitleClass: "text-xs font-medium tracking-wider",
    gapClass: "gap-2",
  },
  md: {
    markSize: 36,
    wordmarkWidth: 110,
    wordmarkHeight: 48,
    titleClass: "text-base font-bold",
    subtitleClass: "text-xs font-medium tracking-wider",
    gapClass: "gap-2.5",
  },
  lg: {
    markSize: 44,
    wordmarkWidth: 130,
    wordmarkHeight: 56,
    titleClass: "text-lg font-bold",
    subtitleClass: "text-xs font-medium tracking-wider",
    gapClass: "gap-3",
  },
  xl: {
    markSize: 56,
    wordmarkWidth: 150,
    wordmarkHeight: 64,
    titleClass: "text-2xl font-bold",
    subtitleClass: "text-sm font-medium tracking-wider",
    gapClass: "gap-3.5",
  },
};

export function BrandMark({
  size = "md",
  priority = false,
  alt = "SGA - Sistema de Gestión Académica",
  className,
  imageClassName,
  ...props
}: BrandMarkProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={cn("relative flex shrink-0 items-center justify-center select-none", className)}
      {...props}
    >
      <Image
        src="/logo.png"
        alt={alt}
        width={config.markSize}
        height={config.markSize}
        priority={priority}
        className={cn("h-auto w-auto object-contain", imageClassName)}
      />
    </div>
  );
}

export function BrandWordmark({
  size = "md",
  useImage = false,
  title = "SGA",
  subtitle = "Gestión Académica",
  showSubtitle = true,
  priority = false,
  className,
  imageClassName,
  ...props
}: BrandWordmarkProps) {
  const config = sizeConfig[size];

  if (useImage) {
    return (
      <div className={cn("flex items-center select-none", className)} {...props}>
        <Image
          src="/logo.png"
          alt={`${title} ${subtitle}`}
          width={config.wordmarkWidth}
          height={config.wordmarkHeight}
          priority={priority}
          className={cn("h-auto w-auto object-contain", imageClassName)}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col text-left leading-none select-none", className)} {...props}>
      <span className={cn("text-foreground font-black tracking-tight", config.titleClass)}>
        {title}
      </span>
      {showSubtitle && subtitle ? (
        <span
          className={cn(
            "text-muted-foreground mt-0.5 font-semibold tracking-wider uppercase",
            config.subtitleClass,
          )}
        >
          {subtitle}
        </span>
      ) : null}
    </div>
  );
}

export function Brand({
  variant = "full",
  size = "md",
  href,
  collapsed = false,
  title = "SGA",
  subtitle = "Gestión Académica",
  showSubtitle = true,
  useImageWordmark = false,
  priority = false,
  className,
  imageClassName,
  action,
  ...props
}: BrandProps) {
  const config = sizeConfig[size];

  const content = (
    <div
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-90",
        config.gapClass,
        className,
      )}
      {...props}
    >
      {(variant === "full" || variant === "mark") && (
        <BrandMark size={size} priority={priority} alt={title} imageClassName={imageClassName} />
      )}

      {!collapsed && (variant === "full" || variant === "wordmark") && (
        <BrandWordmark
          size={size}
          useImage={useImageWordmark}
          title={title}
          subtitle={subtitle}
          showSubtitle={showSubtitle}
          priority={priority}
          imageClassName={imageClassName}
        />
      )}

      {action && !collapsed && <div className="ml-auto">{action}</div>}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="focus-visible:ring-ring inline-flex rounded-lg outline-none focus-visible:ring-2"
      >
        {content}
      </Link>
    );
  }

  return content;
}
