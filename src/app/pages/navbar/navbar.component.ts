import { Component, EventEmitter, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { AuthService } from 'src/app/servicios/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '@angular/fire/auth';
import { RouteService } from 'src/app/servicios/route-service.service';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed: boolean = false;
  navData = navbarData;
  screenWidth: number = 0;
  fechaHora: Date;
  nombreUser: string;
  fotoUser: string;
  usuarioLogueado: any;
  currentRoute: string = '';
  constructor(public authService: AuthService, private angularFirestore: AngularFirestore, private afAuth: AngularFireAuth,
    private routeService: RouteService) {
    this.fechaHora = new Date();
    setInterval(() => {
      this.fechaHora = new Date();
    }, 1000);
  }

  ngOnInit() {
    this.afAuth.authState.subscribe((user: any) => {
      if (user) {
        const usuariosCollection: AngularFirestoreCollection<User> = this.angularFirestore.collection<User>('usuarios');
        const usuarioQuery = usuariosCollection.ref.where('email', '==', user.email).limit(1);
        usuarioQuery.get().then((querySnapshot) => {
          if (querySnapshot.empty) {
          } else {
            this.usuarioLogueado = querySnapshot.docs[0].data() as User;
            console.log(this.usuarioLogueado);
            if (this.usuarioLogueado.perfil == 'cliente' && this.usuarioLogueado.aprobado) {
              this.authService.isLogged = true;
              this.authService.isCliente = true;
              console.log(this.usuarioLogueado);
            }
            if (this.usuarioLogueado.perfil == 'supervisor') {
              this.authService.isSupervisor = true;
            }
            else if (this.usuarioLogueado.perfil == 'bartender' && this.authService.isLogged) {
              this.authService.isBartender = true;
            }
            else if (this.usuarioLogueado.perfil == 'mozo' && this.usuarioLogueado.isLogged) {
              this.authService.isMozo = true;
            }
            else if (this.usuarioLogueado.perfil == 'metre' && this.usuarioLogueado.isLogged) {
              this.authService.isMetre = true;
            }
            else if (this.usuarioLogueado.perfil == 'cocinero' && this.usuarioLogueado.isLogged) {
              this.authService.isCocinero = true;
            }
            else {
              this.authService.isLogged = false;
              this.authService.isMozo = false;
              this.authService.isCliente = false;
              this.authService.isCocinero = false;
              this.authService.isMetre = false;
              this.authService.isSupervisor = false;
            }
          }
        });
      }
    });
  }


  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
  cerrarSesion() {
    this.authService.LogOut()
  }
}