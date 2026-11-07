"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/common/user-avatar";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { PersonaActions } from "./persona-actions";
import type { Persona } from "../../types/personas.types";
import {
  esFichaVigente,
  estadoFicha,
  etiquetaBaja,
  type TipoFichaAcademica,
} from "../../utils/ficha-academica";
import type { AccionFicha } from "../../components/modals/ficha-baja-modal";

interface GetPersonaColumnsOptions {
  onEdit: (persona: Persona) => void;
  onDelete: (persona: Persona) => void;
  onVerHistorial?: (persona: Persona) => void;
  onChangeCargo?: (persona: Persona) => void;
  onFichaAccion?: (persona: Persona, tipo: TipoFichaAcademica, accion: AccionFicha) => void;
  isDeleting?: boolean;
}

export function getPersonaColumns({
  onEdit,
  onDelete,
  onVerHistorial,
  onChangeCargo,
  onFichaAccion,
  isDeleting,
}: GetPersonaColumnsOptions): ColumnDef<Persona>[] {
  return [
    {
      id: "persona",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Persona" />,
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex items-center gap-3">
            <UserAvatar name={p.nombreCompleto} avatar={p.fotoUrl ?? undefined} />
            <div className="space-y-0.5">
              <p className="text-foreground font-medium">{p.nombreCompleto}</p>
              <p className="text-muted-foreground text-xs">
                <span className="font-mono uppercase">{p.tipoDocumento}</span>: {p.numeroDocumento}
                {p.correo && ` · ${p.correo}`}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "sexo",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Sexo" />,
      cell: ({ row }) => {
        const sexo = row.original.sexo;
        return (
          <Badge variant="outline" className="text-xs">
            {sexo === "M" ? "Masculino" : "Femenino"}
          </Badge>
        );
      },
    },
    {
      id: "condicion",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Condición" />,
      cell: ({ row }) => {
        const esProvisional = row.original.esProvisional;
        return esProvisional ? (
          <Badge
            variant="outline"
            className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          >
            Provisional
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            Vinculada
          </Badge>
        );
      },
    },
    {
      id: "fichas",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fichas / Roles" />,
      cell: ({ row }) => {
        const f = row.original.fichas;
        const fichasActivas: Array<{ label: string; color: string }> = [];
        const COLOR_BAJA = "border-slate-400/40 bg-transparent text-muted-foreground line-through";

        // RF-007 V4: una ficha académica dada de baja se muestra apagada y con su estado
        (
          [
            {
              tipo: "docente",
              label: "Docente",
              color: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
            },
            {
              tipo: "estudiante",
              label: "Estudiante",
              color: "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400",
            },
          ] as Array<{ tipo: TipoFichaAcademica; label: string; color: string }>
        ).forEach(({ tipo, label, color }) => {
          const estado = estadoFicha(row.original, tipo);
          if (!estado) return;
          fichasActivas.push(
            esFichaVigente(tipo, estado)
              ? { label, color }
              : { label: `${label} (${etiquetaBaja(tipo, estado)})`, color: COLOR_BAJA },
          );
        });
        if (f.esApoderado)
          fichasActivas.push({
            label: "Apoderado",
            color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          });
        if (f.tieneUsuario)
          fichasActivas.push({
            label: "Usuario",
            color: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400",
          });

        if (fichasActivas.length === 0) {
          return <span className="text-muted-foreground text-xs italic">Sin fichas</span>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {fichasActivas.map((item) => (
              <Badge key={item.label} variant="outline" className={`text-[11px] ${item.color}`}>
                {item.label}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "cargoVigente",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Cargo Vigente" />,
      cell: ({ row }) => {
        const cargo = row.original.cargoVigente;
        return cargo ? (
          <span className="text-foreground text-xs font-medium">{cargo}</span>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        );
      },
    },
    {
      id: "contacto",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Contacto" />,
      cell: ({ row }) => {
        const p = row.original;
        const contacto = p.celular || p.telefono;
        return contacto ? (
          <span className="text-foreground font-mono text-xs">{contacto}</span>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => (
        <PersonaActions
          persona={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          onVerHistorial={onVerHistorial}
          onChangeCargo={onChangeCargo}
          onFichaAccion={onFichaAccion}
          isDeleting={isDeleting}
        />
      ),
    },
  ];
}
