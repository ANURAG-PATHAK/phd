import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

import { LoginForm } from "./_components/login-form";

export const metadata = {
    title: "Login · research and consultancy",
    description: "Access your research and consultancy workspace.",
};

function LoginFormSkeleton() {
    return (
        <Card className="w-full max-w-lg border-border/60 bg-card/60 shadow-lg shadow-primary/5">
            <CardHeader>
                <div className="h-6 w-2/3 animate-pulse rounded bg-muted/70" />
                <CardDescription>
                    <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted/60" />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                {[0, 1, 2].map((index) => (
                    <div key={index} className="space-y-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
                        <div className="h-10 w-full animate-pulse rounded-md bg-muted/50" />
                    </div>
                ))}
                <div className="h-11 w-full animate-pulse rounded-full bg-muted/60" />
            </CardContent>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="grid gap-12 lg:min-h-screen lg:grid-cols-[minmax(0,520px)_1fr]">
            <div className="flex items-center justify-center">
                <div className="w-full max-w-lg">
                    <Suspense fallback={<LoginFormSkeleton />}>
                        <LoginForm />
                    </Suspense>
                </div>
            </div>
            <div className="relative flex flex-col items-center justify-center gap-6 rounded-[40px] border border-border/50 bg-gradient-to-br from-background via-background/80 to-background/70 px-8 py-14 text-center lg:items-start lg:text-left">
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.3),_transparent_60%)]" />
                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-5 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                    research & consultancy cell
                </span>
                <Image
                    src="/Header.png"
                    alt="research and consultancy crest"
                    width={192}
                    height={192}
                    className="h-48 w-48 object-contain"
                    priority
                    sizes="192px"
                />
                <h1 className="text-balance text-4xl font-semibold text-foreground sm:text-5xl">
                    Log in to continue your research journey
                </h1>
                <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                    Manage admissions, track milestones, and collaborate with your supervisory team from a single, secure workspace.
                </p>
                <p className="text-sm text-muted-foreground">
                    Need access?{" "}
                    <Link className="font-medium text-primary transition-colors hover:text-primary/80" href="/register">
                        Create a tenant
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
