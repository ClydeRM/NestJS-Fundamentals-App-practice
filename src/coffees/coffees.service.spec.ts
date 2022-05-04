import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
// Extra Provider Token
import { COFFEE_BRANDS } from './coffees.constants';
// ConfigService Provider Token
import coffeesConfig from './config/coffees.config';
import { NotFoundException } from '@nestjs/common';

// 理想的方法去產生Mock Repository<通用樣板>
// Partial<Type> 把傳入的Type，變成選擇性存在
// Record<...Type, ...value> 把傳入的Type展開變成Key，與後方展開的value做 Peer
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

// describe('Title', func() ) grouping all unit tests in func of 'Title'
describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;

  // beforeEach() will be executed "before every test", A "setup phase"
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        {
          provide: Connection,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: COFFEE_BRANDS,
          useValue: {},
        },
        {
          provide: coffeesConfig.KEY,
          useValue: {
            get: jest.fn((key: string) => {
              // this is being super extra, in the case that you need multiple keys with the `get` method
              if (key === 'foo') {
                return 'bar';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    // service = await module.resolve(CoffeesService); // 如果Provider的lifetime 是“TRANSIENT”或“REQUEST”
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        const coffeeId = '1';
        const exceptedCoffee = {};

        coffeeRepository.findOne.mockReturnValue(exceptedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(exceptedCoffee);
      });
    });
    describe('otherwise', () => {
      it('should return the "NotFoundException"', async () => {
        const coffeeId = '1';
        coffeeRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(coffeeId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Coffee #${coffeeId} not found`);
        }
      });
    });
  });
});
