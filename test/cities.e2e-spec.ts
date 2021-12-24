import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CitiesModule } from '../src/cities/cities.module';
import { CitiesService } from '../src/cities/cities.service';
import { MongooseModule } from '@nestjs/mongoose';

describe('CitiesController (e2e)', () => {
  let app: INestApplication;
  const mockCities = [
    { id: 1, name: 'oran' },
    { id: 2, name: 'paris' },
  ];
  const mockCitiesService = {
    getAllCities: jest.fn().mockResolvedValue(mockCities),
    createCity: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        id: 123,
        ...dto,
        weather: { humidity: 48 },
      }),
    ),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CitiesModule, MongooseModule],
      providers: [CitiesService],
    })
      .overrideProvider(CitiesService)
      .useValue(mockCitiesService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/cities (GET)', () => {
    return request(app.getHttpServer())
      .get('/cities')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockCities);
  });

  it('/cities (POST)', () => {
    return request(app.getHttpServer())
      .post('/cities')
      .send({ name: 'oran' })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          id: expect.any(Number),
          name: 'oran',
        });
      });
  });

  it('/cities (POST) --> 400 on error', () => {
    return request(app.getHttpServer())
      .post('/cities')
      .send({ name: 6625 })
      .expect(400);
  });
});
