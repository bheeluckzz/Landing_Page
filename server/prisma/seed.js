const { PrismaClient } = require('@prisma/client');
const { products, services, members } = require('../data.js');

const prisma = new PrismaClient();

async function main() {
  // Seed Products
  for (const p of products) {
    await prisma.product.upsert({
      where: { title: p.title },
      update: {},
      create: p
    });
  }

  // Seed Services
  for (const s of services) {
    await prisma.service.upsert({
      where: { title: s.title },
      update: {},
      create: s
    });
  }

  // Seed Members
  for (const m of members) {
    await prisma.member.upsert({
      where: { name: m },
      update: {},
      create: { name: m }
    });
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
