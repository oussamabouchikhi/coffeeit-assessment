import * as mongoose from 'mongoose';

export const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  weather: mongoose.SchemaTypes.Mixed,
});

export interface City {
  id: mongoose.Schema.Types.ObjectId;
  name: string;
  weather: mongoose.Schema.Types.Mixed;
}
