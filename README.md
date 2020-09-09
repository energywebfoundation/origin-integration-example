<h1 align="center">
  <br>
  <a href="https://www.energyweb.org/"><img src="https://www.energyweb.org/wp-content/uploads/2019/04/logo-brand.png" alt="EnergyWeb" width="150"></a>
  <br>
  EnergyWeb Origin
  <br>
  <br>
</h1>

Welcome to the Origin SDK integration tutorial. We will guide you step-by-step on how to: 
- 🏗 create the structure and install tooling of the example project
- 🎨 configure and customize your Origin based integration
- 🚀 launch your API and UI services using Origin SDK

Origin SDK repository https://github.com/energywebfoundation/origin

## Preparations

Our example integration with Origin SDK will use the Lerna monorepo structure to host 2 projects, API and UI.

Let's start with installing lerna tool:

`yarn global add lerna`

and initializing the basic repo structure

`lerna init`

as an result we should end up with such a project structure

```
├── LICENSE
├── README.md
├── coverage
├── lerna.json
├── package.json
└── packages
```

Next let's edit `lerna.json` file and add those lines which will setup lerna to use Yarn workspaces capabilities

```json
"npmClient": "yarn",
"useWorkspaces": true
```

as an result our `lerna.json` should look like

```json
{
  "packages": ["packages/*"],
  "version": "0.0.0",
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

Since we want to take an advantage of `workspaces` feature of Yarn we need to modify that `package.json` and add corresponding directives

```json
{
  "name": "root",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

## Origin API project using Origin SDK

### Project setup

Let's now create an package for hosting Origin SDK API based project.

```cmd
mkdir packages/origin-api
cd packages/origin-api
yarn init -y
```

which generates `package.json` with such an content in our packages directory

```json
{
  "name": "origin-api",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT"
}
```

and our project structure should look like

```
├── LICENSE
├── README.md
├── coverage
├── lerna.json
├── package.json
└── packages
    └── origin-api
        └── package.json
```

### Typescript

All Origin SDK packages are written using Typescript, this allows us to deliver types definitions together with JS code inside the NPM packages.

Our tutorial will utilize Typescript as tool of choice, as such this is not a requirement to build Origin based project, still we strongly recommend using it.

Make sure you are in

```bash
cd packages/origin-api
yarn add typescript --dev
touch tsconfig.json
```

Paste this content to your `tsconfig.json` file

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es2017",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true
  },
  "exclude": ["node_modules", "dist"]
}
```

Next, let's setup basic Typescript setting and yarn scripts

- create the `src` folder in `origin-api` project
- add `"include": ["src/**/*"]` to your `tsconfig.json` file
- add `"scripts": { "build": "tsc" }` to your `package.json` file

### Nest.JS

Origin SDK API packages are designed as composable Nest.JS modules, this allows to pick and customize Origin integrations by providing custom implementations. Before we start including existing Origin API modules we need to install Nest.JS framework in our `origin-api` project.

```
yarn add @nestjs/cli @nestjs/common @nestjs/core @nestjs/config @nestjs/typeorm @nestjs/platform-express reflect-metadata
```

Next add the start script to your `origin-api/package.json`

```json
"scripts": {
    "build": "tsc",
    "start": "nest start -p tsconfig.json"
  },
```

Next create initial `app.module.ts` and `main.ts` files as an entry place for Nest.JS project

`origin-api/main.ts`

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("api");

  await app.listen(3000);
}
bootstrap();
```

`origin-api/app.module.ts`

```typescript
import { Module } from "@nestjs/common";

@Module({})
export class AppModule {}
```

After adding those file you can start this empty API project by

`yarn start` results in

```
$ nest start -p tsconfig.json
[Nest] 56219   - 09/04/2020, 10:30:17 AM   [NestFactory] Starting Nest application...
[Nest] 56219   - 09/04/2020, 10:30:17 AM   [InstanceLoader] AppModule dependencies initialized +11ms
[Nest] 56219   - 09/04/2020, 10:30:17 AM   [NestApplication] Nest application successfully started +5ms
```

### Origin SDK

#### Installing SDK packages

Let's now add stable Origin SDK NPM packages as our runtime dependencies

`yarn add @energyweb/origin-backend @energyweb/exchange`

Next we need to edit our `app.module.ts` file to include Origin SDK API modules

```typescript
import {
  AppModule as ExchangeModule,
  entities as ExchangeEntities,
} from "@energyweb/exchange";
import {
  AppModule as OriginBackendModule,
  entities as OriginBackendEntities,
} from "@energyweb/origin-backend";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST ?? "localhost",
      port: Number(process.env.DB_PORT) ?? 5432,
      username: process.env.DB_USERNAME ?? "postgres",
      password: process.env.DB_PASSWORD ?? "postgres",
      database: process.env.DB_DATABASE ?? "origin",
      entities: [...OriginBackendEntities, ...ExchangeEntities],
      logging: ["info"],
    }),
    OriginBackendModule.register(null),
    ExchangeModule,
  ],
})
export class AppModule {}
```

Let's now explain the most important changes that happened here step by step:

1. Exchange modules

```typescript
import {
  AppModule as ExchangeModule,
  entities as ExchangeEntities,
} from "@energyweb/exchange";
```

Imports top-level `AppModule` and all `entities` from `@energyweb/exchange` packages [https://github.com/energywebfoundation/origin/blob/release/packages/exchange/src/app.module.ts]

2. Origin-backend modules

```typescript
import {
  AppModule as OriginBackendModule,
  entities as OriginBackendEntities,
} from "@energyweb/origin-backend";
```

Same as above but from `@energyweb/origin-backend` package.

3. ORM configuration

Origin API SDK is built using TypeORM framework, this allow us to abstract the DB technology and DB handle migrations.

```typescript
TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST ?? "localhost",
      port: Number(process.env.DB_PORT) ?? 5432,
      username: process.env.DB_USERNAME ?? "postgres",
      password: process.env.DB_PASSWORD ?? "postgres",
      database: process.env.DB_DATABASE ?? "origin",
      entities: [...OriginBackendEntities, ...ExchangeEntities],
      logging: ["info"],
    }),
```

#### Database installation and configuration

The DB of choice used by Origin SDK is Postgres SQL, while it's possible to use other DB to run Origin we strongly recommend to use Postgres SQL.

We recommend using Docker to install provision Postgres SQL for Origin API. Script below requires `psql` tool for DB creation process, follow this guide to install it on your OS of choice https://blog.timescale.com/tutorials/how-to-install-psql-on-mac-ubuntu-debian-windows/

```cmd
docker pull postgres
docker run --name origin-postgres -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE origin"
```

#### Origin configuration and migrations

1. Blockchain endpoint configuration

Some of the Origin SDK component requires a working WEB3 endpoint, local blockchain, Volta or EWC. For our tutorial we will use local in-memory blockchain run using Ganache CLI tool.

In order to use any existing WEB3 endpoint set the `.env` configuration entry `WEB3` to that address:

for e.g to use Volta chain

`.env.volta.example`

```
WEB3=https://volta-rpc.energyweb.org
```

for our tutorial we will use

`.env`

```
WEB3=http://localhost:8545
```

Let's now install `ganache-cli` tool

`yarn global add ganache-cli`

and start it with our predefined mnemonic

`ganache-cli -d -m habit sure critic toe surprise all tuition sister clay make steak bronze`

we should now see our local blockchain running under `http://localhost:8545` endpoint

```
Ganache CLI v6.10.1 (ganache-core: 2.11.2)

Available Accounts
==================
(0) 0xa007C764C2fBE2D22BD7Ec9691776C1bd64F3EA1 (100 ETH)
(1) 0x3c77B6DC24788fD41D2d9919675D9Bdd6c282D13 (100 ETH)
(2) 0x59191Dee86a8a8575128BC456B9c1246d3e16fB1 (100 ETH)
(3) 0xB8ce2809E5bB325a28eC5868Dab64F93844b3fAC (100 ETH)
(4) 0x4CD61C4BBdbbE4948F1B5b45e75b615cDB0Ba001 (100 ETH)
(5) 0x590Ae6fc6d2BA17f20b6F4568aDf147Ae8E9d305 (100 ETH)
(6) 0xB20295E78CAa8Ac50623d6e23fB59012A6bDF167 (100 ETH)
(7) 0x63e6f1ec46561F2A5bD7173D37c9923A4Ab7b4e0 (100 ETH)
(8) 0x77489d2a2ce77F0e1E988BD03fC0A9bc4cBc93d6 (100 ETH)
(9) 0xd32230C11e77174Ca374394a60DE56f20265272C (100 ETH)

Private Keys
==================
(0) 0xf50b49b0c61bb9dcb9905df092125d2534009d30fa48545cb6aceef4b561881a
(1) 0xd90ec411718d76a4dec5a574f80f17fca473856ffeba699b460f62d9fa718a84
(2) 0x689839c3525a880f76fe17bfd52903a57e962bb4e7b866a43bb9b80d2b9e4df9
(3) 0xbd4f9b21a6ada3a1cd4a02e5025b23ba88e866c846bb4ddc2b302feef3894eb1
(4) 0x3bc479dd21700b9a88b83e5ba059d971ff7f99f46dedbe2aa6b2469cd5f4cb18
(5) 0x3bb43485298e5bcc61fac5fdb7097f93015415510f8d46a7d121f4968f0dd7c6
(6) 0x268d81accf547a799983e5176ac297a883009aa53dd7abd0f2fd313e29335556
(7) 0xd5ecac5ec89bcbae422db41a984a77c14a199119bcea688e5113eee3313e3cf0
(8) 0xec40f9349de97d3d4f645707a35877d3c505d7606ebcdbd57a2913c312c466d4
(9) 0xee06c783297f054553afb8d674490857add24faba31f17d345680d744c0d0199
```

2. Private keys configuration

Exchange and Issuer modules requires and private keys of the funded accounts to be provided in the `.env` file. In our tutorial we are going to use ganache-cli account with index 0 for the purpose.

`0xf50b49b0c61bb9dcb9905df092125d2534009d30fa48545cb6aceef4b561881a` with corresponding address `0xa007C764C2fBE2D22BD7Ec9691776C1bd64F3EA1`

`.env`

```
EXCHANGE_ACCOUNT_DEPLOYER_PRIV=0xf50b49b0c61bb9dcb9905df092125d2534009d30fa48545cb6aceef4b561881a
EXCHANGE_WALLET_PRIV=0xf50b49b0c61bb9dcb9905df092125d2534009d30fa48545cb6aceef4b561881a
EXCHANGE_WALLET_PUB=0xa007C764C2fBE2D22BD7Ec9691776C1bd64F3EA1
DEPLOY_KEY=0xf50b49b0c61bb9dcb9905df092125d2534009d30fa48545cb6aceef4b561881a
WEB3=http://localhost:8545
```

Note: This tutorial uses the same account to serve as an issuer contract owner `DEPLOY_KEY` and for exchange related operations, in the production based environments these two responsibilities have to be split.

3. Seed data and DB migrations

Previous steps provided the ground work for our next step which would deploy and create initial configuration that allow us to run Origin API.

First we need to add `@energyweb/migrations` and `typeorm` package to our main `package.json` file:

```bash
cd ../..
yarn add @energyweb/migrations
yarn add typeorm --dev
```

Next, let's add those scripts `typeorm:migrate` script to our main `package.json` file:

`package.json`

```json
{
  "name": "root",
  "private": true,
  "devDependencies": {
    "lerna": "^3.17.0",
    "typeorm": "^0.2.25"
  },
  "dependencies": {
    "@energyweb/migrations": "^3.1.10"
  },
  "scripts": {
    "typeorm:migrate": "typeorm migration:run --config packages/origin-api/node_modules/@energyweb/exchange/dist/js/ormconfig.js && typeorm migration:run --config packages/origin-api/node_modules/@energyweb/origin-backend/dist/js/ormconfig.js"
  }
}
```

We can now run the DB migration script for test:

```
yarn typeorm:migrate
```

as a result we would see the DB creating SQL scripts executed and that ends similar to

```
...
query: ALTER TABLE "bundle" ADD "isCancelled" boolean NOT NULL
query: INSERT INTO "migrations_exchange"("timestamp", "name") VALUES ($1, $2) -- PARAMETERS: [1590407732107,"Bundles1590407732107"]
Migration Bundles1590407732107 has been executed successfully.
query: COMMIT
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = current_schema() AND "table_name" = 'migrations_backend'
query: SELECT * FROM "migrations_backend" "migrations_backend" ORDER BY "id" DESC
No migrations are pending
✨  Done in 1.75s.
```

After having DB migrations script done we need to setup a basic markets and issuers information required to run Origin.

Let's create `config` folder with 2 files inside

`demo-config.json`

```json
{
  "complianceStandard": "REC",
  "currencies": ["USD"],
  "externalDeviceIdTypes": [
    { "type": "Real-time Generation ID" },
    { "type": "Issuer ID", "autogenerated": true }
  ],
  "countryName": "United States of America",
  "regions": {
    "Delaware": ["Delaware"],
    "Illinois": ["Illinois"],
    "Indiana": ["Indiana"],
    "Kentucky": ["Kentucky"],
    "Maryland": ["Maryland"],
    "Michigan": ["Michigan"],
    "New Jersey": ["New Jersey"],
    "North Carolina": ["North Carolina"],
    "Ohio": ["Ohio"],
    "Pennsylvania": ["Pennsylvania"],
    "Tennessee": ["Tennessee"],
    "Virginia": ["Virginia"],
    "West Virginia": ["West Virginia"],
    "District of Columbia": ["District of Columbia"]
  },
  "deviceTypes": [
    ["Solar"],
    ["Solar", "Photovoltaic"],
    ["Solar", "Photovoltaic", "Roof mounted"],
    ["Solar", "Photovoltaic", "Ground mounted"],
    ["Solar", "Photovoltaic", "Classic silicon"],
    ["Solar", "Concentration"],
    ["Wind"],
    ["Wind", "Onshore"],
    ["Wind", "Offshore"],
    ["Hydro-electric Head"],
    ["Hydro-electric Head", "Run-of-river head installation"],
    ["Hydro-electric Head", "Storage head installation"],
    ["Hydro-electric Head", "Pure pumped storage head installation"],
    ["Hydro-electric Head", "Mixed pumped storage head"],
    ["Marine"],
    ["Marine", "Tidal"],
    ["Marine", "Tidal", "Inshore"],
    ["Marine", "Tidal", "Offshore"],
    ["Marine", "Wave"],
    ["Marine", "Wave", "Onshore"],
    ["Marine", "Wave", "Offshore"],
    ["Marine", "Currents"],
    ["Marine", "Pressure"],
    ["Marine", "Thermal"],
    ["Solid"],
    ["Solid", "Muncipal waste"],
    ["Solid", "Muncipal waste", "Biogenic"],
    ["Solid", "Industrial and commercial waste"],
    ["Solid", "Industrial and commercial waste", "Biogenic"],
    ["Solid", "Wood"],
    ["Solid", "Wood", "Forestry products"],
    ["Solid", "Wood", "Forestry by-products & waste"],
    ["Solid", "Animal fats"],
    ["Solid", "Biomass from agriculture"],
    ["Solid", "Biomass from agriculture", "Agricultural products"],
    ["Solid", "Biomass from agriculture", "Agricultural by-products & waste"],
    ["Liquid"],
    ["Liquid", "Municipal biodegradable waste"],
    ["Liquid", "Black liquor"],
    ["Liquid", "Pure plant oil"],
    ["Liquid", "Waste plant oil"],
    ["Liquid", "Refined vegetable oil"],
    ["Liquid", "Refined vegetable oil", "Biodiesel (mono-alkyl ester)"],
    ["Liquid", "Refined vegetable oil", "Biogasoline (C6-C12 hydrocarbon)"],
    ["Gaseous"],
    ["Gaseous", "Landfill gas"],
    ["Gaseous", "Sewage gas"],
    ["Gaseous", "Agricultural gas"],
    ["Gaseous", "Agricultural gas", "Animal manure"],
    ["Gaseous", "Agricultural gas", "Energy crops"],
    ["Gaseous", "Gas from organic waste digestion"],
    ["Gaseous", "Process gas"],
    ["Gaseous", "Process gas", "Biogenic"],
    ["Thermal"],
    ["Thermal", "Internal combustion engine"],
    ["Thermal", "Internal combustion engine", "Non CHP"],
    ["Thermal", "Internal combustion engine", "CHP"],
    ["Thermal", "Steam turbine with condensation turbine"],
    ["Thermal", "Steam turbine with condensation turbine", "Non CHP"]
  ]
}
```

`seed.sql`

```sql
/*
 ORGANIZATIONS
 */
INSERT INTO public.organization ("createdAt", "updatedAt", id, "activeCountries", code, name, contact, telephone, email, address, shareholders, "ceoPassportNumber", "ceoName", "companyNumber", "vatNumber", postcode, "headquartersCountry", country, "businessTypeSelect", "businessTypeInput", "yearOfRegistration", "numberOfEmployees", website, status)
  VALUES ('2020-03-30 09:55:25.962333+02', '2020-03-30 09:55:25.962333+02', 1, '[236]', '1', 'Issuer Organization', 'Contact', '1', 'issuer@example.com', 'Address', '1', '1', 'CEO name', '', 'XY123456', '1', '236', '236', 'Private individual', '', '2020', '1', 'http://example.com', '2');

INSERT INTO public.organization ("createdAt", "updatedAt", id, "activeCountries", code, name, contact, telephone, email, address, shareholders, "ceoPassportNumber", "ceoName", "companyNumber", "vatNumber", postcode, "headquartersCountry", country, "businessTypeSelect", "businessTypeInput", "yearOfRegistration", "numberOfEmployees", website, status)
  VALUES ('2020-03-30 09:55:25.962333+02', '2020-03-30 09:55:25.962333+02', 2, '[236]', '1', 'Trader Organization', 'Contact', '1', 'trader@example.com', 'Address', '1', '1', 'CEO name', '', 'XY123456', '1', '236', '236', 'Private individual', '', '2020', '1', 'http://example.com', '2');


/*
 USERS
 */
INSERT INTO public. "user" ("createdAt", "updatedAt", id, title, "firstName", "lastName", email, telephone, PASSWORD, "blockchainAccountAddress", "blockchainAccountSignedMessage", notifications, rights, "organizationId", status, "kycStatus")
  VALUES ('2020-03-30 10:08:33.510625+02', '2020-03-30 10:08:33.652639+02', 1, 'Mr', 'Issuer', 'Surname', 'issuer@example.com', '111-111-111', '$2a$08$KG7OAbLQPCRCNXiw9veGMeCuH8eD/HmxV8CMZjaFr3QebXR4gRCD.', '', '', 'f', 8, '1', '1', '1');

INSERT INTO public. "user" ("createdAt", "updatedAt", id, title, "firstName", "lastName", email, telephone, PASSWORD, "blockchainAccountAddress", "blockchainAccountSignedMessage", notifications, rights, "organizationId", status, "kycStatus")
  VALUES ('2020-03-30 10:08:33.510625+02', '2020-03-30 10:08:33.652639+02', 2, 'Mr', 'Trader', 'USA', 'organization-admin@example.com', '111-111-111', '$2a$08$j8LnGtFdbTfKN5F.0InfdO2gxMWXHbrjWvRziCIl0lRj.kxOKJ/b6', '', '', 'f', 16, '2', '1', '1');

SELECT
  setval(pg_get_serial_sequence('public.user', 'id'), (
      SELECT
        MAX("id")
      FROM public.user) + 1);

SELECT
  setval(pg_get_serial_sequence('public.organization', 'id'), (
      SELECT
        MAX("id")
      FROM public.organization) + 1);


```

The script above creates two organizations:

- Issuer organization with admin account `issuer@example.com` and password `test` and system role of Issuer
- Trader organization with admin account `organization-admin@example.com` and password `test` and system role of OrganizationAdmin

Next we need to add another `script` to our `package.json` in order to run all migrations:

`package.json`

```json
{
  "name": "root",
  "private": true,
  "devDependencies": {
    "lerna": "^3.17.0",
    "typeorm": "^0.2.25"
  },
  "dependencies": {
    "@energyweb/migrations": "^3.1.10"
  },
  "scripts": {
    "typeorm:migrate": "typeorm migration:run --config packages/origin-api/node_modules/@energyweb/exchange/dist/js/ormconfig.js && typeorm migration:run --config packages/origin-api/node_modules/@energyweb/origin-backend/dist/js/ormconfig.js",
    "migrate:demo": "yarn typeorm:migrate && origin-migrations -e .env -c config/demo-config.json -s config/seed.sql"
  }
}
```

Let's now run the newly added migration script:

`yarn migrate:demo`

the expected result is:

```bash
$ yarn typeorm:migrate && origin-migrations -e .env -c config/demo-config.json -s config/seed.sql
$ typeorm migration:run --config packages/origin-api/node_modules/@energyweb/exchange/dist/js/ormconfig.js && typeorm migration:run --config packages/origin-api/node_modules/@energyweb/origin-backend/dist/js/ormconfig.js
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = current_schema() AND "table_name" = 'migrations_exchange'
query: SELECT * FROM "migrations_exchange" "migrations_exchange" ORDER BY "id" DESC
No migrations are pending
query: SELECT * FROM "information_schema"."tables" WHERE "table_schema" = current_schema() AND "table_name" = 'migrations_backend'
query: SELECT * FROM "migrations_backend" "migrations_backend" ORDER BY "id" DESC
No migrations are pending
info: Connected to localhost:5432 - database origin
info: Is first migration: true
info: Deploying contracts to http://localhost:8545...
Registry created at 0x4b05816A94cF40A395867EAecA91395D6fEE161A
Issuer v0.1 created at 0x4C409B7a9235a049AB0daf202fA821c40459a98e
info: Saving configuration...
```

4. Other Origin configuration items

We need to point the configuration module to our `.env` file in `origin-api/src/app.module.ts` file

```typescript
import {
  AppModule as ExchangeModule,
  entities as ExchangeEntities,
} from "@energyweb/exchange";
import {
  AppModule as OriginBackendModule,
  entities as OriginBackendEntities,
} from "@energyweb/origin-backend";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: "../../.env",
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST ?? "localhost",
      port: Number(process.env.DB_PORT) ?? 5432,
      username: process.env.DB_USERNAME ?? "postgres",
      password: process.env.DB_PASSWORD ?? "postgres",
      database: process.env.DB_DATABASE ?? "origin",
      entities: [...OriginBackendEntities, ...ExchangeEntities],
      logging: ["info"],
    }),
    OriginBackendModule.register(null),
    ExchangeModule,
  ],
})
export class AppModule {}
```

and the remaining configuration items to our `.env` before we can start an API

`.env`

```
EXCHANGE_ACCOUNT_DEPLOYER_PRIV=0xf50b49b0c61bb9dcb9905df092125d2534009d30fa48545cb6aceef4b561881a
EXCHANGE_WALLET_PRIV=0xf50b49b0c61bb9dcb9905df092125d2534009d30fa48545cb6aceef4b561881a
EXCHANGE_WALLET_PUB=0xa007C764C2fBE2D22BD7Ec9691776C1bd64F3EA1
DEPLOY_KEY=0xf50b49b0c61bb9dcb9905df092125d2534009d30fa48545cb6aceef4b561881a
WEB3=http://localhost:8545

ISSUER_ID=Issuer ID
EXCHANGE_PRICE_STRATEGY=0
ENERGY_PER_UNIT=1000000
DEVICE_PROPERTIES_ENABLED=LOCATION
DEFAULT_ENERGY_IN_BASE_UNIT=1

JWT_EXPIRY_TIME=7 days
JWT_SECRET=3#9iB80U4EjUkyE$
```

#### Running API endpoint

Finally we can run our API project by using this command:

`lerna run start --stream`

the window output should be similar to:

```
info cli using local version of lerna
lerna notice cli v3.22.1
lerna info Executing command in 1 package: "yarn run start"
origin-api: yarn run v1.22.4
origin-api: $ nest start -p tsconfig.json
origin-api: [Nest] 87813   - 09/04/2020, 1:59:32 PM   [NestFactory] Starting Nest application...
origin-api: [Nest] 87813   - 09/04/2020, 1:59:33 PM   [InstanceLoader] AppModule dependencies initialized +100ms
origin-api: [Nest] 87813   - 09/04/2020, 1:59:33 PM   [InstanceLoader] TypeOrmModule dependencies initialized +0ms
...
...
...
...
origin-api: [Nest] 87813   - 09/04/2020, 1:59:33 PM   [MatchingEngineService] Submitting 0 existing orders
origin-api: [Nest] 87813   - 09/04/2020, 1:59:33 PM   [CertificationRequestWatcherService] onModuleInit
origin-api: [Nest] 87813   - 09/04/2020, 1:59:33 PM   [NestApplication] Nest application successfully started +187ms
```

#### Testing API calls

Now while having API endpoint running we should be able to successfully login into our API using credentials setup in seed.sql file:

```bash
curl --location --request POST 'http://localhost:3000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{"username": "issuer@example.com", "password": "test"}'
```


## UI Setup using Origin UI Core

### Project setup

Let's now create another package for hosting our Origin UI based project.

```cmd
mkdir packages/ui
cd packages/ui
yarn init -y
```

Create the TypeScript configuration file.

```bash
yarn add typescript --dev
touch tsconfig.json
```

With the contents:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es2017",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true
  },
  "exclude": ["node_modules", "dist"]
}
```

Let's also create the folder structure and install all the necessary dependencies to run the UI:

```bash
mkdir packages/ui/src

cd packages/ui

yarn add -D react react-dom @energyweb/origin-ui-core webpack-dev-server webpack-cli @storybook/addon-knobs copy-webpack-plugin css-loader fork-ts-checker-webpack-plugin html-webpack-plugin node-sass react react-dom sass-loader style-loader ts-loader url-loader
```

We need to install React and React DOM, along with the [Origin UI core](https://github.com/energywebfoundation/origin/tree/master/packages/origin-ui-core) package from the Energy Web Foundation which we will extend. Webpack is needed to package the application.

Once we have all the required packages installed, we need to initialize the our UI. Create 2 new files file:

`packages/ui/src/index.tsx`
```tsx
import { render } from 'react-dom';
import React from 'react';

import {
    Origin,
    OriginConfigurationProvider,
    createOriginConfiguration
} from '@energyweb/origin-ui-core';

const originConfiguration = createOriginConfiguration({
    // Override the Origin configuration here
});

render(
    <OriginConfigurationProvider value={originConfiguration}>
        <Origin />
    </OriginConfigurationProvider>,
    document.getElementById('root')
);
```

`packages/ui/src/index.ejs`
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title><%= htmlWebpackPlugin.options.title %></title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Rubik">
    <base href="/" />
  </head>
  <body>
    <div id="root"></div>
    <div class="hero-bg"></div>
  </body>
</html>
```

Let's now initialize our Webpack configuration

`packages/ui/webpack/dev.config.js`
```js
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    entry: './src/index.tsx',

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    devServer: {
        port: 3000,
        compress: true,
        historyApiFallback: true
    },

    plugins: [
        new ExtractTextPlugin({
            filename: 'styles.css',
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            title: 'Origin',
            template: './src/index.ejs',
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        }),
        new CopyWebpackPlugin([{ from: 'env-config.js', to: 'env-config.js' }]),
        new ForkTsCheckerWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader' // translates CSS into CommonJS
                    },
                    {
                        loader: 'sass-loader' // compiles Sass to CSS
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: 'pre', test: /\.js\.map$/, loader: 'source-map-loader' },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: '../tsconfig.json',
                    projectReferences: true,
                    transpileOnly: true
                }
            }
        ]
    },

    node: {
        fs: 'empty'
    },

    externals: [
        {
            xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
        }
    ]
};
```

Now let's configure our UI .env file. Create a new file in the UI package:

`packages/ui/env-config.js`
```js
{
    "MODE": "dev",
    "WEB3": "http://localhost:8545",
    "BACKEND_URL": "http://localhost",
    "BACKEND_PORT": "3030",
    "BLOCKCHAIN_EXPLORER_URL": "",
    "REGISTRATION_MESSAGE_TO_SIGN": "I register as an Origin user",
    "ISSUER_ID": "Issuer ID"
}
```

We should now be able to start our UI application. Run the following command to start the Origin UI:
```bash
cd packages/ui
npx webpack-dev-server --config webpack/dev.config.js --watch
```
