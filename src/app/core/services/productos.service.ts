import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment'

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = environment.apiUrl + 'productos/';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createProducto(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto);
  }

  updateProducto(productoId: any, producto: any): Observable<any> {
    return this.http.put(this.apiUrl + `${productoId}/`, producto);
  }

  getProducto(productoId: any, producto: any): Observable<any> {
    return this.http.get(this.apiUrl + `${productoId}/`, producto);
  }

  deleteProducto(productoId: any): Observable<any> {
    return this.http.delete(this.apiUrl + `${productoId}/`);
  }
}
