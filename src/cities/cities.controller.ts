import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Logger,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';

@Controller('cities')
export class CitiesController {
  private logger = new Logger('CitiesController');

  constructor(private readonly citiesService: CitiesService) {}

  /*
   * Create a new city, get its weather info from
   * OpenWeatherMap api then store it into DB
   * @Body name String
   * @Return the newly created city
   */
  @Post()
  @ApiCreatedResponse({ description: 'Create a new city' })
  @ApiBody({ type: CreateCityDto })
  @ApiConflictResponse({ description: 'This city already exists' })
  createCity(@Body() createCityDto: CreateCityDto) {
    this.logger.verbose(`Creating a new city...`);
    return this.citiesService.createCity(createCityDto);
  }

  /*
   * Get all cities from DB
   */
  @Get()
  @ApiCreatedResponse({ description: 'Get all cities' })
  getAllCities() {
    this.logger.verbose(`Getting all new cities...`);
    return this.citiesService.getAllCities();
  }

  @Get('weather')
  @ApiCreatedResponse({ description: 'Get all cities last known weather' })
  GetCitiesWeather() {
    return this.citiesService.GetCitiesWeather();
  }

  @Get(':city_name/weather')
  @ApiCreatedResponse({ description: 'Get all cities last known weather' })
  GetCityWeather(@Param('city_name') cityName: string) {
    return this.citiesService.GetCityWeather(cityName);
  }

  /*
   * Delete a city by its ID
   * @Param: id String
   */
  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'City has been deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'No city with such id has been found.',
  })
  deleteCity(@Param('id') id) {
    this.logger.verbose(`Deleting city with id ${id}`);
    return this.citiesService.deleteCity(id);
  }
}
