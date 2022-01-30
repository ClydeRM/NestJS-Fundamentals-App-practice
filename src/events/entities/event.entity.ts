import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// data transaction to suggest user to get certain coffee
@Index(['name', 'type'])
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Index()
  @Column()
  name: string;

  @Column('json') // Store event payload
  payload: Record<string, any>;
}
