import { Component, OnInit } from '@angular/core';
import { QrscannerService } from '../../servicios/qrscanner.service';
import { ToastController } from '@ionic/angular';
import { MesasService } from 'src/app/servicios/mesas.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { PushService } from 'src/app/servicios/push.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import Swal from 'sweetalert2'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-principal-mesa',
  templateUrl: './home-principal-mesa.page.html',
  styleUrls: ['./home-principal-mesa.page.scss'],
})
export class HomePrincipalMesaPage implements OnInit {

  constructor(
    private toastController: ToastController,
    public scaner: QrscannerService,
    public mesaSrv: MesasService,
    public auth: AuthService,
    private pushService: PushService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore) { }

  spinner: boolean = false;
  scanActivo = false;
  numeroMesa: number = 0;
  tokenMozos: string[] = [];
  llegoComida = false;
  scannerCorrecto: boolean = true;
  MostrarMenu = false;
  MostrarDetallePedido = false;
  MostrarPagar = false;
  MostrarJuego = false;
  MostrarJuego15 = false;
  MostrarJuego20 = false;
  SinElegir = true;
  usuarioLogueado: any;
  screenWidth: any = 0;
  isSideNavCollapsed: any = false;
  collapsed: any = false;
  pedido: any = { estado: 'no iniciado' };
  yaHayPedido: boolean = false;
  private subscription: Subscription;

  ngOnInit() {
    if (this.auth.usuarioAnonimo) {
      this.yaHayPedido = false;
      this.SinElegir = true;
      this.scannerCorrecto = true;
    }
    else {
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
              //TRAER PEDIDO DEL USUARIO
              const pedidosCollection = this.afs.collection('pedidos');
              const pedidoQuery = pedidosCollection.ref.where('cliente.uid', '==', this.usuarioLogueado.uid).limit(1);
              pedidoQuery.get().then((querySnapshot) => {
                if (!querySnapshot.empty) {
                  const docId = querySnapshot.docs[0].id;
                  const docRef = pedidosCollection.doc(docId);

                  this.subscription = docRef.valueChanges().subscribe(doc => {
                    this.pedido = doc as any;
                    this.yaHayPedido = true;
                    this.SinElegir = true;
                    this.scannerCorrecto = true;
                  });
                }
              });

            }
          });
        }
      });
    }

    this.numeroMesa = this.mesaSrv.numeroMesa;
    this.mesaSrv.traerMozos().subscribe((mozos: any) => {
      this.tokenMozos = [];
      mozos.forEach(element => {
        if (element.token != '') {
          this.tokenMozos.push(element.token);
        }
      });
    });
  }

  verEncuesta() {
    this.scanActivo = false;
    this.numeroMesa= 0;
    this.tokenMozos = [];
    this.llegoComida = false;
    this.scannerCorrecto = true;
    this.MostrarMenu = false;
    this.MostrarDetallePedido = false;
    this.MostrarPagar = false;
    this.MostrarJuego = false;
    this.MostrarJuego15 = false;
    this.MostrarJuego20 = false;
    this.SinElegir = true;
    this.pedido = { estado: 'no iniciado' };
    this.yaHayPedido = false;
    this.router.navigate(['encuesta-de-cliente']);
  }

  pago() {
    this.scanActivo = false;
    this.MostrarPagar = false;
    this.scannerCorrecto = true;
    this.mesaSrv.desasignarCliente(this.pedido.mesa);
  }

  consultarMozo() {
    this.enviarPushMozos();
    this.router.navigate(['chat']);
  }

  verMenu() {
    this.scannerCorrecto = false;
    this.MostrarMenu = true;
    this.SinElegir = false;
  }

  recibirPedido($event: any) {
    this.SinElegir = false;
    this.MostrarMenu = false;
    this.scannerCorrecto = true;
    this.pedido = $event;
    this.mesaSrv.traerPedido(this.pedido.uid).subscribe((pedido) => {
      this.pedido = pedido;
    });
  }

  consultarPedido() {
    this.MostrarDetallePedido = true;

    let horaFinal = new Date((new Date(this.pedido.comienzo.seconds * 1000)).getTime() + this.pedido.tiempoPreparacion * 60000)
    let ahora = new Date()
    let diffMs = (horaFinal.getTime() - ahora.getTime());
    var diffMins = Math.round(diffMs / 60000);
    diffMins;
    if (this.pedido.estado === 'no aceptado') {
      this.presentAlert("Su pedido está en proceso de revisión.")
    }
    else if (this.pedido.estado === 'aceptado') {
      this.presentAlert(`Su pedido esta preparandose, faltan aproximadamente: ${diffMins} minutos`)
    }
    else if (this.pedido.estado === 'cocinado' && this.pedido.bartenderOk === true && !this.pedido.cocineroOk && this.pedido.soloBartender && this.pedido.soloCocinero) {
      this.presentAlert(`Su pedido esta preparandose, faltan aproximadamente: ${diffMins} minutos`)
    }
    else if (this.pedido.estado === 'cocinado' && !this.pedido.bartenderOk && this.pedido.cocineroOk && this.pedido.soloCocinero && this.pedido.soloBartender) {
      this.presentAlert(`Su pedido esta preparandose, faltan aproximadamente: ${diffMins} minutos`)
    }
    else if (this.pedido.estado === 'cocinado' && !this.pedido.bartenderOk && this.pedido.cocineroOk && this.pedido.soloCocinero && !this.pedido.soloBartender) {
      this.presentAlert("Su pedido ya esta listo, en un momento se lo llevaremos.");
    }
    else if (this.pedido.estado === 'cocinado' && this.pedido.bartenderOk && !this.pedido.cocineroOk && !this.pedido.soloCocinero && this.pedido.soloBartender) {
      this.presentAlert("Su pedido ya esta listo, en un momento se lo llevaremos.");
    }
    else if (this.pedido.estado === 'cocinado' && this.pedido.bartenderOk === true && this.pedido.cocineroOk === true) {
      this.presentAlert("Su pedido ya esta listo, en un momento se lo llevaremos.");
    }
  }

  async presentAlert(mensaje: any) {
    Swal.fire({
      icon: 'info',
      title: 'ESTADO DEL PEDIDO',
      text: mensaje,
      backdrop: false,
      confirmButtonText: 'Aceptar'
    })
  }

  Jugar() {
    this.scannerCorrecto = false;
    this.SinElegir = false;
    this.MostrarJuego = true;
  }

  Jugar15() {
    this.scannerCorrecto = false;
    this.SinElegir = false;
    this.MostrarJuego15 = true;
  }

  Jugar20() {
    this.scannerCorrecto = false;
    this.SinElegir = false;
    this.MostrarJuego20 = true;
  }

  Pagar() {
    this.MostrarMenu = false;
    this.SinElegir = false;
    this.scannerCorrecto = false;
    this.MostrarDetallePedido = false;
    this.scanActivo = true;
    this.MostrarPagar = true;
    //pagar
  }

  LlegoComida() {
    this.llegoComida = true;
    this.mesaSrv.CambiarEstadoPedido(this.pedido, 'confirmado');
  }

  cerrarDetallePedido() {
    this.MostrarDetallePedido = false;
  }

  terminarJuego($event) {
    this.mesaSrv.actualizarPedido($event);
    this.MostrarJuego = false;
    this.scannerCorrecto = true;
  }

  terminarJuego15($event) {
    this.mesaSrv.actualizarPedido($event);
    this.MostrarJuego15 = false;
    this.scannerCorrecto = true;
  }
  terminarJuego20($event) {
    this.mesaSrv.actualizarPedido($event);
    this.MostrarJuego20 = false;
    this.scannerCorrecto = true;
  }

  enviarPushMozos() {
    console.log(this.tokenMozos);
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenMozos,
        notification: {
          title: 'CONSULTA DE CLIENTE',
          body: 'La mesa ' + this.numeroMesa + ' solicita de asistencia',
        },
      })
      .subscribe((data) => {
        this.presentToast('Sera atendido en un segundo!', 'success', 'thumbs-up-outline');
        console.log(data);
      });
  }

  volver2() {
    this.router.navigate(['/home-principal-de-cliente'], { queryParams: { mostrarDiv: true } });
  }

  async presentToast(mensaje: string, color: string, icono: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color
    });

    await toast.present();
  }

  volver() {
    this.MostrarMenu = false;
    this.MostrarPagar = false;
    this.MostrarJuego = false;
    this.MostrarJuego15 = false;
    this.MostrarJuego20 = false;
    this.SinElegir = true;
    this.router.navigate(['/carta']);
    this.router.navigate(['/home-principal-mesa']);
  }
  cerrarSesion() {
    this.spinner = true;
    this.auth.LogOut().then(() => {
      this.spinner = false;
    })
  }
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
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}