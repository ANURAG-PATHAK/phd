import Link from "next/link";

import { RegisterForm } from "./_components/register-form";

export const metadata = {
    title: "Register · Research X",
    description: "Provision a new Research X tenant for your institution.",
};

export default function RegisterPage() {
    return (
        <div className="grid gap-12 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-center">
            <div className="justify-self-start">
                <RegisterForm />
            </div>
            <div className="space-y-6 text-right">
                <span className="inline-flex items-center justify-end gap-2 rounded-full border border-slate-800 bg-slate-950/40 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                    Research X
                </span>
                <h1 className="text-4xl font-semibold text-white sm:text-5xl">
                    Launch a secure PhD management workspace in minutes.
                </h1>
                <p className="text-base text-slate-300 sm:text-lg">
                    We automatically scaffold role-based access, audit trails, and onboarding workflows so your teams can focus on research—not spreadsheets.
                </p>
                <div className="text-sm text-slate-400">
                    Already provisioned?{" "}
                    <Link className="font-medium text-fuchsia-300 transition-colors hover:text-fuchsia-200" href="/login">
                        Sign in instead
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
}
