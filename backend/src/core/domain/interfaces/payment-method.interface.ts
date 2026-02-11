
export interface ICard {
    id : number;
    titular : string;
    number : string;
    expirationDate : string;
    cvv : string;
}


export interface IPaymentMethod {
    id : string;
    name : string;
}