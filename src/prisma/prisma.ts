import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`;
  await prisma.$executeRaw`TRUNCATE TABLE User;`;
  await prisma.$executeRaw`TRUNCATE TABLE Chat;`;
  await prisma.$executeRaw`TRUNCATE TABLE Message;`;
  await prisma.$executeRaw`TRUNCATE TABLE Event;`;
  await prisma.$executeRaw`TRUNCATE TABLE EventsUsers;`;
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

  // Retrieve all users to ensure correct IDs are used
  const createdUsers = await prisma.user.findMany();

  // Seed Chats and Messages
  for (let i = 0; i < createdUsers.length; i += 2) {
    if (i + 1 >= createdUsers.length) break; // Prevent out-of-bounds error

    const user1 = createdUsers[i];
    const user2 = createdUsers[i + 1];

    let chat = await prisma.chat.create({
      data: {
        users: {
          connect: [{ id: user1.id }, { id: user2.id }]
        }
      }
    });

    // Create messages between the two users
    await prisma.message.create({
      data: {
        content: `Hello from ${user1.name} to ${user2.name}`,
        chatId: chat.id,
        senderId: user1.id,
        receiverId: user2.id,
      }
    });

    await prisma.message.create({
      data: {
        content: `Hello from ${user2.name} to ${user1.name}`,
        chatId: chat.id,
        senderId: user2.id,
        receiverId: user1.id,
      }
    });
  }

  // Seed Events and EventsUsers
  const events = [];
  for (let i = 0; i < 5; i++) {
    const event = {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      date: faker.date.future(),
    };
    events.push(event);
  }
  await prisma.event.createMany({
    data: events,
  });

  // Retrieve all events
  const createdEvents = await prisma.event.findMany();

  // Randomly assign users to events
  for (const event of createdEvents) {
    const attendees = faker.helpers.shuffle(createdUsers).slice(0, faker.datatype.number({ min: 1, max: createdUsers.length }));
    for (const attendee of attendees) {
      await prisma.eventsUsers.create({
        data: {
          eventId: event.id,
          userId: attendee.id,
        }
      });
    }
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