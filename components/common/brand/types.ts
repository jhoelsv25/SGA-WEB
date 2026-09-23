import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type BrandSize = "xs" | "sm" | "md" | "lg" | "xl";
export type BrandVariant = "full" | "mark" | "wordmark";

export interface BrandMarkProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  size?: BrandSize;
  priority?: boolean;
  alt?: string;
  className?: string;
  imageClassName?: string;
}

export interface BrandWordmarkProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  size?: BrandSize;
  useImage?: boolean;
  title?: string;
  subtitle?: string;
  showSubtitle?: boolean;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}

export interface BrandProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  variant?: BrandVariant;
  size?: BrandSize;
  href?: string;
  collapsed?: boolean;
  title?: string;
  subtitle?: string;
  showSubtitle?: boolean;
  useImageWordmark?: boolean;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  action?: ReactNode;
}
