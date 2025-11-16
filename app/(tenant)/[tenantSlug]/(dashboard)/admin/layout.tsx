import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
    DashboardShell,
    type DashboardNavItem,
} from "@/app/(tenant)/[tenantSlug]/(dashboard)/_components/dashboard-shell";
import { MANAGEMENT_ROLES, hasAnyRole } from "@/lib/auth/rbac";
import { requireSession } from "@/lib/auth/session";
import { ensureTenantMembership } from "@/lib/auth/navigation";

export default async function AdminLayout({
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

    if (!hasAnyRole(membership, MANAGEMENT_ROLES)) {
        notFound();
    }

    const navItems: DashboardNavItem[] = [
        {
            title: "Overview",
            href: `/${tenantSlug}/admin`,
            icon: "LayoutDashboard",
        },
        {
            title: "Users",
            href: `/${tenantSlug}/admin/users`,
            icon: "UserCog",
        },
        {
            title: "Admissions",
            href: `/${tenantSlug}/admin/admissions`,
            icon: "GraduationCap",
        },
        {
            title: "Programs",
            href: `/${tenantSlug}/admin/programs`,
            icon: "Building2",
        },
        {
            title: "Scholars",
            href: `/${tenantSlug}/admin/scholars`,
            icon: "Users",
        },
        {
            title: "Finance",
            href: `/${tenantSlug}/admin/finance`,
            icon: "Wallet",
        },
        {
            title: "Documents",
            href: `/${tenantSlug}/admin/documents`,
            icon: "FileStack",
        },
        {
            title: "Communications",
            href: `/${tenantSlug}/admin/communications`,
            icon: "MessageSquare",
        },
        {
            title: "Settings",
            href: `/${tenantSlug}/admin/settings`,
            icon: "Settings2",
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
