import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponent } from './product.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('ProductComponent', () => {
  //comoponent oriented
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  const mockProduct = {
    id: 1,
    name: 'Laptop',
    price: 1000,
    discount: 10,
    description: JSON.stringify({
      brand: 'Dell',
      ram: '16GB',
      cpu: 'i7'
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductComponent,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;

    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should parse product description on init', () => {
    expect(component.productDescription).toEqual({
      brand: 'Dell',
      ram: '16GB',
      cpu: 'i7'
    });
  });

  it('should generate tableData from product description', () => {
    expect(component.tableData).toEqual([
      { key: 'brand', value: 'Dell' },
      { key: 'ram', value: '16GB' },
      { key: 'cpu', value: 'i7' }
    ]);
  });

  it('should calculate previous price after discount', () => {
    const price = component.getPreviosPriceAfterDiscount(900, 10);
    expect(price).toBe(1000);
  });

  it('should emit addToCartEvent when addToCart is called', () => {
    spyOn(component.addToCartEvent, 'emit');

    component.cuantity = 2;
    component.addToCart();

    expect(component.addToCartEvent.emit).toHaveBeenCalledWith({
      product: mockProduct,
      cuantity: 2
    });
  });
  //template oriented
  it('should render the product name and stock information in the template', () => {
    component.product = {
      name: 'Test Product',
      image: 'test.jpg',
      stock: 5,
      rating: 4,
      price: 100,
      discount: 0
    };

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const title = compiled.querySelector('h1');
    const stockText = compiled.textContent;

    expect(title?.textContent).toContain('Test Product');
    expect(stockText).toContain('5 items avaibale!');
  });

  it('should render table rows based on tableData', () => {
    component.tableData = [
      { key: 'Color', value: 'Red' },
      { key: 'Size', value: 'Medium' }
    ];

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const tableText = compiled.textContent;

    expect(tableText).toContain('Color');
    expect(tableText).toContain('Red');
    expect(tableText).toContain('Size');
    expect(tableText).toContain('Medium');
  });


});
