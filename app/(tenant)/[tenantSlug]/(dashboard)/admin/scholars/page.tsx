import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminScholarsPage({
    params,
}: {
    params: Promise<{ tenantSlug: string }>;
}) {
    const { tenantSlug } = await params;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Scholar roster
                </h1>
                <p className="text-sm text-muted-foreground">
                    Search, filter, and bulk-manage scholar records for {tenantSlug}.
                </p>
            </div>
            <Card className="border-border/60 bg-card/70">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Scholar management toolkit
                    </CardTitle>
                    <CardDescription>
                        Bulk imports, risk flags, and timeline summaries will reside here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Upcoming work includes roster search, cohort filters, and widgets that surface scholars requiring intervention. We will hook this view to aggregated Prisma queries once the endpoints land.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
