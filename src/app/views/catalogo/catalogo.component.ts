import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../core/services/productos.service';
import { AutoresService } from '../../core/services/autores.service';
import { GenerosService } from '../../core/services/generos.service';
import { CategoriasService } from '../../core/services/categorias.service';
import { EditorialesService } from '../../core/services/editoriales.service';
import { CarritoService } from '../../core/services/carrito.service';
import Swal from 'sweetalert2';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: number;
  imagen: string;
  is_active: boolean;
  categoria: number;
  autor: number | null; // Si puede ser null
  editorial: number | null; // Si puede ser null
  genero: number | null; // Si puede ser null
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export default class CatalogoComponent implements OnInit {
  productos: Producto[] = [];  // Lista de productos obtenidos
  productosFiltrados: Producto[] = []; // Lista de productos filtrados
  isAdmin: boolean = false; // Asegúrate de controlar si el usuario es administrador
  generos: Array<any> = [];
  autores: Array<any> = [];
  editoriales: Array<any> = [];
  subcategorias: Array<any> = [];
  categoriasMap: { [key: number]: string } = {};
  generosMap: { [key: number]: string } = {};
  autoresMap: { [key: number]: string } = {};
  editorialesMap: { [key: number]: string } = {};

  constructor(private productosService: ProductosService, private autoresService: AutoresService,
    private generosService: GenerosService,
    private editorialesService: EditorialesService,
    private categoriasService: CategoriasService,
    private carritoService: CarritoService) { }

  ngOnInit() {
    this.getProductos();
    this.getAutores();
    this.getGeneros();
    this.getEditoriales();
    this.getSubcategorias();
  }

  getProductos(): void {
    this.productosService.getProductos().subscribe(
      (productos) => {
        this.productos = productos.filter(producto => producto.is_active); // Filtrar solo productos activos
        console.log('Productos después del filtrado:', this.productos); // Verifica los productos que llegan al frontend
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }

  getSubcategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.subcategorias = resp;
        this.categoriasMap = {};
        this.subcategorias.forEach((categoria: any) => {
          this.categoriasMap[categoria.id] = categoria.nombre;
        });
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  getEditoriales() {
    this.editorialesService.getEditoriales().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.editoriales = resp;
        this.editorialesMap = {};
        this.editoriales.forEach((editorial: any) => {
          this.editorialesMap[editorial.id] = editorial.nombre;
        });
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  getAutores() {
    this.autoresService.getAutores().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.autores = resp;
        this.autoresMap = {};
        this.autores.forEach((autor: any) => {
          this.autoresMap[autor.id] = autor.nombre;
        });
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  getGeneros() {
    this.generosService.getGeneros().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.generos = resp;
        this.generosMap = {};
        this.generos.forEach((genero: any) => {
          this.generosMap[genero.id] = genero.nombre;
        });
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  filtrarProductos(): void {
    // Filtramos los productos dependiendo del rol
    if (this.isAdmin) {
      // Si es administrador, mostramos todos los productos (activos e inactivos)
      this.productosFiltrados = this.productos;
    } else {
      // Si no es administrador, mostramos solo los productos activos
      this.productosFiltrados = this.productos.filter(producto => producto.is_active);
    }
  }

  agregarAlCarrito(producto: Producto): void {
    const productoCarrito = {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Number(producto.precio),
      imagen: producto.imagen,
      cantidad: 1
    };
    this.carritoService.agregarProducto(productoCarrito);
    // alert(`"${producto.nombre}" fue añadido al carrito.`);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Producto agregado al carrito!",
      showConfirmButton: false,
      timer: 1000
    });
  }
}