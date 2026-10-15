import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Customer, User } from './../core/domain/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { hashPassword } from './hash-password';


@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name) private  userRepository: Model<User>,
        @InjectModel(Customer.name) private  customerRepository: Model<Customer>,
    ){}

    public async singup(data : any){
        //verify if email exists

        const user = await this.userRepository.findOne({email: data.email});

        if (user) return false;

        console.log(data);

        //hash passwd

        data.password = hashPassword(data.password);

        const newUser = new this.userRepository(data);
        const mongoResponse = await newUser.save();
        console.log(mongoResponse);
        if (mongoResponse) return true;
        return false;
    }

    public async login(data : any){
        console.log(data);

        //hash passwd

        data.password = hashPassword(data.password);

        const user = await this.userRepository.findOne({email: data.email, password: data.password});
        console.log(user);
        if (user) return user;
        return false;
    }


    public async modifyUser(data : any){
        if (data.password) {
            data.password = hashPassword(data.password);
        } else {
            delete data.password;
        }

        const result = await this.userRepository.updateOne({email: data.email}, data);
        console.log(result);

        if (result.matchedCount > 0) return true;
        return false;
    }


    public async createCustomer(data : any){
        //check for user

        console.log('data recived from user', data);

        const user = await this.userRepository.findOne({_id: data.user});
        if (!user) return null;


        const newCustomer = new this.customerRepository(data);
        const mongoResponse = await newCustomer.save();

        if (mongoResponse) return mongoResponse;
        return null;



    }
}
