/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

// Definition of coffee data entity.
@Entity() // sql table === 'coffees'
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  // single table method #1
  // @Column('json', { nullable: true }) // data format is json, and field is optional
  // flavors: string[];

  // Many to many table method #2
  @JoinTable() // foreign table join in coffee table
  @ManyToMany(
    // this type set to flavor, and coffees <=> flavors
    (type) => Flavor,
    (flavor) => flavor.coffees,
    {
      cascade: true, //['insert'] auto insert new flavor data in Flavor table
    },
  )
  flavors: Flavor[];

  @Column({ default: 0 }) // recommendation of coffee
  recommendation: number;
}
