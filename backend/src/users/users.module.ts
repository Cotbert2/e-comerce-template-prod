import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema, User, UserSchema } from 'src/core/domain/schemas/user.schema';

@Module({
  imports : [
        MongooseModule.forFeature([{ name : User.name, schema : UserSchema}]),
        MongooseModule.forFeature([{ name : Customer.name, schema : CustomerSchema }]),
  ],
  providers: [UsersService, UsersResolver]
})
export class UsersModule {}
