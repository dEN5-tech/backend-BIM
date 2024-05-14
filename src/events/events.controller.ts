import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from 'src/guards/auth.guard';

interface CreateEventDto {
    title: string;
    description: string;
    date: string; // Using string type for date for simplicity, consider using Date type or a string format like ISO8601 in a real application
  }

  interface UpdateEventDto {
    title?: string;
    description?: string;
    date?: string;
  }


@UseGuards(AuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAllEvents();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOneEvent(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.updateEvent(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.removeEvent(+id);
  }
}