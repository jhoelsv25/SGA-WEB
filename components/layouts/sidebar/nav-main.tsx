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
    <div className="space-y-3.5">
      {sections.map((section, idx) => (
        <SidebarGroup key={section.title || `section-${idx}`} className="px-0 py-0">
          {section.title && (
            <SidebarGroupLabel className="text-muted-foreground/60 px-3 pt-3 pb-1 text-[11px] font-bold tracking-wider uppercase select-none">
              {section.title}
            </SidebarGroupLabel>
          )}

          <SidebarMenu className="gap-1">
            {section.items.map((item) => (
              <NavMenuItem key={item.id} item={item} currentPath={pathname} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </div>
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
                "group relative h-10 rounded-full border border-transparent px-3.5 text-[13px] font-medium tracking-tight transition-all duration-200",
                "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                (isActive || isAnyChildActive) &&
                  "bg-primary/10 text-primary border-primary/20 font-semibold shadow-2xs",
              )}
            >
              <RenderNavIcon
                icon={item.icon}
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isActive || isAnyChildActive
                    ? "text-primary"
                    : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground",
                )}
              />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge && <RenderNavBadge badge={item.badge} />}
              <HugeiconsIcon
                icon={ChevronRightIcon}
                className="ml-1.5 size-4 shrink-0 opacity-50 transition-transform duration-200 group-hover:opacity-100 group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub className="border-sidebar-border/70 my-1 ml-4 space-y-0.5 border-l py-1 pl-3">
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
                        "h-8.5 rounded-full border border-transparent px-3 text-[12.5px] font-medium transition-all duration-150",
                        "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                        isSubActive && "bg-primary/10 text-primary border-primary/15 font-semibold",
                      )}
                    >
                      <Link href={subItem.link} className="flex items-center gap-2">
                        {subItem.icon ? (
                          <RenderNavIcon
                            icon={subItem.icon}
                            className={cn(
                              "size-3.5",
                              isSubActive ? "text-primary" : "text-sidebar-foreground/60",
                            )}
                          />
                        ) : (
                          <span
                            className={cn(
                              "size-1.5 rounded-full transition-colors",
                              isSubActive ? "bg-primary" : "bg-sidebar-foreground/30",
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
          "group relative h-10 rounded-full border border-transparent px-3.5 text-[13px] font-medium tracking-tight transition-all duration-200",
          "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
          isActive && "bg-primary/10 text-primary border-primary/20 font-semibold shadow-2xs",
        )}
      >
        <Link href={item.link} className="flex w-full items-center gap-2.5">
          <RenderNavIcon
            icon={item.icon}
            className={cn(
              "size-4.5 shrink-0 transition-colors",
              isActive
                ? "text-primary"
                : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground",
            )}
          />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.badge && <RenderNavBadge badge={item.badge} isParentActive={isActive} />}
          {isActive && (
            <span className="bg-primary animate-in fade-in size-1.5 shrink-0 rounded-full" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
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
      <span className="bg-primary/20 text-primary border-primary/30 ml-auto inline-flex items-center rounded-full border px-2 py-0.5 text-[9.5px] font-bold">
        {text}
      </span>
    );
  }

  const variantStyles: Record<string, string> = {
    default: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary text-secondary-foreground border border-border/50",
    destructive: "bg-destructive/10 text-destructive border border-destructive/20",
    outline: "border border-border/70 text-muted-foreground bg-background/50",
    success:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20",
    info: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20",
  };

  const badgeStyle = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={cn(
        "ml-auto inline-flex shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-[9.5px] font-bold tracking-tight shadow-2xs",
        badgeStyle,
        typeof badge !== "string" && badge.className,
      )}
    >
      {text}
    </span>
  );
}
