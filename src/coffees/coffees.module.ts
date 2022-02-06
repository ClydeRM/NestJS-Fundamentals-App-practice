import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';

import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';

// Static Custom provider
import { COFFEE_BRANDS } from './coffees.constants';

// Dynamic Custom provider, determine a Class that a Token should resolve to.
class ConfigService {}
class DevelopmentConfigService {}
class ProductConfigService {}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])], // Use typeorm mapping entity and sql table
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] }, // Static Custom provider, Inject certain data in own service
    {
      provide: ConfigService,
      useValue:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductConfigService,
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
