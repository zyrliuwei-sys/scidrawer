import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';

import { createD1HttpBinding } from '../src/core/db/d1-http';

afterEach(() => mock.restoreAll());

const binding = () =>
  createD1HttpBinding({
    accountId: 'account',
    databaseId: 'database',
    getHeaders: async () => ({ Authorization: 'Bearer test-only' }),
  });

test('bind parameters stay separate from SQL and do not mutate the statement', async () => {
  const requests: unknown[] = [];
  mock.method(
    globalThis,
    'fetch',
    async (_url: Parameters<typeof fetch>[0], init?: RequestInit) => {
      requests.push(JSON.parse(String(init?.body)));
      return Response.json({
        success: true,
        result: [{ success: true, results: [] }],
      });
    }
  );
  const statement = binding().prepare('SELECT * FROM user WHERE email = ?');
  const value = "x' OR 1=1; DROP TABLE user; --";
  await statement.bind(value).all();
  await statement.bind('another@example.com').all();
  assert.deepEqual(requests, [
    { sql: 'SELECT * FROM user WHERE email = ?', params: [value] },
    {
      sql: 'SELECT * FROM user WHERE email = ?',
      params: ['another@example.com'],
    },
  ]);
});

test('raw joins preserve duplicate column names, nulls and column order', async () => {
  mock.method(globalThis, 'fetch', async (url: Parameters<typeof fetch>[0]) => {
    assert.match(String(url), /\/raw$/);
    return Response.json({
      success: true,
      result: [
        {
          success: true,
          results: {
            columns: ['id', 'id', 'image'],
            rows: [['user', 'session', null]],
          },
        },
      ],
    });
  });
  assert.deepEqual(
    await binding().prepare('SELECT user.id, session.id, image').raw(),
    [['user', 'session', null]]
  );
});

test('batch submits all bound statements together', async () => {
  mock.method(
    globalThis,
    'fetch',
    async (_url: Parameters<typeof fetch>[0], init?: RequestInit) => {
      assert.deepEqual(JSON.parse(String(init?.body)), {
        batch: [
          { sql: 'SELECT ?', params: [1] },
          { sql: 'SELECT ?', params: [2] },
        ],
      });
      return Response.json({
        success: true,
        result: [
          { success: true, results: [{ value: 1 }] },
          { success: true, results: [{ value: 2 }] },
        ],
      });
    }
  );
  const db = binding();
  assert.equal(
    (
      await db.batch([
        db.prepare('SELECT ?').bind(1),
        db.prepare('SELECT ?').bind(2),
      ])
    ).length,
    2
  );
});

test('API and per-statement failures reject instead of returning empty data', async () => {
  mock.method(globalThis, 'fetch', async () =>
    Response.json(
      { success: false, errors: [{ message: 'Unauthorized' }] },
      { status: 401 }
    )
  );
  await assert.rejects(
    binding().prepare('SELECT 1').all(),
    /D1 request failed \(401\): Unauthorized/
  );
  mock.restoreAll();
  mock.method(globalThis, 'fetch', async () =>
    Response.json({
      success: true,
      result: [{ success: false, error: 'constraint failed' }],
    })
  );
  await assert.rejects(
    binding().prepare('INSERT INTO user DEFAULT VALUES').run(),
    /constraint failed/
  );
});
