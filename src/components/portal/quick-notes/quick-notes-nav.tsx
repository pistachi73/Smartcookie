"use client";

import { Breadcrumbs, Separator, SidebarNav, SidebarTrigger } from "ui";

export default function QuickNotesNav() {
  return (
    <SidebarNav className="border-b h-14 sticky shrink-0 top-0 z-20">
      <span className="flex items-center gap-x-4">
        <SidebarTrigger className="-mx-2" appearance="plain" shape="square" />
        <Separator className="h-6" orientation="vertical" />
        <Breadcrumbs className="@md:flex hidden">
          <Breadcrumbs.Item href="/portal/dashboard">
            Dashboard
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="/portal/quick-notes">
            Quick Notes
          </Breadcrumbs.Item>
        </Breadcrumbs>
      </span>
    </SidebarNav>
  );
}
