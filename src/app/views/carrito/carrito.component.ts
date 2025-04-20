import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../core/services/carrito.service';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  cantidad: number; // cantidad en el carrito
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export default class CarritoComponent implements OnInit {
  carrito: any[] = [];

  constructor(private carritoService: CarritoService) { }

  ngOnInit() {
    this.carrito = this.carritoService.obtenerCarrito();

    // Opcional: suscribirse si quieres actualización en vivo
    this.carritoService.carrito$.subscribe(data => {
      this.carrito = data;
    });
  }

  aumentarCantidad(producto: Producto) {
    producto.cantidad++;
  }

  disminuirCantidad(producto: Producto) {
    if (producto.cantidad > 1) {
      producto.cantidad--;
    }
  }

  eliminarProducto(id: number) {
    this.carrito = this.carrito.filter(p => p.id !== id);
  }

  get subtotal() {
    return this.carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  }

  get descuento() {
    return 5; // Puedes aplicar lógica más compleja aquí
  }

  get total() {
    return this.subtotal - this.descuento;
  }
}