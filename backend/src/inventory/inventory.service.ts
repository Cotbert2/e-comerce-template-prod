import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Category, Product, Provider } from './../core/domain/schemas/invetory.schema';
import { InjectModel } from '@nestjs/mongoose';
//import byson


@Injectable()
export class CategoryService {
        constructor(
            @InjectModel(Category.name) private  catalogRepository: Model<Category>,
        ){}

        public async createCategory(category: any) {
            console.log(category);
            const newCategory = new this.catalogRepository(category);
            const mongoResponse = await newCategory.save();
            console.log(mongoResponse);
            if (mongoResponse) return true;
            return false;
        }


        public async findAll(){
            return await this.catalogRepository.find().exec();
        }
}

@Injectable()
export class ProviderService{
    constructor(
        @InjectModel(Provider.name) private  providerRepository: Model<Provider>,
    ){}

    public async insertProvider(provider: any) {
        console.log(provider);
        const newProvider = new this.providerRepository(provider);
        const mongoResponse = await newProvider.save();
        console.log(mongoResponse);
        if (mongoResponse) return true;
        return false;
    }

    public async findAll(){
        return await this.providerRepository.find().exec();
    }
}


@Injectable()
export class ProductsService{
    constructor(
        @InjectModel(Product.name) private  productRepository: Model<Product>,
        @InjectModel(Provider.name) private  providerRepository: Model<Provider>,
        @InjectModel(Category.name) private  catalogRepository: Model<Category>,
    ){}

    public async findByCategory(category: string){
        const data = await this.productRepository.find({category: category})
        .populate('provider')
        .populate('category')
        .exec();

        console.log('products', data);
        return data;
    }

    public async insertProduct(product: any) {
        console.log(product);
        const providerSelected = await this.providerRepository.findOne({_id: product.provider});
        if(!providerSelected){
            console.log('provider not found');
            return false;
        } 


        console.log('provider selected', providerSelected);

        const categorySelected = await this.catalogRepository.findOne({_id: product.category});

        if(!categorySelected){
            console.log('category not found');
            return false;
        }
        console.log('category selected', categorySelected);


        const newProduct = new this.productRepository(product);
        const mongoResponse = await newProduct.save();
        console.log(mongoResponse);
        if (mongoResponse) return true;
        return false;
    }

    public async findAll(){
        const data = await this.productRepository.find()
        .populate('provider')
        .populate('category')
        .exec();

        console.log('products', data);
        return data;
    }


    public async deleteProduct(id: string){
        const mongoResponse = await this.productRepository.deleteOne({_id: id});
        console.log(mongoResponse);
        if (mongoResponse.deletedCount > 0) return true;
        return false;
    }
}
