import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event, Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.event.create({
      data,
    });
  }

  async findAllEvents(){
    const events = await this.prisma.event.findMany({
      include: {
        EventsUsers: {
          include: {
            user: true,
          },
        },
      },
    });
  
    return events.map(event => ({
      title: event.title,
      date: event.date.toISOString(),
      description: event.description,
      participants: event.EventsUsers.map(eventUser => ({
        name: eventUser.user.name,
        avatar: eventUser.user.avatar,
      })),
    }));
  }

  async findOneEvent(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }

  async updateEvent(id: number, data: Prisma.EventUpdateInput): Promise<Event> {
    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async removeEvent(id: number): Promise<Event> {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}