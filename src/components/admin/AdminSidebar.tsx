/**
 * @file AdminSidebar component.
 * Renders a scrollable, collapsible sidebar with profile header and grouped
 * navigation links. On mobile it acts as an off-canvas drawer controlled by
 * `open`/`onClose`; on desktop (`lg+`) it is a fixed, always-visible panel.
 *
 * @param open  - Whether the sidebar is visible (mobile drawer state).
 * @param onClose - Called when the drawer should be dismissed.
 */
"use client";
import Link from "next/link";
import { navGroups } from "@/lib/admin-nav";
import type { SidebarNavGroup } from "@/types/dashboard";

export default function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-white shadow-lg
          transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarProfile />
        <nav className="mt-4 space-y-6 px-3 pb-6">
          {navGroups.map((group) => (
            <SidebarSection key={group.group} group={group} />
          ))}
        </nav>
      </aside>
    </>
  );
}

/** Profile header for the admin inside the sidebar. */
function SidebarProfile() {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b">
      <img
        src="/placeholder.png"
        alt="Admin avatar"
        className="h-10 w-10 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold text-gray-800">Hi, Admin</p>
        <p className="text-xs text-gray-500">Super Admin</p>
      </div>
    </div>
  );
}

/** Renders one labeled group of navigation links. */
function SidebarSection({ group }: { group: SidebarNavGroup }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
        {group.group}
      </p>
      <ul className="space-y-1">
        {group.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center justify-between rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              <span className="flex items-center gap-2">
                {link.icon}
                {link.label}
              </span>
              {link.badge ? (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {link.badge}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
