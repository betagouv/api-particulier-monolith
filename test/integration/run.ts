import pgMigrate from 'node-pg-migrate';
// eslint-disable-next-line node/no-unpublished-import
import {run} from 'jest';
import {pgPool} from 'test/integration/config';

const setup = async () => {
  await pgPool.query(`
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS pgmigrations;
    DROP TABLE IF EXISTS tokens;
    DROP MATERIALIZED VIEW IF EXISTS consumptions_summary_daily;
    DROP MATERIALIZED VIEW IF EXISTS consumptions_summary_hourly;
    DROP TABLE IF EXISTS journal_entries;
      `);
  await pgMigrate({
    migrationsTable: 'pgmigrations',
    count: 1000,
    dir: process.cwd() + '/migrations',
    direction: 'up',
    databaseUrl: process.env.TEST_DATABASE_URL!,
  });
};

const teardown = async () => {
  pgPool.end();
};

setup()
  .then(async () => {
    await run([
      '-c',
      'test/integration/jest-integration.json',
      '--detectOpenHandles',
    ]);
  })
  .then(teardown)
  .catch(e => console.error(e));
