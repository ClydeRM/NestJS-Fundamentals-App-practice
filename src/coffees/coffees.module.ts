import { Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';

import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';

// Static Custom provider
import { COFFEE_BRANDS } from './coffees.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])], // Use typeorm mapping entity and sql table
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    {
      provide: COFFEE_BRANDS,
      useFactory: async (connection: Connection): Promise<string[]> => {
        // const coffeeBrands = await connection.query('SELECT * ...');
        const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
        return coffeeBrands;
      },
      scope: Scope.TRANSIENT,
    }, // Static Custom provider useFactory "Async" method, retrieve data from database use typeorm connection
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
