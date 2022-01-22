// CLI >> nest g class coffees/dto/update-coffee.dto --no-spec
// Update property optional

import { PartialType } from '@nestjs/mapped-types'; // 利用原本的DTO去建立一個內容元素是可選擇使用的新DTO
import { CreateCoffeeDto } from './create-coffee.dto'; // 原本的DTO

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
