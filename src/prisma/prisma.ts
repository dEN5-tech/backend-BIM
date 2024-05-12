import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
  await prisma.$executeRaw`TRUNCATE TABLE User;`;
  await prisma.$executeRaw`TRUNCATE TABLE Chat;`;
  await prisma.$executeRaw`TRUNCATE TABLE Message;`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`;
  // Seed Users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = {
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password(),
      avatar: faker.image.avatar(),
    };
    users.push(user);
  }
  await prisma.user.createMany({
    data: users,
  });

  // Seed Chats and Messages using logic similar to ChatService and ChatController
  for (let i = 0; i < users.length; i += 2) {
    const user1Id = i + 1;
    const user2Id = i + 2;
    let chat = await prisma.chat.findFirst({
      where: {
        users: {
          every: {
            OR: [
              { id: user1Id },
              { id: user2Id }
            ]
          }
        }
      }
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          users: {
            connect: [{ id: user1Id }, { id: user2Id }]
          }
        }
      });
    }

    // Create messages between the two users
    await prisma.message.create({
      data: {
        content: `Hello from ${users[user1Id-1].name} to ${users[user2Id-1].name}`,
        chatId: chat.id,
        userId: user1Id,
      }
    });

    await prisma.message.create({
      data: {
        content: `Hello from ${users[user2Id-1].name} to ${users[user1Id-1].name}`,
        chatId: chat.id,
        userId: user2Id,
      }
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
