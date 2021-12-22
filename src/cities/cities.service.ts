import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { CreateCityDto } from './dto/create-city.dto';

import * as dotenv from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { City } from './city.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
dotenv.config();

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel('City') private readonly cityModel: Model<City>,
    private readonly httpService: HttpService,
  ) {}

  async createCity(createCityDto: CreateCityDto) {
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
  }

  getAllCities() {
    return this.cityModel.find();
  }
}
