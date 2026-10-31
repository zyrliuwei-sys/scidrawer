type Query = { sql: string; params: unknown[] };
type Result<T> = {
  success: boolean;
  results: T;
  meta?: Record<string, number | string | boolean>;
  error?: string;
};

/** D1's binding interface over its HTTPS API, for local development only. */
export function createD1HttpBinding(options: {
  accountId: string;
  databaseId: string;
  getHeaders: () => Promise<Record<string, string>>;
}) {
  const endpoint =
    'https://api.cloudflare.com/client/v4/accounts/' +
    `${encodeURIComponent(options.accountId)}/d1/database/` +
    encodeURIComponent(options.databaseId);

  async function request<T>(method: 'query' | 'raw', queries: Query[]) {
    const response = await fetch(`${endpoint}/${method}`, {
      method: 'POST',
      headers: {
        ...(await options.getHeaders()),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        queries.length === 1 ? queries[0] : { batch: queries }
      ),
      signal: AbortSignal.timeout(30_000),
    });
    const payload = (await response.json()) as {
      success: boolean;
      result?: Result<T>[];
      errors?: { message: string }[];
    };
    const failed = payload.result?.find((result) => !result.success);
    if (!response.ok || !payload.success || !payload.result || failed) {
      throw new Error(
        `D1 request failed (${response.status}): ` +
          (payload.errors?.[0]?.message || failed?.error || 'Unknown error')
      );
    }
    return payload.result;
  }

  function prepare(sql: string, params: unknown[] = []) {
    const query = { sql, params };
    return {
      query,
      bind: (...values: unknown[]) => prepare(sql, values),
      async all() {
        return (await request<Record<string, unknown>[]>('query', [query]))[0];
      },
      async run() {
        return this.all();
      },
      async first(column?: string) {
        const row = (await this.all()).results[0];
        return column ? (row?.[column] ?? null) : (row ?? null);
      },
      async raw() {
        // Object values lose duplicate column names in joins. The raw API
        // preserves the selected column order that Drizzle's mapper needs.
        const [result] = await request<{ rows?: unknown[][] }>('raw', [query]);
        return result.results.rows ?? [];
      },
    };
  }

  return {
    prepare,
    batch: (statements: ReturnType<typeof prepare>[]) =>
      request<Record<string, unknown>[]>(
        'query',
        statements.map((statement) => statement.query)
      ),
    async exec(sql: string) {
      const result = await request('query', [{ sql, params: [] }]);
      return { count: result.length, duration: 0 };
    },
    async dump(): Promise<ArrayBuffer> {
      throw new Error('Export remote D1 with wrangler d1 export.');
    },
  };
}
