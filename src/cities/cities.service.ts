import { Delete, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { CreateCityDto } from './dto/create-city.dto';

import * as dotenv from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { City } from './city.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
dotenv.config();

@Injectable()
export class CitiesService {
  private logger = new Logger('CitiesService');

  constructor(
    @InjectModel('City') private readonly cityModel: Model<City>,
    private readonly httpService: HttpService,
  ) {}

  async createCity(createCityDto: CreateCityDto) {
    try {
      const { name } = createCityDto;

      const weather = await lastValueFrom(
        this.httpService
          .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${process.env.OPEN_WEATHER_API_KEY}`,
          )
          .pipe(map((response) => response.data)),
      );

      const city = new this.cityModel({
        name,
        weather,
      });

      await city.save();

      return city;
    } catch (error) {
      this.logger.error(`Error creating a nex city`, error);
    }
  }

  getAllCities() {
    try {
      return this.cityModel.find();
    } catch (error) {
      this.logger.error('Error getting all cities', error);
    }
  }

  @Delete(':id')
  async deleteCity(id) {
    try {
      const cityId = new ObjectId(id);
      const result = await this.cityModel.deleteOne({ _id: cityId }).exec();
      console.log(result);

      if (result.deletedCount === 0) {
        throw new NotFoundException('No city with such id has been found.');
      }
    } catch (error) {
      this.logger.error(`Error deleting city with id ${id}`, error);
    }
  }
}
