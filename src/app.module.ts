import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [
    CoffeesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      autoLoadEntities: true, // If option not found, try reinstall @nestjs/typeorm
      synchronize: true, // shouldn't be used in production - otherwise you can lose production data #自動產生entity的SQL table
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
