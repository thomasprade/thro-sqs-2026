import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { UserEntity } from '../src/auth/user.entity';

const SALT_ROUNDS = 10;

async function main() {
  const [username, password] = process.argv.slice(2);

  if (!username || !password) {
    console.error('Usage: npx ts-node scripts/create-user.ts <username> <password>');
    process.exit(1);
  }

  const databasePath = process.env.DATABASE_PATH || './data/database.sqlite';

  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: databasePath,
    entities: [UserEntity],
    synchronize: true,
  });

  await dataSource.initialize();

  const repo = dataSource.getRepository(UserEntity);

  const existing = await repo.findOneBy({ username });
  if (existing) {
    console.error(`User "${username}" already exists.`);
    await dataSource.destroy();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = repo.create({ username, passwordHash });
  await repo.save(user);

  console.log(`User "${username}" created successfully.`);
  await dataSource.destroy();
}

main().catch((err) => {
  console.error('Failed to create user:', err);
  process.exit(1);
});
