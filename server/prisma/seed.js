const { PrismaClient } = require('@prisma/client');
const { products, services, members } = require('../data.js');

const prisma = new PrismaClient();

async function main() {
  // Seed Products
  for (const p of products) {
    await prisma.product.create({
      data: {
        title: p.title,
        img: p.img
      }
    });
  }

  // Seed Services
  for (const s of services) {
    await prisma.service.create({
      data: s
    });
  }

  // Seed Members
  for (const m of members) {
    await prisma.member.create({
      data: { name: m }
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
