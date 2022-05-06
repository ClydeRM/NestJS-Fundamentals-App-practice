import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Event extends mongoose.Document {
  @Prop()
  type: string;

  // @Prop({ index: true })
  name: string;

  // 如果Schema的prop 有any type， 使用Mixed，讓所有東西通過檢查
  @Prop(mongoose.SchemaTypes.Mixed)
  payload: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
// 設定name為index 並且為升冪排列
// 設定type為index 並且為降冪排列
EventSchema.index({ name: 1, type: -1 });
