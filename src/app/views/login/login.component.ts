import { Component } from '@angular/core';
import { AuthService } from './../../core/services/auth.service';
import { log } from 'console';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  username: any;
  password: any;
  constructor(private authService: AuthService, private router: Router) {
  }
  login() {
    console.log("Botón presionado");
    let user = {
      username: this.username,
      password: this.password
    };
    this.authService.login(user).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.token && resp.token !== '') {
          sessionStorage.setItem("token", resp.token);
          sessionStorage.setItem("user_id", resp.user_id);
          sessionStorage.setItem("user", JSON.stringify({ username: resp.username }));
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Usuario logueado exitosamente",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/usuarios']);
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Token no recibido",
            showConfirmButton: false,
            timer: 2000
          });
        }
      },
      error: (err: any) => {
        console.error(err);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Credenciales inválidas",
          text: "Verifica usuario y contraseña",
          showConfirmButton: true
        });
      }
    });
  }
}
