import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ApiResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { CoffeesService } from './coffees.service';
// Custom Decorator
import { Public } from 'src/common/decorators/public.decorator';
// Custom Pipe
import { PraseIntPipe } from 'src/common/pipes/prase-int.pipe';
import { Protocol } from 'src/common/decorators/protocol.decorator';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
  // 注入service 只有在這個類別可使用,而且只能用不能更改
  constructor(
    private readonly coffeesService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request, // Show all Request http detail like header, ip address etc.
  ) {
    // console.log('CoffeesController instantiated');
    // console.log(request);
  }

  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Public()
  @Get() // paginationQuery 限縮搜尋資料庫table的範圍
  findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    // limit 限制多少資料數量, offset 宣告要跳過哪些列資料
    // const { limit, offset } = paginationQuery;
    console.log(protocol);

    return this.coffeesService.findAll(paginationQuery);
    // return `this action returns all coffees. Limit: ${limit}, Offset: ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id', PraseIntPipe) id: string) {
    // console.log(id);

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
