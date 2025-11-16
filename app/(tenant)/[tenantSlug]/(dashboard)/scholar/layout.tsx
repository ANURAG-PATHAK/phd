import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
    DashboardShell,
    type DashboardNavItem,
} from "@/app/(tenant)/[tenantSlug]/(dashboard)/_components/dashboard-shell";
import { requireSession } from "@/lib/auth/session";
import { ensureTenantMembership } from "@/lib/auth/navigation";

export default async function ScholarLayout({
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

    if (membership.roleKey !== "SCHOLAR") {
        notFound();
    }

    const navItems: DashboardNavItem[] = [
        {
            title: "Overview",
            href: `/${tenantSlug}/scholar`,
            icon: "LayoutDashboard",
        },
        {
            title: "Coursework",
            href: `/${tenantSlug}/scholar/coursework`,
            icon: "GraduationCap",
        },
        {
            title: "Documents",
            href: `/${tenantSlug}/scholar/documents`,
            icon: "FileStack",
        },
        {
            title: "Meetings",
            href: `/${tenantSlug}/scholar/meetings`,
            icon: "CalendarClock",
        },
        {
            title: "Finance",
            href: `/${tenantSlug}/scholar/finance`,
            icon: "Wallet",
        },
        {
            title: "Messages",
            href: `/${tenantSlug}/scholar/messages`,
            icon: "MessageCircle",
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
