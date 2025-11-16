import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
    DashboardShell,
    type DashboardNavItem,
} from "@/app/(tenant)/[tenantSlug]/(dashboard)/_components/dashboard-shell";
import { requireSession } from "@/lib/auth/session";
import { ensureTenantMembership } from "@/lib/auth/navigation";

export default async function DeveloperLayout({
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

    if (membership.roleKey !== "DEVELOPER") {
        notFound();
    }

    const navItems: DashboardNavItem[] = [
        {
            title: "Overview",
            href: `/${tenantSlug}/developer`,
            icon: "LayoutDashboard",
        },
        {
            title: "Feature flags",
            href: `/${tenantSlug}/developer/feature-flags`,
            icon: "Flag",
        },
        {
            title: "Audit logs",
            href: `/${tenantSlug}/developer/audit`,
            icon: "ScrollText",
        },
        {
            title: "Integrations",
            href: `/${tenantSlug}/developer/integrations`,
            icon: "PlugZap",
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
        >
            {children}
        </DashboardShell>
    );
}
