import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-home-registro-de-usuarios',
  templateUrl: './home-registro-de-usuarios.page.html',
  styleUrls: ['./home-registro-de-usuarios.page.scss'],
})
export class HomeRegistroDeUsuariosPage implements OnInit {
  spinner: boolean = false;

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit() { }

  cerrarSesion() {
    this.spinner = true;
    this.authService.LogOut().then(() => {
      this.spinner = false;
    })
  }

  irAHomeSupervisor() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.router.navigate(["home-principal-de-supervisor"]);
    }, 1000);
  }
}
