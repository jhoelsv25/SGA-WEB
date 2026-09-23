import type { ReactNode } from "react";
import type { IconSvgElement } from "@hugeicons/react";

export interface RowActionHeader {
  title: string;
  subtitle?: string | null;
}

export interface RowActionCopy {
  text: string;
  label?: string;
  successMessage?: string;
}

export interface RowActionStatusOption<T extends string = string> {
  value: T;
  label: string;
  className?: string;
  disabled?: boolean;
}

export interface RowActionStatusPicker<T extends string = string> {
  title?: string;
  current: T;
  options: RowActionStatusOption<T>[];
  onSelect: (value: T) => void | Promise<void>;
  label?: string;
  icon?: IconSvgElement;
}

export interface RowActionCustomItem {
  key?: string;
  label: string;
  icon: IconSvgElement;
  onClick?: () => void | Promise<void>;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  variant?: "default" | "destructive" | "primary" | "warning";
  separatorBefore?: boolean;
}

export interface RowActionDelete {
  title?: string;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
  label?: string;
}

export interface TableRowActionsProps<TStatus extends string = string> {
  header?: RowActionHeader;
  copy?: RowActionCopy;
  onEdit?: () => void;
  editLabel?: string;
  statusPicker?: RowActionStatusPicker<TStatus>;
  items?: RowActionCustomItem[];
  deleteAction?: RowActionDelete;
  className?: string;
  triggerAriaLabel?: string;
}
