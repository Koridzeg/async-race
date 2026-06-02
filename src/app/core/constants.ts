export const API_BASE_URL = 'http://127.0.0.1:3000';

export const API_PATHS = {
  garage: '/garage',
  engine: '/engine',
  winners: '/winners',
} as const;

export const QUERY_PARAMS = {
  page: '_page',
  limit: '_limit',
  sort: '_sort',
  order: '_order',
  id: 'id',
  status: 'status',
} as const;

export const TOTAL_COUNT_HEADER = 'X-Total-Count';

export const HTTP_STATUS = {
  ok: 200,
  internalServerError: 500,
} as const;