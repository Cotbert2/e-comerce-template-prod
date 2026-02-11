import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CatalogService } from './catalog.service';
import { Country } from '../core/domain/entities/country.entity';
import { CountryInput } from '../core/domain/inputs/country.input';

@Resolver()
export class CatalogResolver {
    constructor(private readonly catalogService: CatalogService) {}


    @Mutation(() => Boolean)
    public async insertCountries(
        @Args('data', {type: () => CountryInput}) data: CountryInput
    ) {
        return await this.catalogService.insertCountries(data);
    }


    @Query(() => [Country])
    public async countries() {
        return await this.catalogService.findAll();
    }

}
