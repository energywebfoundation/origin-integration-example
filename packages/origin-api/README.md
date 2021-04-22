# EnergyWeb Origin API example implementation

In this example we will setup Origin API, using provided components.

Frontend uses typical React stack: `react` itself, `react-router-dom` (`connected-react-router`), `redux` (`react-redux`) and `redux-saga`.
Translations are based on `i18next` (`react-i18next`). All of these libraries will be necessary to run @energyweb components.

Backend uses typical [NestJS](https://nestjs.com/) stack: `nestjs` itself, `typeorm` (as ORM) and `@nestjs/platform-express` (as HTTP adapter).

For the database Origin SDK uses PostgreSQL. It is possible to use other databases as well, but PostgreSQL is strongly recommended.

The language of choice is TypeScript, but plain JavaScript works just as well.
The package manager of choice is `yarn`, but `npm` works the same.

Complete example can be found in the source code, so make sure to compare this tutorial with what's actually in the source code.
This README covers crucial requirements of the setup.

**If you want, you may just copy the code, and build on top of it. Then You can use README to explain "the why"**

## Database setup

You can setup PostgreSQL (psql) using any tutorial for your operating system **or** you can use [Docker](https://www.docker.com/).

Docker allows to run containerized applications, and psql is one of them. We recommend to use Docker.

```sh
# Either create of start database container, if it already exists
docker start origin-postgres || docker run --name origin-postgres -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres

# Create database inside psql
docker exec origin-postgres bash -c "psql -U postgres -c \"CREATE DATABASE origin\""
```

You can verify if it's working correctly by running

```sh
docker ps --filter name=origin-postgres
```

## API setup

### Installing dependencies

Please use our [package.json](./package.json) to setup dependencies. This way you use correct set of modules.

### Prepare NestJS application

You can follow [official tutorial](https://docs.nestjs.com/), and you are good to go.

### Adding Origin SDK

Start by importing TypeORM module into Nest module. For configuration use values, that match you database. In this example that would be:

```js
imports: [
  TypeOrmModule.forRoot({
    type: "postgres",
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT) ?? 5432,
    username: process.env.DB_USERNAME ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    database: process.env.DB_DATABASE ?? "origin",
  }),
]
```

Now, you need to include entities, that TypeORM will use. Origin SDK exposes few:

```js
import { entities as ExchangeEntities } from "@energyweb/exchange";
import { entities as OriginBackendEntities } from "@energyweb/origin-backend";
import { entities as IssuerEntities } from "@energyweb/issuer-api";

...
imports: [
  TypeOrmModule.forRoot({
    ...
    entities: [...OriginBackendEntities, ...ExchangeEntities, ...IssuerEntities],
  }),
]
...
```

Now if you start the application, you should have the connection setup. If there is any problem with a connection to database, application won't start.

Then, you should import following modules:

```js
import { AppModule as ExchangeModule } from "@energyweb/exchange";
import { AppModule as ExchangeIrecModule } from "@energyweb/exchange-irec";
import {
  AppModule as OriginBackendModule,
  OrganizationModule,
  UserModule,
} from "@energyweb/origin-backend";
import { AppModule as IssuerModule } from "@energyweb/issuer-api";

...
imports: [
  ...,
  OriginBackendModule,
  OrganizationModule,
  ExchangeModule,
  ExchangeIrecModule,
  UserModule,
  IntegrationModule,
  IssuerModule
]
```

Now, the application may not launch until you add configuration.

### Configuration

It's possible to use `@nestjs/config` module for configuration.

```js
import { ConfigModule } from "@nestjs/config";

...
imports: [
  ...,
  ConfigModule.forRoot({
    envFilePath: "../../.env",
    isGlobal: true,
  }),
  ...
]
...
```

Now, You have to have `.env` file. Note the `envFilePath` above. It's relative to `package.json`.

The `.env` file can be created by copying [.env.example](../../.env.example) file.

## Blockchain

Now you need to connect to a blockchain. To setup local one, you can use `ganache-cli` tool:

```
yarn add ganache-cli
```

And now start it with our predefined mnemonic:

```
ganache-cli -d -m habit sure critic toe surprise all tuition sister clay make steak bronze
```

Now blockchain is running under `http://localhost:8545` endpoint. As you see in logs,
accounts and according private keys to these accounts were created. They can be matched by numeric index starting from 0.

Exchange and Issuer modules requires and private keys of the funded accounts to be provided in the `.env` file.
In our tutorial we are going to use ganache-cli account with index 0 for the purpose.

`0xf50b49b0c61bb9dcb9905df092125d2534009d30fa48545cb6aceef4b561881a` with corresponding address `0xa007C764C2fBE2D22BD7Ec9691776C1bd64F3EA1`

Enter this values in `.env` file.

`.env`

```
EXCHANGE_ACCOUNT_DEPLOYER_PRIV=0xf50b49b0c61bb9dcb9905df092125d2534009d30fa48545cb6aceef4b561881a
EXCHANGE_WALLET_PRIV=0xf50b49b0c61bb9dcb9905df092125d2534009d30fa48545cb6aceef4b561881a
EXCHANGE_WALLET_PUB=0xa007C764C2fBE2D22BD7Ec9691776C1bd64F3EA1
DEPLOY_KEY=0xf50b49b0c61bb9dcb9905df092125d2534009d30fa48545cb6aceef4b561881a
WEB3=http://localhost:8545
```

Note: This tutorial uses the same account to serve as an issuer contract owner `DEPLOY_KEY` and for exchange related operations, in the production based environments these two responsibilities have to be split.

## Database seed

Run migration:

```
typeorm migration:run --config packages/origin-api/node_modules/@energyweb/exchange/dist/js/ormconfig.js && typeorm migration:run --config packages/origin-api/node_modules/@energyweb/origin-backend/dist/js/ormconfig.js
```