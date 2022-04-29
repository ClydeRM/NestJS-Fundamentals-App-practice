import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';

// A Provider_Token for inject mock data
import { COFFEE_BRANDS } from './coffees.constants';
// Coffees's ConfigObject namespaces key value
import coffeesConfig from './config/coffees.config';

@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee) // Use Repository register coffee entity to PGSql
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection, // For data transaction
    @Inject(COFFEE_BRANDS) coffeeBrands: string[], // inject certain data or mock data for testing service
    @Inject(coffeesConfig.KEY) // Coffees's ConfigObject namespaces key value
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    // console.log('CoffeesService instantiated'); // Log inject data in console
    // ConfigService.get<T>('SetValue','DefaultValue') // [hint] get method does't have type safety, must avoid it
    console.log(coffeesConfiguration.foo);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    // limit 限制多少資料數量, offset 宣告要跳過哪些列資料
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'], // 因為coffee table中，有個多對多對應元素到 foreign table，啟用relations:['foreign_table_name']，取得joinTable後的資料
      skip: offset, // 跳過多少個
      take: limit, // 只取得多少個
    });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors'],
    });
    if (!coffee) {
      // If Not Found
      throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      // 檢查新加入的coffee中，所有的flavors是否已存在，有就使用，沒有就建立
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    }); // Create coffee instance
    return this.coffeeRepository.save(coffee); // Save coffee instance
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    // 檢查更新的coffee中，所有的flavors是否已存在，有就使用，沒有就建立
    const flavors =
      updateCoffeeDto.flavors && // 新傳入flavors跟 flavors table中沒有的做and運算，只更新沒有存在的
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    // Repository.preload() If an entity exists already, preload replaces all of the values with the new ones passed
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      // coffee not found
      throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.coffeeRepository.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    // In real world application, this should be wrapped in a single module
    // Handle user to recommend coffee
    const queryRunner = this.connection.createQueryRunner();

    // Open connection
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Increase recommendations number, and save new recommendEvent data, commitTransaction
      coffee.recommendation++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      await queryRunner.commitTransaction();
    } catch (error) {
      // If recommendEvent object has wrong property, throw error and rollbackTransaction
      await queryRunner.rollbackTransaction();
    } finally {
      // When anything is finish, close and release the transaction
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    // Check Flavor have existed?
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      // this flavors have already existed
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
