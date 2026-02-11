import { ICity } from "./places.interface";
import { IProduct } from "./product.interface";
import { ICustomer } from "./user.interface";

export interface IAddess{
    id : string;
    address : string;
    postalCode : string;
    phone : string;
    city : ICity;
}


export interface ISell{
    id : string;
    status : string;
    date : Date;
    address : IAddess;
    products: IProduct[];
    customer : ICustomer;
}