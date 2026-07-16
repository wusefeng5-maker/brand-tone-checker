export const ADMIN_PAGE_SIZE = 20;

export type AiLogStatusFilter = "SUCCESS" | "FAILED";

export type AiLogFilters = {
  email?: string;
  provider?: string;
  status?: AiLogStatusFilter;
};

export function parseAdminEmails(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmailAllowed(
  email: string | null | undefined,
  adminEmailsValue: string | undefined,
) {
  if (!email) {
    return false;
  }

  return parseAdminEmails(adminEmailsValue).includes(email.trim().toLowerCase());
}

export function parseAdminPage(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(rawValue ?? "", 10);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return page;
}

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeTextFilter(value: string | string[] | undefined) {
  const text = getSingleValue(value)?.trim();
  return text ? text : undefined;
}

export function parseAiLogFilters(searchParams: {
  email?: string | string[];
  provider?: string | string[];
  status?: string | string[];
}): AiLogFilters {
  const filters: AiLogFilters = {};
  const email = normalizeTextFilter(searchParams.email);
  const provider = normalizeTextFilter(searchParams.provider);
  const status = normalizeTextFilter(searchParams.status);

  if (email) {
    filters.email = email;
  }

  if (provider) {
    filters.provider = provider;
  }

  if (status === "SUCCESS" || status === "FAILED") {
    filters.status = status;
  }

  return filters;
}
