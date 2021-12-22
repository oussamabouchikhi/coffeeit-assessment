import * as mongoose from 'mongoose';

export const CitySchema = new mongoose.Schema({
  name: String,
  weather: mongoose.SchemaTypes.Mixed,
});

export interface City {
  id: number;

  name: string;

  weather: mongoose.Schema.Types.Mixed;
}
