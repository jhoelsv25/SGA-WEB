import { ReactNode } from "react";

export interface SelectOptionItem<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
  group?: string;
}

export interface SelectOptionProps<T = string> {
  options: SelectOptionItem<T>[];
  value?: T;
  values?: T[];
  onSelect?: (value: T) => void;
  onValuesChange?: (values: T[]) => void;
  multi?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
}
