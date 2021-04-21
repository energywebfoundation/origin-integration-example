import {
  AppModule as ExchangeModule,
  entities as ExchangeEntities,
  IExchangeConfigurationService,
  IOrderMapperService,
} from "@energyweb/exchange";
import {
  AppModule as OriginBackendModule,
  OrganizationModule,
  UserModule,
  entities as OriginBackendEntities,
} from "@energyweb/origin-backend";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { OrderMapperService, DeviceTypeServiceWrapper } from '@energyweb/exchange-irec';

const deviceTypes = [
  ['Solar'],
  ['Solar', 'Photovoltaic'],
  ['Solar', 'Photovoltaic', 'Roof mounted'],
  ['Solar', 'Photovoltaic', 'Ground mounted'],
  ['Solar', 'Photovoltaic', 'Classic silicon'],
  ['Solar', 'Concentration'],
  ['Wind'],
  ['Wind', 'Onshore'],
  ['Wind', 'Offshore'],
  ['Marine'],
  ['Marine', 'Tidal'],
  ['Marine', 'Tidal', 'Inshore'],
  ['Marine', 'Tidal', 'Offshore']
];

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
    OriginBackendModule,
    OrganizationModule,
    ExchangeModule,
    UserModule,
  ],
  providers: [
    DeviceTypeServiceWrapper,
    { provide: IOrderMapperService, useClass: OrderMapperService },
    { provide: IExchangeConfigurationService, useValue: {
      getRegistryAddress: async () => '0xd46aC0Bc23dB5e8AfDAAB9Ad35E9A3bA05E092E8',
      getIssuerAddress: async () => '0xd46aC0Bc23dB5e8AfDAAB9Ad35E9A3bA05E092E8',
      getDeviceTypes: async () => deviceTypes,
      getGridOperators: async () => ['TH-PEA', 'TH-MEA']
  } },
  ]
})
export class AppModule {}
