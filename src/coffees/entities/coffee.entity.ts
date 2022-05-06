// Definition of coffee data entity.
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Coffee extends Document {
  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop({ default: 0 })
  recommendation: number;

  @Prop([String])
  flavors: string[];
}

export const CoffeesSchema = SchemaFactory.createForClass(Coffee);
// DefinitionsFactoryClass 建立一列（raws）的 Schema instances
