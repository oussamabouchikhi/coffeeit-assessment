import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Create a new city' })
  @ApiBody({ type: CreateCityDto })
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.createCity(createCityDto);
  }

  @Get()
  @ApiCreatedResponse({ description: 'Get all cities' })
  getAllCities() {
    return this.citiesService.getAllCities();
  }
}