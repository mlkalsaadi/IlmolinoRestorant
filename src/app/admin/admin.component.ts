import { Component , Input, OnInit} from '@angular/core';
import { ItemsService } from '../item.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
constructor(private itemService: ItemsService, private http:HttpClient){}
  newItem = {
    id:'',
    name: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    telefone: ''
  };
  items: any[] = [];
  lastId:any;
  search_id:any
  editItem = {
    id:'',
    name: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    telefone: ''
  };
  allUsers: any[] = [];
  ngOnInit(): void {
    this.getItems();
    this.getProducts();
  }
  getItems(){
    this.itemService.getItems().subscribe(
      (data) => {
        this.allUsers = data;
        this.lastId= this.newItem.id == '' ||  this.newItem.id == null ||
        this.allUsers.find((search_id)=>(parseInt(search_id.id) === parseInt(this.search_id)))
        ? parseInt(this.allUsers[this.allUsers.length - 1].id ) + 1
        : this.newItem.id;
      }
    );
  }
  addItem(): void {
    this.newItem.id =this.lastId; 
    this.itemService.addItem(this.newItem).subscribe((data) => {
      console.log(data)
      this.items.push(data); 
      this.newItem = {id: '', name: '', street_address: '', city: '', state: '', postal_code: '', telefone: '' };
      this.getItems();
      this.showAlert('Added user succesfuly ', 'success')
    }, (error) => {
      this.showAlert('Error While added the user ! ', 'error');
    }
  );}
  update(id: number , item:any) {
    for (let i = 0; i < this.filteredUsers.length; i++) {
        if(this.filteredUsers[i].id === id){
            this.editItem = {
              id: item.id == '' ? this.filteredUsers[i].id : item.id,
              name: item.name == '' ? this.filteredUsers[i].name : item.name,
              street_address: item.street_address == '' ? this.filteredUsers[i].street_address : item.street_address,
              city: item.city == '' ? this.filteredUsers[i].city : item.city,
              state: item.state == '' ? this.filteredUsers[i].state : item.state,
              postal_code: item.postal_code == '' ? this.filteredUsers[i].postal_code : item.postal_code,
              telefone: item.telefone == '' ? this.filteredUsers[i].telefone : item.telefone,
            };
            this.getItems();
      }
    }

    this.http.put(`https://mlk1994.pythonanywhere.com/api/items/${id}/`,this.editItem).subscribe(() => {
      this.getItems();
      this.showAlert('Updated Succesfly ', 'success')
      }, (error) => {
        this.showAlert('Error While updeted the user ! ', 'error');
      });
      this.getItems();
  }
  delete(id: any) {
    this.http.delete(`https://mlk1994.pythonanywhere.com/api/items/${id}/`).subscribe(() => {
     this.getItems();
     this.showAlert('Deleted succesfly ', 'success')
    });
  }
  searchQuery:string ='';
  get filteredUsers() {
    return this.allUsers.filter((searchQuery)=>(
      searchQuery.id.toLowerCase().includes(this.searchQuery.toLowerCase())||
      searchQuery.name.toLowerCase().includes(this.searchQuery.toLowerCase())||
      searchQuery.city.toLowerCase().includes(this.searchQuery.toLowerCase())||
      searchQuery.street_address.toLowerCase().includes(this.searchQuery.toLowerCase())||
      searchQuery.state.toLowerCase().includes(this.searchQuery.toLowerCase())||
      searchQuery.postal_code.toLowerCase().includes(this.searchQuery.toLowerCase())||
      searchQuery.telefone.toLowerCase().includes(this.searchQuery.toLowerCase())
    )) 
  };

  allProducts: any[] = [];
  Products: any[] = [];
  newProduct = {
    artikelnummer: '',
    name: '',
    content: '',
    preis: '',
  };
  editProduct = {
    id:'',
    artikelnummer:'',
    name:'',
    preis:''
  };
  getProducts(): void {
    const apiUrl = 'https://mlk1994.pythonanywhere.com/api/product/';
    this.http.get<any[]>(apiUrl).subscribe(
      (data) => {
        this.allProducts = data;
        console.log(this.allProducts) 
      }
    );
  }
  addProduct(): void {
    this.itemService.addProduct(this.newProduct).subscribe((data) => {
      this.Products.push(data); 
      this.newProduct = { artikelnummer:'', name: '', content: '', preis: '' };
      this.getItems();
      this.getProducts()
      this.showAlert('Added product succesfuly ', 'success')
    }, (error) => {
      this.showAlert('Error While added the product ! ', 'error');
    }
  );
   
  }
  updateProducts(id: number , item:any) {
    for (let i = 0; i < this.filteredProducts.length; i++) {
        if(this.filteredProducts[i].id === id){
            this.editProduct = {
              id: item.id == '' ? this.filteredProducts[i].id : item.id,
              artikelnummer: item.artikelnummer == '' ? this.filteredProducts[i].artikelnummer : item.artikelnummer,
              name: item.name == '' ? this.filteredProducts[i].name : item.name,
              preis: item.preis == '' ? this.filteredProducts[i].preis : item.preis
            };
            this.getProducts();
      }
    }

    this.http.put(`https://mlk1994.pythonanywhere.com/api/product/${id}/`,this.editProduct).subscribe(() => {
      this.getProducts();
      this.showAlert('Updated Succesfly ', 'success')
      }, (error) => {
        this.showAlert('Error While updeted the user ! ', 'error');
      });
      this.getProducts();
  }
  deleteProduct(id: any) {
    this.http.delete(`https://mlk1994.pythonanywhere.com/api/product/${id}/`).subscribe(() => {
     this.getItems();this.getProducts()
     this.showAlert('Deleted succesfly ', 'success')
    }, (error) => {
      this.showAlert('Error While deleted the product ! ', 'error');
    });
  }
  searchProducts: string='';
  get filteredProducts() {
    return this.allProducts.filter((searchProducts)=>(
      searchProducts.artikelnummer.toLowerCase().includes(this.searchProducts.toLowerCase())||
      searchProducts.name.toLowerCase().includes(this.searchProducts.toLowerCase())||
      searchProducts.preis.toLowerCase().includes(this.searchProducts.toLowerCase())
    )) 
  };


  isUsersVisible = false;
  toggleDivUser(){
    this.isUsersVisible = !this.isUsersVisible;
  }
  showEditUserDisplay: { [key: number]: boolean } = {};
  openEditUserDisplay(id:any) {
    this.showEditUserDisplay[id] = true;
    const searchInputs = window.document.querySelectorAll('input[type="search"]');
    searchInputs.forEach((input: any) => { input.value = ''; });
    this.searchQuery=''
  }
  closeEditUserDisplay(id:any) {
    this.showEditUserDisplay[id] = false;
    const searchInputs = window.document.querySelectorAll('input[type="search"]');
    searchInputs.forEach((input: any) => { input.value = '';});
    this.searchQuery=''
  }

  isVisible = false;
  toggleDiv() {
    this.isVisible = !this.isVisible;
  }
  showEditProductsDisplay: { [key: number]: boolean } = {};
  openEditProductsDisplay(id:any) {
    this.showEditProductsDisplay[id] = true;
    const searchInputs = window.document.querySelectorAll('input[type="search"]');
    searchInputs.forEach((input: any) => { input.value = '';});
    this.searchProducts='';
  }
  closeEditProductsDisplay(id:any) {
    this.showEditProductsDisplay[id] = false;
    const searchInputs = window.document.querySelectorAll('input[type="search"]');
    searchInputs.forEach((input: any) => { input.value = '';});
    this.searchProducts='';
  }




  alertVisible: boolean = false;
  successVisible: boolean = false;
  errorVisible: boolean = false;
  alertMessage: string = '';
  alertType: string = '';  // 'success' or 'error'

  // Function to make the alert
  showAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type; 
    this.alertType !='success' ? this.successVisible= true :this.successVisible= false;
    this.alertType !='error' ? this.errorVisible= true :this.errorVisible= false;
    this.alertVisible = true;
    setTimeout(() => {
      this.alertVisible = false;
    }, 3000);
  }
  // Function to close the alert
  closeAlert() {
    this.alertVisible = false;
  }

}









