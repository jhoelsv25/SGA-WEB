import { IconSvgElement } from "@hugeicons/react";
import { ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: IconSvgElement;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
  badge?: ReactNode;
}
