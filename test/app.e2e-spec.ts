import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Change beforeEach to beforeAll, bc we don't want to restart the app for each e2e test
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(); // 一定要建立一個App runtime system
    await app.init();
  });

  // it('desc', func(supertest.request(){...}))
  it('/ (GET)', () => {
    return request(app.getHttpServer()) // Connect to server (Express or Fastify)
      .get('/')
      .set('Authorization', process.env.API_KEY) // Pass to Global Guard
      .expect(200)
      .expect('Hello World!');
  });

  afterAll(async () => {
    await app.close(); // 因為App有一些“非同步”的程序，這邊是DB connecter
  });
});
