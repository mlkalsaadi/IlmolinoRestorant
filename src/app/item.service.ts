import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
    providedIn: 'root' // Makes the service available throughout the application
})
export class ItemsService { // Ensure this matches the import statement
    private apiUrl = 'https://mlk1994.pythonanywhere.com/api/items/'; 
    private  apiUrlProduct = 'https://mlk1994.pythonanywhere.com/api/product/'; 

    constructor(private http: HttpClient) {}


    
      createItem(item: Item): Observable<Item> {
        return this.http.post<Item>(this.apiUrl, item);
      }
    
      updateItem(id: number, item: Item): Observable<Item> {
        return this.http.put<Item>(`${this.apiUrl}/${id}`, item);
      }
    
      deleteItem(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
      }


  // Fetch all items
  getItems(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


  // Add a new item
  addItem(item: any): Observable<any> {
    return this.http.post(this.apiUrl, item);
  } 

  getProduct(): Observable<any> {
    return this.http.get(this.apiUrlProduct);
  }

  // Add a new item
  addProduct(item: any): Observable<any> {
    return this.http.post(this.apiUrlProduct, item);
  } 
}
