import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../services/inventory.service';

import { DividerModule } from 'primeng/divider';
import { DataViewModule } from 'primeng/dataview';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-categories',
  imports: [
    SelectModule,FloatLabelModule,
    FormsModule,CommonModule,
    DividerModule,
    DataViewModule,
    ButtonModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit{
  @Output() openProductViewEvent = new EventEmitter<any>();



  categories: any = [];

  currentCategory: any = {};

  products: any = [];
  
  ngOnInit(): void {
    this.inventoryService.getCategories().subscribe((data : any) => {
      console.log('categories: ',data);
      this.categories = data.data.categories.map((category : any) => {
        return {
          name: category.name,
          value: category.id
        }
      });
    });
  }

  getProductsByCategory(){
    console.log('currentCategory: ',this.currentCategory);
    this.inventoryService.getProductsByCategory(this.currentCategory.value).subscribe((data : any) => {
      this.products = data.data.productsByCategory;
      console.log('sproducts: ',this.products);
    }
    , (error) => {
      console.log('error: ',error);
    })
  }

  openProductView(product : any) : void{
    console.log('open product view');
    this.openProductViewEvent.emit(product);
  }


  constructor(
    private inventoryService : InventoryService
  ){}

}
