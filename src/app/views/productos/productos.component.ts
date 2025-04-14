import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../core/services/productos.service';
import { AutoresService } from '../../core/services/autores.service';
import { GenerosService } from '../../core/services/generos.service';
import { CategoriasService } from '../../core/services/categorias.service'; // Este servicio en realidad maneja subcategorías
import { EditorialesService } from '../../core/services/editoriales.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export default class ProductosComponent {
  productos: any[] = [];
  generos: Array<any> = [];
  autores: Array<any> = [];
  editoriales: Array<any> = [];
  subcategorias: Array<any> = []; // Renombrado

  nombre: any;
  descripcion: any;
  imagen: any;
  precio: any;

  selectedAutor: any = "";
  selectedGenero: any = "";
  selectedEditorial: any = "";
  selectedSubcategoria: any = ""; // Renombrado

  nombreUpdate: any;
  descripcionUpdate: any;
  imagenUpdate: any;
  precioUpdate: any;
  generoUpdate: any;
  autorUpdate: any;
  editorialUpdate: any;
  subcategoriaUpdate: any; // Renombrado
  productoIdSelected: any;

  isModalRegisterProductoOpen: boolean = false;
  isModalUpdateProductoOpen: boolean = false;

  constructor(
    private productoService: ProductosService,
    private autoresService: AutoresService,
    private generosService: GenerosService,
    private editorialesService: EditorialesService,
    private categoriasService: CategoriasService // Este en realidad es para subcategorías
  ) {
    this.getProductos();
    this.getAutores();
    this.getGeneros();
    this.getEditoriales();
    this.getSubcategorias(); // Renombrado
  }

  getProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error al obtener productos', error);
      }
    });
  }

  getSubcategorias() {
    this.categoriasService.getCategorias().subscribe({ // Servicio realmente carga subcategorías
      next: (resp: any) => this.subcategorias = resp,
      error: (error: any) => console.log(error)
    });
  }

  getEditoriales() {
    this.editorialesService.getEditoriales().subscribe({
      next: (resp: any) => this.editoriales = resp,
      error: (error: any) => console.log(error)
    });
  }

  getAutores() {
    this.autoresService.getAutores().subscribe({
      next: (resp: any) => this.autores = resp,
      error: (error: any) => console.log(error)
    });
  }

  getGeneros() {
    this.generosService.getGeneros().subscribe({
      next: (resp: any) => this.generos = resp,
      error: (error: any) => console.log(error)
    });
  }

  createProducto() {
    const producto = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      imagen: this.imagen,
      precio: this.precio,
      genero: this.selectedGenero,
      editorial: this.selectedEditorial,
      autor: this.selectedAutor,
      subcategoria: this.selectedSubcategoria,
      categoria: 1 // Fijo por diseño
    };

    this.productoService.createProducto(producto).subscribe({
      next: (resp: any) => {
        if (resp.id || resp.id >= 1) {
          this.getProductos();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Producto registrado!",
            showConfirmButton: false,
            timer: 2500
          });
          setTimeout(() => this.closeRegisterProductoModal(), 2600);
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error al registrar el Producto!",
            showConfirmButton: false,
            timer: 2500
          });
        }
      },
      error: () => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error al registrar el Producto!",
          showConfirmButton: false,
          timer: 2500
        });
      }
    });
  }

  activeRegisterForm() {
    this.isModalRegisterProductoOpen = true;
  }

  openModalToUpdateproducto(producto: any) {
    this.isModalUpdateProductoOpen = true;
    this.nombreUpdate = producto.nombre;
    this.descripcionUpdate = producto.descripcion;
    this.imagenUpdate = producto.imagen;
    this.precioUpdate = producto.precio;
    this.generoUpdate = producto.genero.id;
    this.editorialUpdate = producto.editorial.id;
    this.autorUpdate = producto.autor.id;
    this.subcategoriaUpdate = producto.subcategoria?.id || producto.categoria?.id; // fallback si back devuelve mal
    this.productoIdSelected = producto.id;
  }

  updateproducto() {
    const productoData = {
      nombre: this.nombreUpdate,
      descripcion: this.descripcionUpdate,
      imagen: this.imagenUpdate,
      precio: this.precioUpdate,
      genero: this.selectedGenero,
      editorial: this.selectedEditorial,
      autor: this.selectedAutor,
      subcategoria: this.selectedSubcategoria,
      categoria: 1
    };

    this.productoService.updateProducto(this.productoIdSelected, productoData).subscribe({
      next: (resp: any) => {
        if (resp) {
          this.getProductos();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Producto actualizado!",
            showConfirmButton: false,
            timer: 2500
          });
          setTimeout(() => this.closeUpdateProductoModal(), 2600);
        }
      },
      error: (error: any) => console.log(error)
    });
  }

  deleteProducto(producto: any) {
    this.productoService.deleteProducto(producto.id).subscribe({
      next: () => {
        this.getProductos();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Producto eliminado!",
          showConfirmButton: false,
          timer: 2500
        });
      },
      error: (error: any) => console.log(error)
    });
  }

  closeRegisterProductoModal() {
    this.isModalRegisterProductoOpen = false;
  }

  closeUpdateProductoModal() {
    this.isModalUpdateProductoOpen = false;
  }
}
