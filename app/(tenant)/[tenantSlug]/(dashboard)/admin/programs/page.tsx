import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminProgramsPage({
    params,
}: {
    params: Promise<{ tenantSlug: string }>;
}) {
    const { tenantSlug } = await params;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Program configuration
                </h1>
                <p className="text-sm text-muted-foreground">
                    Manage program structures, coursework, and milestones for {tenantSlug}.
                </p>
            </div>
            <Card className="border-border/60 bg-card/70">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Build reusable program blueprints
                    </CardTitle>
                    <CardDescription>
                        Course catalogs, credit rules, and milestone engines will live here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        This surface will allow admins to add programs, seed milestone journeys, and attach course inventories. We will connect it to Prisma models and server actions in the next iteration.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
