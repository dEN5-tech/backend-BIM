import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRaw`PRAGMA foreign_keys = OFF;`;
    await prisma.$executeRaw`DELETE FROM User;`;
    await prisma.$executeRaw`DELETE FROM Chat;`;
    await prisma.$executeRaw`DELETE FROM Message;`;
    await prisma.$executeRaw`DELETE FROM Event;`;
    await prisma.$executeRaw`DELETE FROM EventsUsers;`;
    await prisma.$executeRaw`DELETE FROM Project;`;
    await prisma.$executeRaw`DELETE FROM UserProjects;`;
    await prisma.$executeRaw`DELETE FROM Image;`;
    await prisma.$executeRaw`DELETE FROM Document;`;
    await prisma.$executeRaw`DELETE FROM Comment;`;
    await prisma.$executeRaw`PRAGMA foreign_keys = ON;`;

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

      const chat = await prisma.chat.create({
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

    // Seed Projects, Images, Documents, Comments, and UserProjects
    const projects = [];
    for (let i = 0; i < 5; i++) {
      const project = {
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        miniDescription: faker.lorem.sentence(),
        backgroundImage: faker.image.urlPlaceholder(),
        startDate: faker.date.past(),
        endDate: faker.date.future()
      };
      projects.push(project);
    }
    await prisma.project.createMany({
      data: projects,
    });

    // Retrieve all projects
    const createdProjects = await prisma.project.findMany();

    // Seed Images, Documents, and Comments for each project
    for (const project of createdProjects) {
      // Seed Images
      const images = [];
      for (let i = 0; i < 3; i++) {
        const image = {
          url: faker.image.imageUrl(),
          projectId: project.id,
        };
        images.push(image);
      }
      await prisma.image.createMany({
        data: images,
      });

      // Seed Documents
      const documents = [];
      for (let i = 0; i < 3; i++) {
        const document = {
          url: faker.internet.url(),
          projectId: project.id,
        };
        documents.push(document);
      }
      await prisma.document.createMany({
        data: documents,
      });

      // Seed Comments
      const comments = [];
      for (let i = 0; i < 3; i++) {
        const comment = {
          content: faker.lorem.sentence(),
          projectId: project.id,
          userId: createdUsers[faker.datatype.number({ min: 0, max: createdUsers.length - 1 })].id,
        };
        comments.push(comment);
      }
      await prisma.comment.createMany({
        data: comments,
      });
    }

    // Assign users to projects
    for (const project of createdProjects) {
      const participants = faker.helpers.shuffle(createdUsers).slice(0, faker.datatype.number({ min: 1, max: createdUsers.length }));
      for (const participant of participants) {
        await prisma.userProjects.create({
          data: {
            projectId: project.id,
            userId: participant.id,
          }
        });
      }
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
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