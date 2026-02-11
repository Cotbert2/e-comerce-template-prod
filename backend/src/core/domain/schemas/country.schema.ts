import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class City {
  @Prop({ required: true })
  name: string;
}

export const CitySchema = SchemaFactory.createForClass(City);

@Schema()
export class State {


  @Prop({ required: true })
  name: string;

  @Prop({ type: [CitySchema], default: [] })
  cities: City[];
}

export const StateSchema = SchemaFactory.createForClass(State);

@Schema()
export class Country extends Document {

  @Prop({ required: true })
  name: string;

  @Prop({ type: [StateSchema], default: [] })
  states: State[];
    static schema: any;
}

export const CountrySchema = SchemaFactory.createForClass(Country);