import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed Users
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `User${i}`,
      },
    });
  }

  // Seed Chats
  for (let i = 0; i < 5; i++) {
    await prisma.chat.create({
      data: {
        users: {
          connect: [{ id: 2 * i + 1 }, { id: 2 * i + 2 }],
        },
      },
    });
  }

  // Seed Messages
  for (let i = 0; i < 20; i++) {
    await prisma.message.create({
      data: {
        content: `Message content ${i}`,
        chatId: (i % 5) + 1,
        userId: (i % 10) + 1,
        image: i % 3 === 0 ? `http://example.com/image${i}.jpg` : null,
        document: i % 4 === 0 ? `http://example.com/doc${i}.pdf` : null,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
