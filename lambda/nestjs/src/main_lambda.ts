import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { Server } from 'http';
import { Handler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server));
  app.useGlobalPipes(new ValidationPipe());
  //await app.listen(3000);
  await app.init();
  return createServer(server);
}

//bootstrap();

let cachedServer: Server;

export const handler: Handler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
