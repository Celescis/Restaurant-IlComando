import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { PushService } from 'src/app/servicios/push.service';
import { QrscannerService } from 'src/app/servicios/qrscanner.service';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { ReservasClienteService } from 'src/app/servicios/reservas-cliente.service';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';


interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-home-principal-de-cliente',
  templateUrl: './home-principal-de-cliente.page.html',
  styleUrls: ['./home-principal-de-cliente.page.scss'],

})
export class HomePrincipalDeClientePage implements OnInit {

  scanActivo: boolean = false;
  scanCoincide: boolean = false;
  contenido: any;
  spinner: boolean = false;
  verEncuestas: boolean = false;
  mostrarMenu: boolean = false;
  numeroMesaQR: number = null;
  estaEnLaLista: boolean = false;
  ingreso: boolean = false;
  clienteEncontrado: any = null;
  tokenMetres: string[] = [];
  numeroMesa: number = 0;
  escanerMesaOk: boolean = false;
  listadoReservas: any[] = [];
  screenWidth: any = 0;
  isSideNavCollapsed: any = false;
  collapsed: any = false;
  usuarioLogueado: any = null;
  mostrarCard: boolean = true;
  yaHayPedido: boolean = false;
  mesaYaHayPedido:any;

  constructor(public scaner: QrscannerService, private toastController: ToastController,
    private firestoreService: FirestoreService, public auth: AuthService, private mesasService: MesasService,
    public afs: AngularFirestore, private pushService: PushService,
    private router: Router, private vibration: Vibration, private reservasServicio: ReservasClienteService, private afAuth: AngularFireAuth, private alertController: AlertController) {
    this.scaner.scanPrepare();
    this.mostrarCard = true;
  }

  async ngOnInit() {
    this.mostrarCard = true;
    this.verEncuestas = false;
    if (this.auth.usuarioAnonimo) {
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
              const mesasCollection: AngularFirestoreCollection = this.afs.collection('mesas');
              const mesaQuery = mesasCollection.ref.where('clienteActivo.uid', '==', this.usuarioLogueado.uid).limit(1);
              mesaQuery.get().then((querySnapshotMesa) => {
                if (querySnapshotMesa.empty) {
                } else {
                  this.yaHayPedido = true;
                  this.mesaYaHayPedido= querySnapshotMesa.docs[0].data() as any;
                }
              });
            }
          });
        }
      });
    }

    this.mesasService.traerListaEspera()
      .subscribe(async (listadoEncuestasClientes) => {
        await listadoEncuestasClientes.forEach(async (cliente: any) => {
          if (this.usuarioLogueado) {
            if (cliente.uid == this.usuarioLogueado.uid) {//si esta en la lista y tiene mesa asignada
              if (cliente.mesaAsignada != null) {
                this.numeroMesa = cliente.mesaAsignada;
                this.presentToast('Se le asigno la mesa ' + this.numeroMesa + '!', 'success', 'thumbs-up-outline');
                this.estaEnLaLista = true;
              }
            }
            else {
              this.estaEnLaLista = false;
            }
          }
          else {
            if (cliente.uid == this.auth.usuarioAnonimo.uid) {
              if (cliente.mesaAsignada != null) {
                this.numeroMesa = cliente.mesaAsignada;
                this.presentToast('Se le asigno la mesa ' + this.numeroMesa + '!', 'success', 'thumbs-up-outline');
                this.estaEnLaLista = true;
              }
            }
            else {
              this.estaEnLaLista = false;
            }
          }
        });
      });
    this.firestoreService.traerMetres().subscribe((metres: any) => {
      this.tokenMetres = [];
      console.log('METRES', metres);
      metres.forEach((metre) => {
        if (metre.token != '') {
          this.tokenMetres.push(metre.token);
        }
      });
      console.log('TOKENS', this.tokenMetres);
    });

    this.reservasServicio.traerReservas().subscribe(async (reservas: any) => {
      this.listadoReservas = reservas;
      const now = moment(); // Obtener la fecha y hora actual
      reservas.forEach((r) => {
        if (r && r.cliente.uid == this.usuarioLogueado.uid && r.aprobada) {

          const reservaFecha = moment(r.dia, 'YYYY/MM/DD'); // Convertir la fecha de la reserva a objeto Moment
          const reservaHora = moment(r.horario, 'HH:mm'); // Convertir el horario de la reserva a objeto Moment
          console.log(now);
          // Combinar la fecha y el horario de la reserva en un solo objeto Moment
          const reservaCompleta = moment({
            year: reservaFecha.year(),
            month: reservaFecha.month(),
            date: reservaFecha.date(),
            hour: reservaHora.hours(),
            minute: reservaHora.minutes()
          });

          // Calcular la diferencia de tiempo entre la reserva completa y el momento actual
          const diffMinutes = reservaCompleta.diff(now, 'minutes');
          console.log(diffMinutes);
          // Comprobar si la diferencia de tiempo está dentro del rango de 40 minutos
          if (diffMinutes > 0 && diffMinutes <= 41) {

            // Asignar la mesa al cliente y actualizar los datos en la base de datos
            const mesaAsignada = r.mesa;
            console.log(r.mesa);
            this.afs.collection('mesas', ref => ref.where('numero', '==', r.mesa))
              .snapshotChanges()
              .pipe(take(1))
              .subscribe((mesas: any[]) => {
                if (mesas.length > 0) {
                  const mesaId = mesas[0].payload.doc.id;
                  this.afs.collection('mesas').doc(mesaId).update({ ocupada: true });
                } else {
                  // La mesa no se encontró
                  console.log('La mesa no existe');
                }
              }, error => {
                // Manejar el error en caso de que ocurra
                console.error('Error al obtener la mesa:', error);
              });
            // Asignar la mesa y actualizar los datos en la base de datos
          }
          else if (diffMinutes >= -10 && diffMinutes <= 0) {
            // Asignar la mesa al cliente y actualizar los datos en la base de datos
            const mesaAsignada = r.mesa;
            const clienteActivo = r.cliente;

            // Asignar la mesa y actualizar los datos en la base de datos
            this.mesasService.asignarCliente(mesaAsignada, clienteActivo);

            // Mostrar un mensaje o realizar las acciones adicionales necesarias
            console.log('Mesa asignada automáticamente:', mesaAsignada);
            this.presentToast('Se le asigno la mesa ' + r.mesa + '!', 'success', 'thumbs-up-outline');
          }
          else if (diffMinutes <= -10) {
            this.afs.collection('mesas', ref => ref.where('numero', '==', r.mesa))
              .snapshotChanges()
              .pipe(take(1))
              .subscribe((mesas: any[]) => {
                if (mesas.length > 0) {
                  const mesaId = mesas[0].payload.doc.id;
                  this.afs.collection('mesas').doc(mesaId).update({ ocupada: false });
                } else {
                  // La mesa no se encontró
                  console.log('La mesa no existe');
                }
              }, error => {
                // Manejar el error en caso de que ocurra
                console.error('Error al obtener la mesa:', error);
              });
            this.afs.collection('reservas').doc(r.uid).delete();
          }
        } else if (r && r.aprobada) {
          const reservaFecha = moment(r.dia, 'YYYY/MM/DD'); // Convertir la fecha de la reserva a objeto Moment
          const reservaHora = moment(r.horario, 'HH:mm'); // Convertir el horario de la reserva a objeto Moment
          console.log(now);
          // Combinar la fecha y el horario de la reserva en un solo objeto Moment
          const reservaCompleta = moment({
            year: reservaFecha.year(),
            month: reservaFecha.month(),
            date: reservaFecha.date(),
            hour: reservaHora.hours(),
            minute: reservaHora.minutes()
          });
          // Calcular la diferencia de tiempo entre la reserva completa y el momento actual
          const diffMinutes = reservaCompleta.diff(now, 'minutes');
          if (diffMinutes <= -10) {
            this.afs.collection('reservas').doc(r.uid).delete();
          }
        }
        else if (r && !r.aprobada) {
          const reservaFecha = moment(r.dia, 'YYYY/MM/DD'); // Convertir la fecha de la reserva a objeto Moment
          const reservaHora = moment(r.horario, 'HH:mm'); // Convertir el horario de la reserva a objeto Moment
          console.log(now);
          // Combinar la fecha y el horario de la reserva en un solo objeto Moment
          const reservaCompleta = moment({
            year: reservaFecha.year(),
            month: reservaFecha.month(),
            date: reservaFecha.date(),
            hour: reservaHora.hours(),
            minute: reservaHora.minutes()
          });
          // Calcular la diferencia de tiempo entre la reserva completa y el momento actual
          const diffMinutes = reservaCompleta.diff(now, 'minutes');
          if (diffMinutes <= -10) {
            this.afs.collection('reservas').doc(r.uid).delete();
          }
        }
      });

      console.log(this.listadoReservas);
    });
  }
  async escanearDocumento() {
    this.mostrarCard = false;
    this.verEncuestas = false;
    document.querySelector('body').classList.add('scanner-active');
    this.scanActivo = true;
    this.scaner.startScan().then((result) => {
      this.contenido = result;
      if (result == "ilcomandoresto") {
        this.scanActivo = false;
        this.scanCoincide = true;
        this.mostrarMenu = true;
      }
      else {
        this.presentToast('El código QR escaneado no pertenece al local!', 'danger', 'qr-code-outline');
        this.scanActivo = false;
        this.vibration.vibrate(1000);
      }
    }).catch((error) => {
      console.log('ERROR ESCANER HOME-CLIENTE: ', error);
      this.vibration.vibrate(1000);
    })
  }
  async presentToast(mensaje: string, color: string, icono: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color: color
    });

    await toast.present();
  }

  async entrarListaEspera() {
    this.mostrarCard = false;
    this.spinner = true;
    if (!this.estaEnLaLista) {
      if (this.usuarioLogueado) {
        await this.firestoreService.agregarAListaDeEspera(this.usuarioLogueado).catch(() => {
          this.presentToast('Ocurrió un error al ingresar a la lista de espera.', 'danger', 'alert-circle-outline');
          this.vibration.vibrate(1000);
        }).then(() => {
          this.enviarPushAMetre();
          this.presentToast('Ingreso en la lista de espera!', 'success', 'thumbs-up-outline');
        });
        this.spinner = false;
      }
      else {
        await this.firestoreService.agregarAListaDeEspera(this.auth.usuarioAnonimo).catch(() => {
          this.presentToast('Ocurrió un error al ingresar a la lista de espera.', 'danger', 'alert-circle-outline');
          this.vibration.vibrate(1000);
        }).then(() => {
          this.enviarPushAMetre();
          this.presentToast('Ingreso en la lista de espera!', 'success', 'thumbs-up-outline');
        });
        this.spinner = false;
      }
    } else {
      this.presentToast('Ya esta en la lista de espera', 'warning', 'alert-circle-outline');
      this.vibration.vibrate(1000);
    }

    this.spinner = false;
  }

  pararScan() {
    this.scanActivo = false;
    this.mostrarCard = true;
    document.querySelector('body').classList.remove('scanner-active');
    this.scaner.stopScanner();
  }

  mostrarEncuestas() {
    this.verEncuestas = true;
    this.mostrarCard = false;
  }
  esconderEncuestas() {
    this.verEncuestas = false;
    this.mostrarCard = true;
  }

  async escanearQRmesa() {
    document.querySelector('body').classList.add('scanner-active');
    this.scanActivo = true;
    await this.scaner.startScan().then(async (result) => {
      this.numeroMesaQR = parseInt(result);
      if (this.numeroMesaQR == 1 || this.numeroMesaQR == 2 || this.numeroMesaQR == 3 || this.numeroMesaQR == 4) {
        if (!this.ingreso) {
          if (this.numeroMesa != 0) {//tiene mesa asignada
            if (this.numeroMesaQR == this.numeroMesa) {
              this.scanActivo = false;
              this.spinner = true;
              if (this.usuarioLogueado) {
                await this.mesasService.asignarCliente(this.numeroMesa, this.usuarioLogueado).then(() => {
                  this.escanerMesaOk = true;
                  this.ingreso = true;
                  this.mesasService.numeroMesa = this.numeroMesa;
                  this.mostrarMenu = false;
                  setTimeout(() => {
                    this.spinner = false;
                    this.verEncuestas = true;
                    this.mostrarCard = false;
                    this.estaEnLaLista = false;
                    this.ingreso = false;
                    this.router.navigateByUrl('home-principal-mesa');
                  }, 1000);
                  this.presentToast('Mesa escaneada', 'success', 'qr-code-outline');
                  this.scanActivo = false;
                })
              }
              else {
                await this.mesasService.asignarCliente(this.numeroMesa, this.auth.usuarioAnonimo).then(() => {
                  this.escanerMesaOk = true;
                  this.ingreso = true;
                  this.mesasService.numeroMesa = this.numeroMesa;
                  this.mostrarMenu = false;
                  setTimeout(() => {
                    this.spinner = false;
                    this.verEncuestas = true;
                    this.mostrarCard = false;
                    this.estaEnLaLista = false;
                    this.ingreso = false;
                    this.router.navigateByUrl('home-principal-mesa');
                  }, 1000);
                  this.presentToast('Mesa escaneada', 'success', 'qr-code-outline');
                  this.scanActivo = false;
                })
              }
            }
            else {
              this.presentToast('Escanee la mesa correspondiente, su mesa es la ' + this.numeroMesa, 'danger', 'qr-code-outline');
              this.scanActivo = false;
              this.vibration.vibrate(1000);
            }
          }
          else //metre no asigno mesa CAMBIOS HECHO ACA!!!!!!
          {
            const mesasCollection = this.afs.collection('mesas');
            const mesaQuery = mesasCollection.ref.where('clienteActivo.uid', '==', this.auth.UsuarioActivo.uid).limit(1);
            mesaQuery.get().then(async (querySnapshot) => {
              if (querySnapshot.empty) {
                if (!await this.mesasService.ConsultarMesaActiva(this.numeroMesaQR)) {
                  this.presentToast('Mesa disponible', 'success', 'thumbs-up-outline');
                  this.scanActivo = false;
                } else {
                  this.presentToast('La mesa escaneada no se encuentra disponible!', 'danger', 'alert-circle-outline');
                  this.scanActivo = false;
                  this.vibration.vibrate(1000);
                }
                this.scanActivo = false;
              }
              else {
                const mesaEncontrada = querySnapshot.docs[0].data() as any;
                if (mesaEncontrada.numero === this.numeroMesaQR) {
                  this.scanActivo = false;
                  this.spinner = true;
                  this.escanerMesaOk = true;
                  this.ingreso = true;
                  this.mesasService.numeroMesa = this.numeroMesaQR;
                  this.mostrarMenu = false;
                  setTimeout(() => {
                    this.spinner = false;
                    this.verEncuestas = true;
                    this.mostrarCard = false;
                    this.estaEnLaLista = false;
                    this.ingreso = false;
                    this.router.navigateByUrl('home-principal-mesa');
                  }, 1000);
                  this.presentToast('Mesa escaneada', 'success', 'qr-code-outline');
                  this.scanActivo = false;

                }
                else {
                  this.presentToast('Escanee la mesa correspondiente, su mesa es la ' + mesaEncontrada.numero, 'danger', 'qr-code-outline');
                  this.vibration.vibrate(1000);
                  this.scanActivo = false;
                }
              }
            });
          }
        }
      }
      else {
        this.presentToast('Error el QR no pertenece a una mesa.', 'danger', 'qr-code-outline');
        this.vibration.vibrate(1000);
        this.scanActivo = false;
      }
    }).catch((error) => {
      this.presentToast('Error al escanear el QR de la mesa', 'danger', 'qr-code-outline');
      this.spinner = false;
      this.scanActivo = false;
      this.vibration.vibrate(1000);
    });
  }

  enviarPushAMetre() {
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenMetres,
        notification: {
          title: 'LISTA DE ESPERA',
          body: 'Hay un cliente en la lista de espera',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  async presentAlert(mensaje: any, header: any) {
    const alert = await this.alertController.create({
      header: header,
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  cerrarSesion() {
    this.spinner = true;
    this.auth.LogOut().then(() => {
      this.spinner = false;
    }).catch((error) => {
      this.spinner = false;
      this.presentAlert(error, "Error al cerrar la sesión:")
    })
  }


  irAReservas() {
    this.verEncuestas = false;
    this.mostrarCard = true;
    this.router.navigateByUrl('/reservas-cliente');
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
}
