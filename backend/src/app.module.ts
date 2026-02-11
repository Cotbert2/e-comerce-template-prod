import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogModule } from './catalog/catalog.module';
import { InventoryModule } from './inventory/inventory.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from './payments/payments.module';
import { SellsModule } from './sells/sells.module';



console.log('Mongo Uri',process.env.MONGO_URI);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile : join(process.cwd(), 'src/schema.gql'),
    }), MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce'), CatalogModule, InventoryModule, UsersModule, PaymentsModule, SellsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
