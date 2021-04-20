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
    OriginBackendModule,
    ExchangeModule,
  ],
})
export class AppModule {}
