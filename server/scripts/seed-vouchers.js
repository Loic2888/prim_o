/**
 * Seed script — populates the vouchers table with test data.
 * Run once: node scripts/seed-vouchers.js
 * Requires DATABASE_URL in environment (server/.env).
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const sequelize = require('../src/config/database');
const { initVoucher } = require('../src/models/Voucher');

const vouchers = [
  { partner: 'Amazon',     title: 'Carte cadeau 20 €',              token_cost: 100, available: true },
  { partner: 'Amazon',     title: 'Carte cadeau 50 €',              token_cost: 250, available: true },
  { partner: 'Fnac',       title: 'Bon d\'achat 15 €',              token_cost: 75,  available: true },
  { partner: 'Fnac',       title: 'Bon d\'achat 30 €',              token_cost: 150, available: true },
  { partner: 'Décathlon',  title: 'Bon d\'achat 20 €',              token_cost: 100, available: true },
  { partner: 'Uber Eats',  title: 'Réduction 10 € sur commande',    token_cost: 50,  available: true },
  { partner: 'Netflix',    title: 'Abonnement 1 mois offert',       token_cost: 200, available: true },
  { partner: 'Spotify',    title: 'Premium 3 mois offerts',         token_cost: 150, available: true },
  { partner: 'Sephora',    title: 'Bon d\'achat 25 €',              token_cost: 125, available: true },
  { partner: 'IKEA',       title: 'Bon d\'achat 30 €',              token_cost: 150, available: true },
  { partner: 'Zalando',    title: 'Réduction 20 € dès 80 € d\'achat', token_cost: 100, available: true },
  { partner: 'Maisons du Monde', title: 'Bon d\'achat 20 €',        token_cost: 100, available: true },
];

async function seed() {
  try {
    const Voucher = initVoucher(sequelize);
    await sequelize.authenticate();
    await sequelize.sync();

    const existing = await Voucher.count();
    if (existing > 0) {
      console.log(`⚠️  ${existing} bons déjà présents en base — seed ignoré.`);
      console.log('   Pour forcer le seed, videz la table vouchers et relancez.');
      process.exit(0);
    }

    const created = await Voucher.bulkCreate(vouchers);
    console.log(`✅  ${created.length} bons d'achat insérés avec succès.`);
  } catch (err) {
    console.error('❌  Erreur lors du seed :', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();
