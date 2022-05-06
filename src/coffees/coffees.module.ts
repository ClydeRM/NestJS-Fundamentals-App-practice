import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';

import { Coffee, CoffeesSchema } from './entities/coffee.entity';
import { Event, EventSchema } from 'src/events/entities/event.entity.ts';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coffee.name, schema: CoffeesSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}
