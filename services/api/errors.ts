import axios from 'axios';

import type { FieldErrors } from '@/types/auth';

/**
 * Normalize Django / DRF error bodies into a single user-facing message
 * and optional field map for form highlighting.
 */
export function parseApiError(error: unknown): {
  message: string;
  fields: FieldErrors;
  status?: number;
  retryAfter?: number;
} {
  if (!axios.isAxiosError(error)) {
    return {
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      fields: {},
    };
  }

  const status = error.response?.status;
  const data = error.response?.data as
    | { detail?: string | string[] }
    | FieldErrors
    | undefined;

  const retryHeader = error.response?.headers?.['retry-after'];
  const retryAfter =
    typeof retryHeader === 'string' ? Number.parseInt(retryHeader, 10) : undefined;

  if (!data || typeof data !== 'object') {
    return {
      message: status === 429 ? 'Слишком много попыток. Подождите немного.' : 'Ошибка сети',
      fields: {},
      status,
      retryAfter: Number.isFinite(retryAfter) ? retryAfter : undefined,
    };
  }

  if ('detail' in data && data.detail != null) {
    const detail = data.detail;
    return {
      message: Array.isArray(detail) ? detail.join(' ') : String(detail),
      fields: {},
      status,
      retryAfter: Number.isFinite(retryAfter) ? retryAfter : undefined,
    };
  }

  const fields: FieldErrors = {};
  const parts: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      fields[key] = value.map(String);
      parts.push(...value.map(String));
    } else if (typeof value === 'string') {
      fields[key] = [value];
      parts.push(value);
    }
  }

  return {
    message: parts[0] ?? 'Проверьте введённые данные',
    fields,
    status,
    retryAfter: Number.isFinite(retryAfter) ? retryAfter : undefined,
  };
}
