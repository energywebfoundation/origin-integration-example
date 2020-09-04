# origin-integration-example

An example Origin SDK integration project

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

```
"npmClient": "yarn",
"useWorkspaces": true
```

as an result our `lerna.json` should look like

```
{
  "packages": ["packages/*"],
  "version": "0.0.0",
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

## Origin API project using Origin SDK

### Project setup

Let's now create an package for hosting Origin SDK API based project.

```
cd packages
mkdir origin-api
cd origin-api
yarn init -y
```

which generates `package.json` with such an content in our packages directory

```
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

```
cd packages/origin-api
yarn add typescript --dev
touch tsconfig.json
```

Paste this content to your `tsconfig.json` file

```
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

```
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

### Integrating Origin SDK

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

The DB of choice used by Origin SDK is Postgres SQL, while it's possible to use other DB to run Origin we strongly recommend to use Postgres SQL.

4. Postgres DB installation and configuration

We recommend using Docker to install provision Postgres SQL for Origin API. Script below requires `psql` tool for DB creation process, follow this guide to install it on your OS of choice https://blog.timescale.com/tutorials/how-to-install-psql-on-mac-ubuntu-debian-windows/

```bash
docker pull postgres
docker run --name origin-postgres -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres
psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE origin"
```
