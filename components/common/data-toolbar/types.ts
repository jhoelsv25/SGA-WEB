import { ReactNode } from "react";

export type ViewMode = "table" | "cards" | "kanban";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterField {
  key: string;
  label: string;
  type: "select" | "multi-select" | "boolean";
  options?: FilterOption[];
}

export interface DataToolbarProps {
  searchKey?: string;
  searchPlaceholder?: string;
  filters?: FilterField[];
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  availableViews?: ViewMode[];
  onRefresh?: () => void | Promise<void>;
  isRefreshing?: boolean;
  actions?: ReactNode;
  className?: string;
}
