"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { NavSection, NavItem, NavBadge } from "@/config/navigation/types";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { cn } from "@/lib/utils";
import { colorDeSeccion } from "./colores-seccion";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface NavMainProps {
  sections: NavSection[];
  /** Muestra desplegados todos los grupos (mientras se busca en el menú). */
  abrirTodo?: boolean;
}

/** La ruta actual es la del ítem (o una de sus rutas incluidas), o la de alguna de sus opciones. */
function contieneRuta(item: NavItem, ruta: string): boolean {
  const coincide = (enlace: string) => ruta === enlace || ruta.startsWith(`${enlace}/`);
  if (item.items?.length) return item.items.some((sub) => contieneRuta(sub, ruta));
  if (item.exact) return ruta === item.link;
  return coincide(item.link) || Boolean(item.rutasIncluidas?.some(coincide));
}

export function NavMain({ sections, abrirTodo = false }: NavMainProps) {
  const pathname = usePathname();

  // Solo un grupo del menú queda abierto: al abrir otro, el anterior se cierra.
  const grupoActivo =
    sections
      .flatMap((seccion) => seccion.items)
      .find((item) => item.items?.length && contieneRuta(item, pathname))?.id ?? null;
  const [grupoAbierto, setGrupoAbierto] = React.useState(grupoActivo);
  // Al cambiar de pantalla (menú, buscador o acceso rápido) se abre el grupo que la contiene.
  const [rutaAnterior, setRutaAnterior] = React.useState({ pathname, grupoActivo });
  if (rutaAnterior.pathname !== pathname || rutaAnterior.grupoActivo !== grupoActivo) {
    setRutaAnterior({ pathname, grupoActivo });
    setGrupoAbierto(grupoActivo);
  }

  return (
    <div className="group-data-[collapsible=icon]:space-y-0">
      {sections.map((section, idx) => {
        // Se pinta la sección completa donde está la pantalla actual (Inicio no tiene título).
        const enSeccion =
          Boolean(section.title) && section.items.some((item) => contieneRuta(item, pathname));

        return (
          <React.Fragment key={section.title || `section-${idx}`}>
            {/* Línea que separa una sección de la anterior (contraída usa la suya, más corta) */}
            {idx > 0 && (
              <div
                aria-hidden="true"
                className="bg-sidebar-border my-2 h-px group-data-[collapsible=icon]:hidden"
              />
            )}
            <SidebarGroup
              data-seccion-activa={enSeccion || undefined}
              className={cn(
                "p-0",
                enSeccion && "bg-(--menu-seccion) pb-1",
                // Contraída: sin títulos, las secciones se separan con una línea corta.
                "group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0",
                "group-data-[collapsible=icon]:not-first:before:bg-sidebar-border group-data-[collapsible=icon]:not-first:before:mx-auto group-data-[collapsible=icon]:not-first:before:my-2 group-data-[collapsible=icon]:not-first:before:h-0.5 group-data-[collapsible=icon]:not-first:before:w-5",
              )}
            >
              {section.title && (
                <SidebarGroupLabel
                  className={cn(
                    "text-muted-foreground h-auto rounded-none px-4 pt-2 pb-2 text-[11px] font-semibold tracking-wider uppercase select-none",
                    enSeccion && "text-foreground",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{section.title}</span>
                </SidebarGroupLabel>
              )}

              <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center">
                {section.items.map((item) => (
                  <NavMenuItem
                    key={item.id}
                    item={item}
                    currentPath={pathname}
                    color={colorDeSeccion(section.title, idx)}
                    isOpen={abrirTodo || grupoAbierto === item.id}
                    buscando={abrirTodo}
                    onOpenChange={(abrir) => setGrupoAbierto(abrir ? item.id : null)}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </React.Fragment>
        );
      })}
    </div>
  );
}

interface NavMenuItemProps {
  /** Con el menú filtrado todos los grupos están abiertos: no se desplaza la lista. */
  buscando: boolean;
  isOpen: boolean;
  onOpenChange: (abrir: boolean) => void;
  /** Clase del color del icono. */
  color: string;
  item: NavItem;
  currentPath: string;
}

function NavMenuItem({
  item,
  currentPath,
  color,
  buscando,
  isOpen,
  onOpenChange,
}: NavMenuItemProps) {
  const { anio } = useAnioLectivo();
  const { state, isMobile } = useSidebar();
  const contraida = state === "collapsed" && !isMobile;
  const hasSubItems = item.items && item.items.length > 0;
  const badge =
    item.id === "admin-enrollment" ? (anio ? String(anio.anio) : undefined) : item.badge;
  const isActive = contieneRuta(item, currentPath);

  // Al abrir un grupo, el menú sube lo necesario para que se vean todas sus opciones.
  const refGrupo = React.useRef<HTMLLIElement>(null);
  React.useEffect(() => {
    if (!isOpen || buscando || contraida || !hasSubItems) return;
    const cuadro = requestAnimationFrame(() => mostrarCompleto(refGrupo.current));
    return () => cancelAnimationFrame(cuadro);
  }, [isOpen, buscando, contraida, hasSubItems]);

  const clasesBoton = cn(
    "group h-10 gap-3 rounded-none px-4 text-[13.5px] font-medium transition-colors duration-150 pointer-coarse:h-11",
    "text-foreground/80 hover:bg-(--menu-hover) hover:text-foreground",
    "group-data-[collapsible=icon]:text-foreground/85 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!",
    isActive &&
      (hasSubItems && !contraida
        ? "text-foreground! bg-(--menu-grupo)! font-semibold"
        : "text-foreground! bg-(--menu-activo)! font-semibold shadow-[inset_4px_0_0_var(--franja)]!"),
  );
  const icono = (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center",
        // Estilo Azure: icono grande de color, con un relleno suave del mismo tono.
        "[&_circle]:fill-current/20 [&_path]:fill-current/20 [&_rect]:fill-current/20",
        color,
      )}
    >
      <RenderNavIcon icon={item.icon} className="size-[22px]! shrink-0" />
    </span>
  );

  // Contraída: un grupo abre sus opciones en un menú emergente al costado.
  if (hasSubItems && contraida) {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              isActive={isActive}
              aria-label={item.label}
              title={item.label}
              className={clasesBoton}
            >
              {icono}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={16}
            className="tema-barra bg-sidebar border-sidebar-border w-60 rounded-sm border px-0 py-1 shadow-xl"
          >
            <DropdownMenuLabel className="text-muted-foreground px-3 text-[11px] tracking-wider uppercase">
              {item.label}
            </DropdownMenuLabel>
            {item.items?.map((subItem) => {
              const activa = contieneRuta(subItem, currentPath);
              return (
                <DropdownMenuItem
                  key={subItem.id}
                  asChild
                  className={cn(
                    "text-foreground/80 focus:text-foreground h-10 cursor-pointer rounded-none px-4 text-[13px] font-medium focus:bg-(--menu-hover)",
                    activa &&
                      "text-foreground! bg-(--menu-activo)! font-semibold shadow-[inset_4px_0_0_var(--franja)]!",
                  )}
                >
                  <Link href={subItem.link} aria-current={activa ? "page" : undefined}>
                    <RenderNavIcon icon={subItem.icon} className="size-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{subItem.label}</span>
                    {activa && <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  }

  // Abierta: el grupo despliega sus opciones, con sangría respecto del padre.
  if (hasSubItems) {
    return (
      <Collapsible asChild open={isOpen} onOpenChange={onOpenChange} className="group/collapsible">
        <SidebarMenuItem ref={refGrupo} className={cn((isActive || isOpen) && "bg-(--menu-grupo)")}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton isActive={isActive} className={clasesBoton}>
              {icono}
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge && <RenderNavBadge badge={item.badge} />}
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <ul className="space-y-0.5 py-0.5">
              {item.items?.map((subItem) => {
                const activa = contieneRuta(subItem, currentPath);

                return (
                  <li key={subItem.id}>
                    <Link
                      href={subItem.link}
                      aria-current={activa ? "page" : undefined}
                      className={cn(
                        "text-foreground/80 hover:text-foreground focus-visible:ring-ring flex min-h-9 items-center gap-3.5 pr-3 pl-10 text-[13px] font-medium transition-colors outline-none hover:bg-(--menu-hover) focus-visible:ring-2 focus-visible:ring-inset pointer-coarse:min-h-11",
                        activa &&
                          "text-foreground bg-(--menu-activo) font-semibold shadow-[inset_4px_0_0_var(--franja)] hover:bg-(--menu-activo)",
                      )}
                    >
                      {/* Gris como el texto; en la fila seleccionada se oscurece con él */}
                      <RenderNavIcon icon={subItem.icon} className="size-[18px] shrink-0" />
                      <span className="min-w-0 flex-1 truncate">{subItem.label}</span>
                      {subItem.badge && <RenderNavBadge badge={subItem.badge} />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // Ítem directo sin desplegable
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.label} isActive={isActive} className={clasesBoton}>
        <Link href={item.link} aria-label={contraida ? item.label : undefined}>
          {icono}
          {!contraida && (
            <>
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {badge ? <RenderNavBadge badge={badge} isParentActive={isActive} /> : null}
            </>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/**
 * Desplaza solo la lista del menú. Si el grupo no cabe entero, su título queda arriba
 * para ver la mayor cantidad posible de opciones.
 */
function mostrarCompleto(grupo: HTMLElement | null) {
  const lista = grupo?.closest<HTMLElement>('[data-slot="sidebar-content"]');
  if (!grupo || !lista) return;
  const margen = 12;
  const caja = grupo.getBoundingClientRect();
  const visible = lista.getBoundingClientRect();
  // Si al cerrarse otro grupo este quedó por encima, también se baja hasta su título.
  const porArriba = caja.top - visible.top;
  const sobra = caja.bottom + margen - visible.bottom;
  if (porArriba >= 0 && sobra <= 0) return;
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  lista.scrollBy({
    top: porArriba < 0 ? porArriba : Math.min(sobra, porArriba),
    behavior: sinMovimiento ? "auto" : "smooth",
  });
}

function RenderNavIcon({
  icon,
  className = "size-4.5 shrink-0",
}: {
  icon: NavItem["icon"];
  className?: string;
}) {
  if (typeof icon === "function") {
    const Component = icon;
    return <Component className={className} />;
  }

  if (Array.isArray(icon)) {
    return <HugeiconsIcon icon={icon} className={className} />;
  }

  return null;
}

function RenderNavBadge({
  badge,
  isParentActive = false,
}: {
  badge: NavBadge | string;
  isParentActive?: boolean;
}) {
  const text = typeof badge === "string" ? badge : badge.text;
  const variant = typeof badge === "string" ? "default" : (badge.variant ?? "default");

  if (isParentActive) {
    return (
      <span className="bg-primary/20 text-primary border-primary/30 ml-auto inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold">
        {text}
      </span>
    );
  }

  const variantStyles: Record<string, string> = {
    default: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary text-secondary-foreground border border-border/50",
    destructive: "bg-destructive/10 text-destructive border border-destructive/20",
    outline: "border border-border/70 text-muted-foreground bg-background/50",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning-text dark:text-warning border border-warning/20",
    info: "bg-info/10 text-info border border-info/20",
  };

  const badgeStyle = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={cn(
        "ml-auto inline-flex shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold tracking-tight shadow-2xs",
        badgeStyle,
        typeof badge !== "string" && badge.className,
      )}
    >
      {text}
    </span>
  );
}
