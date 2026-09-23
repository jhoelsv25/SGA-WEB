import { IconSvgElement } from "@hugeicons/react";
import { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: IconSvgElement;
  action?: ReactNode;
  className?: string;
}
