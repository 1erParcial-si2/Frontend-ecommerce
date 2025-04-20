import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ProductoCarrito {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private carrito: ProductoCarrito[] = [];
  private carritoSubject = new BehaviorSubject<ProductoCarrito[]>([]);

  carrito$ = this.carritoSubject.asObservable();

  constructor() {
    if (typeof window !== 'undefined' && localStorage) {
      const data = localStorage.getItem('carrito');
      if (data) {
        this.carrito = JSON.parse(data);
        this.carritoSubject.next(this.carrito);
      }
    }
  }


  agregarProducto(producto: ProductoCarrito) {
    const index = this.carrito.findIndex(p => p.id === producto.id);
    if (index > -1) {
      this.carrito[index].cantidad += 1;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    this.actualizarCarrito();
  }

  obtenerCarrito(): ProductoCarrito[] {
    return this.carrito;
  }

  limpiarCarrito() {
    this.carrito = [];
    this.actualizarCarrito();
  }

  private actualizarCarrito() {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }
    this.carritoSubject.next([...this.carrito]);
  }
}
