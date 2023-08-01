import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { EmailService } from 'src/app/servicios/email.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { PushService } from 'src/app/servicios/push.service';
import { ReservasClienteService } from 'src/app/servicios/reservas-cliente.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-home-principal-de-supervisor',
  templateUrl: './home-principal-de-supervisor.page.html',
  styleUrls: ['./home-principal-de-supervisor.page.scss'],
})
export class HomePrincipalDeSupervisorPage implements OnInit {
  spinner: boolean = false;
  listadoClientes: any[] = [];
  listadoReservas: any[] = [];
  verListaDeClientes: boolean = true;
  verListaDeReservas: boolean = false;
  screenWidth: any = 0;
  isSideNavCollapsed: any = false;
  collapsed: any = false;
  usuarioLogueado: any;
  verEncuestas: boolean = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    private firestoreService: FirestoreService,
    private toastController: ToastController,
    private emailService: EmailService,
    private pushService: PushService,
    private reservasServicio: ReservasClienteService,
    private afAuth: AngularFireAuth,
    public afs: AngularFirestore
  ) {
    this.pushService.getUser();
  }

  ngOnInit() {
    this.afAuth.authState.subscribe((user: any) => {
      if (user) {
        const usuariosCollection: AngularFirestoreCollection<User> = this.afs.collection<User>('usuarios');
        const usuarioQuery = usuariosCollection.ref.where('email', '==', user.email).limit(1);
        usuarioQuery.get().then((querySnapshot) => {
          if (querySnapshot.empty) {
          } else {
            this.usuarioLogueado = querySnapshot.docs[0].data() as User;
            this.authService.isLogged = true;
            console.log(this.usuarioLogueado);
          }
        });
      }
    });
    this.firestoreService.traerClientes().subscribe((clientes: any) => {
      this.listadoClientes = [];
      clientes.forEach((c) => {
        if (c.tipo == 'registrado') {
          this.listadoClientes.push(c);
        }
      });
      // this.listadoClientes = clientes;
      // console.log('CLIENTES: ', clientes);
    });
    this.reservasServicio.traerReservas().subscribe((reservas: any) => {
      this.listadoReservas = [];
      reservas.forEach((r) => {
        this.listadoReservas.push(r);
      });
      console.log(this.listadoReservas);
    });
  }

  irAReservas() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.verListaDeClientes = false;
      this.verListaDeReservas = true;
    }, 1000);
  }

  irAEncuestas() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.router.navigate(['encuesta-de-supervisor']);
    }, 1000);
  }

  irAAltas() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.router.navigate(['home-registro-de-usuarios']);
    }, 1000);
  }

  irAClientes() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.verListaDeClientes = true;
      this.verListaDeReservas = false;
    }, 1000);
  }

  habilitarDeshabilitarCliente(cliente: any) {
    this.spinner = true;
    cliente.aprobado = !cliente.aprobado;
    this.firestoreService
      .actualizarUsuario(cliente)
      .then(() => {
        this.spinner = false;
        this.presentToast('Se actualizo el estado del cliente', 'success');
        if (cliente.aprobado) {
          this.emailService.enviarAvisoCuentaAprobada(cliente);
        } else {
          this.emailService.enviarAvisoCuentaDeshabilitada(cliente);
        }
      })
      .catch(() => {
        this.spinner = false;
        this.presentToast(
          'No se actualizo el estado del cliente',
          'danger',
        );
      });
  }

  habilitarDeshabilitarReserva(reserva: any) {
    this.spinner = true;
    reserva.aprobada = !reserva.aprobada;
    this.firestoreService
      .actualizarReserva(reserva)
      .then(() => {
        this.spinner = false;
        this.presentToast('Estado de reserva modificado', 'success');
      })
      .catch(() => {
        this.spinner = false;
        this.presentToast(
          'No se modifico el estado de la reserva',
          'danger',
        );
      });
  }

  async presentToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });

    await toast.present();
  }

  cerrarSesion() {
    this.spinner = true;
    this.authService.LogOut().then(() => {
      this.spinner = false;
    })
  }
      //NAVBAR
      onToggleSideNav(): void {
        this.screenWidth = 0
        this.isSideNavCollapsed = this.collapsed.collapsed;
      }
    
      toggleCollapse(): void {
        this.collapsed = !this.collapsed;
      }
    
      closeSidenav(): void {
        this.collapsed = false;
      }
}
