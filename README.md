#    NestJS official course

##    Start project
```
sudo npm i -g @nest/cli
nest -v
nest new project_name 
git init

npm run start:dev
docker-compose up (-d)
docker exec -it __pid__ bash
psql -U acc
```

##    Npm Script
```>>
測試e2e 建立Mock PG DB用
"pretest:e2e": "docker-compose up -d test-db",
"test:e2e": "jest --config ./test/jest-e2e.json",
"posttest:e2e": "docker-compose stop test-db && docker-compose rm -f test-db"
```

##    Package version
```>>
"@hapi/joi": "^17.1.1" // 檢查Env value
"@nestjs/cli": "^8.2.5" // Nest Dep
"@nestjs/core": "^8.4.4"// Nest Dep
... 


"@nestjs/mapped-types": "^1.0.1" // 建構Partial Dto
"@nestjs/swagger": "^5.2.1" // 建立API Document
"swagger-ui-express": "^4.3.0" // Swagger UI
"@nestjs/typeorm": "^8.0.3" // 連線與Map SQL
"rxjs": "^7.2.0"
"pg": "^8.7.1", // Postgres 
"typeorm": "^0.2.41" // Typeorm

"@nestjs/mongoose": "^9.0.3" // 連線與Map NO-SQL 
"mongoose": "^6.3.2" // Mongoose


dev // 使用 Jest 測試
"@nestjs/testing": "^8.4.4",
"@types/hapi__joi": "^17.1.8",
"@types/jest": "27.0.2",
"@types/supertest": "^2.0.11",
"jest": "^28.0.3", // Jest 28.0.1^ 移除jasmine
"supertest": "^6.1.3",
"typescript": "^4.3.5"
```

##    Project Structure
```>>
./nest-app
├── dist // 由 tsc 編譯ts專案輸出成js專案
    └── ...
├── node_module // 安裝的外部模組
├── src // ts主要開發資料夾
    ├── config // 全域的Env Object
        └── app.config.ts
    ├── app.controller.spec.ts // app 路由測試檔案 
    ├── app.controller.ts
    ├── app.service.ts 
    ├── app.module.ts // 設定注入與使用subModule
    ├── main.ts // 主程式，設定伺服器跟端口與運作AppModule
    ├── XXXModule // 封裝成模組
        ├── configs // Partial register ENV config
        ├── entities // 資料的schema
            └── ...
        ├── dto // 資料實體化的sharp
            └── ...
        ├── constants.ts // Provider token
        ├── controller.ts  
        ├── service.ts 
        └── module.ts 
    ├── common // 常會用到的重複使用的邏輯，例如middleware，DBConnect，DataSchema etc.
        ├── decorators
        ├── filters
        ├── pipes
        ├── guards
        ├── interceptor
        ├── middlewares
        └── common.module.ts // 包裝成Module 區域使用
    ├── event // Data Transaction 的模組，包含完整的路由與商業邏輯，目前暫時只有entity
        └── ...
    ├── migration // typeorm data migration
        └── ...
    └── test // e2e test
        ├── coffees // 單一個Module CRUD e2e測試
            └── ...
        ├── app.e2e-spec.ts
        └── jest-e2e.json // jest設定檔
├── .gitignore
├── docker-compose.yml // Docker-compose file
├── .env // 全域環境變數
├── ormconfig.ts // orm config Obj
├── package.json
├── package-look.json
├── nestcli.json // 設定 nest cli 功能
└── tsconfig.json // 設定tsc 編譯的格式與規定
```


## Nest cli Command
* Flag --no-spec 表示只產生controller檔案與資料夾，不產生測試檔案
* Flag --dry-run 只顯示結果，常測試檔案名有無衝突
    * Controller
    ```
    nest g controller __name__ --no-spec
    ```
    * Service (Provider)
    ```
    nest g service __SameNameController__ --no-spec
    ```
    * Module 
    ```
    nest g module __moduleName__
    ```
    * Filter
    ```
    nest g filter common/filters/http-exception
    ```
    * Guard
    ```
     nest g guard common/guards/api-key
    ```
    * Interceptor
    ```
    nest g interceptor common/interceptors/timeout
    ```
    * Pipe
    ```
    nest g pipe common/pipes/prase-int
    ```
    * Middleware
    ```
    nest g middleware common/middlewares/logging
    ```
    
##    Decorater 裝飾子

###   @Controller @Get @Post @Put @Patch @Delete
* **@Controller()** 宣告子：宣稱此物件屬於Controller類別，參數可傳入此路徑的根路徑
* **@Get()** ：此方法是處理get request
* **@Post()** ：此方法是處理post request，參數同上
* **@Put()** ：此方法是處理put request，參數同上
* **@Patch()** ：此方法是處理patch request，參數同上
* **@Delete()** ：此方法是處理delete request，參數同上


###    @Query()
```>>
@Get() // paginationQuery 限縮搜尋資料庫table的範圍
findAll(@Query() paginationQuery: PaginationQueryDto) {
    // limit 限制多少資料數量, offset 宣告要跳過哪些列資料
    // const { limit, offset } = paginationQuery;
    ...
}

```

###    @Param()
```>>
@Get(':productId') // 使用此API，需要傳入ID
//API名稱（@Params('個別參數') 重構參數名：型態）{...}
findById(@Params('productId') pId:string){
    console.log(`This is product #${pId}`);
    return ...
}
```

### @Body()
```>>
@Post()
//API名稱（@Body('物件名稱或內屬性')）{...}
createOne(@Body() DTO:__DTO){
    console.log(DTO);
    return ...
}
```

## Service (Provider)
###    @Injectable()
**＃宣告此類別為可在任何地方注入類別**
```>>
@Injectable()
export class TestService{
...
}
```


##    Module (encapsulate)
**＃封裝路由與商業邏輯成一個小模組**
@Module()
```>>
@Module({
    imports:[],
    controllers:[],
    providers:[],
    exports:[],
}}
export class TestModule{}
```
1. **imports:[]** 注入哪些套件或模組
2. **controllers:[]** 使用哪些路由
3. **providers:[]** 使用哪些提供器
4. **exports:[]** 出口哪些提供器

##    DTO (Data to Object)
**＃將資料轉變成物件，方便使用**
**＃定義資料的內容與詳細型態**
**＃設定唯讀防止屬性被更改**
```>>
export class TestDto{
    readonly property1: string;
    readonly .....
}
```

##    Entity (Data entity)
**＃定義資料的實體屬性**
**＃表示SQL資料庫中的資料表**
```>>
>> coffee.entity.ts

// Definition of coffee data entity.
@Entity() // sql table === 'coffee'
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  // Many to many table
  @JoinTable() // foreign table join in coffee table
  @ManyToMany(
    // this type set to flavor, and coffees <=> flavors
    (type) => Flavor,
    (flavor) => flavor.coffees,
    {
      cascade: true, //['insert'] auto insert new flavor data in Flavor table
    },
  )
  flavors: Flavor[];

  @Column({ default: 0 }) // recommendation of coffee
  recommendation: number;
}


```


## ValidationPipe (Pipe)
**＃驗證客戶端傳入的資料完整性**
[# Validation](https://docs.nestjs.com/techniques/validation)
＃ npm i class-validator class-transformer **for create-dto**
＃ npm i @nestjs/mapped-types **for update-dto**
```>>
#Method1: GlobalPipes
>>main.ts
async function bootstrap(){
    ...
    app.useGlobalPipes(new ValidationPipe()); // 在整個App中 使用驗證
    ...
}

#hint npm i class-validator class-transformer
>>Test-create.dto.ts
import { IsEmail } from 'class-validator';
export class TestCreateDto{
    @IsEmail()
    email: string;
}


#hint npm i @nestjs/mapped-types
>>Test-update.dto.ts
import { PartialType } from '@nestjs/mapped-types'; // 利用原本的DTO去建立一個內容元素是可選擇使用的新DTO
import { TestCreateDto } from '...dto'; // 原本的DTO
export class TestUpdateDto extend PartialType(TestCreateDto){}


==================================================================================================


#Method2: WhiteList
>>main.ts
// 檢查Request資料正確性
app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 限制request，只傳入DTO規定的內容
      transform: true, // 自動轉換 request Body, 將Body的型別成DTO的類別物件
      forbidNonWhitelisted: true, // 抵擋request，如果request body有DTO規定外的欄位，request被攔截
      transformOptions: {
        enableImplicitConversion: true, // 不需要在額外標示@Type， ValidationPipe會依據原設定資料型態去驗證
      },
})
```

###    PaginationQuery
* 建立通用型DTO 規定limit offset的資料物件
* limit
```>>
>> common/pagination-query.dto.ts

import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional() // this property is optional
  @IsPositive() // this property must be a nature number
  // @Type(()=>Number) // 在main.ts中的GlobalPipe設定transformOptions
  // 設定enableImplictConversion 固定轉換成ts指定的type， 不再需要另外使用@Type()修飾子
  limit: number;

  @IsOptional()
  @IsPositive()
  offset: number;
}

>> main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 檢查Request資料完整性
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 限制request，只傳入DTO規定的內容
      transform: true, // 自動轉換 request Body, 將Body的型別成DTO的類別物件，會輕微影響效能
      forbidNonWhitelisted: true, // 抵擋request，如果request body有DTO規定外的欄位，request被攔截
      transformOptions: {
        enableImplicitConversion: true, // 不需要在額外標示@Type， ValidationPipe會依據原設定資料型態去驗證
      },
    }),
  );

  await app.listen(3000);
}


>> coffees/coffees.service.ts

export class CoffeesService{
  constructor(){...}
  
  findAll(paginationQuery: PaginationQueryDto) {
    // limit 限制多少資料數量, offset 宣告要跳過哪些列資料
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'], // 因為coffee table中，有個多對多對應元素到 foreign table，啟用relations:['foreign_table_name']，取得joinTable後的資料
      skip: offset, // 跳過多少個
      take: limit, // 只取得多少個
    });
  }
  
  // business login...
}
```


##    TypeORM Postgres
* ＃Package
```
npm i @nestjs/typeorm typeorm pg
```

* ＃docker-compose.yml
```>>
version: "3"

services:
  db:
    image: postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: PWD
```

###    使用
* forRoot() 只要在根模組設定一次就好
* forFeature() 在對應的子模組設定到指定的entity

```>>
>> app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'IP',
      port: 5432,
      username: 'ACC',
      password: 'PWD',
      database: 'DB',
      autoLoadEntities: true, // If option not found, try reinstall @nestjs/typeorm
      synchronize: true, // shouldn't be used in production - otherwise you can lose production data #自動產生entity的SQL table
    }),
    CoffeeRatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


>> test.module.ts

import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])], // Use typeorm mapping entity and sql table
})
export class CoffeesModule {}

```

### 原理
![entity與資料的關係](https://i.imgur.com/L38Y1Q3.png)
* entity 將同類的資料聚集成一個Repository，並可被注入
* entity 也表示資料在SQL中的schema

```>>
>> test.service.ts
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee) // Use Repository register coffee entity to PGSql
    private readonly coffeeRepository: Repository<Coffee>){}
    
    business logic.....
}

```

###    Decorator
* @JoinTable()
Helps specify the OWNER side of the relationship
表示此Table是 Primary Table

* @OneToOne(type => entity, ()=>{})
In Primary Table each row has only one related row in Foreign Table

* @OneToMany(type...) / @ManyToOne(...)
In Primary Table each row has one or more than one related row in Foreign Table


* @ManyToMany(type => entity, (元素)=>{對應到Table中的哪一個元素})
In Primary Table each row many related rows in Foreign Table
```>>
>> coffees/entities/coffee.entity.ts

// Definition of coffee data entity.
@Entity() // sql table === 'coffee'
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()...

  // Many to many table
  @JoinTable() // foreign table join in coffee table
  @ManyToMany(
    // this type set to flavor, and coffees <=> flavors
    (type) => Flavor,
    (flavor) => flavor.coffees,
    {
      // detail setting...
    },
  )
  flavors: Flavor[];
}

>> coffees/entities/flavor.entity.ts

@Entity()
export class Flavor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany((type) => Coffee, (coffee) => coffee.flavors)
  coffees: Coffee[];
}
```


### Fetch Data
* hint: find function detail
```>>
>> coffee.service.ts

findAll(...: ...Dto) {
    return this.coffeeRepository.find({
      relations: ['flavors'], 
      // 因為coffee table中，有個多對多對應元素到 foreign table，
      // 啟用relations:['foreign_table_name']，取得joinTable後的資料
    });
  }

```

### Cascading Insert (串連插入新資料)
* 聯集多Table時，新增一筆資料將同時插入至集合中的其他子Table

```>>
>> coffee.entity.ts

@JoinTable() // foreign table join in coffee table
  @ManyToMany(
    // this type set to flavor, and coffees <=> flavors
    (type) => Flavor,
    (flavor) => flavor.coffees,
    {
      // we can also limit cascades to just insert OR update
      cascade: true, //['insert'] auto insert new flavor data in Flavor table, Can 
    },
  )
  flavors: Flavor[];
```

### Transaction
* 假如同時有多個endpoint想修改同一筆資料
* 為保全資料在DB中的完整性，需要將資料狀態儲存成一個"Event"
* 在前一個"Event"完成後在進行下一步"Event"
* 這種安全措施稱為"Transaction"

![](https://i.imgur.com/HmoVfZw.png)

#### QueryRunner 

* Connection 模組： 建立QueryRunner 連線
* 步驟
    1. 建立QueryRunner連線物件
    2. 等待連線
    3. 啟動Transaction
    4. Try：建立"Event" =>  儲存"Event"
    5. Catch： 發生錯誤就"Roll Back"，防止資料不同步
    6. Finally： 關閉QueryRunner連線
```>>
>> coffees/coffees.service.ts

import { Connection, Repository } from 'typeorm';
...

@Injectable()
export class CoffeesService {
  constructor(
    ...
    private readonly connection: Connection, // For data transaction
  ){}

  async recommendCoffee(coffee: Coffee) {
    // In real world application, this should be wrapped in a single module
    // Handle user to recommend coffee
    const queryRunner = this.connection.createQueryRunner();

    // Open connection
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Increase recommendations number, and save new recommendEvent data, commitTransaction
      coffee.recommendation++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      await queryRunner.commitTransaction();
    } catch (error) {
      // If recommendEvent object has wrong property, throw error and rollbackTransaction
      await queryRunner.rollbackTransaction();
    } finally {
      // When anything is finish, close and release the transaction
      await queryRunner.release();
    }
  }
  // buniness logic ...
}
```

####    @Index() 
* 加快 fetch data的速度
* Single index

```>>
>> event/entities/event.entity.ts

import {Index} from 'typeorm';

@Entity()
export class Event{
  @PrimaryGeneratedColumn()
  ...
  
  @Index() // 指定此欄位為Index
  @Column()
  ...

}
```

* Composite index

```>>
>> event/entities/event.entity.ts

import {Index} from 'typeorm';

@Index(['column1', 'column2'])
@Entity()
export class Event{
  @PrimaryGeneratedColumn()
  ...
  
  @Column()
  ...

}
```


### Migration
* DB migrations "提供開發者在**已存在的資料上**"逐漸更新與同步 data schema 與 App data model (entity)


####    ormconfig.ts
* ormconfig.ts 設定migration的資料庫與migration file的生成路徑

```>>
>> /ormconfig.ts

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'ACC',
  password: 'PWD',
  database: 'DB',
  entities: ['dist/**/*.entity.js'], // 編譯輸出的所有entities
  migrations: ['dist/migrations/*.js'], // 編譯輸出的索有migration files
  cli: {
    migrationsDir: 'src/migrations', // 參考哪個路徑的migration files 做編譯
  },
};
```

#### typeorm cli command
* 生成 migration.ts file
* npx 可以在不下載套件的cli下，執行套件的cli 
```
npx typeorm migration:create -n _migration_file_name_
```

* 執行migration
* 記得先**關閉dev模式**
```
#1 編譯Project
npm run build

#2 手動產生migration file
npx typeorm migration:create -n _migration_file_name_

#3 執行migration
npx typeorm migration:run 

successfully 表示執行成功
No migrations are depanding 表示沒有新更動被發現

#4 roll back (復原)
npx typeorm migration:revert

reverted successfully 表示復原成功
```

* 自動偵測更新 migration
* 記得先**關閉dev模式**
```
#1 編譯Project
npm run build

#2 自動偵測與生成migration file
npx typeorm migration:generate -n _FILENAME_

#3 執行migration
npx typeorm migration:run 

successfully 表示執行成功
No migrations are depanding 表示沒有新更動被發現

#4 roll back (復原)
npx typeorm migration:revert

reverted successfully 表示復原成功
```

#### up()
* 宣告哪些資料屬性需要更改

```>>
>> migrations/CoffeeRefactor.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ...Refactor implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
        // SQL command
      `ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`,
    );
  }
  
  // down()...
}
```

#### down() 
* 宣告roll back時，哪些資料屬性需要復原

```>>
>> migrations/CoffeeRefactor.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ...Refactor implements MigrationInterface {
  // up() ...
  
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`,
    );
  }
}

```

##    Depandency Injection

###    步驟
1. 建立與檔案名稱相同類別的Service.ts，並加上@Injectable()的裝飾子
2. 在 Module 的 providers:[]當中加入 service
3. Nest Runtime system 就會依據Module建構時所列舉的providers 類別去建構 service 物件

![](https://i.imgur.com/rrvSVcb.png)
* 分離商業邏輯物件類別，需要用到時在呼叫
* Container 代表整個Nest Runtime System，排程每個子模組的生命週期
* Injector 在 Module 被建構時，才會注入(Injection)

![](https://i.imgur.com/FTd48HN.png)
* 當Module的Controller被互叫時，需要建構Service Depandency
* 這時候被注入的Service過程，就稱為Injection
* 優點是可以無限擴充Controller的功能性，並且容易維護


###    Custom Provider
* 當我們要注入現有的 Service時，可以使用 exports:[] 把現有的 Service變成公開使用，重複利用
* 也可以使用"Strategy Pattern" overwrite覆蓋現有的 Service，進而達到客製化的效果
* **使用在 unit Testing**， 也可以客製化 mockService()

###    Provider Token
```>>
@Module(
    imports:[...],...
    providers:[
        {
            provide: _NameOfProviderToken_,
            useClass: _WhichInjectableClass_,
            // useValue: [data or obj etc...]
            // useFactory: (_nameOfFactory_: FACTORYCLASS) => _nameOfFactory_.internalFunction(),
            // inject: [_listOfFactoryClass_],
            // scope: Scope.DEFAULT/ TRANSIENT /REQUEST // 設定Provider 的LifeCycle
        }
    ]
){}

================================================================================================

＃直接在@Injectable() 修飾子裡設定LifeCycle
@Injectable({scope: Scope.DEFAULT/ TRANSIENT /REQUEST})
export class xxService{
    ...
}
```

####    useValue (Mock data)

* 用來做自動化測試
* 靜態資料
* 每當Module被建構時，Service被注入，但注入的是 @Injectable() Class 物件
```>>
>> coffees/coffees.module.ts
import...

// Mock service class 建立測試資料類別
class MockCoffeesService{...}

@Module({
    imports:[...],
    controllers:[...],
    providers:[{
        provide: CoffeesService,
        useValue: new MockCoffeesService() // 使用測試資料類別
    }],
    exports:[...]
})

======================================================
# 直接注入測試資料

>> coffees/coffees.constants.ts 
// export a test PROVIDER_TOKEN_CLASS for injecting data in service
export const COFFEE_BRANDS = 'COFFEE_BRANDS';

>> coffees/coffees.module.ts

@Module({
    imports:[...],
    controllers:[...],
    providers:[CoffeesService,
        {
            provide: COFFEE_BRANDS, // PROVIDER_TOKEN_CLASS
            useValue: ['buddy brew', 'nescafe'] // mock data
        }
    ],
    exports:[...]
})

>> coffees/coffees.service.ts

import {...
import {COFFEE_BRANDS} from './coffees.constant.ts';

@Injectable()
export class CoffeesService{
    constructor(
        @InjectRepository(...)
        private readonly ....
        ...
        // 注入測試假資料
        //@Inject(PROVIDER_TOKEN_CLASS) 
        @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    )

    ...
}
```

#### useClass()

* 依據node執行模式（開發/產品），呼叫不同的Service Class

```>>
>> coffees/coffees.module.ts

// Dynamic Service Class
class ConfigClass{...}
class DevelopmentConfigService{...}
class ProductionConfigService{...}

@Module({
    imports:[...],
    controller:[...],
    providers:[
        CoffeesService,
        { 
            provide: ConfigService,
            useClass:
                process.env.NODE_ENV === 'development' 
                ? DevelopmentConfigService
                : ProductionConfigService,
        }
    ],
    exports:[...]
}){...}
```

####    useFactory()
* Create provider dynamicaclly
* 動態產生 @Injectable() Class

```>>
>> coffees/coffees.module.ts

@Module({
    imports:[...],
    controllers:[...],
    providers:[CoffeesService,
        {
            provide: COFFEE_BRANDS, // PROVIDER_TOKEN_CLASS
            useFactory: () => ['buddy brew', 'nescafe'] // useFactory function
        }
    ],
    exports:[...]
})
```

####    Async useFactory()
* Fetch data from DB or other Promise Obj
* 當產品服務啟動時，有些必要先啟動的Provider 要先被建立
* 非同步建立Provider，配合useFactory()，Promise 物件
* 等到Provider都就定位，才開始接收 request
* 例如DB Provider，需要DB完成連線，才開始服務

```>>
>> coffees/coffees.module.ts

// Static Custom provider token
import { COFFEE_BRANDS } from './coffees.constants';

@Module({
  imports: [...], 
  controllers: [...],
  providers: [
    CoffeesService,
    {
      provide: COFFEE_BRANDS,
      useFactory: async (connection: Connection): Promise<string[]> => {
        // const coffeeBrands = await connection.query('SELECT * ...'); // SQL Command
        const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']); // mock promise for test
        return coffeeBrands;
      },
    }, // Static Custom provider useFactory "Async" method, retrieve data from database use typeorm connection
  ],
  exports: [...],
})

```

### Dynamic Module

* 在某些情況，模組需要使用完全不一樣的功能
* 導致useFactory()，太多事情要做
* 把特定功能獨立成 DynamicModule，依據情境去傳入"選擇的功能"
* 最後在模組中引入DynamicModule即可
* 需要實作DynamicModule interface
* 需要提供一個 register() Method

```>>
＃ 假設使用連線不同資料庫的動態模組為例
>> database/database.module.ts

import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection } from 'typeorm';

@Module({})
export class DatabaseModule {
  static register(options: ConnectionOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'CONNECTION',
          useValue: createConnection(options),
        },
      ],
    };
  }
}


>> coffee-rating/coffee-rating.module.ts

import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'ACC',
      password: 'PWD',
      database: 'postgres',
    }),
  ],
  providers: [...],
})

```

###    Scope (Life Cycle)

####    原理
* 因為NodeJS 沒有所謂的多線程（Muti Task）
* 所以當有Request傳入NestApp時，理論上所有的Module都是共享的
* 基於某些情況，為了節省效能，只希望Provider的Life Cycle 在處理完成Request後就關閉
* Scope 可以設定 Provider 的 Life Cycle

####    種類
* **Scope.DEFAULT** ：完全與APP的Life Cycle相同，APP活多久，Provider 就活多久

![](https://i.imgur.com/trJj8bP.png)

* **Scope.TRANSIENT** ： 除了原本DEFAULT的Provider被建構一次，會額外建構一個 Private的 Provider instance，假如同個Provider會在多個Module中被呼叫注入，TRANSIENT可以將 TASK分開處理

![](https://i.imgur.com/kccN9Fu.png)

* **Scope.REQUEST** ：與被Request呼叫到處理結束的週期為這個Provider 的 Life Cycle

![](https://i.imgur.com/hrByViB.png)

##    Config Module

###    .env file
* @nestjs/config

```
npm i @nestjs/config
```
* 一個應用程式，會依據不同的運作需求，而有不同的參數設定
* 有些敏感資料或參數，需要被隔離或是隱藏於.gitignore中
* 設定**環境變數**，可以讓開發者輕易的更改所有的參數
* 新增 **.env** 檔，將環境參數命名，再藉由ConfigModule讀取，即可

###    ConfigModule
* 預設情況下會自動讀取路徑 **./ .env** 檔，作為環境參數設定檔
* 需要在根模組(AppModule)中 import

```>>
>> ./src/app.module.ts

import {...}
import {ConfigModule} from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(), // 預設讀取./.env
        CoffeesModule,
        TypeOrmModule.forRoot({...})
    ],
    controllers:[...],
    providers:[...],
    exports:[...],
}){}
export class AppModule{}
```


###    Custom path or ignore

* ConfigMoudle.forRoot()，可以傳入尋找的路徑設定，或是特定檔名
* **如果檔名相同， 會以第一個找到的檔案為優先設定**
* 如果程式執行的平台例如**Heroko**，擁有其他的環境設定檔，就必需要忽略本專案的 .env
* ignoreEnvFile: true 可以讓ConfigModule忽略所有的 .env 檔


```>>
>> app.module.ts

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '__PathOrFileName__',
            // ignoreEnvFile: true 
        })
    ]
})
```

###    validate env value

* **joi** package 可以定義 object schema跟 validate JS Object
* Regular dependence

```
npm i @hapi/joi
```
* Devolopment dependence

```
npm i --save-dev @types/hapi__joi
```

[# Joi DOC](https://joi.dev/api/?v=17.6.0)
* validationSchema: 建立Joi 物件Schema 

```>>
>> app.module.ts

import * as Joi from '@hapi/joi';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema:Joi.object({
                DATABASE_HOST: Joi.required(),
                DATABASE_PORT: Joi.number().default(5432),
              }),
        })
    ],
    ...
})
```

###    ConfigService
* 為了防止缺少變數後，APP也能順利執行
* ConfigService可以取得Env，也能設定 Default Value

```>>
>> /src/coffees/coffees.service.ts

import {ConfigSerivce} form '@nestjs/config';
...

@injectable()
export class CoffeesService{
    constructor(
        ...
        private readonly configService: ConfigService,
    ){...}
    
    const databaseHost = 
        this.configService.get<string>(
            'DATABASE_HOST', // ENV VALUE
            'localhost' // DEFAULT VALUE
        );
    ...
}
```

###    Custom ConfigFile
* 集中所有相同類別的設定為一個檔案
* 方便獨立更改每個類別的設定
* 輸出成JS object 比起一般字串更方便呼叫
* 可使用物件屬性(obj.property)的呼叫方法區分環境變數

```>>
>> /src/config/app.config.ts

// An example for global configuration object
export default () => ({
  // 利用箭頭函式建立一個全域物件
  environment: process.env.NODE_ENV || 'development', // 執行環境
  database: {
    // DB的設定值
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432, // 把環境變數'字串'轉成10進位'數字'
  },
});


>> /src/app.module.ts

...
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig], // 讀取ConfigObject
      }),
    }),
  ],
  ...
})

>> /src/coffees/coffees.service.ts

import {ConfigSerivce} form '@nestjs/config';
...

@injectable()
export class CoffeesService{
    constructor(
        ...
        private readonly configService: ConfigService,
    ){...}
    
    const databaseHost = 
        this.configService.get(
            'database.host', // ConfigObject VALUE
            'localhost' // DEFAULT VALUE
        );
    ...
}
```

###    Partial Registration and Namespace

* 利用 Namespace的方式，註冊特定Service的 KEY Token 
* 利用Partial Registration 設定只存在特定Service中的環境變數
* 使用 @inject(KEY) 的方式保證Type Safety
* 方便撰寫測試與維護

```>>
>> /src/coffees/config/coffees.config.ts

// An example of ConfigObject Namespaces and Partial Registration
import { registerAs } from '@nestjs/config';  // 部分註冊

export default registerAs('coffees', () => ({
  foo: 'bar', // coffees.foo 的ConfigObject
}));

>> /src/coffees/coffees.module.ts

// Partial Registration of ConfigObject
import coffeesConfig from './config/coffees.config';
...

@Module({
  imports: [
    ...
    ConfigModule.forFeature(coffeesConfig),
  ], // Use typeorm mapping entity and sql table
  ...
})

>> /src/coffees/coffees.service.ts

import { ConfigService, ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config'; // Coffees's ConfigObject namespaces key value


...

@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {
  constructor(
    ...
    @Inject(coffeesConfig.KEY) // Coffees's ConfigObject namespaces key value
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    console.log(coffeesConfiguration.foo);
  }
  
  ...
}
```


##     Nest 4 Techniques (Middleware)

###    Exception Filters
*    處理預測的Request意外狀況
*    依據狀況回覆特定的Response
*    更加控制原Nestjs 的 Exception Layer
*    使錯誤訊息更"可讀化"

＃ Nest CLI
```
 nest g filter common/filters/http-exception
```

####    實作ExceptionFilter class
```>>
>> /src/common/filters/http-exception.filter.ts

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)  // 專門處理Service throw HttpException
export class HttpExceptionFilter<T extends HttpException> // T 是HttpException類別，確保catch HttpException
  implements ExceptionFilter // 實作Filter interface
{
  catch(exception: T, host: ArgumentsHost) { // host 是一個實體的 Request或Response Object
    const ctx = host.switchToHttp(); // 轉換Context成 http 格式
    const response = ctx.getResponse<Response>(); // 取出Http的Response 部分

    const status = exception.getStatus(); // 取出status code
    const exceptionResponse = exception.getResponse(); // 取出Exception
    const error =
      typeof response === 'string'
        ? { message: exceptionResponse } // 轉換型別，如果單純是字串，轉換成物件，放入Message的Key中
        : (exceptionResponse as object); //  全部轉換成物件

    response.status(status).json({
      ...error,
      timestamp: new Date().toISOString(),
    });
  }
}

```

###    Guard
*    Authorization (Register and Valid)
*    Authentization (Session and Token)
*    Permissions
*    Roles
*    ACLs (Access Control Lists)

＃ Nest CLI
```
 nest g guard common/guards/api-key
```
####    @SetMetadata('key', 'value')
*    設定路由權限
*    key: 尋找哪個KEY
*    value: (typeof any) 存入KEY的值
*    @SetMetadata('isPublic', true)

![](https://i.imgur.com/2pCUGl5.png)


####    Custom Decorator

```>>
>> /src/common/decorators/public.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

>> /src/coffees/coffees.controller.ts 

import {...}
import { Public } from 'src/common/decorators/public.decorator';

@injectable('coffees')
export CoffeesController {
  constructor(...){}
  
  //@SetMetadata('isPublic', true)
  @Public() // 使用 Custom Decorator
  @Get() 
  findAll(@Query() paginationQuery: PaginationQueryDto) 
    return this.coffeesService.findAll(paginationQuery);
  }
}
```

####    實作 Guard 
* Reflector (hint: @SetMetadata())
    *  Reflector.get(哪個MetaData, 哪個Route);
```>>
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}
  // CanActivate interface must return boolean True allowed / False Denied
  canActivate(
    context: ExecutionContext, // inherits the ArgumentsHost (hint) ExceptionFilter
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler()); // reflector.get(WHICHMETADATA, WHICHROUTE);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Authorization'); // 取得標頭"權限"欄位值
    return authHeader === this.configService.get('API_KEY');
  }
}

```

###    Interceptors 
*    在Call route的 "前後" 都會觸發
*    阻擋而外的程式邏輯
*    轉換程式邏輯的 return 值
*    繼承與拓展程式邏輯
*    覆寫程式邏輯(疊加)

＃ Nest CLI
```
nest g interceptor common/interceptors/wrap-response
```

####    [Rxjs API](https://rxjs.dev/api) 
*    rxjs 是一個Liberary，使開發者更容易操縱"非同步API"
*    可以監聽所有的Promise/CallBack物件
*    統一管理不同的API
*    pipe(fun1, fun2,..串接多個Method
*    tap() 終止Observable物件
*    map() 走訪Observable中所有資料

####    實作 wrap-response
```>>
>> /src/common/interceptors/wrap-response.interceptor.ts

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

// Wrap Req and Res stream, allow us to decide execute the route or not
@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  // Every CustomInterceptor must implement NestInterceptor interface
  // Every CustomInterceptor must have one intercept method
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Every intercept method must return a 'Observable' from Rxjs library
    // CallHandler interface implement handle method. Call it can invoke the route handler method, If don't not invoke
    console.log('Before...'); // Execute it before the route handler be called

    // return next.handle().pipe(tap((data) => console.log('After...', data))); // Execute it after the route handler be called
    // tap() invokes an anonymous logging function upon graceful termination of the Observable stream
    // data => ... is the response we send back to the router handler

    return next.handle().pipe(map((data) => ({ data })));
    // map() takes a value from the stream and returns a modified one
    // wrap response data in a object
  }
}
```

####    實作 timeout
```>>
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // If a req or res execute more than 3 sec. ,Interceptor is going to end handler forcefully
    return next.handle().pipe(
      timeout(3000),  // 超過3秒終止 handler
      catchError((err) => {
        if (err instanceof TimeoutError) { // 如果 err 是 TimeoutError的"實例" 
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),
    );
  }
}
```

####    加入Main
```>>
>> /src/main.ts
// Interceptor
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

async function bootstrap() {
  const app ...

  // 測試Interceptor的lifetime
  app.useGlobalInterceptors( // 逗號區分 同時加入多個interceptor
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );
  await app.listen(3000);
}
bootstrap();
```



###    Pipes (ValidationPipe)
*    只在Call routes 前被觸發
*    (Transfromation) 驗證Request傳入的資料，轉換成規定的格式
*    (Validation) 遮擋跟拒絕規定外的資料

＃ Nest CLI
```
nest g pipe common/pipes/prase-int 
```

### 使用 Nest 4 helper (Token)
* main.ts (Global)
    *    app.useGlobalPipes()
    *    app.useGlobalFilters()
    *    app.useGlobalGuards()
    *    app.useGlobalInterceptors()

* module.ts @nestjs/core (Provider)
    *    Custom Provider (hint: Provider token)
    *    APP_PIPE
    *    APP_FILTER
    *    APP_GUARD
    *    APP_INTERCEPTOR

* controller.ts @nestjs/common (Decorator)
    *    @UsePipes()
    *    @UseFilter()
    *    @UseGuard()
    *    @UseInterceptor()

* Params (Pipe only)
    *    @Body(Custom_Pipe_Class)

###    Custom Middleware
* execute code
* change req/res object
* ending req/res cycle
* calling "next()" middleware
* 不能綁定在Provider中
* 只能以string的方式注入Controller

＃ Nest CLI
```
 nest g middleware common/middlewares/logging
```

####    Function Middleware
* stateless
* can't inject dependencies
* can't access Nest Container (run time cycle)

####    Class Middleware
* register in module scope
* can inject dependencies
* can access Nest Container (run time cycle)

```>>
>> /src/common/middleware/logging.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  // Every custom middleware must implement NestMiddleware interface
  // Every custom middleware must provide a 'use method'
  use(req: any, res: any, next: () => void) {
    // req is from pervious middleware or request arguments
    // res is this middleware want to pass to the next middleware arguments
    // next() is a method, called the next middleware
    console.time('Request-response time');
    console.log('hi from next middleware');
    res.on('finish', () => console.timeEnd('Request-response time'));
    // always call next(), otherwise the request will all hanging
    next();
  }
}

>> /src/common/common.module.ts

import ...
// Custom middleware
import { LoggingMiddleware } from './middlewares/logging.middleware';

@Module({
  imports: [...],
  providers: [...],
})
export class CommonModule implements NestModule {
  // Every custom middleware inject in Module must implement NestModule interface
  // Every custom middleware must provide a 'configure()' method
  configure(consumer: MiddlewareConsumer) {
    // consumer provides a set of useful methods to tie middleware to "specific routes"
    consumer.apply(LoggingMiddleware).forRoutes('*'); // * represent all route
    // consumer.apply(LoggingMiddleware).exclude('coffees').forRoutes('*'); // exclude all /coffees routes
    // consumer
    //   .apply(LoggingMiddleware)
    //   .forRoutes({ path: 'coffees', method: RequestMethod.GET }); // specify GET /coffees routes
  }
}

```

###    Custom Decorator
####    實作
* createParamDecorator 要實作的interface
* ExecutionContext 傳入的http context
```>>
>> /src/common/decorators/protocol.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Protocol = createParamDecorator(
  (defaultValue: string, ctx: ExecutionContext) => {
    console.log({ defaultValue });

    const request = ctx.switchToHttp().getRequest();
    return request.protocol;
  },
);


@Protocol('data')
```

##    OpenAPI Specification
* Document of OpenAPI is vital part of APP
* Guide and expose our API as a SDK(Sofeware Developer Kit)

###    Swagger 
* A Nest tool, help us integrate and automatically generate Open API documentation
* Dependencies
    * Express

    ```
    npm i @nestjs/swagger swagger-ui-express
    ```

    * Fastify

    ```
    npm i @nestjs/swagger fastify-swagger
    ```
![](https://i.imgur.com/TdTTjs5.png)



###    Open API specification
* A language agnostic definition format used to describe a RESTful APIs
* include
    1. Available operations or endpoints
    2. Operation parameters: Input and output for each operation 
    3. Authentication methods
    4. Contact information, license, terms of use, and other information

###    Swagger UI setup
####    Swagger UI Doc and endpoint route
* setup('RoutePathToSwaggerUI', 'APPInstance', 'DocumentObject');
    * 'RoutePathToSwaggerUI': Endpoint to Swagger UI (http://localhost:3000/api)
    * 'APPInstance': App Instance
    * 'DocumentObject': Doc object
```>>
>> /src/main.ts

import ...
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app ...

  // Set OpenAPI specification property
  const options = new DocumentBuilder()
    .setTitle('Ilovecoffee')
    .setDescription('Coffee application')
    .setVersion('1.0.0')
    .build();
  // Create document
  const document = SwaggerModule.createDocument(app, options);
  // setup('RoutePathToSwaggerUI', 'APPInstance', 'DocumentObject');
  SwaggerModule.setup('api', app, document); // UI setup in http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();

```

####    Swagger plugin setup
*    使Swagger可以找到 DTO Schema
*    compilerOptions: 設定加入Plugin
```>>
>> nest-cli.json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions":{
    "__comment__": "Load swagger plugin enable to use specific Decorator",
    "deleteOutDir": true,
    "plugins": ["@nestjs/swagger/plugin"]
  }
}
```
####    PartialType Bug
![](https://i.imgur.com/mjGI0It.png)


*    有些DTO是基於其他DTO的變化
*    更改 PartialType的Lib "@nestjs/mapped-types" => "@nestjs/swagger"

```>>
>> /src/coffees/dto/update-coffee.dto.ts

// CLI >> nest g class coffees/dto/update-coffee.dto --no-spec
// Update property optional

// import { PartialType } from '@nestjs/mapped-types'; // 利用原本的DTO去建立一個內容元素是可選擇使用的新DTO
import { PartialType } from '@nestjs/swagger'; // Insure Swagger UI can get all partial type properties
import { CreateCoffeeDto } from './create-coffee.dto'; // 原本的DTO

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}

```

###    @ApiProperty()

![](https://i.imgur.com/FCbMfc5.png)

* import from @nestjs/swagger
* 提供開發者設定 Property 的 預設值/敘述
```>>
>> /src/coffees/dto/create-coffee.dto.ts

// CLI >> nest g class coffees/dto/create-coffee.dto --no-spec
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCoffeeDto {
  @ApiProperty({ description: 'The name of a coffee.' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The brand of a coffee.' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ example: [] })
  @IsString({ each: true }) // 檢查陣列每一個元素
  readonly flavors: string[];
}

```

###    @ApiResponse()    ＆ @ApiForbiddenResponse()
![](https://i.imgur.com/baMPjF6.png)

* 提供範例輸出

```>>
>> /src/coffees/coffees.controller.ts

import { ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';

@Controller('coffees')
export class CoffeesController {
  constructor(...){}

  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Public()
  @Get()
  findAll(
    ...
  ) {
    ...
  }
}
```

###    @ApiTags()
![](https://i.imgur.com/xXs4qWS.png)


* 更好的統整"相同"的 Route
* 區分"相同" Route 增加可讀性

``` >>
>> /src/coffees/coffees.controller.ts

import { ApiTags } from '@nestjs/swagger';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
  constructor(...){}
  ...
}

```

##      Testing

* Unit test
```
npm run test
```

* Coverage test
```
npm run test:cov
```

* e2e test
```
npm run test:e2e
```
### [Jest Lib](https://docs.nestjs.com/fundamentals/testing)
####    [Jest Doc](https://jestjs.io/docs/getting-started)
* Great error message
* Build-in Mocking utilities
* Reliably run test pararllel

####    class
* Test： 建立與提供"Mock ExecutionContext"，
* TestModule： 測試模組，將實體化參數內的Class，並測試

####    method
* Test.createTestingModule({"Metadata"}) : 相同於在@Module({"Metadata"}){}，依照傳入的Metadata建立物件

####    hook
* describe()
* beforeEach() : **"Setup phase"**， 在所有Test前 執行
    * compile() : 實體化一個TestingModule，成為一個"Mock Application"
    * get()：取得"Mock Application"中的特定物件
* it('desc', func()): 表示一個“單一測試”
    * expect(Obj)
    * toBeDefinded()
* beforeAll() : 
* afterEach() : 
* afterAll() : 


###    Unit test
####    CLI
* 單一
```
npm run test:watch -- coffees.service
```
* 全部
```
npm run test:watch
```

#### Inject Dependencies as Mock
* 訣竅 Service的constructor 中 @Inject(Token) @InjectRepository(Token)
    * Token全部都要在providers:[] 中用CustomProvider實作Mock
* [Utility Type TS DOC](https://www.typescriptlang.org/docs/handbook/utility-types.html)

```>>
>> /src/coffees/coffees.service.spec.ts

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

```

###    e2e test
* 接近真實使用者的使用情況
* 測試每一個“Route”
* **記得把每個檔案import路徑改成“相對路徑”**


####    CLI
*    e2e
```
npm run test:e2e
```

*    detect open handle
```
npx jest 
```

####    hook
* beforeAll(): 只建立App實體一次
    * compile(): 建立實體
    * moduleFixture.createNestApplication(): 建立測試APP實體
    * app.init(): 初始化APP
* afterAll()
    * app.close(): 關閉所有Promise物件，減少OpenHanging的問題
* it('desc', func(supertest.request(){...}))
    * 設定單一測試Route
    * 使用request 模擬使用者request
    * 使用chain的方式設定
    * 例如get()/post()/set('header')
####    app.e2e-spec.ts
```>>
>> /src/test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => { // Change beforeEach to beforeAll, bc we don't want to restart the app for each e2e test
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(); // 一定要建立一個App runtime system
    await app.init();
  });

  // it('route (Method)', func(supertest.request(){...}))
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
```

####    coffees.e2e-spes.ts

#####    package.json (npm script)
* pretest : 在執行test script前執行
* posttest : 在執行test script後執行
```>>
>> /package.json

{
  "name": ...,
  "scripts": {
    ...
    "pretest:e2e": "docker-compose up -d test-db",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "posttest:e2e": "docker-compose stop test-db && docker-compose rm -f test-db"
  },
  dep...
}
```

* jest@28.0.1^ 移除jasmine
```>>
>> /test/coffees/coffees.e2e-spec.ts

import {
  HttpServer,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';

import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { CreateCoffeeDto } from '../../src/coffees/dto/create-coffee.dto';
import { UpdateCoffeeDto } from '../../src/coffees/dto/update-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['Chocolate', 'Vanilla'],
  };

  const expectedPartialCoffee = expect.objectContaining({
    ...coffee,
    flavors: expect.arrayContaining(
      coffee.flavors.map((name) => expect.objectContaining({ name })),
    ),
  });

  let app: INestApplication;
  let httpServer: HttpServer;

  // Method1: use mock object(hard maintain)
  // Method2: use DISK_BASE DB (Diff with real world)
  // Method3: use EXTRA_TESTDB (Recommend)
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({ // use Method3 strategy
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
    httpServer = app.getHttpServer();
  });

  it('Create [POST /]', () => {
    return request(httpServer)
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });

  it('Get All [GET /]', () => {
    return request(httpServer)
      .get('/coffees')
      .then(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
        expect(body[0]).toEqual(expectedPartialCoffee);
      });
  });

  it('Get One [GET /:id]', () => {
    return request(httpServer)
      .get('/coffees/1')
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });

  it('Update One [PATCH /:id]', () => {
    const updatedCoffeeDto: UpdateCoffeeDto = {
      ...coffee,
      name: 'New and Improved Shipwreck Roast',
    };

    return request(httpServer)
      .patch('/coffees/1')
      .send(updatedCoffeeDto)
      .then(({ body }) => {
        expect(body.name).toEqual(updatedCoffeeDto.name);

        return request(httpServer)
          .get('/coffees/1')
          .then(({ body }) => {
            expect(body.name).toEqual(updatedCoffeeDto.name);
          });
      });
  });

  it('Delete One [DELETE /:id]', () => {
    return request(httpServer)
      .delete('/coffees/1')
      .expect(HttpStatus.OK)
      .then(() => {
        return request(httpServer)
          .get('/coffees/1')
          .expect(HttpStatus.NOT_FOUND);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});

```

##    MongoDB

###    Git Checkout branch
* 回到剛建制CRUD前的分支 main
```
git checkout main
```

###    ReBuild
* 因為dist沒有改變，編譯會出問題
* 重新建置編譯
```
npm run build
```

###    Docker-compose.yml
```>>
>> /docker-compose.yml

version: "3"

services:
  db:
    ...
  mongodb:
    image: mongo
    restart: always
    ports:
      - 27017:27017
    environment:
      MONGODB_DATABASE: nest-course
```

###    MongoDB Schema and Document
* MongoDB屬於No SQL，是以Document Mapping
![](https://i.imgur.com/RYusOmT.png)
* 所有資料集(collection)是按照Schema Definition 做區分
![](https://i.imgur.com/J4fcIXS.png)

###    Entity (Schema)
* 所有Schema definition類別都要實作 Document interface
* @Prop() 可以設定預設值 例如 Array[], {default: type, index: true}, 
* SchemaFactory() 產生Schema Instance
```>>
>> /src/coffees/entity/coffees.entity.ts

// Definition of coffee data entity.
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Coffee extends Document {
  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop({ default: 0 })
  recommendation: number;

  @Prop([String])
  flavors: string[];
}

export const CoffeesSchema = SchemaFactory.createForClass(Coffee);
// DefinitionsFactoryClass 建立一列（raws）的 Schema instances

>> /src/events/entities/event.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Event extends mongoose.Document {
  @Prop()
  type: string;

  // @Prop({ index: true })
  name: string;

  // 如果Schema的prop 有any type， 使用Mixed，讓所有東西通過檢查
  @Prop(mongoose.SchemaTypes.Mixed)
  payload: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
// 設定name為index 並且為升冪排列
// 設定type為index 並且為降冪排列
EventSchema.index({ name: 1, type: -1 });

```

###   Connect  MongoDB

####    AppModule imports MongoModule
* forRoot() 連線到DB，整個APP只需要連一次
```>> 
>> /src/app.module.ts

import ...
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://__HOST__:port/DB_NAME'),
  ],
  controllers: [...],
  providers: [...],
})
export class AppModule {}
```
####    Module imports model
* forFeature() 連線到特定的Document 
* 使用Schema token 
```
{
 name: schema.name, 
 schema: SchemaInstance
}
```
```>>
>> /src/coffees/coffees.module.ts

import ...
import { MongooseModule } from '@nestjs/mongoose';
import { Coffee, CoffeesSchema } from './entities/coffee.entity';
import { Event, EventSchema } from 'src/events/entities/event.entity.ts';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coffee.name, schema: CoffeesSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [...],
  providers: [...],
})
export class CoffeesModule {}

```

####    Service Inject Model
* @InjectModel(Schema.name) :Model\<Schema>

```>>
>> /src/coffees/coffees.service.ts

import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { Coffee } from './entities/coffee.entity';
import { Event } from 'src/events/entities/event.entity.ts';

import ...

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}   
  
  business logic..
}
```
##    Service CRUD
* exec() 
* save()
* remove()

```>>
>> /src/coffees/coffees.service.ts

import ...

@Injectable()
export class CoffeesService{
  constructor(
      @InjectModel() ...
  ){}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeModel.findById({ _id: id }).exec();
    if (!coffee) {
      // If Not Found
      throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const existingCoffee = await this.coffeeModel
      .findByIdAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true }) // findOneAndUpdate({QUERY_ID},{MONGOOSE_UPDATE_OBJ},{AFTER_FINISH_ACTION} )
      .exec();
    if (!existingCoffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return existingCoffee;
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    return coffee.remove();
  }
}

```

##    Pagination-query
* Limit 限制一次Query多少資料量
* Offset 跳過多少資料量
###    pagination-query dto
* 使用class-validtor 檢查資料
```>>
>> /src/common/dto/pagination-query.dto.ts

import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional() // this property is optional
  @IsPositive() // this property must be a nature number
  limit: number;

  @IsOptional()
  @IsPositive()
  offset: number;
}
```
###    實作
```>> 
>> /src/coffees/coffees.service.ts

import...

@Injectable()
export class CoffeesService{
  constructor(...){}
  
  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }
}

```
##    Transaction
* 如同Postgres，Event 一般來說要以獨立Module實作
* 步驟
    1. 建立session連線
    2. 開始transactoin
    3. try transaction logic
    4. commit transaction
    5. catch(err) abortTransaction()
    6. finally endSession() 
```>> 
>> /src/coffees/coffee.service.ts

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  // CRUD logic ...
  
  async recommendCoffee(coffee: Coffee) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      coffee.recommendation++;
      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId: coffee.id },
      });
      await recommendEvent.save({ session });
      await coffee.save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction(); // Rollback the transaction
    } finally {
      session.endSession();
    }
  }
}
```

##    指令Note
```
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod


## Test

bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# Nest-cli-command:

npm run start:dev // start dev module

nest g controller/service/module path/path --dry-run // 只顯示結果，常測試檔案名有無衝突

nest g controller/service/module _name_ // Create nest file
nest g class path/{create/update}-{name}.dto --no-spec // Create DTO file
nest g class path/{name}.entity --no-spec // Create new entity file, Need to rename module name

# docker-compose command: 

docker-compose up -d // Start up all container
docker-compose up db -d // Only start up db container
docker-compose down // Close all container


# docker exec container-compose

docker exec -it __Pid__ bash

# Postgers

psql -U postgres 


DB Migration: (TypeOrm)
* Migration 可以更輕鬆修改欄位名稱，避免修改時欄位資料消失或錯誤

#preprocessing
npm run build // build whole project to dist folder

npx typeorm migration:create -n _file_name_ // Create migration file
npx typeorm migration:run // Do update
npx typeorm migration:revert // Undo update

npx typeorm migration:generate -n _file_name_ // auto catch schema changed and generate a particular migration file

```
