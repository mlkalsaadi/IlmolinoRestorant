import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../item.service'; // Ensure this matches the exported service
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
interface Item {
    id: number;
    name: string;
    address_type : string;
    street_address: string;
    city : string;
    state : string;
    postal_code  : string;
    telefone  : string;
}
@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
    itemForm!: FormGroup;
    editingItem: Item | null = null; 

    constructor(private router: Router,private itemsService: ItemsService,private http: HttpClient,private itemService: ItemsService,  private fb: FormBuilder) {} // Use ItemsService

    ngOnInit(): void {
        this.fetchItems(); // Call to fetch items on initialization
        this.loadItems();
        this.itemForm = this.fb.group({
          name: [''],
          address_type: [''],
          street_address: [''],
          city: [''],
          state: [''],
          postal_code: [''],
          telefone: ['']
        });
        this.getItems();
        this.getProcudt();
    }
    loadItems(): void {
        this.itemService.getItems().subscribe(
          (data) => {
            this.items = data;
            
          },
          (error) => {
            console.error('Error loading items', error);
          }
        );
    }
    editItem(item: Item): void {
      this.editingItem = item;
      this.itemForm.patchValue(item);  // Set the form values to the selected item
    }
    submitForm(): void {
      if (this.editingItem) {
        // Update the item
        this.itemService.updateItem(this.editingItem.id, this.itemForm.value).subscribe(
          () => {
            this.loadItems();  // Reload items after update
            this.itemForm.reset();  // Reset the form
            this.editingItem = null;  // Clear editing item
          },
          (error) => {
            console.error('Error updating item', error);
          }
        );
      } else {
        // Create a new item
        this.itemService.createItem(this.itemForm.value).subscribe(
          () => {
            this.loadItems();  // Reload items after creation
            this.itemForm.reset();  // Reset the form
          },
          (error) => {
            console.error('Error creating item', error);
          }
        );
      }
    }
    deleteItem(id: number): void {
        // Call the service to delete the item from the API
        this.itemService.deleteItem(id).subscribe(
          () => {
            // Remove the item from the local array by filtering out the deleted item
            this.items = this.items.filter(item => item.id !== id);
          },
          (error) => {
            console.error('Error deleting item:', error);
            alert('There was an error while  deleting the item .');
          }
        );
    }
    fetchItems(): void {
        this.itemsService.getItems().subscribe(
            (data: Item[]) => {
                this.items = data; // Assign fetched data to items
             
            },
            (error: any) => {
                console.error('Error fetching items:', error); // Handle errors
            }
        );
    }



    oder_id:any;
    oder:any=false;dispay_id:any;dispay_name:any;dispay_city:any;dispay_street_address:any;dispay_postal_code:any;dispay_telefone:any;
    oder_(item:any){this.oder=true;
      this.dispay_id=item.id;
      this.dispay_name=item.name;
      this.dispay_city=item.city;
      this.dispay_street_address=item.street_address;
      this.dispay_postal_code=item.postal_code;
      this.dispay_telefone=item.telefone;
    }


    items: any[] = [];
    products: any[] = [];
close(){
  this.oder=false;
}

    newItem = {
      id :'',
      name: '',
      street_address: '',
      city: '',
      state: '',
      postal_code: '',
      telefone: ''
    };
    filteredProducts: any[] = []; 
    getItems(): void {
      this.itemService.getItems().subscribe((data) => {
        this.items = data;
      });
    }
    getProcudt(): void {
      this.itemService.getProduct().subscribe((data) => {
        this.products = data;this.filteredProducts = data; 
      });
    }
    searchProducts(event: Event): void {
      const query = (event.target as HTMLInputElement).value; // Cast to HTMLInputElement
    
      if (query.trim().length > 0) {  
        this.filteredProducts = this.products.filter((product) =>
          product.artikelnummer.toLowerCase().includes(query.toLowerCase())||
          product.name.toLowerCase().includes(query.toLowerCase()) 
        );
      } else {
        this.filteredProducts = this.products;
      }
    }
    
totalPrise:number=0;
add_products: any[]=[];



// add items for list to buy
add(product:any){
  const price = Number(product.preis);
  if (!isNaN(price)) {
    // Check if the product is already in the array
    const existingProduct = this.add_products.find(p => p.id === product.id);

    if (existingProduct) {
      // If the product exists, increase the quantity and update the price
      existingProduct.quantity += 1;
      existingProduct.totalPrice += price;
    } else {
      // If the product doesn't exist, add it with initial quantity and total price
      this.add_products.push({
        id: product.id,
        name: product.name,
        quantity: 1,
        totalPrice: price,
        //noor
        product_price:price
      });
    }

    // Update the overall total price
    this.totalPrise = this.add_products.reduce((sum, p) => sum + p.totalPrice, 0);
  } else {
    console.error('Invalid price, cannot convert to number:', product.preis);
  }
}

// delete selected items in list
delete(product: any) {
  const index = this.add_products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    // Check the quantity of the product
    if (this.add_products[index].quantity > 1) {
      // Reduce quantity and adjust the total price
      this.add_products[index].quantity -= 1;
      this.add_products[index].totalPrice -= this.add_products[index].product_price;
      this.totalPrise -= this.add_products[index].product_price;
    } else {
      // If quantity is 1, remove the product from the array
      this.totalPrise -= this.add_products[index].totalPrice;
      this.add_products.splice(index, 1);
    }
  } else {
    console.error('Product not found in the cart:', product);
  }
}




route(){
  this.router.navigate(['/admin']);
} 
//print function
printDivAsText(divId: string): void {
  const newWindow = window.open('', '_blank');

  if (newWindow) {
    // Prepare the receipt content
    const formattedProducts = this.add_products
      .map(product => `
        
        <div class="product">
          <span class="quantity">${product.quantity} x</span>
          <span class="name">${product.name}</span>
          <span class="price">${product.totalPrice.toFixed(2)} €</span>
        </div>
      `)
      .join('');

    // Write to the new window
    newWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              font-family: 'Courier New', monospace; /* Common for receipts */
              font-size: 12px; /* Small text size */
              line-height: 1.4;
              margin: 0;
              padding: 10px;
              width: 58mm; /* Width suitable for receipt printers */
            }
            h2 {
              text-align: center;
              margin: 0;
              padding: 10px 0;
              font-size: 14px;
              border-bottom: 1px solid #000;
            }
            .product {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .quantity {
              width: 20%;
            }
            .name {
              width: 50%;
              text-align: left;
            }
            .price {
              width: 30%;
              text-align: right;
            }
            .total {
              font-weight: bold;
              text-align: right;
              margin-top: 10px;
              border-top: 1px solid #000;
              padding-top: 5px;
            }
          </style>
        </head>
        <body>
          <h2>Receipt</h2>
          <div>${Date()}</div>
          <div style='display:flex;
            justify-content: space-between;
            align-items: center;
            text-align: center;'>
            <div>Abdendrotweg 14<br>12307 Berlin <br>098 9289 8938</div>
              <divstyle='display:flex;
                  flex-direction:column;
                  justify-content: center;
                  align-items: center;
                  text-align: center;>
                 <img style='width:40px;height:40px;' src='../../assets/images/logo.png'/>
                 <div>MANGALI</div>
              </div>
          </div>
              <h2></h2>
          <div>${this.dispay_name}</div>
          <div>${this.dispay_city}</div>
          <div>${this.dispay_street_address}</div>
          <div>${this.dispay_telefone}</div>
          <div class="products">
            ${formattedProducts}
          </div>
          <div class="total">Total: ${this.totalPrise.toFixed(2)} €</div>
        </body>
      </html>
    `);

    // Close the document and trigger the print
    newWindow.document.close();
    newWindow.print();
  } else {
    console.error('Unable to open new window');
  }
}



// to search for users

    filteredItems: any[] = [];
    filterSuggestions(event: Event): void {
      const inputElement = event.target as HTMLInputElement; // Explicitly cast
      const value = inputElement.value;
    
      if (!value) {
        this.filteredItems = [];
        return;
      }
    
      const searchValue = value.toLowerCase();
    
      this.filteredItems = this.items.filter((item) => {
        return (
          item.name?.toLowerCase().includes(searchValue) ||
          item.street_address?.toLowerCase().includes(searchValue) ||
          item.city?.toLowerCase().includes(searchValue) ||
          item.state?.toLowerCase().includes(searchValue) ||
          item.id?.toLowerCase().includes(searchValue) ||
          item.postal_code?.toLowerCase().includes(searchValue) ||
          item.telefone?.toLowerCase().includes(searchValue)
        );
      });
    }
 
}
