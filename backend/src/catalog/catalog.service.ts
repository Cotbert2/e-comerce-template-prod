import { InjectModel } from '@nestjs/mongoose';
import {Country} from '../core/domain/schemas/country.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ICountry } from '../core/domain/interfaces/places.interface';

@Injectable()
export class CatalogService {
    constructor(@InjectModel(Country.name) private  catalogRepository: Model<Country>){}
    
    public async findAll(){
        return await this.catalogRepository.find().exec();
    }

    public async insertCountries(countries: any)  {//Promise<ICountry[]> {
        console.log(countries);
        const mongoResponse = await this.catalogRepository.insertMany(countries);
        console.log(mongoResponse);
        if (mongoResponse) return true;
        return false;

    }
}
