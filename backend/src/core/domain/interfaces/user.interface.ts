
export interface IUser{
    id : string;
    name : string;
    email : string;
    password : string;
    phone : string;
    customer : ICustomer[];
}


export interface ICustomer{
    id : string;
    name : string;
    email : string;
    phone : string;
    NUI : string;
}

