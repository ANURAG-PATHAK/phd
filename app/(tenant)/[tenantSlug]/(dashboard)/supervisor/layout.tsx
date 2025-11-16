import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
    DashboardShell,
    type DashboardNavItem,
} from "@/app/(tenant)/[tenantSlug]/(dashboard)/_components/dashboard-shell";
import { requireSession } from "@/lib/auth/session";
import { ensureTenantMembership } from "@/lib/auth/navigation";

export default async function SupervisorLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ tenantSlug: string }>;
}) {
    const { tenantSlug } = await params;

    const session = await requireSession();
    const membership = ensureTenantMembership(session, {
        tenantSlug,
    });

    if (membership.roleKey !== "SUPERVISOR") {
        notFound();
    }

    const navItems: DashboardNavItem[] = [
        {
            title: "Overview",
            href: `/${tenantSlug}/supervisor`,
            icon: "LayoutDashboard",
        },
        {
            title: "Scholars",
            href: `/${tenantSlug}/supervisor/scholars`,
            icon: "Users",
        },
        {
            title: "Meetings",
            href: `/${tenantSlug}/supervisor/meetings`,
            icon: "CalendarClock",
        },
        {
            title: "Documents",
            href: `/${tenantSlug}/supervisor/documents`,
            icon: "FileStack",
        },
        {
            title: "Messages",
            href: `/${tenantSlug}/supervisor/messages`,
            icon: "MessageSquare",
        },
    ];

    return (
        <DashboardShell
            navItems={navItems}
            tenant={{ name: membership.tenantName, slug: membership.tenantSlug }}
            user={{
                name: session.user.name ?? session.user.email,
                roleName: membership.roleName,
                email: session.user.email,
            }}
            maxContentWidthClassName="max-w-5xl"
        >
            {children}
        </DashboardShell>
    );
}
