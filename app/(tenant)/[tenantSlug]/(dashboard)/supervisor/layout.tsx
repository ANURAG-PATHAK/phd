import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/app/(tenant)/[tenantSlug]/(dashboard)/_components/dashboard-shell";
import { requireSession } from "@/lib/auth/session";
import { ensureTenantMembership } from "@/lib/auth/navigation";
import { fetchTenantNavigation } from "@/lib/navigation/load-nav";

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
        roleKey: "SUPERVISOR",
    });

    if (membership.roleKey !== "SUPERVISOR") {
        notFound();
    }

    const navItems = await fetchTenantNavigation(tenantSlug, membership.roleKey);

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
