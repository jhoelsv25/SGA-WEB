import type { Control, FieldPath, FieldValues } from "react-hook-form";

export interface CampoFechaProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  dateFormat?: string;
  clearable?: boolean;
}
