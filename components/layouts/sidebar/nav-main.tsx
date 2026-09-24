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
        <SidebarGroup key={section.title || `section-${idx}`} className="py-2">
          {section.title && (
            <SidebarGroupLabel className="text-muted-foreground/70 text-[11px] font-bold tracking-wider uppercase">
              {section.title}
            </SidebarGroupLabel>
          )}

          <SidebarMenu>
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
                "group hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                (isActive || isAnyChildActive) &&
                  "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
              )}
            >
              <RenderNavIcon icon={item.icon} />
              <span className="truncate">{item.label}</span>
              {item.badge && <RenderNavBadge badge={item.badge} />}
              <HugeiconsIcon
                icon={ChevronRightIcon}
                className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem) => {
                const isSubActive = subItem.exact
                  ? currentPath === subItem.link
                  : currentPath === subItem.link || currentPath.startsWith(`${subItem.link}/`);

                return (
                  <SidebarMenuSubItem key={subItem.id}>
                    <SidebarMenuSubButton asChild isActive={isSubActive}>
                      <Link href={subItem.link} className="flex items-center gap-2">
                        {subItem.icon && <RenderNavIcon icon={subItem.icon} className="size-3.5" />}
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
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
        )}
      >
        <Link href={item.link} className="flex items-center gap-2.5">
          <RenderNavIcon icon={item.icon} />
          <span className="truncate">{item.label}</span>
          {item.badge && <RenderNavBadge badge={item.badge} />}
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

function RenderNavBadge({ badge }: { badge: NavBadge | string }) {
  if (typeof badge === "string") {
    return (
      <span className="bg-primary/10 text-primary border-primary/20 py-0.2 ml-auto rounded-full border px-1.5 text-[10px] font-bold">
        {badge}
      </span>
    );
  }

  const variantStyles: Record<string, string> = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-border text-foreground",
    success:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    info: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20",
  };

  const selectedStyle =
    badge.variant && variantStyles[badge.variant]
      ? variantStyles[badge.variant]
      : variantStyles.default;

  return (
    <span
      className={cn(
        "py-0.2 ml-auto shrink-0 rounded-full px-1.5 text-[9.5px] font-bold tracking-tight",
        selectedStyle,
        badge.className,
      )}
    >
      {badge.text}
    </span>
  );
}
