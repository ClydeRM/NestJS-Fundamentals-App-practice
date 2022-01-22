// CLI >> nest g class coffees/dto/update-coffee.dto --no-spec
// Update property optional

export class UpdateCoffeeDto {
  readonly name?: string;
  readonly brand?: string;
  readonly flavors?: string[];
}
