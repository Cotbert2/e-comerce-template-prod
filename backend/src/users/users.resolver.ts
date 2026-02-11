import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CustomerInput, UserInput } from '../core/domain/inputs/user.input';
import { Customer, User } from '../core/domain/entities/auth.entity';

@Resolver()
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService
    ){}


    @Query(() => User)
    public async login(
        @Args('data', {type: () => UserInput}) data: UserInput
    ) {
        return await this.usersService.login(data);
    }


    @Mutation(() => Boolean)
    public async singup(
        @Args('data', {type: () => UserInput}) data: UserInput
    ) {
        return await this.usersService.singup(data);
    }

    @Mutation(() => Boolean)
    public async modifyUser(
        @Args('data', {type: () => UserInput}) data: UserInput
    ) {
        return await this.usersService.modifyUser(data);
    }



    @Mutation(() => Customer)
    public async createCustomer(
        @Args('data', {type: () => CustomerInput}) data: CustomerInput
    ) {
        return await this.usersService.createCustomer(data);
    }
}