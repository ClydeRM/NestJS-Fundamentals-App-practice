// CLI >> nest g class coffees/dto/create-coffee.dto --no-spec
import { IsString } from 'class-validator';
export class CreateCoffeeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsString({ each: true }) // 檢查陣列每一個元素
  readonly flavors: string[];
}
