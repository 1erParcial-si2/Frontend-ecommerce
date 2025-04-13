import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import Swal from 'sweetalert2'
import { error } from 'console';
import { UserService } from '../../core/services/user.service';
import { RoleService } from '../../core/services/role.service';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export default class UsuariosComponent {

  isModalRegisterUserOpen: boolean = false;
  isModalUpdateUserOpen: boolean = false;
  username: any;
  password: any;
  selectedRole: any = "";
  roles: Array<any>;
  users: Array<any> = [];
  usernameUpdate: any;
  passwordUpdate: any;
  roleUpdate: any;
  userIdSelected: any;

  constructor(private userService: UserService, private roleService: RoleService) {
    this.roles = [];
    this.getRoles();
    this.getUsers();
  }

  getRoles() {

    this.roleService.getRoles().subscribe(
      {
        next: (resp: any) => {
          console.log(resp);
          this.roles = resp;
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    );
  }

  activeRegisterForm() {

    this.isModalRegisterUserOpen = true;

  }

  registerUser() {

    let user = {
      username: this.username,
      password: this.password,
      role: {
        id: this.selectedRole
      }
    };

    this.userService.registerUser(user).subscribe(
      {
        next: (resp: any) => {
          console.log(resp);
          if (resp.id || resp.id >= 1) {

            this.getUsers();

            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Usuario registrado!",
              showConfirmButton: false,
              timer: 2500
            });

            setTimeout(() => {
              this.closeRegisterUserModal();
            }, 2600);
          } else {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Error al registrar el usuario!",
              showConfirmButton: false,
              timer: 2500
            });
          }

        },
        error: (error: any) => {
          console.log(error);

        }
      }
    );
  }

  getUsers() {

    this.userService.getUsers().subscribe(
      {
        next: (resp: any) => {
          console.log(resp);
          this.users = resp;
        },
        error: (error: any) => {
          console.log(error);

        }
      }
    );
  }

  openModalToUpdateUser(user: any) {
    console.log(user);

    this.isModalUpdateUserOpen = true;
    this.usernameUpdate = user.username;
    this.passwordUpdate = user.password;
    this.roleUpdate = user.role.id;
    this.userIdSelected = user.id;
  }

  updateUser() {

    let userData = {
      username: this.usernameUpdate,
      password: this.passwordUpdate,
      role: {
        id: this.roleUpdate
      }
    };

    this.userService.updateUser(this.userIdSelected, userData).subscribe(
      {
        next: (resp: any) => {
          console.log(resp);
          if (resp) {
            this.getUsers();
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Usuario actualizado!",
              showConfirmButton: false,
              timer: 2500
            });

            setTimeout(() => {
              this.closeUpdateUserModal();
            }, 2600);
          }

        },
        error: (error: any) => {
          console.log(error);

        }
      }
    );
  }

  deleteUser(user: any) {


    this.userService.deleteUser(user.id).subscribe(
      {
        next: (resp: any) => {
          console.log(resp);
          this.getUsers();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Usuario eliminado!",
            showConfirmButton: false,
            timer: 2500
          });
        },
        error: (error: any) => {
          console.log(error);

        }
      }
    );

  }

  updateRoleId($event: any) {
    this.roleUpdate = $event;
    console.log(this.roleUpdate);
    console.log($event);

  }

  closeRegisterUserModal() {
    this.isModalRegisterUserOpen = false;
  }

  closeUpdateUserModal() {
    this.isModalUpdateUserOpen = false;
  }
}
