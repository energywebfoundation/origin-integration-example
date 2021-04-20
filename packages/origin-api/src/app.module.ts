import {
  AppModule as ExchangeModule,
  entities as ExchangeEntities,
  IOrderMapperService,
  Order,
} from "@energyweb/exchange";
import {
  IMatchableProduct,
  IMatchableOrder,
  Order as MatchingEngineOrder,
} from '@energyweb/exchange-core';
import {
  AppModule as OriginBackendModule,
  OrganizationModule,
  UserModule,
  entities as OriginBackendEntities,
} from "@energyweb/origin-backend";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Injectable } from '@nestjs/common';

export class MatchableProduct implements IMatchableProduct<string, string> {
  product: string;

  matches(product: string): boolean {
      return true;
  }

  filter(filter: string): boolean {
      return true;
  }
}

@Injectable()
export class OrderMapperService implements IOrderMapperService<string, string> {
    async map(order: Order): Promise<IMatchableOrder<string, string>> {
        return new MatchingEngineOrder(
            order.id,
            order.side,
            order.validFrom,
            new MatchableProduct(),
            order.price,
            order.currentVolume,
            order.userId,
            order.createdAt,
            order.assetId
        );
    }
}

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
  providers: [{ provide: IOrderMapperService, useClass: OrderMapperService }]
})
export class AppModule {}
