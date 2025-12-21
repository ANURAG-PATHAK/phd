import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

import { RegisterForm } from "./_components/register-form";

export const metadata = {
    title: "Register · research and consultancy",
    description: "Provision a new research and consultancy tenant for your institution.",
};

function RegisterFormSkeleton() {
    return (
        <Card className="w-full max-w-2xl border-border/60 bg-card/60">
            <CardHeader className="space-y-4">
                <div className="h-6 w-3/5 animate-pulse rounded bg-muted/60" />
                <CardDescription>
                    <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted/50" />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted/50" />
                        <div className="h-10 w-full animate-pulse rounded-md bg-muted/40" />
                    </div>
                ))}
                <div className="h-11 w-full animate-pulse rounded-full bg-muted/50" />
            </CardContent>
        </Card>
    );
}

export default function RegisterPage() {
    return (
        <div className="grid gap-12 lg:min-h-screen lg:grid-cols-[minmax(0,540px)_1fr]">
            <div className="flex items-center justify-center">
                <div className="w-full max-w-2xl">
                    <Suspense fallback={<RegisterFormSkeleton />}>
                        <RegisterForm />
                    </Suspense>
                </div>
            </div>
            <div className="relative flex flex-col justify-center gap-6 rounded-[40px] border border-border/50 bg-gradient-to-br from-background via-background/80 to-background/60 px-10 py-14">
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_65%)]" />
                <div className="flex w-full justify-end">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-5 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                        research & consultancy cell
                    </span>
                </div>
                <Image
                    src="/Header.png"
                    alt="research and consultancy crest"
                    width={192}
                    height={192}
                    className="mx-auto h-48 w-48 object-contain"
                    sizes="192px"
                />
                <h1 className="text-balance text-4xl font-semibold text-foreground sm:text-5xl">
                    Launch a secure PhD management workspace in minutes.
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                    We automatically scaffold role-based access, audit trails, and onboarding workflows so your teams can focus on research—not spreadsheets.
                </p>
                <p className="text-sm text-muted-foreground">
                    Already provisioned?{" "}
                    <Link className="font-medium text-primary transition-colors hover:text-primary/80" href="/login">
                        Sign in instead
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
