import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const TEST_DB_PATH = './data/test-integration.sqlite';

export const TEST_USER = process.env.TEST_USER ?? 'testuser';
export const TEST_PASSWORD = process.env.TEST_PASSWORD ?? 'testpassword';

async function globalSetup() {
  // Ensure the data directory exists so better-sqlite3 can create the file
  fs.mkdirSync(path.join(WORKSPACE_ROOT, 'data'), { recursive: true });

  try {
    execSync(`npm run create-user -w backend -- ${TEST_USER} ${TEST_PASSWORD}`, {
      cwd: WORKSPACE_ROOT,
      env: { ...process.env, DATABASE_PATH: TEST_DB_PATH },
      stdio: 'pipe',
    });
    console.log(`Test user "${TEST_USER}" created.`);
  } catch (error) {
    // User may already exist from a previous run — that is acceptable
    const stderr = (error as { stderr?: Buffer }).stderr?.toString() ?? '';
    if (!stderr.includes('already exists')) {
      throw error;
    }
    console.log(`Test user "${TEST_USER}" already exists, skipping creation.`);
  }
}

export default globalSetup;
