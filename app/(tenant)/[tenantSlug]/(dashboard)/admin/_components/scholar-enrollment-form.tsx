"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type SelectOption = {
    id: string;
    name: string;
};

type CourseOption = SelectOption & {
    programName: string;
};

type Props = {
    tenantSlug: string;
    scholars: SelectOption[];
    courses: CourseOption[];
};

export function ScholarEnrollmentForm({ tenantSlug, scholars, courses }: Props) {
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
                    scholarId: formData.get("scholarId")?.toString() ?? "",
                    courseId: formData.get("courseId")?.toString() ?? "",
                    academicYear: formData.get("academicYear")?.toString() ?? "",
                    semester: formData.get("semester")?.toString() ?? "",
                    status: formData.get("status")?.toString() ?? "in_progress",
                    grade: formData.get("grade")?.toString() || undefined,
                };

                if (!payload.scholarId || !payload.courseId || !payload.academicYear || !payload.semester) {
                    setMessage({ type: "error", label: "Scholar, course, academic year, and semester are required." });
                    return;
                }

                startTransition(async () => {
                    try {
                        const response = await fetch(`/api/tenants/${tenantSlug}/admin/scholars/enrollments`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                        });

                        if (!response.ok) {
                            const data = await response.json().catch(() => ({}));
                            const errorLabel = typeof data.error === "string" ? data.error : "Unable to create enrollment";
                            setMessage({ type: "error", label: errorLabel });
                            return;
                        }

                        event.currentTarget.reset();
                        setMessage({ type: "success", label: "Enrollment recorded successfully." });
                        router.refresh();
                    } catch (error) {
                        console.error(error);
                        setMessage({ type: "error", label: "Unexpected error creating enrollment." });
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
                        {scholars.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="courseId">Course</Label>
                    <select
                        id="courseId"
                        name="courseId"
                        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                        defaultValue=""
                        required
                        disabled={isPending}
                    >
                        <option value="" disabled>
                            Select course
                        </option>
                        {courses.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name} - {option.programName}
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
                        defaultValue="in_progress"
                        disabled={isPending}
                    >
                        <option value="in_progress">In progress</option>
                        <option value="completed">Completed</option>
                        <option value="withdrawn">Withdrawn</option>
                        <option value="deferred">Deferred</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic year</Label>
                    <Input
                        id="academicYear"
                        name="academicYear"
                        placeholder="2024-2025"
                        required
                        disabled={isPending}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Input id="semester" name="semester" placeholder="Semester 1" required disabled={isPending} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Input id="grade" name="grade" placeholder="Optional" disabled={isPending} />
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
                {isPending ? "Saving..." : "Record enrollment"}
            </Button>
        </form>
    );
}
