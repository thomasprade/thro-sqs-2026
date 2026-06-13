import * as fs from 'node:fs';
import * as path from 'node:path';

const TEST_DB_PATH = path.resolve(__dirname, '..', 'data', 'test-integration.sqlite');

async function globalTeardown() {
  if (process.env.CI) {
    return;
  }

  if (fs.existsSync(TEST_DB_PATH)) {
    fs.rmSync(TEST_DB_PATH);
    console.log('Test database deleted.');
  }
}

export default globalTeardown;
