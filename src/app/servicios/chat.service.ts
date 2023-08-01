import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection?: AngularFirestoreCollection<any>;
  public mensajes: any[] = [];
  public userLog: any = {};
  elements: any;
  nuevoArray: any[] = [];

  constructor(private authService: AuthService, private afs: AngularFirestore) {
  }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<any>('mensajes-chat', ref =>
      ref.orderBy('fecha', 'asc').limit(20)
    );
    return this.itemsCollection.valueChanges().subscribe(mensajes => {
      this.mensajes = mensajes;
      this.nuevoArray = this.ordenarPorFecha(this.mensajes);
      console.log(this.nuevoArray);
    });
  }

  agregarMensaje(message: any) {

    let newMessage: any = {
      nombre: message.nombre,
      texto: message.texto,
      fecha: this.obtenerFechaActual(),
      uid: message.uid
    };

    return this.afs.collection('mensajes-chat').add(newMessage);
  }

  formatDate = (date: any) => {
    return date.toLocaleString()
  }

  ordenarPorFecha(array: any): any {
    return array.sort((a, b) => {
      const fechaA = this.parsearFecha(a.fecha);
      const fechaB = this.parsearFecha(b.fecha);

      return fechaA.getTime() - fechaB.getTime();
    });
  }

  parsearFecha(fecha: string): Date {
    const partes = fecha.split(/[/: ,]+/);
    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1;
    const anio = parseInt(partes[2]);
    const hora = parseInt(partes[3]);
    const minuto = parseInt(partes[4]);
    const segundo = parseInt(partes[5]);

    return new Date(anio, mes, dia, hora, minuto, segundo);
  }

  obtenerFechaActual(): string {
    const fecha = new Date();

    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses son base 0, por eso se suma 1
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');

    const fechaActual = `${dia}/${mes}/${anio}, ${horas}:${minutos}:${segundos}`;
    return fechaActual;
  }
}
