// Interface for City

export interface ICity {
    id?: string;
    name : string;
}


export interface IState {
    id ?: string;
    name : string;
    cities : ICity[];
}

export interface ICountry {
    id ?: string;
    name : string;
    states : IState[];
}