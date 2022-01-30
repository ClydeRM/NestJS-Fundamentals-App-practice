import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coffee } from './entities/coffee.entity';

import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee) // Use Repository register coffee entity to PGSql
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
  ) {}

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

    const coffee = await this.coffeeRepository.preload({
      // Repository.preload() create new entity base on original entity
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

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      // this flavors have already existed
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
