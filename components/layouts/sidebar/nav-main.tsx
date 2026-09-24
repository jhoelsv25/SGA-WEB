"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronRightIcon } from "@hugeicons/core-free-icons";
import type { NavSection, NavItem, NavBadge } from "@/config/navigation/types";
import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface NavMainProps {
  sections: NavSection[];
}

export function NavMain({ sections }: NavMainProps) {
  const pathname = usePathname();

  return (
    <>
      {sections.map((section, idx) => (
        <SidebarGroup key={section.title || `section-${idx}`} className="px-0 py-1.5">
          {section.title && (
            <SidebarGroupLabel className="text-muted-foreground/80 px-3 text-[10.5px] font-semibold tracking-wider uppercase">
              {section.title}
            </SidebarGroupLabel>
          )}

          <SidebarMenu className="gap-0.5">
            {section.items.map((item) => (
              <NavMenuItem key={item.id} item={item} currentPath={pathname} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}

interface NavMenuItemProps {
  item: NavItem;
  currentPath: string;
}

function NavMenuItem({ item, currentPath }: NavMenuItemProps) {
  const hasSubItems = item.items && item.items.length > 0;
  const isActive = item.exact
    ? currentPath === item.link
    : currentPath === item.link || currentPath.startsWith(`${item.link}/`);

  const isAnyChildActive = hasSubItems
    ? item.items?.some((sub) =>
        sub.exact
          ? currentPath === sub.link
          : currentPath === sub.link || currentPath.startsWith(`${sub.link}/`),
      )
    : false;

  const [isOpen, setIsOpen] = React.useState(isActive || isAnyChildActive);

  // Si tiene elementos anidados (desplegable)
  if (hasSubItems) {
    return (
      <Collapsible asChild open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.label}
              isActive={isActive || isAnyChildActive}
              className={cn(
                "group relative h-10 rounded-full px-3.5 text-[13.5px] font-medium transition-all duration-200",
                "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
                (isActive || isAnyChildActive) &&
                  "bg-primary/10 text-primary hover:bg-primary/15 font-bold shadow-2xs",
              )}
            >
              <RenderNavIcon
                icon={item.icon}
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isActive || isAnyChildActive
                    ? "text-primary"
                    : "text-muted-foreground/80 group-hover:text-foreground",
                )}
              />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge && <RenderNavBadge badge={item.badge} />}
              <HugeiconsIcon
                icon={ChevronRightIcon}
                className="ml-1.5 size-4 shrink-0 opacity-60 transition-transform duration-200 group-hover:opacity-100 group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub className="border-sidebar-border/70 my-1 ml-4 border-l py-1 pl-2.5">
              {item.items?.map((subItem) => {
                const isSubActive = subItem.exact
                  ? currentPath === subItem.link
                  : currentPath === subItem.link || currentPath.startsWith(`${subItem.link}/`);

                return (
                  <SidebarMenuSubItem key={subItem.id}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isSubActive}
                      className={cn(
                        "h-8.5 rounded-full px-3 text-[13px] font-medium transition-colors",
                        "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
                        isSubActive && "bg-primary/10 text-primary font-bold",
                      )}
                    >
                      <Link href={subItem.link} className="flex items-center gap-2">
                        {subItem.icon && (
                          <RenderNavIcon
                            icon={subItem.icon}
                            className={cn(
                              "size-3.5",
                              isSubActive ? "text-primary" : "text-muted-foreground",
                            )}
                          />
                        )}
                        <span className="truncate">{subItem.label}</span>
                        {subItem.badge && <RenderNavBadge badge={subItem.badge} />}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // Ítem directo sin desplegable
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.label}
        isActive={isActive}
        className={cn(
          "group relative h-10 rounded-full px-3.5 text-[13.5px] font-medium transition-all duration-200",
          "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
          isActive &&
            "!bg-primary !text-primary-foreground hover:!bg-primary/90 hover:!text-primary-foreground shadow-primary/25 font-bold shadow-md",
        )}
      >
        <Link href={item.link} className="flex w-full items-center gap-2.5">
          <RenderNavIcon
            icon={item.icon}
            className={cn(
              "size-4 shrink-0 transition-colors",
              isActive
                ? "!text-primary-foreground"
                : "text-muted-foreground/80 group-hover:text-foreground",
            )}
          />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.badge && <RenderNavBadge badge={item.badge} isParentActive={isActive} />}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function RenderNavIcon({
  icon,
  className = "size-4 shrink-0",
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
  if (typeof badge === "string") {
    return (
      <span
        className={cn(
          "ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide transition-colors",
          isParentActive
            ? "bg-white/20 text-white"
            : "border-primary/20 bg-primary/10 text-primary border",
        )}
      >
        {badge}
      </span>
    );
  }

  const variantStyles: Record<string, string> = {
    default: isParentActive
      ? "bg-white/20 text-white"
      : "bg-primary/10 text-primary border border-primary/20",
    secondary: isParentActive
      ? "bg-white/20 text-white"
      : "bg-secondary text-secondary-foreground border border-border/50",
    destructive:
      "bg-destructive/15 text-destructive border border-destructive/25 dark:bg-destructive/25",
    outline: isParentActive
      ? "bg-white/20 text-white"
      : "border border-border/80 text-muted-foreground bg-background/50",
    success:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25",
    warning: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30",
    info: "bg-sky-500/15 text-sky-800 dark:text-sky-300 border border-sky-500/30",
  };

  const selectedStyle =
    badge.variant && variantStyles[badge.variant]
      ? variantStyles[badge.variant]
      : variantStyles.default;

  return (
    <span
      className={cn(
        "ml-auto inline-flex shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight shadow-2xs",
        selectedStyle,
        badge.className,
      )}
    >
      {badge.text}
    </span>
  );
}
