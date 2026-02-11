import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from 'src/core/domain/schemas/country.schema';
import { CatalogService } from './catalog.service';
import { CatalogResolver } from './catalog.resolver';

@Module({
    imports: [MongooseModule.forFeature([{ name : Country.name, schema : CountrySchema}])],
    providers: [CatalogService, CatalogResolver]
})
export class CatalogModule {}
