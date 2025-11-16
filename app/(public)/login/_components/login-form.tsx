"use client";

import { useState, useTransition } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

type FormState = {
    email: string;
    password: string;
    tenant: string;
};

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";
    const [formState, setFormState] = useState<FormState>({
        email: "",
        password: "",
        tenant: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const { email, password, tenant } = formState;

        startTransition(async () => {
            const response = await signIn("credentials", {
                email,
                password,
                tenant: tenant || undefined,
                redirect: false,
            });

            if (!response || response.error) {
                setError(response?.error ?? "Authentication failed. Please verify your credentials.");
                return;
            }

            router.replace(callbackUrl);
            router.refresh();
        });
    }

    function updateField(key: keyof FormState, value: string) {
        setFormState((previous) => ({ ...previous, [key]: value }));
    }

    return (
        <Card className="w-full max-w-md border-slate-800 bg-slate-950/70 text-slate-100 shadow-2xl shadow-fuchsia-900/10">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Welcome back</CardTitle>
                <CardDescription className="text-sm text-slate-400">
                    Enter your credentials to access your Research X workspace.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Institutional email</Label>
                        <Input
                            id="email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="you@university.edu"
                            value={formState.email}
                            onChange={(event) => updateField("email", event.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={formState.password}
                            onChange={(event) => updateField("password", event.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="tenant">Tenant slug</Label>
                            <span className="text-xs text-slate-400">Optional</span>
                        </div>
                        <Input
                            id="tenant"
                            placeholder="research-x"
                            value={formState.tenant}
                            onChange={(event) => updateField("tenant", event.target.value)}
                        />
                        <p className="text-xs text-slate-500">
                            Provide the tenant slug if you belong to multiple campuses or programs.
                        </p>
                    </div>

                    {error ? (
                        <Alert className="border-red-500/40 bg-red-950/40 text-red-200">
                            <AlertTitle>Unable to sign in</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : null}

                    <Button
                        type="submit"
                        className="h-11 w-full rounded-full bg-fuchsia-500 text-slate-950 transition-transform duration-150 hover:-translate-y-0.5 hover:bg-fuchsia-400"
                        disabled={isPending}
                    >
                        {isPending ? "Signing you in…" : "Sign in"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
