import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: 'dev-user-1' },
    update: {},
    create: {
      id: 'dev-user-1',
      email: 'dev@example.com',
      name: 'Dev User',
    },
  });
  console.log('Dev user seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });