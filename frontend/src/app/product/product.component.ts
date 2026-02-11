import { Component,  Input,  OnInit, Output, EventEmitter } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';


//keyvalue pipe



@Component({
  selector: 'app-product',
  imports: [
    PanelModule,
    InputNumberModule,
    ImageModule,
    TableModule,
    FormsModule,
    CommonModule,
    RatingModule,
    ButtonModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit{
  @Input() product : any = {};

  @Output() addToCartEvent = new EventEmitter<any>();

  productDescription : any = {};
  tableData : any = [];

  ngOnInit(): void {
    console.log('product: ',this.product);
    this.productDescription = JSON.parse(this.product.description);
    console.log('productDescription: ',this.productDescription);
    this.tableData = Object.entries(this.productDescription).map(([key, value]) => ({ key, value }));

  }

  getPreviosPriceAfterDiscount(price: number, discount: number): number {
    return Math.round( price / ( 1 - (discount) / 100));
  }

  addToCart() : void{
    const itemToCard = {
      product: this.product,
      cuantity: this.cuantity
    };
    console.log('new ited selected',itemToCard);
    this.addToCartEvent.emit(itemToCard);
  }

  cuantity : number = 1;
}
