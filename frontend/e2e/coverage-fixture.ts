import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { test as base } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coverageDir = path.resolve(__dirname, '../.nyc_output');

export const test = base.extend({
  page: async ({ page }, use) => {
    await use(page);

    const coverage = await page.evaluate(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).__coverage__ ? JSON.stringify((globalThis as any).__coverage__) : null,
    );

    if (coverage) {
      fs.mkdirSync(coverageDir, { recursive: true });
      const fileName = `coverage-${Date.now()}-${Math.random().toString(36).slice(2)}.json`;
      fs.writeFileSync(path.join(coverageDir, fileName), coverage);
    }
  },
});

export { expect } from '@playwright/test';
