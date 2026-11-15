/**
 * tests/users/users.export.integration.test.js — Integration tests for GET /api/users/me/export.
 *
 * 200 with the user's own data, 401 without a token, and the exported identity always comes from
 * the verified JWT (never from a query string or another route parameter).
 */
process.env.PORT = 0;
process.env.JWT_SECRET = 'test_access_secret';

const request = require('supertest');
const jwt = require('jsonwebtoken');

const ME = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
const OTHER = 'd8b16f3e-4f80-4b6d-8761-71e9882236b4';
const COMPANY = '4a3f3b6c-2f88-4663-9977-84a123bc4567';

jest.mock('../../src/config/database', () => ({
  authenticate: jest.fn().mockResolvedValue(undefined),
  sync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../src/models', () => ({
  User: { findAll: jest.fn(), findOne: jest.fn(), findByPk: jest.fn() },
  TokenTransaction: { findAll: jest.fn() },
  Redemption: { findAll: jest.fn() },
  Favorite: { findAll: jest.fn() },
  Voucher: {},
}));

const { User, TokenTransaction, Redemption, Favorite } = require('../../src/models');
const app = require('../../server');

const token = jwt.sign({ id: ME, role: 'employee', company_id: COMPANY }, 'test_access_secret');
const row = (data) => ({ toJSON: () => data });

beforeEach(() => {
  jest.clearAllMocks();
  User.findByPk.mockResolvedValue(row({ id: ME, email: 'me@example.com', token_balance: '50.00' }));
  TokenTransaction.findAll.mockResolvedValue([row({ id: 't', sender_id: OTHER, receiver_id: ME, amount: '5.00' })]);
  Redemption.findAll.mockResolvedValue([]);
  Favorite.findAll.mockResolvedValue([]);
});

describe('GET /api/users/me/export', () => {
  it('returns 200 with the connected user data and no password hash', async () => {
    const res = await request(app).get('/api/users/me/export').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.profile.id).toBe(ME);
    expect(res.body.data.transactions[0].amount).toBe(5);
    expect(JSON.stringify(res.body)).not.toMatch(/password/i);
    expect(res.headers['cache-control']).toBe('no-store');
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/users/me/export');
    expect(res.status).toBe(401);
    expect(User.findByPk).not.toHaveBeenCalled();
  });

  it('always exports the identity of the JWT, ignoring an id in the query string', async () => {
    await request(app).get(`/api/users/me/export?id=${OTHER}&user_id=${OTHER}`).set('Authorization', `Bearer ${token}`);
    expect(User.findByPk).toHaveBeenCalledWith(ME, expect.any(Object));
    expect(Redemption.findAll.mock.calls[0][0].where).toEqual({ user_id: ME });
    expect(Favorite.findAll.mock.calls[0][0].where).toEqual({ user_id: ME });
  });
});
