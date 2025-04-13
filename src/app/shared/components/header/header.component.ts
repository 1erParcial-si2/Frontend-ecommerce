import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  mostrarSesion = false;
  username: string | null = null;

  constructor(private authService: AuthService) {
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    const user = sessionStorage.getItem('user');
    if (user) {
      try {
        const userObj = JSON.parse(user);
        this.username = userObj.username;
        if (this.username && this.username.includes('@')) {
          this.username = this.username.split('@')[0];
        }
      } catch (error) {
        console.error("Error al parsear el usuario: ", error);
      }
    }
  }

  irPerfil(): void {
    console.log('Ir al perfil');
  }

  cerrarSesion() {
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.sesion-div') && !target.closest('.boton-sesion')) {
      this.mostrarSesion = false;
    }
  }
}
