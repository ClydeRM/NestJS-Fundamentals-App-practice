import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { CoffeesService } from './coffees.service';

@Controller('coffees')
export class CoffeesController {
  // 注入service 只有在這個類別可使用,而且只能用不能更改
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get() // paginationQuery 限縮搜尋資料庫table的範圍
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    // limit 限制多少資料數量, offset 宣告要跳過哪些列資料
    // const { limit, offset } = paginationQuery;

    return this.coffeesService.findAll(paginationQuery);
    // return `this action returns all coffees. Limit: ${limit}, Offset: ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffeesService.findOne(id);
    // return `this action returns #${id} coffee`;
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
    // return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
    // const newData = JSON.stringify(body);
    // return `Update #${id} coffee with ${newData}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
    // return `Delete #${id} coffee`;
  }
}
