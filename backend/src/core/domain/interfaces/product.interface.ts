import { ICountry } from './places.interface'

export interface ICategory{
    id : string;
    name : string;
    description : string;
}

export interface IProvider{
    id : string;
    name : string;
    email : string;
    phone : string;
    description : string;
    country : ICountry;
}

export interface IProduct{
    id : string;
    name : string;
    price : number;
    description : string;
    stock : number;
    category : ICategory;
    provider : IProvider;
    rating : number;
    image : string;
}