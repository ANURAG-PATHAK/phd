import { cache } from "react";

import type { Session } from "next-auth";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import type { SessionMembership } from "@/types/next-auth";

export class UnauthorizedError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Access denied") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export const getCurrentSession = cache(async () =>
  getServerSession(authOptions)
);

export async function requireSession(): Promise<Session> {
  const session = await getCurrentSession();
  if (!session) {
    throw new UnauthorizedError();
  }
  return session;
}

export function findMembershipByTenantId(
  session: Session,
  tenantId: string
): SessionMembership | undefined {
  return session.user.memberships.find(
    (membership) => membership.tenantId === tenantId
  );
}

export function findMembershipByTenantSlug(
  session: Session,
  tenantSlug: string
): SessionMembership | undefined {
  return session.user.memberships.find(
    (membership) => membership.tenantSlug === tenantSlug
  );
}

export function requireMembership(
  session: Session,
  criteria: { tenantId?: string; tenantSlug?: string }
): SessionMembership {
  const membership = criteria.tenantId
    ? findMembershipByTenantId(session, criteria.tenantId)
    : criteria.tenantSlug
    ? findMembershipByTenantSlug(session, criteria.tenantSlug)
    : undefined;

  if (!membership) {
    throw new ForbiddenError("Missing required tenant membership");
  }

  return membership;
}
