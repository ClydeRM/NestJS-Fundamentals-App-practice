import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// data transaction to suggest user to get certain coffee
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column('json') // Store event payload
  payload: Record<string, any>;
}
