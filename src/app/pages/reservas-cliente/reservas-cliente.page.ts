import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { MesasService } from 'src/app/servicios/mesas.service';
import { take, toArray } from 'rxjs/operators';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { PushService } from 'src/app/servicios/push.service';
import { ReservasClienteService } from 'src/app/servicios/reservas-cliente.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2'

interface Reservation {
  date: moment.Moment;
  time: moment.Moment;
}

@Component({
  selector: 'app-reservas-cliente',
  templateUrl: './reservas-cliente.page.html',
  styleUrls: ['./reservas-cliente.page.scss'],
})
export class ReservasClientePage implements OnInit {
  mesaSeleccionada: any;
  date: string;
  time: string;
  reservations: Reservation[];
  mesasDisponibles: Observable<unknown[]>;
  nuevoArrayMesas;
  mesaData: any;
  mesaTraida: any;
  dia: any;
  horario: any;
  reservasArray: any[] = [];
  reservasCliente: any[] = [];
  tokenSupervisores: string[] = [];
  listadoReservas: any[] = [];
  usuarioLogueado: any;
  reserva: any;


  constructor(private toastController: ToastController, private mesaService: MesasService, private afs: AngularFirestore
    , private auth: AuthService, private firestore: FirestoreService, private pushService: PushService, private reservasServicio: ReservasClienteService, private afAuth: AngularFireAuth) {
    this.reservations = [];
    this.mesasDisponibles = this.mesaService.traerMesas();
  }

  async ngOnInit() {
    this.afAuth.authState.subscribe((user: any) => {
      if (user) {
        const usuariosCollection: AngularFirestoreCollection<User> = this.afs.collection<User>('usuarios');
        const usuarioQuery = usuariosCollection.ref.where('email', '==', user.email).limit(1);
        usuarioQuery.get().then((querySnapshot) => {
          if (querySnapshot.empty) {
          } else {
            this.usuarioLogueado = querySnapshot.docs[0].data() as User;
            if (this.usuarioLogueado.perfil == 'cliente' && this.usuarioLogueado.aprobado) {
              this.auth.isLogged = true;
              this.auth.isCliente = true;
            }
            if (this.usuarioLogueado.perfil == 'supervisor') {
              this.auth.isSupervisor = true;
            }
            else if (this.usuarioLogueado.perfil == 'bartender' && this.auth.isLogged) {
              this.auth.isBartender = true;
            }
            else if (this.usuarioLogueado.perfil == 'mozo' && this.usuarioLogueado.isLogged) {
              this.auth.isMozo = true;
            }
            else if (this.usuarioLogueado.perfil == 'metre' && this.usuarioLogueado.isLogged) {
              this.auth.isMetre = true;
            }
            else if (this.usuarioLogueado.perfil == 'cocinero' && this.usuarioLogueado.isLogged) {
              this.auth.isCocinero = true;
            }
            else {
              this.auth.isLogged = false;
              this.auth.isMozo = false;
              this.auth.isCliente = false;
              this.auth.isCocinero = false;
              this.auth.isMetre = false;
              this.auth.isSupervisor = false;
            }
            this.obtenerReservasCliente();
          }
        });
      }
    });

    this.firestore.traerSupervisores().subscribe((supervisores: any) => {
      this.tokenSupervisores = [];
      supervisores.forEach((sup) => {
        if (sup.token != '') {
          this.tokenSupervisores.push(sup.token);
        }
      });
      // console.log(this.tokenSupervisores);
    });

  }

  onMesaChange() {
    this.mesaTraida = this.mesaSeleccionada;
  }

  async makeReservation() {
    const reservationDate = moment(this.date, 'YYYY-MM-DD');
    const reservationTime = moment(this.time, 'HH:mm');

    if (!reservationDate.isValid() || !reservationTime.isValid()) {
      const toast = await this.toastController.create({
        message: 'Debe elegir el día y horario de la reserva.',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
      return;
    }

    const now = moment();
    if (reservationDate.isBefore(now, 'day') || (reservationDate.isSame(now, 'day') && reservationTime.isBefore(now, 'minute'))) {
      const toast = await this.toastController.create({
        message: 'No se pueden hacer reservas en el pasado.',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
      return;
    }

    this.dia = reservationDate.format('YYYY-MM-DD');
    this.horario = reservationTime.format('HH:mm')

    const numeroMesa = parseInt(this.mesaTraida);

    const reserva = {
      dia: this.dia,
      horario: this.horario,
      cliente: this.usuarioLogueado,
      aprobada: false,
      mesa: numeroMesa,
    };

    this.reservasServicio.traerReservas()
      .pipe(take(1))
      .subscribe(async (reservas: any) => {
        if (reservas.length > 0) {
          const reservationDateTime = moment(`${reserva.dia} ${reserva.horario}`, 'YYYY/MM/DD HH:mm');
          const reservationTimeStart = reservationDateTime.clone().subtract(1, 'hour');
          const reservationTimeEnd = reservationDateTime.clone().add(1, 'hour');

          const conflictingReservations = reservas.filter((reservaExistente: any) => {
            const reservaDateTime = moment(`${reservaExistente.dia} ${reservaExistente.horario}`, 'YYYY/MM/DD HH:mm');
            return (
              (reservaExistente.mesa === reserva.mesa) &&
              (reservaDateTime.isBetween(reservationTimeStart, reservationTimeEnd, null, '[]') ||
                reservaDateTime.isSame(reservationDateTime))
            );
          });

          if (conflictingReservations.length > 0) {
            const toast = this.toastController.create({
              message: 'Ya existe una reserva en ese horario.',
              duration: 2000,
              position: 'bottom',
              color: 'danger',
            });
            (await toast).present();
            return;
          }
          if (this.reservasCliente.length > 0) {
            const toast = await this.toastController.create({
              message: 'Solo puedes tener una reserva, puedes cancelar la existente y reservar otra vez',
              duration: 2000,
              position: 'bottom',
              color: 'danger',
            });
            toast.present();
            return;
          }

        }
      });

    // Guardar la reserva en la base de datos solo si no hay conflictos
    this.mesaSeleccionada = 0;
    this.date = '';
    this.time = '';

    const reservation = {
      dia: this.dia,
      horario: this.horario,
      cliente: this.usuarioLogueado,
      aprobada: false,
      mesa: numeroMesa,
    };

    const reservaRef = await this.afs.collection('reservas').add(reservation);
    const reservaId = reservaRef.id;

    // Actualizar el documento de la reserva con el campo "uid"
    await this.afs.collection('reservas').doc(reservaId).update({ uid: reservaId }).then(() => {
      this.presentAlert("Se ha creado la reserva exitosamente! Recuerde que tiene 10 minutos de tolerancia para ingresar.")
      this.obtenerReservasCliente();
      this.enviarPushASupervisores();
    });
  }

  async presentAlert(mensaje: any) {
    Swal.fire({
      icon: 'success',
      title: 'RESERVA EXITOSA',
      text: mensaje,
      backdrop: false,
      confirmButtonText: 'Aceptar'
    })
  }
  obtenerReservasCliente() {
    this.reservasCliente = [];
    const reservasCollection: AngularFirestoreCollection<any> = this.afs.collection<any>('reservas');
    const reservaQuery = reservasCollection.ref.where('cliente.uid', '==', this.usuarioLogueado.uid).limit(1);

    reservaQuery.get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        this.reserva = querySnapshot.docs[0].data() as any;
        this.reservasCliente.push(this.reserva);
      }
    });
  }


  async presentToast(mensaje: string, color: string, icono: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color: color,
    });

    await toast.present();
  }

  async cancelarReserva(reserva: any) {
    await this.afs.collection('reservas').doc(reserva.uid).delete();
    this.reservasCliente = [];
    this.obtenerReservasCliente();
    this.presentToast("Se ha cancelado la reserva exitosamente", "success", "success");
  }



  enviarPushASupervisores() {
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenSupervisores,
        notification: {
          title: 'RESERVA',
          body: 'Un cliente ha hecho una reserva',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }
}