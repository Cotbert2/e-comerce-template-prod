import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, Customer } from '../core/domain/schemas/user.schema';
import { Country } from '../core/domain/schemas/country.schema';
import { Category, Provider, Product } from '../core/domain/schemas/invetory.schema';
import { Payment } from '../core/domain/schemas/payments.schema';
import { Sell } from '../core/domain/schemas/sells.schema';
import * as crypto from 'crypto-js';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Customer') private customerModel: Model<Customer>,
    @InjectModel('Country') private countryModel: Model<Country>,
    @InjectModel('Category') private categoryModel: Model<Category>,
    @InjectModel('Provider') private providerModel: Model<Provider>,
    @InjectModel('Product') private productModel: Model<Product>,
    @InjectModel('Payment') private paymentModel: Model<Payment>,
    @InjectModel('Sell') private sellModel: Model<Sell>,
  ) {}

  async seed() {
    console.log(' Starting database seeding...');

    // Limpiar la base de datos
    await this.clearDatabase();

    // Crear datos en orden de dependencias
    const users: any[] = await this.seedUsers();
    const customers: any[] = await this.seedCustomers(users);
    const countries: any[] = await this.seedCountries();
    const categories: any[] = await this.seedCategories();
    const providers: any[] = await this.seedProviders();
    const products: any[] = await this.seedProducts(categories, providers);
    const payments: any[] = await this.seedPayments(users);
    await this.seedSells(customers, products, payments, countries);

    console.log(' Database seeding completed successfully!');
  }

  private async clearDatabase() {
    console.log('  Clearing existing data...');
    await Promise.all([
      this.sellModel.deleteMany({}),
      this.paymentModel.deleteMany({}),
      this.productModel.deleteMany({}),
      this.providerModel.deleteMany({}),
      this.categoryModel.deleteMany({}),
      this.customerModel.deleteMany({}),
      this.userModel.deleteMany({}),
      this.countryModel.deleteMany({}),
    ]);
  }

  private async seedUsers() {
    console.log(' Seeding users...');
    const hashedPassword = crypto.SHA256('password123').toString();
    
    const usersData = [
      {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        password: hashedPassword,
        phone: '+34612345678',
        role: 'customer',
      },
      {
        name: 'María García',
        email: 'maria.garcia@example.com',
        password: hashedPassword,
        phone: '+34623456789',
        role: 'customer',
      },
      {
        name: 'Carlos López',
        email: 'carlos.lopez@example.com',
        password: hashedPassword,
        phone: '+34634567890',
        role: 'customer',
      },
      {
        name: 'Ana Martínez',
        email: 'ana.martinez@example.com',
        password: hashedPassword,
        phone: '+34645678901',
        role: 'admin',
      },
      {
        name: 'Pedro Sánchez',
        email: 'pedro.sanchez@example.com',
        password: hashedPassword,
        phone: '+34656789012',
        role: 'customer',
      },
    ];

    return await this.userModel.insertMany(usersData);
  }

  private async seedCustomers(users: any[]) {
    console.log(' Seeding customers...');
    const customersData = [
      {
        name: 'Juan Pérez',
        phone: '+34612345678',
        identification: '12345678A',
        user: users[0]._id,
      },
      {
        name: 'María García',
        phone: '+34623456789',
        identification: '23456789B',
        user: users[1]._id,
      },
      {
        name: 'Carlos López',
        phone: '+34634567890',
        identification: '34567890C',
        user: users[2]._id,
      },
      {
        name: 'Pedro Sánchez',
        phone: '+34656789012',
        identification: '56789012E',
        user: users[4]._id,
      },
    ];

    return await this.customerModel.insertMany(customersData);
  }

  private async seedCountries() {
    console.log('Seeding countries...');
    const countriesData = [
      {
        name: '🇪🇸 España',
        states: [
          {
            name: 'Madrid',
            cities: [
              { name: 'Madrid' },
              { name: 'Alcalá de Henares' },
              { name: 'Móstoles' },
              { name: 'Getafe' },
            ],
          },
          {
            name: 'Cataluña',
            cities: [
              { name: 'Barcelona' },
              { name: 'Tarragona' },
              { name: 'Girona' },
              { name: 'Lleida' },
            ],
          },
          {
            name: 'Andalucía',
            cities: [
              { name: 'Sevilla' },
              { name: 'Málaga' },
              { name: 'Granada' },
              { name: 'Córdoba' },
            ],
          },
        ],
      },
      {
        name: '🇲🇽 México',
        states: [
          {
            name: 'Ciudad de México',
            cities: [
              { name: 'Benito Juárez' },
              { name: 'Coyoacán' },
              { name: 'Miguel Hidalgo' },
            ],
          },
          {
            name: 'Jalisco',
            cities: [
              { name: 'Guadalajara' },
              { name: 'Zapopan' },
              { name: 'Tlaquepaque' },
            ],
          },
        ],
      },
      {
        name: '🇨🇴 Colombia',
        states: [
          {
            name: 'Cundinamarca',
            cities: [
              { name: 'Bogotá' },
              { name: 'Soacha' },
              { name: 'Chía' },
            ],
          },
          {
            name: 'Antioquia',
            cities: [
              { name: 'Medellín' },
              { name: 'Envigado' },
              { name: 'Bello' },
            ],
          },
        ],
      },
    ];

    return await this.countryModel.insertMany(countriesData);
  }

  private async seedCategories() {
    console.log(' Seeding categories...');
    const categoriesData = [
      {
        name: 'Electrónica',
        description: 'Dispositivos electrónicos y gadgets',
      },
      {
        name: 'Ropa',
        description: 'Ropa y accesorios de moda',
      },
      {
        name: 'Hogar',
        description: 'Artículos para el hogar y decoración',
      },
      {
        name: 'Deportes',
        description: 'Equipamiento deportivo y fitness',
      },
      {
        name: 'Libros',
        description: 'Libros físicos y digitales',
      },
      {
        name: 'Juguetes',
        description: 'Juguetes y juegos para niños',
      },
    ];

    return await this.categoryModel.insertMany(categoriesData);
  }

  private async seedProviders() {
    console.log(' Seeding providers...');
    const providersData = [
      {
        name: 'TechSupply SL',
        email: 'contacto@techsupply.es',
        phone: '+34911234567',
        description: 'Proveedor de productos electrónicos',
        country: 'España',
      },
      {
        name: 'FashionWorld SA',
        email: 'info@fashionworld.com',
        phone: '+34922345678',
        description: 'Distribuidor de moda y ropa',
        country: 'España',
      },
      {
        name: 'HomeStyle Corp',
        email: 'ventas@homestyle.mx',
        phone: '+525533445566',
        description: 'Artículos para el hogar',
        country: 'México',
      },
      {
        name: 'SportsPro',
        email: 'contact@sportspro.co',
        phone: '+573001234567',
        description: 'Equipamiento deportivo profesional',
        country: 'Colombia',
      },
      {
        name: 'BookHaven',
        email: 'info@bookhaven.es',
        phone: '+34933456789',
        description: 'Distribuidora de libros',
        country: 'España',
      },
    ];

    return await this.providerModel.insertMany(providersData);
  }

  private async seedProducts(categories: any[], providers: any[]) {
    console.log(' Seeding products...');
    const productsData = [
      {
        name: 'Smartphone Galaxy X',
        price: 599.99,
        description: 'Smartphone de última generación con 128GB',
        stock: 50,
        category: categories[0]._id,
        provider: providers[0]._id,
        rating: 4.5,
        discount: 10,
        image: 'https://images.samsung.com/is/image/samsung/nz-feature-equipped-for-your-environment-254979277?$FB_TYPE_A_MO_JPG$',
      },
      {
        name: 'Laptop ProBook 15',
        price: 899.99,
        description: 'Laptop profesional Intel i7, 16GB RAM',
        stock: 30,
        category: categories[0]._id,
        provider: providers[0]._id,
        rating: 4.7,
        discount: 15,
        image: 'https://hp.widen.net/content/thevlwgq4c/png/thevlwgq4c.png?w=800&h=600&dpi=72&color=ffffff00',
      },
      {
        name: 'Auriculares Bluetooth Premium',
        price: 129.99,
        description: 'Auriculares inalámbricos con cancelación de ruido',
        stock: 100,
        category: categories[0]._id,
        provider: providers[0]._id,
        rating: 4.3,
        discount: 5,
        image: 'https://http2.mlstatic.com/D_NQ_NP_707825-MLA72508419694_102023-O.webp',
      },
      {
        name: 'Camiseta Casual Premium',
        price: 29.99,
        description: 'Camiseta 100% algodón, varios colores',
        stock: 200,
        category: categories[1]._id,
        provider: providers[1]._id,
        rating: 4.2,
        discount: 0,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7qgxLUXj1c6i4LFYqEA0f4mlE4pZd7Oh0bw&s',
      },
      {
        name: 'Jeans Slim Fit',
        price: 59.99,
        description: 'Jeans de corte moderno, resistentes',
        stock: 150,
        category: categories[1]._id,
        provider: providers[1]._id,
        rating: 4.4,
        discount: 20,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuwH6kD8-TXOeG4QTZWWeN02Kq7teShnfWwQ&s',
      },
      {
        name: 'Sofá Moderno 3 Plazas',
        price: 499.99,
        description: 'Sofá cómodo y elegante para sala',
        stock: 15,
        category: categories[2]._id,
        provider: providers[2]._id,
        rating: 4.6,
        discount: 10,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDMfXVsXkv0Vzh6x0T_8xaj8Bzh8ycFk2_SQ&s',
      },
      {
        name: 'Lámpara de Mesa LED',
        price: 39.99,
        description: 'Lámpara regulable con diseño minimalista',
        stock: 80,
        category: categories[2]._id,
        provider: providers[2]._id,
        rating: 4.1,
        discount: 0,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS05arHJXbatvPS8y5LlxW0-ftOx2MxL1_Sw&s',
      },
      {
        name: 'Bicicleta Montaña MTB',
        price: 399.99,
        description: 'Bicicleta de montaña 21 velocidades',
        stock: 25,
        category: categories[3]._id,
        provider: providers[3]._id,
        rating: 4.5,
        discount: 15,
        image: 'https://www.bicis.ec/cdn/shop/files/bicicleta-eagle-aro-29-mtb-man-alu-3x8v-rojo-negro-blanco-1-1024-1024_600x.webp?v=1702505770',
      },
      {
        name: 'Pesas Ajustables 20kg',
        price: 79.99,
        description: 'Set de pesas ajustables para gimnasio en casa',
        stock: 40,
        category: categories[3]._id,
        provider: providers[3]._id,
        rating: 4.3,
        discount: 5,
        image: 'https://www.megamaxi.com/wp-content/uploads/2024/12/843956377075-1-11.jpg',
      },
      {
        name: 'El Quijote - Edición Especial',
        price: 24.99,
        description: 'Edición ilustrada del clásico español',
        stock: 60,
        category: categories[4]._id,
        provider: providers[4]._id,
        rating: 4.8,
        discount: 0,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHR9fqNrG-rBnGzry9P4Wjivhg9_S2zAxJ0A&s',
      },
      {
        name: 'Puzzle 1000 Piezas',
        price: 19.99,
        description: 'Puzzle de paisajes naturales',
        stock: 70,
        category: categories[5]._id,
        provider: providers[1]._id,
        rating: 4.0,
        discount: 10,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8wUgka0cR4bO2Kv60aubsvGwhwOSE6fZCQ&s',
      },
      {
        name: 'Robot Educativo',
        price: 89.99,
        description: 'Robot programable para niños',
        stock: 35,
        category: categories[5]._id,
        provider: providers[0]._id,
        rating: 4.6,
        discount: 0,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRRnwx24ZzaB7Z_H8pMV4GKK0WSEVG7FEmsg&s',
      },
    ];

    return await this.productModel.insertMany(productsData);
  }

  private async seedPayments(users: any[]) {
    console.log(' Seeding payment methods...');
    const paymentsData = [
      {
        paymentMethod: 'credit_card',
        creditCardNumber: '4532123456789012',
        creditCardName: 'JUAN PEREZ',
        creditCardExpirationDate: '12/25',
        creditCardCVC: '123',
        user: users[0]._id,
      },
      {
        paymentMethod: 'credit_card',
        creditCardNumber: '5425233430109903',
        creditCardName: 'MARIA GARCIA',
        creditCardExpirationDate: '06/26',
        creditCardCVC: '456',
        user: users[1]._id,
      },
      {
        paymentMethod: 'gift_card',
        giftCardNumber: 'GIFT1234567890',
        giftCardAmount: 100,
        giftCardStatus: 'active',
        user: users[2]._id,
      },
      {
        paymentMethod: 'credit_card',
        creditCardNumber: '4916338506082832',
        creditCardName: 'PEDRO SANCHEZ',
        creditCardExpirationDate: '03/27',
        creditCardCVC: '789',
        user: users[4]._id,
      },
    ];

    return await this.paymentModel.insertMany(paymentsData);
  }

  private async seedSells(
    customers: any[],
    products: any[],
    payments: any[],
    countries: any[],
  ) {
    console.log(' Seeding sales...');
    
    const sellsData = [
      {
        address: 'Calle Gran Vía 123, Piso 4',
        zipCode: '28013',
        contactPhone: '+34612345678',
        city: 'Madrid',
        paymentMethod: payments[0]._id,
        total: 659.98,
        products: [
          { product: products[0]._id, quantity: 1 },
          { product: products[2]._id, quantity: 1 },
        ],
        customer: customers[0]._id,
        date: new Date('2024-12-15'),
      },
      {
        address: 'Avenida Diagonal 456',
        zipCode: '08029',
        contactPhone: '+34623456789',
        city: 'Barcelona',
        paymentMethod: payments[1]._id,
        total: 899.99,
        products: [
          { product: products[1]._id, quantity: 1 },
        ],
        customer: customers[1]._id,
        date: new Date('2024-12-16'),
      },
      {
        address: 'Calle Sierpes 789',
        zipCode: '41004',
        contactPhone: '+34634567890',
        city: 'Sevilla',
        paymentMethod: payments[2]._id,
        total: 539.98,
        products: [
          { product: products[5]._id, quantity: 1 },
          { product: products[6]._id, quantity: 1 },
        ],
        customer: customers[2]._id,
        date: new Date('2024-12-17'),
      },
      {
        address: 'Plaza Mayor 12',
        zipCode: '28012',
        contactPhone: '+34656789012',
        city: 'Madrid',
        paymentMethod: payments[3]._id,
        total: 159.96,
        products: [
          { product: products[3]._id, quantity: 2 },
          { product: products[9]._id, quantity: 4 },
        ],
        customer: customers[3]._id,
        date: new Date('2024-12-18'),
      },
      {
        address: 'Calle Alcalá 234',
        zipCode: '28014',
        contactPhone: '+34612345678',
        city: 'Madrid',
        paymentMethod: payments[0]._id,
        total: 479.98,
        products: [
          { product: products[7]._id, quantity: 1 },
          { product: products[8]._id, quantity: 1 },
        ],
        customer: customers[0]._id,
        date: new Date('2024-12-19'),
      },
      {
        address: 'Paseo de Gracia 567',
        zipCode: '08007',
        contactPhone: '+34623456789',
        city: 'Barcelona',
        paymentMethod: payments[1]._id,
        total: 109.98,
        products: [
          { product: products[10]._id, quantity: 1 },
          { product: products[11]._id, quantity: 1 },
        ],
        customer: customers[1]._id,
        date: new Date('2024-12-20'),
      },
    ];

    return await this.sellModel.insertMany(sellsData);
  }
}
