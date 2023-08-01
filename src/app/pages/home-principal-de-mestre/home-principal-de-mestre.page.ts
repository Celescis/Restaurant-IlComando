import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { PushService } from 'src/app/servicios/push.service';
import { ReservasClienteService } from 'src/app/servicios/reservas-cliente.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-home-principal-de-mestre',
  templateUrl: './home-principal-de-mestre.page.html',
  styleUrls: ['./home-principal-de-mestre.page.scss'],
})
export class HomePrincipalDeMestrePage implements OnInit {

  constructor(private pushService: PushService, public mesasSrv: MesasService, public auth: AuthService, public fire: FirestoreService,
    private reservasServicio: ReservasClienteService, private afs: AngularFirestore, private afAuth: AngularFireAuth, private router: Router) { }
  spinner: boolean = false;
  listadoClientes: any[] = [];
  mesasDisponibles: any[] = [];
  listadoReservas: any[] = [];
  screenWidth: any = 0;
  isSideNavCollapsed: any = false;
  collapsed: any = false;
  usuarioLogueado: any = null;
  verEncuestas: boolean = false;

  ngOnInit() {
    this.afAuth.authState.subscribe((user: any) => {
      if (user) {
        const usuariosCollection: AngularFirestoreCollection<User> = this.afs.collection<User>('usuarios');
        const usuarioQuery = usuariosCollection.ref.where('email', '==', user.email).limit(1);
        usuarioQuery.get().then((querySnapshot) => {
          if (querySnapshot.empty) {
          } else {
            this.usuarioLogueado = querySnapshot.docs[0].data() as User;
            this.auth.isLogged = true;
            console.log(this.usuarioLogueado);
          }
        });
      }
    });
    this.pushService.getUser();


    this.reservasServicio.traerReservas().subscribe(async (reservas: any) => {
      this.listadoReservas = [];
      const now = moment();

      reservas.forEach((r) => {
        if (r && r.aprobada) {

          const reservaFecha = moment(r.dia, 'YYYY/MM/DD');
          const reservaHora = moment(r.horario, 'HH:mm');

          const reservaCompleta = moment({
            year: reservaFecha.year(),
            month: reservaFecha.month(),
            date: reservaFecha.date(),
            hour: reservaHora.hours(),
            minute: reservaHora.minutes()
          });

          const diffMinutes = reservaCompleta.diff(now, 'minutes');

          if (diffMinutes > -10 && diffMinutes <= 40) {
            const mesaAsignada = r.mesa;
            this.afs.collection('mesas', ref => ref.where('numero', '==', r.mesa))
              .snapshotChanges()
              .pipe(take(1))
              .subscribe((mesas: any[]) => {
                if (mesas.length > 0) {
                  const mesaId = mesas[0].payload.doc.id;
                  this.afs.collection('mesas').doc(mesaId).update({ ocupada: true });
                } else {
                  console.log('La mesa no existe');
                }
              }, error => {
                console.error('Error al obtener la mesa:', error);
              });
          } else if (diffMinutes <= 10 && diffMinutes >= -10) {
            const mesaAsignada = r.mesa;
            const clienteActivo = r.cliente;

            this.mesasSrv.asignarCliente(mesaAsignada, clienteActivo);
            console.log('Mesa asignada automáticamente:', mesaAsignada);
          } else if (diffMinutes < -10) {
            this.afs.collection('mesas', ref => ref.where('numero', '==', r.mesa))
              .snapshotChanges()
              .pipe(take(1))
              .subscribe((mesas: any[]) => {
                if (mesas.length > 0) {
                  const mesaId = mesas[0].payload.doc.id;
                  this.afs.collection('mesas').doc(mesaId).update({ ocupada: false });
                } else {
                  console.log('La mesa no existe');
                }
              }, error => {
                console.error('Error al obtener la mesa:', error);
              });
            this.afs.collection('reservas').doc(r.uid).delete();
          }
          this.listadoReservas.push(r);
        }
      });

      console.log(this.listadoReservas);
    });






    this.mesasSrv.traerListaEspera().subscribe((clientes) => {
      this.listadoClientes = clientes;
    })

    this.mesasSrv.traerMesasDisponibles().subscribe((mesas) => {
      this.mesasDisponibles = mesas;
      console.log(this.mesasDisponibles);
    })
  }

  async asignarMesa(cliente: any, numeroMesa: number) {
    await this.mesasSrv.AsignarMesa(cliente, numeroMesa)
  }

  cerrarSesion() {
    this.spinner = true;
    this.auth.LogOut().then(() => {
      this.spinner = false;
    })

  }
  mostrarEncuestas() {
    this.verEncuestas = true;
    this.router.navigate(['encuesta-de-empleado']);
  }
  esconderEncuestas() {
    this.verEncuestas = false;
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