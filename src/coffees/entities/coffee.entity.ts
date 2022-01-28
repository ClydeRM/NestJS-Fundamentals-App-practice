import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// Definition of coffee data entity.
@Entity() // sql table === 'coffees'
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column('json', { nullable: true }) // data format is json, and field is optional
  flavors: string[];
}
