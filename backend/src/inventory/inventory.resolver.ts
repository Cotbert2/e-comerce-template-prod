import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryService, ProductsService, ProviderService } from './inventory.service';
import { Country } from '../core/domain/entities/country.entity';
import { CategoryInput, ProductInput, ProviderInput } from '../core/domain/inputs/invetory.input';
import { Category, Product, Provider } from '../core/domain/entities/inventory.entity';


@Resolver()
export class InventoryResolver {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly providerService : ProviderService,
        private readonly productService : ProductsService) {}


    @Mutation(() => Boolean)
    public async createCategory(
        @Args('data', {type: () => CategoryInput}) data: CategoryInput
    ) {
        return await this.categoryService.createCategory(data);
    }

    @Mutation(() => Boolean)
    public async insertProvider(
        @Args('data', {type: () => ProviderInput}) data: ProviderInput
    ) {
        return await this.providerService.insertProvider(data);
    }

    @Mutation(() => Boolean)
    public async insertProduct(
        @Args('data', {type: () => ProductInput}) data: ProductInput
    ) {
        return await this.productService.insertProduct(data);
    }

    @Mutation(() => Boolean)
    public async deleteProduct(
        @Args('id') id: string
    ) {
        return await this.productService.deleteProduct(id);
    }


    @Query(() => [Category])
    public async categories() {
        return await this.categoryService.findAll();
    }

    @Query(() => [Provider])
    public async providers() {
        return await this.providerService.findAll();
    }

    @Query(() => [Product])
    public async products() {
        return await this.productService.findAll();
    }


    @Query(() => [Product])
    public async productsByCategory(
        @Args('category') category: string
    ) {
        return await this.productService.findByCategory(category);
    }
}
