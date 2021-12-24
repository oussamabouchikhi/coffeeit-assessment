import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';

describe('CitiesService', () => {
  let service: CitiesService;
  const mockCities = [
    { id: 1, name: 'oran' },
    { id: 2, name: 'paris' },
  ];

  const mockCitiesService = {
    createCity: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        id: 123,
        ...dto,
        weather: { humidity: 48 },
      }),
    ),
    deleteCity: jest.fn((id) => {
      return mockCities.filter((c) => c.id != id);
    }),
    getAllCities: jest.fn(() => mockCities),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CitiesService],
    })
      .overrideProvider(CitiesService)
      .useValue(mockCitiesService)
      .compile();

    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a city', async () => {
    const createCityDto = { name: 'oran' };

    expect(await service.createCity(createCityDto)).toEqual({
      id: expect.any(Number),
      name: createCityDto.name,
      weather: expect.any,
    });

    expect(service.createCity(createCityDto)).toHaveBeenCalledWith(
      createCityDto,
    );
  });

  it('should delete a city', () => {
    expect(mockCitiesService.deleteCity(2)).toEqual([
      {
        id: 1,
        name: 'oran',
      },
    ]);
  });

  it('should get all cities', () => {
    expect(mockCitiesService.getAllCities()).toEqual(mockCities);
  });
});
