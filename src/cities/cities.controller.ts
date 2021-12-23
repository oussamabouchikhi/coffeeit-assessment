import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
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
    return this.citiesService.createCity(createCityDto);
  }

  /*
   * Get all cities from DB
   */
  @Get()
  @ApiCreatedResponse({ description: 'Get all cities' })
  getAllCities() {
    return this.citiesService.getAllCities();
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
    return this.citiesService.deleteCity(id);
  }
}
