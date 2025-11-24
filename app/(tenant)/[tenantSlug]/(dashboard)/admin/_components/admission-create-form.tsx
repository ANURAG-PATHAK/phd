"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdmissionPathway, AdmissionStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProgramOption = {
    id: string;
    name: string;
};

type Props = {
    tenantSlug: string;
    programs: ProgramOption[];
};

function formatEnumLabel(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export function AdmissionCreateForm({ tenantSlug, programs }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: "success" | "error"; label: string } | null>(null);

    return (
        <form
            className="space-y-4"
            onSubmit={(event) => {
                event.preventDefault();
                setMessage(null);
                const formData = new FormData(event.currentTarget);
                const payload = {
                    firstName: formData.get("firstName")?.toString().trim() ?? "",
                    lastName: formData.get("lastName")?.toString().trim() ?? "",
                    email: formData.get("email")?.toString().trim() ?? "",
                    programId: formData.get("programId")?.toString() ?? "",
                    pathway: formData.get("pathway")?.toString() ?? AdmissionPathway.DIRECT_OTHER,
                    status: formData.get("status")?.toString() ?? AdmissionStatus.APPLIED,
                    notes: formData.get("notes")?.toString().trim() || undefined,
                    source: formData.get("source")?.toString().trim() || undefined,
                };

                if (!payload.firstName || !payload.lastName || !payload.email || !payload.programId) {
                    setMessage({ type: "error", label: "First name, last name, email, and program are required." });
                    return;
                }

                startTransition(async () => {
                    try {
                        const response = await fetch(`/api/tenants/${tenantSlug}/admin/admissions`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(payload),
                        });

                        if (!response.ok) {
                            const data = await response.json().catch(() => ({}));
                            const errorLabel = typeof data.error === "string" ? data.error : "Unable to create admission";
                            setMessage({ type: "error", label: errorLabel });
                            return;
                        }

                        event.currentTarget.reset();
                        setMessage({ type: "success", label: "Admission created successfully." });
                        router.refresh();
                    } catch (error) {
                        console.error(error);
                        setMessage({ type: "error", label: "Unexpected error creating admission." });
                    }
                });
            }}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Applicant first name</Label>
                    <Input id="firstName" name="firstName" required disabled={isPending} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Applicant last name</Label>
                    <Input id="lastName" name="lastName" required disabled={isPending} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required disabled={isPending} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="programId">Program</Label>
                    <select
                        id="programId"
                        name="programId"
                        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                        required
                        disabled={isPending}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Select program
                        </option>
                        {programs.map((program) => (
                            <option key={program.id} value={program.id}>
                                {program.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pathway">Pathway</Label>
                    <select
                        id="pathway"
                        name="pathway"
                        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                        disabled={isPending}
                        defaultValue={AdmissionPathway.DIRECT_OTHER}
                    >
                        {Object.values(AdmissionPathway).map((pathway) => (
                            <option key={pathway} value={pathway}>
                                {formatEnumLabel(pathway)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                        id="status"
                        name="status"
                        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                        disabled={isPending}
                        defaultValue={AdmissionStatus.APPLIED}
                    >
                        {Object.values(AdmissionStatus).map((status) => (
                            <option key={status} value={status}>
                                {formatEnumLabel(status)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="source">Source (optional)</Label>
                    <Input id="source" name="source" placeholder="Campus fair, referral, ..." disabled={isPending} />
                </div>
                <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        disabled={isPending}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    />
                </div>
            </div>
            {message ? (
                <p
                    className={
                        message.type === "success"
                            ? "text-sm font-medium text-emerald-500"
                            : "text-sm font-medium text-rose-500"
                    }
                >
                    {message.label}
                </p>
            ) : null}
            <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Create admission"}
            </Button>
        </form>
    );
}
