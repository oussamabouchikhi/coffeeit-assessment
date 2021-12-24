import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';

describe('CitiesController', () => {
  let controller: CitiesController;
  const mockCities = [
    { id: 1, name: 'oran' },
    { id: 2, name: 'paris' },
  ];

  const mockCitiesService = {
    createCity: jest.fn((dto) => {
      return {
        id: 1640361454817,
        ...dto,
        weather: { humidity: 84 },
      };
    }),
    deleteCity: jest.fn((id) => {
      return mockCities.filter((c) => c.id != id);
    }),
    getAllCities: jest.fn(() => mockCities),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [CitiesService],
    })
      .overrideProvider(CitiesService)
      .useValue(mockCitiesService)
      .compile();

    controller = module.get<CitiesController>(CitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a city', () => {
    const createCityDto = { name: 'oran' };

    expect(controller.createCity(createCityDto)).toEqual({
      id: expect.any,
      name: createCityDto.name,
      weather: expect.any,
    });

    expect(mockCitiesService.createCity).toHaveBeenCalledWith(createCityDto);
  });

  it('should delete a city', () => {
    expect(controller.deleteCity(2)).toEqual([
      {
        id: 1,
        name: 'oran',
      },
    ]);

    expect(mockCitiesService.deleteCity).toHaveBeenCalledWith(2);
  });

  it('should get all cities', () => {
    expect(controller.getAllCities()).toEqual(mockCities);

    expect(mockCitiesService.getAllCities).toHaveBeenCalled();
  });
});
