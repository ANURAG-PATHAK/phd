import { notFound } from "next/navigation";
import {
    CalendarClock,
    FileStack,
    MessageCircle,
    Target,
    Wallet,
} from "lucide-react";

import { MetricCard } from "@/app/(tenant)/[tenantSlug]/(dashboard)/_components/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/lib/auth/session";
import { getScholarDashboardSummary } from "@/lib/dashboard/scholar";
import { ensureTenantMembership } from "@/lib/auth/navigation";

function titleCase(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function formatDate(value: string | null) {
    if (!value) {
        return "Not scheduled";
    }
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
}

export default async function ScholarOverviewPage({
    params,
}: {
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

    const summary = await getScholarDashboardSummary({
        tenantId: membership.tenantId,
        membershipId: membership.membershipId,
    });

    const nextMeeting = summary.meetings[0] ?? null;
    const outstandingFees = summary.finances.outstandingAmount;
    const currency = summary.finances.currency ?? "INR";

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Scholar workspace
                </h1>
                <p className="text-sm text-muted-foreground">
                    Welcome back, {session.user.name ?? session.user.email}. Keep your milestones, submissions, and meetings on track.
                </p>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    title="Milestone completion"
                    value={`${summary.progress.completionPercent}%`}
                    description={`${summary.progress.completedMilestones} of ${summary.progress.totalMilestones} milestones completed`}
                    icon={Target}
                />
                <MetricCard
                    title="Outstanding fees"
                    value={formatCurrency(outstandingFees, currency)}
                    description="Includes tuition, registration, and any pending adjustments"
                    icon={Wallet}
                />
                <MetricCard
                    title="Next milestone"
                    value={summary.progress.nextMilestone?.name ?? "All caught up"}
                    description={formatDate(summary.progress.nextMilestone?.expectedBy ?? null)}
                    icon={FileStack}
                />
                <MetricCard
                    title="Upcoming meeting"
                    value={nextMeeting ? nextMeeting.title : "No meetings"}
                    description={nextMeeting ? formatDate(nextMeeting.scheduledFor) : "Meeting requests will appear here"}
                    icon={CalendarClock}
                />
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border/60 bg-card/70">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-foreground">
                            Milestone timeline
                        </CardTitle>
                        <CardDescription>
                            Review upcoming deadlines and recently cleared checkpoints
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {summary.milestones.length ? (
                            summary.milestones
                                .slice()
                                .sort((a, b) => a.order - b.order)
                                .map((item) => (
                                    <div key={item.id} className="rounded-xl border border-border/60 bg-background/80 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-sm font-semibold text-foreground">
                                                {item.name}
                                            </div>
                                            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                                                {titleCase(item.status)}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                                            Due {formatDate(item.expectedBy)}
                                        </p>
                                        {item.completedAt ? (
                                            <p className="mt-1 text-[0.7rem] uppercase tracking-wide text-emerald-500">
                                                Completed {formatDate(item.completedAt)}
                                            </p>
                                        ) : null}
                                    </div>
                                ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Your program milestones will appear once assignments are configured.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border/60 bg-card/70">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-foreground">
                            Coursework snapshot
                        </CardTitle>
                        <CardDescription>
                            Most recent enrollments with grade or status updates
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {summary.coursework.length ? (
                            summary.coursework.map((course) => (
                                <div key={course.id} className="rounded-xl border border-border/60 bg-background/80 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-foreground">
                                                {course.courseTitle}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {course.courseCode} • {course.academicYear} • {course.semester}
                                            </p>
                                        </div>
                                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                                            {course.grade ?? titleCase(course.status)}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                                        {course.credits} credits • {titleCase(course.status)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No coursework records yet. Enrollments will populate once your program assigns courses.</p>
                        )}
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <Card className="border-border/60 bg-card/70">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-foreground">
                            Document tracker
                        </CardTitle>
                        <CardDescription>
                            Submission states for thesis, synopsis, and supporting evidence
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {summary.documents.length ? (
                            summary.documents.map((doc) => (
                                <div key={doc.id} className="rounded-xl border border-border/60 bg-background/80 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="text-sm font-semibold text-foreground">
                                            {doc.title ?? "Untitled document"}
                                        </div>
                                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                                            {titleCase(doc.status)}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">{titleCase(doc.type)}</p>
                                    <p className="mt-2 text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                                        Updated {formatDate(doc.updatedAt)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Upload your first synopsis or thesis draft to start the review workflow.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border/60 bg-card/70">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-foreground">
                            Notifications
                        </CardTitle>
                        <CardDescription>
                            Latest alerts from admin teams and supervisors
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {summary.notifications.length ? (
                            summary.notifications.map((notification) => (
                                <div key={notification.id} className="rounded-xl border border-border/60 bg-background/80 p-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                                        <span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                                            {formatDate(notification.createdAt)}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">{notification.body}</p>
                                    <p className="mt-2 text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                                        {notification.readAt ? "Read" : "Unread"}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No notifications yet.</p>
                        )}
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border/60 bg-card/70">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-foreground">
                            Finance ledger
                        </CardTitle>
                        <CardDescription>
                            Recent fee and scholarship transactions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {summary.finances.recent.length ? (
                            summary.finances.recent.map((entry) => (
                                <div key={entry.id} className="rounded-xl border border-border/60 bg-background/80 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="text-sm font-semibold text-foreground">
                                            {titleCase(entry.type)}
                                        </div>
                                        <span className={entry.paidAt ? "text-xs font-semibold text-emerald-500" : "text-xs font-semibold text-primary"}>
                                            {formatCurrency(entry.amount, entry.currency)}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {entry.description ?? "No description provided"}
                                    </p>
                                    <p className="mt-2 text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                                        Created {formatDate(entry.createdAt)}
                                    </p>
                                    {entry.paidAt ? (
                                        <p className="text-[0.7rem] uppercase tracking-wide text-emerald-500">
                                            Cleared {formatDate(entry.paidAt)}
                                        </p>
                                    ) : null}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No financial transactions recorded yet.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border/60 bg-card/70">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-foreground">
                            Research projects
                        </CardTitle>
                        <CardDescription>
                            Snapshot of ongoing research initiatives and last observations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {summary.projects.length ? (
                            summary.projects.map((project) => (
                                <div key={project.id} className="rounded-xl border border-border/60 bg-background/80 p-4">
                                    <div className="text-sm font-semibold text-foreground">{project.title}</div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Started {formatDate(project.startDate)}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Last observation {formatDate(project.lastObservationAt)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Create a research project to log observations, metrics, and field notes.</p>
                        )}
                    </CardContent>
                </Card>
            </section>

            <section>
                <Card className="border-border/60 bg-card/70">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                            <MessageCircle className="h-4 w-4" aria-hidden="true" /> Meeting notes & actions
                        </CardTitle>
                        <CardDescription>
                            Summaries of upcoming meetings; full thread history lives in the meetings tab
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {summary.meetings.length ? (
                            summary.meetings.map((meeting) => (
                                <div key={meeting.id} className="rounded-xl border border-border/60 bg-background/80 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-foreground">{meeting.title}</div>
                                            <p className="text-xs text-muted-foreground">Organiser: {meeting.organizerName}</p>
                                        </div>
                                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                                            {titleCase(meeting.status)}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                                        {formatDate(meeting.scheduledFor)} • {meeting.location ?? "Virtual"}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No upcoming meetings yet. Faculty-scheduled sessions will appear as they are created.</p>
                        )}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
