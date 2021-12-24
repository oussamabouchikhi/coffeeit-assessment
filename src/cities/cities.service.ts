import {
  Delete,
  Get,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { CreateCityDto } from './dto/create-city.dto';

import * as dotenv from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { City } from './city.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
dotenv.config();

@Injectable()
export class CitiesService {
  private logger = new Logger('CitiesService');

  constructor(
    @InjectModel('City') private readonly cityModel: Model<City>,
    private readonly httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry,
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
      this.logger.error(`Error creating a new city`, error);
    }
  }

  getAllCities() {
    try {
      return this.cityModel.find();
    } catch (error) {
      this.logger.error('Error getting all cities', error);
    }
  }

  getCitiesWeather() {
    try {
      return this.cityModel.find();
    } catch (error) {
      this.logger.error('Error getting all cities weather', error);
    }
  }

  async getCityLastWeather(cityName) {
    return await lastValueFrom(
      this.httpService
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.OPEN_WEATHER_API_KEY}`,
        )
        .pipe(map((response) => response.data)),
    );
  }

  startTime = new Date().getTime();
  numberOfDays = process.env.DAYS || 7;
  @Cron(`0 0-23/24 * * *`, {
    name: 'myJob',
  })
  async getCityLastXDaysWeather(lat, lon) {
    this.logger.verbose(`Getting last 7 days forcast`);

    const last7DaysWeather = await lastValueFrom(
      this.httpService
        .get(
          `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${this.startTime}&appid=${process.env.OPEN_WEATHER_API_KEY}`,
        )
        .pipe(map((response) => response.data)),
    );

    this.closeJob();
    return last7DaysWeather;
  }

  closeJob() {
    const job = this.schedulerRegistry.getCronJob('myJob');

    const endTime = this.startTime + 1000 * 60 * 60 * 24 * Number(this.numberOfDays);

    if (job.lastDate().getTime() >= endTime) {
      job.stop();
    }
  }

  async getCityNext7DaysWeather(cityName) {
    return await lastValueFrom(
      this.httpService
        .get(
          `https://api.openweathermap.org/data/2.5/forecast/daily?q=${cityName}&cnt=${7}&appid=${
            process.env.OPEN_WEATHER_API_KEY
          }`,
        )
        .pipe(map((response) => response.data)),
    );
  }

  async GetCityWeather(cityName) {
    const city = await this.cityModel.findOne({ name: cityName });

    let cityWeather = undefined;
    if (!city) {
      cityWeather = await this.getCityLastWeather(cityName);
    }

    // const lat = city.weather.coord.lat;
    // const lon = city.weather.coord.lon;
    // paris coords
    const lat = 48.8534;
    const lon = 2.3488;

    const last7DaysWeather = await this.getCityLastXDaysWeather(lat, lon);

    const next7DaysWeather = await this.getCityNext7DaysWeather(cityName);

    const res = {
      name: cityName,
      weather: cityWeather || city.weather,
      last7DaysWeather,
      next7DaysWeather,
    };
    return res;
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
