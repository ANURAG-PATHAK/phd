"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ScholarOption = {
    id: string;
    name: string;
};

type Props = {
    tenantSlug: string;
    scholars: ScholarOption[];
};

export function ScholarFeeForm({ tenantSlug, scholars }: Props) {
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
                const amountValue = Number(formData.get("amount"));
                const payload: Record<string, unknown> = {
                    scholarId: formData.get("scholarId")?.toString() ?? "",
                    type: formData.get("type")?.toString() ?? "fee",
                    amount: Number.isFinite(amountValue) ? amountValue : 0,
                    currency: formData.get("currency")?.toString().trim() || "INR",
                    description: formData.get("description")?.toString().trim() || undefined,
                    referenceNumber: formData.get("referenceNumber")?.toString().trim() || undefined,
                };

                const dueDate = formData.get("dueDate")?.toString();
                if (dueDate) {
                    payload.dueDate = dueDate;
                }
                const paidAt = formData.get("paidAt")?.toString();
                if (paidAt) {
                    payload.paidAt = paidAt;
                }

                if (!payload.scholarId || (payload.amount as number) <= 0) {
                    setMessage({ type: "error", label: "Scholar and a positive amount are required." });
                    return;
                }

                startTransition(async () => {
                    try {
                        const response = await fetch(`/api/tenants/${tenantSlug}/admin/finance/fees`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                        });

                        if (!response.ok) {
                            const data = await response.json().catch(() => ({}));
                            const errorLabel = typeof data.error === "string" ? data.error : "Unable to create fee entry";
                            setMessage({ type: "error", label: errorLabel });
                            return;
                        }

                        event.currentTarget.reset();
                        setMessage({ type: "success", label: "Fee entry added successfully." });
                        router.refresh();
                    } catch (error) {
                        console.error(error);
                        setMessage({ type: "error", label: "Unexpected error creating fee entry." });
                    }
                });
            }}
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="scholarId">Scholar</Label>
                    <select
                        id="scholarId"
                        name="scholarId"
                        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                        defaultValue=""
                        required
                        disabled={isPending}
                    >
                        <option value="" disabled>
                            Select scholar
                        </option>
                        {scholars.map((scholar) => (
                            <option key={scholar.id} value={scholar.id}>
                                {scholar.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Entry type</Label>
                    <select
                        id="type"
                        name="type"
                        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                        defaultValue="fee"
                        disabled={isPending}
                    >
                        <option value="fee">Fee</option>
                        <option value="payment">Payment</option>
                        <option value="adjustment">Adjustment</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        name="amount"
                        type="number"
                        min={0.01}
                        step="0.01"
                        required
                        disabled={isPending}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" name="currency" defaultValue="INR" disabled={isPending} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dueDate">Due date</Label>
                    <Input id="dueDate" name="dueDate" type="date" disabled={isPending} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paidAt">Paid at</Label>
                    <Input id="paidAt" name="paidAt" type="date" disabled={isPending} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" placeholder="Optional description" disabled={isPending} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="referenceNumber">Reference number</Label>
                    <Input id="referenceNumber" name="referenceNumber" placeholder="Optional" disabled={isPending} />
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
                {isPending ? "Saving..." : "Add ledger entry"}
            </Button>
        </form>
    );
}
