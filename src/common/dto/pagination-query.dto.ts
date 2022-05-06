import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional() // this property is optional
  @IsPositive() // this property must be a nature number
  limit: number;

  @IsOptional()
  @IsPositive()
  offset: number;
}
