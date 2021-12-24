<p align='center'>
  <a href="https://coffeeit.nl/" target="_blank">
  <img src='https://coffeeit.nl/wp-content/uploads/2016/09/logo_dark_small_new.png' width="320" alt='coffee IT logo'>
  </a>
</p>

# 🎯 CoffeeIT backend assessment

Backend assessment from CoffeeIT

## 📋 Description

The assessment is to make an API that is able to get the weather information for
certain cities.

## ⬇ Installation

Make sure you have Nodejs and Nestjs/cli installed

```bash
~ node -v
~ nest --version
```

```bash
# Clone via SSH or any other method
$ git clone git@github.com:oussamabouchikhi/coffeeit-assessment.git

# CD into the project
$ cd coffeeit-assessment

# Install the dependencies
$ npm install
```

## 🛠️ Configuration

Rename the `sample.env` file to `.env` and put your Mongodb Atlas connection string & OpenWeatherMap api key

`DAYS` property is for setting how many days to get fro city weather forcast
for the `getCityNextXDaysWeather` function, by default it will get the next 7 days (we cannot set more than that for the free version)

```.env
MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
OPEN_WEATHER_API_KEY=YOUR_API_KEY

DAYS=NUMBER_OF_DAYS
```

## 🚀 Running the app

```bash
# development
$ npm start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🧪 Test

```bash
# unit tests (you can add the prefix --watch)
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

### Test scheduler

in `cities.service.ts` file add the bellow code

```typescript
private count = 0
numberOfSeconds = undefined; // if undefined or unspecified it will default to 7 seconds

  startTime = new Date().getTime();
  @Cron(`0-59/1 * * * * *`, {
    name: 'myJob',
  })
  handleCron() {
    console.log(`${this.count + 1} - Called every second`);
    this.count++;
    this.closeJob();
  }

  closeJob() {
    const job = this.schedulerRegistry.getCronJob('myJob');

    const endTime = this.startTime + 1000 * (this.numberOfSeconds || 7);

    if (job.lastDate().getTime() > endTime) {
      job.stop();
    }
  }
```

in `cities.controller.ts` file add the bellow code

```typescript
@Get('test')
testFunc() {
  return this.citiesService.handleCron();
}
```

you should get

```markdown
1 - Called every second
2 - Called every second
3 - Called every second
4 - Called every second
5 - Called every second
6 - Called every second
7 - Called every second
```

### Docker

Make sure docker is running on your machine. And Obviously you installed it :)

```bash


# Build docker image
docker-compose build

# Show docker images
docker images

# Show docker images on running container
docker ps -a

# run the image
Docker compose up

```
