"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockIcon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { Input, type InputProps } from "@/components/ui/input";

export interface PasswordInputProps extends Omit<InputProps, "type" | "endIcon"> {
  /**
   * Etiquetas accesibles para el botón alternador de visibilidad.
   * Por defecto: "Ver contraseña" / "Ocultar contraseña".
   */
  toggleAriaLabel?: {
    show?: string;
    hide?: string;
  };
}

/**
 * Campo de contraseña accesible y reutilizable.
 * Cumple WCAG 2.2 con botón ver/ocultar de 36 px (en rango 36–44 px),
 * atributos `aria-pressed` y `aria-label`, foco visible y manejo por teclado.
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ startIcon, toggleAriaLabel, disabled, ...props }, ref) {
    const [showPassword, setShowPassword] = React.useState(false);

    const labelOcultar = toggleAriaLabel?.hide ?? "Ocultar contraseña";
    const labelVer = toggleAriaLabel?.show ?? "Ver contraseña";

    return (
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        disabled={disabled}
        startIcon={startIcon ?? <HugeiconsIcon icon={LockIcon} className="size-4" />}
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-pressed={showPassword}
            aria-label={showPassword ? labelOcultar : labelVer}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/40 -mr-2 flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <HugeiconsIcon icon={showPassword ? ViewOffSlashIcon : ViewIcon} className="size-4" />
          </button>
        }
        {...props}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";
