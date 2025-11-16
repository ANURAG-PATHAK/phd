import Link from "next/link";

import { LoginForm } from "./_components/login-form";

export const metadata = {
    title: "Login · Research X",
    description: "Access your Research X workspace.",
};

export default function LoginPage() {
    return (
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center">
            <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/40 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                    Research X
                </span>
                <h1 className="text-4xl font-semibold text-white sm:text-5xl">Log in to continue your research journey</h1>
                <p className="text-base text-slate-300 sm:text-lg">
                    Manage admissions, track milestones, and collaborate with your supervisory team from a single, secure workspace.
                </p>
                <div className="text-sm text-slate-400">
                    New here?{" "}
                    <Link className="font-medium text-fuchsia-300 transition-colors hover:text-fuchsia-200" href="/register">
                        Create a tenant
                    </Link>
                    .
                </div>
            </div>
            <div className="justify-self-end">
                <LoginForm />
            </div>
        </div>
    );
}
