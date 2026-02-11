import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SellsService } from './sells.service';
import { SellInput } from '../core/domain/inputs/sells.input';
// Removed incorrect import
import { SellsEntity } from '../core/domain/entities/sells.entity';

@Resolver()
export class SellsResolver {

    constructor(
        private readonly sellsService : SellsService
    ){}


    @Query(() => [SellsEntity])
    public async getSellsByCustomerId(
        @Args('customerId') customerId: string
    ) {
        return await this.sellsService.getSellByCustomerId(customerId);
    }

    @Mutation(() => Boolean)
    public async createSell(
        @Args('sell', {type : () => SellInput}) sell: SellInput
    ) {
        return await this.sellsService.createSell(sell);
    }
}
