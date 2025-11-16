import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminAdmissionsPage({
    params,
}: {
    params: Promise<{ tenantSlug: string }>;
}) {
    const { tenantSlug } = await params;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Admissions pipeline
                </h1>
                <p className="text-sm text-muted-foreground">
                    Configure intakes, interview panels, and offer flows for {tenantSlug}.
                </p>
            </div>
            <Card className="border-border/60 bg-card/70">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Admissions workspace
                    </CardTitle>
                    <CardDescription>
                        Candidate stage management, reviewer assignments, and decision logging will appear here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        We are scaffolding the admissions UI next. Track candidate cohorts, automate communications, and push final decisions once the workflow is wired up.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
