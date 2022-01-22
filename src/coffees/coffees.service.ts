import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  // mock DB data
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    const coffee = this.coffees.find((item) => item.id === +id);
    if (!coffee) {
      // If Not Found
      throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
    }
    return coffee;
  }

  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
  }

  update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    let updateData: any; // TODO: change type any
    const updateCoffeeList = this.coffees.map((coffee) => {
      if (coffee.id === +id) {
        updateData = {
          ...coffee,
          ...updateCoffeeDto,
        };
        return updateData;
      } else return coffee;
    });
    this.coffees = updateCoffeeList;
    return updateData;
  }

  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
