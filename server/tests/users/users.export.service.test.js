/**
 * tests/users/users.export.service.test.js — Unit tests for usersService.exportData (GDPR portability).
 *
 * Verifies that the export contains only the connected user's data, never the password hash,
 * never the identity of another person, and that DECIMAL strings from pg become numbers.
 */
jest.mock('../../src/models', () => ({
  User: { findByPk: jest.fn() },
  TokenTransaction: { findAll: jest.fn() },
  Redemption: { findAll: jest.fn() },
  Favorite: { findAll: jest.fn() },
  Voucher: {},
}));

const { Op } = require('sequelize');
const { User, TokenTransaction, Redemption, Favorite } = require('../../src/models');
const { exportData } = require('../../src/services/users.service');

const row = (data) => ({ toJSON: () => data });

beforeEach(() => {
  jest.clearAllMocks();
  User.findByPk.mockResolvedValue(
    row({ id: 'me', name: 'Doe', first_name: 'Jane', email: 'jane@example.com', role: 'employee', token_balance: '268.50', company_id: 'co' })
  );
  TokenTransaction.findAll.mockResolvedValue([
    row({ id: 't1', sender_id: 'boss', receiver_id: 'me', amount: '40.00', type: 'employer_to_employee', reason: 'Bravo' }),
    row({ id: 't2', sender_id: 'me', receiver_id: null, amount: '10.50', type: 'voucher', reason: null }),
  ]);
  Redemption.findAll.mockResolvedValue([row({ id: 'r1', promo_code: 'CODE-1', voucher: { title: 'Bon', partner: 'P', token_cost: 32 } })]);
  Favorite.findAll.mockResolvedValue([row({ id: 'f1', voucher: { title: 'Bon', partner: 'P' } })]);
});

describe('exportData', () => {
  it('returns profile, transactions, redemptions and favourites of the user', async () => {
    const out = await exportData('me');
    expect(out.profile.email).toBe('jane@example.com');
    expect(out.transactions).toHaveLength(2);
    expect(out.redemptions).toHaveLength(1);
    expect(out.favorites).toHaveLength(1);
    expect(typeof out.exported_at).toBe('string');
  });

  it('never selects or returns the password hash', async () => {
    const out = await exportData('me');
    const { attributes } = User.findByPk.mock.calls[0][1];
    expect(attributes).not.toContain('password_hash');
    expect(JSON.stringify(out)).not.toMatch(/password/i);
  });

  it('converts DECIMAL strings with parseFloat (balance and transaction amounts)', async () => {
    const out = await exportData('me');
    expect(out.profile.token_balance).toBe(268.5);
    expect(out.transactions.map((t) => t.amount)).toEqual([40, 10.5]);
  });

  it('flags the direction of each transaction and exposes counterparts as ids only', async () => {
    const out = await exportData('me');
    expect(out.transactions[0]).toMatchObject({ direction: 'received', sender_id: 'boss' });
    expect(out.transactions[1]).toMatchObject({ direction: 'sent' });
    expect(out.transactions[0]).not.toHaveProperty('sender');
    expect(out.transactions[0]).not.toHaveProperty('receiver');
  });

  it('scopes every query to the given user id', async () => {
    await exportData('me');
    expect(User.findByPk).toHaveBeenCalledWith('me', expect.any(Object));
    expect(TokenTransaction.findAll.mock.calls[0][0].where).toEqual({ [Op.or]: [{ sender_id: 'me' }, { receiver_id: 'me' }] });
    expect(Redemption.findAll.mock.calls[0][0].where).toEqual({ user_id: 'me' });
    expect(Favorite.findAll.mock.calls[0][0].where).toEqual({ user_id: 'me' });
  });

  it('throws 404 when the account does not exist', async () => {
    User.findByPk.mockResolvedValue(null);
    await expect(exportData('ghost')).rejects.toMatchObject({ status: 404 });
    expect(TokenTransaction.findAll).not.toHaveBeenCalled();
  });
});
