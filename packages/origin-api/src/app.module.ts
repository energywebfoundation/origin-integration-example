import { entities as ExchangeEntities } from "@energyweb/exchange";
import { AppModule as ExchangeModule } from "@energyweb/exchange";
import { AppModule as ExchangeIrecModule } from "@energyweb/exchange-irec";
import {
  AppModule as OriginDeviceRegistry,
  entities as OriginDeviceEntities
} from '@energyweb/origin-device-registry-api';
import {
  AppModule as IRECFormDeviceRegistry,
  entities as IRECFormDeviceEntities
} from '@energyweb/origin-device-registry-irec-form-api';
import {
  AppModule as OriginBackendModule,
  OrganizationModule,
  UserModule,
  entities as OriginBackendEntities,
} from "@energyweb/origin-backend";
import {
  AppModule as IssuerModule,
  entities as IssuerEntities,
} from "@energyweb/issuer-api";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { IntegrationModule } from "./integration/integration.module";

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
      entities: [
        ...OriginBackendEntities,
        ...ExchangeEntities,
        ...IssuerEntities,
        ...OriginDeviceEntities,
        ...IRECFormDeviceEntities,
      ],
      logging: ["info"],
    }),
    OriginBackendModule,
    OrganizationModule,
    ExchangeModule,
    ExchangeIrecModule,
    UserModule,
    IntegrationModule,
    IssuerModule,
    OriginDeviceRegistry,
    IRECFormDeviceRegistry.register(null),
  ]
})
export class AppModule {}
