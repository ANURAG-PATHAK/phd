import {
  AdmissionPathway,
  AdmissionStatus,
  DocumentStatus,
  DocumentType,
  MeetingStatus,
} from "@prisma/client";

import prisma from "@/lib/db";

function personName(person?: {
  displayName: string | null;
  firstName: string;
  lastName: string;
}) {
  if (!person) {
    return "—";
  }
  if (person.displayName && person.displayName.trim().length > 0) {
    return person.displayName.trim();
  }
  const fullName = `${person.firstName ?? ""} ${person.lastName ?? ""}`.trim();
  return fullName.length ? fullName : "—";
}

export type AdminDashboardSummary = {
  metrics: {
    activeScholars: number;
    pendingAdmissions: number;
    documentsUnderReview: number;
    outstandingFees: number;
    outstandingFeesCurrency: string;
  };
  recentAdmissions: Array<{
    id: string;
    applicantName: string;
    programName: string;
    status: AdmissionStatus;
    pathway: AdmissionPathway;
    updatedAt: string;
  }>;
  reviewQueue: Array<{
    id: string;
    title: string | null;
    type: DocumentType;
    status: DocumentStatus;
    ownerName: string;
    updatedAt: string;
  }>;
  feeAlerts: Array<{
    id: string;
    scholarName: string;
    amount: number;
    currency: string;
    dueDate: string | null;
    referenceNumber: string | null;
  }>;
  upcomingMeetings: Array<{
    id: string;
    title: string;
    scheduledFor: string;
    status: MeetingStatus;
    organizerName: string;
    location: string | null;
  }>;
  auditTrail: Array<{
    id: string;
    action: string;
    actorName: string;
    createdAt: string;
  }>;
};

export async function getAdminDashboardSummary({
  tenantId,
}: {
  tenantId: string;
}): Promise<AdminDashboardSummary> {
  const now = new Date();

  const [
    activeScholarCount,
    pendingAdmissionsCount,
    documentsUnderReviewCount,
    outstandingFeesAggregate,
    recentAdmissions,
    reviewQueue,
    feeAlerts,
    upcomingMeetings,
    auditTrail,
  ] = await Promise.all([
    prisma.scholarProfile.count({
      where: { tenantId, status: { in: ["active", "enrolled"] } },
    }),
    prisma.admission.count({
      where: {
        tenantId,
        status: {
          in: [
            AdmissionStatus.VERIFIED,
            AdmissionStatus.INTERVIEW_SCHEDULED,
            AdmissionStatus.FEE_PENDING,
          ],
        },
      },
    }),
    prisma.document.count({
      where: {
        tenantId,
        status: {
          in: [DocumentStatus.SUBMITTED, DocumentStatus.UNDER_REVIEW],
        },
      },
    }),
    prisma.feeLedgerEntry.aggregate({
      where: {
        tenantId,
        paidAt: null,
        type: "fee",
      },
      _sum: { amount: true },
    }),
    prisma.admission.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: {
        user: {
          select: {
            displayName: true,
            firstName: true,
            lastName: true,
          },
        },
        program: { select: { name: true } },
      },
    }),
    prisma.document.findMany({
      where: {
        tenantId,
        status: {
          in: [DocumentStatus.SUBMITTED, DocumentStatus.UNDER_REVIEW],
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: {
        ownerUser: {
          select: {
            displayName: true,
            firstName: true,
            lastName: true,
          },
        },
        scholar: {
          select: {
            user: {
              select: {
                displayName: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    }),
    prisma.feeLedgerEntry.findMany({
      where: {
        tenantId,
        paidAt: null,
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      take: 6,
      include: {
        scholar: {
          select: {
            user: {
              select: {
                displayName: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    }),
    prisma.meeting.findMany({
      where: {
        tenantId,
        scheduledFor: { gte: now },
        status: { in: [MeetingStatus.REQUESTED, MeetingStatus.CONFIRMED] },
      },
      orderBy: { scheduledFor: "asc" },
      take: 5,
      include: {
        organizer: {
          include: {
            user: {
              select: {
                displayName: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    }),
    prisma.auditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        user: {
          select: {
            displayName: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  const outstandingFees = Number(outstandingFeesAggregate._sum.amount ?? 0);
  const outstandingFeesCurrency =
    feeAlerts.find((alert) => alert.currency)?.currency ?? "INR";

  return {
    metrics: {
      activeScholars: activeScholarCount,
      pendingAdmissions: pendingAdmissionsCount,
      documentsUnderReview: documentsUnderReviewCount,
      outstandingFees,
      outstandingFeesCurrency,
    },
    recentAdmissions: recentAdmissions.map((item) => ({
      id: item.id,
      applicantName: personName(item.user),
      programName: item.program?.name ?? "—",
      status: item.status,
      pathway: item.pathway,
      updatedAt: item.updatedAt.toISOString(),
    })),
    reviewQueue: reviewQueue.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      status: item.status,
      ownerName:
        personName(item.ownerUser ?? undefined) ||
        personName(item.scholar?.user ?? undefined),
      updatedAt: item.updatedAt.toISOString(),
    })),
    feeAlerts: feeAlerts.map((item) => ({
      id: item.id,
      scholarName: personName(item.scholar?.user ?? undefined),
      amount: Number(item.amount),
      currency: item.currency,
      dueDate: item.dueDate ? item.dueDate.toISOString() : null,
      referenceNumber: item.referenceNumber,
    })),
    upcomingMeetings: upcomingMeetings.map((meeting) => ({
      id: meeting.id,
      title: meeting.title,
      scheduledFor: meeting.scheduledFor.toISOString(),
      status: meeting.status,
      organizerName: personName(meeting.organizer.user ?? undefined),
      location: meeting.location,
    })),
    auditTrail: auditTrail.map((log) => ({
      id: log.id,
      action: log.action,
      actorName: personName(log.user ?? undefined),
      createdAt: log.createdAt.toISOString(),
    })),
  };
}
