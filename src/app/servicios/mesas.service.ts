import { getFirestore } from '@angular/fire/firestore';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable, uploadString } from 'firebase/storage';
import { Router } from '@angular/router';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import * as firebase from 'firebase/compat';
import { ToastController } from '@ionic/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MesasService {

  numeroMesa: any;
  constructor(
    private vibration: Vibration, public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private router: Router,
    private toastController: ToastController
  ) { }

  async hacerPedido(pedido: any): Promise<string> {
    try {
      pedido.uid = await this.afs.createId();
      await this.afs.collection('pedidos').doc(pedido.uid).set(pedido).then(async () => {
        await this.presentToast('Se ha realizado el pedido exitosamente!', 'success',)
        return pedido.uid
      })
    }
    catch (err) {
      this.presentToast(
        'Se produjo un error',
        'danger',
      );
      this.vibration.vibrate(1000);

      console.log("error:", err)
      return null;
    }
  }

  TraerPedidos(estado: string) {
    const coleccion = this.afs.collection('pedidos', (ref) => ref.where('estado', '==', estado));
    return coleccion.valueChanges();
  }

  async BorrarPedidosPagados() {
    const collection = this.afs.collection('pedidos', ref => ref.where('estado', '==', "pagado"));
    const snapshot = await collection.get().toPromise();
  
    snapshot.docs.forEach(doc => {
      doc.ref.delete().then(() => {
        console.log(`Documento ${doc.id} eliminado con éxito`);
      }).catch(error => {
        console.log('Error eliminando el documento: ', error);
      });
    });
  }
  
  traerPedido(IdPedido: string) {
    return this.afs
      .collection('pedidos')
      .doc(IdPedido)
      .valueChanges()
  }

  actualizarPedido(pedido: any) {
    this.afs.collection("pedidos").doc(pedido.uid).update(pedido).catch((err) => {
      this.presentToast(
        'Se produjo un error',
        'danger',
      );
      this.vibration.vibrate(1000);

    }).then(() => {

    })
  }

  traerProductos() {
    const coleccion = this.afs.collection('productos');
    return coleccion.valueChanges();
  }

  traerMesasDisponibles() {
    const coleccion = this.afs.collection('mesas', ref => ref.where('ocupada', '==', false));
    return coleccion.valueChanges().pipe(
      map((mesas: any[]) => mesas.sort((a, b) => a.numero - b.numero))
    );
  }
  traerMesas() {
    const coleccion = this.afs.collection('mesas', ref => ref.orderBy('numero'));
    return coleccion.valueChanges();
  }

  traerListaEspera() {
    const coleccion = this.afs.collection('lista-de-espera');
    return coleccion.valueChanges();
  }
  
  async borrarDeListaEspera(cliente: any) {
    await this.afs.collection('lista-de-espera').doc(cliente.uid).delete().catch((err) => {
      this.presentToast('Se produjo un error al intentar borrar de la lista de espera', 'danger',);
      this.vibration.vibrate(1000);

    });
  }

  async AsignarMesa(cliente: any, mesa: number) {
    try {
      const coleccionEspera = this.afs.collection('lista-de-espera', (ref) => ref.where('uid', '==', cliente.uid));
      const snapshotEspera = await coleccionEspera.get().toPromise();

      snapshotEspera.forEach(async (clienteDoc) => {
        const clienteEncontrado: any = clienteDoc.data();
        await this.afs.collection('lista-de-espera').doc(clienteDoc.id).update({ mesaAsignada: mesa });
        const coleccionMesas = this.afs.collection('mesas', (ref) => ref.where('numero', '==', mesa));
        const snapshotMesas = await coleccionMesas.get().toPromise();

        snapshotMesas.forEach(async (mesaDoc) => {
          const mesaEncontrada: any = mesaDoc.data();
          await this.afs.collection('mesas').doc(mesaDoc.id).update({ ocupada: true });

          this.presentToast('Se ha asignado la mesa exitosamente', 'success');
          await this.borrarDeListaEspera(cliente);
        });
      });
    } catch (err) {
      this.presentToast('Se produjo un error al asignar la mesa', 'danger');
      this.vibration.vibrate(1000);
    }
  }

  async CambiarEstadoPedido(pedido: any, estado: string) {
    this.afs.collection('pedidos').doc(pedido.uid).update({ estado: estado, propina: pedido.propina, porcentajePropina: pedido.porcentajePropina }).catch((err) => {
      this.presentToast('Se produjo un error al aprobar', 'danger');
      this.vibration.vibrate(1000);

    }).finally(() => {
      this.presentToast('Se ha modificado el estado del pedido', 'success');
    })
  }

  async UpdatearPedidoBartender(pedido: any, estado: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.afs.collection('pedidos').doc(pedido.uid).update({ bartenderOk: estado })
        .then(() => {
          this.presentToast('Se ha actualizado el estado del pedido', 'success');
          resolve(); // Resuelve la promesa cuando se completa la actualización del pedido
        })
        .catch((err) => {
          this.presentToast('Se produjo un error al actualizar el pedido', 'danger');
          this.vibration.vibrate(1000);
          reject(err); // Rechaza la promesa si ocurre un error al actualizar el pedido
        });
    });
  }

  async UpdatearPedidoCocinero(pedido: any, estado: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.afs.collection('pedidos').doc(pedido.uid).update({ cocineroOk: estado })
        .then(() => {
          this.presentToast('Se ha actualizado el estado del pedido', 'success');
          resolve(); // Resuelve la promesa cuando se completa la actualización del pedido
        })
        .catch((err) => {
          this.presentToast('Se produjo un error al actualizar el pedido', 'danger');
          this.vibration.vibrate(1000);
          reject(err); // Rechaza la promesa si ocurre un error al actualizar el pedido
        });
    });
  }


  async DesaprobarPedido(pedido: any) {
    this.afs.collection('pedidos').doc(pedido.uid).delete().catch((err) => {
      this.presentToast('Se produjo un error al rechazar el pedido', 'danger');
      this.vibration.vibrate(1000);

    }).finally(() => {
      this.presentToast('Se ha rechazado el pedido exitosamente', 'success');
    })
  }

  async ConsultarMesaActiva(numeroMesa: number): Promise<Boolean> {
    let flagOcupada = false;
    const coleccion = await this.afs.collection('mesas', (ref) => ref.where('numero', '==', numeroMesa));
    await (await coleccion.get().toPromise()).docs.forEach(async (mesa: any) => {
      if (mesa.data().numero == numeroMesa) {
        flagOcupada = mesa.data().ocupada;
      }
    })
    return flagOcupada;
  }

  async asignarCliente(numeroMesa: number, cliente: any) {
    //Busco la mesa con ese numero
    const coleccion = await this.afs.collection('mesas', (ref) => ref.where('numero', '==', numeroMesa));
    await (await coleccion.get().toPromise()).docs.forEach(async (mesa) => {
      let mesaEncontrada: any = mesa.data()
      if (mesaEncontrada.numero == numeroMesa) {
        //al encontrarla agrego al usuario y la marco como ocupada
        await this.afs.collection('mesas').doc(mesa.id).update({ clienteActivo: cliente, ocupada: true }).catch((err) => {
          this.presentToast('Se produjo un error al asignar', 'danger');
          this.vibration.vibrate(1000);

        }).finally(async () => {
          //borro al cliente de la lista de espera
          const coleccion = await this.afs.collection('lista-de-espera', (ref) => ref.where('uid', '==', cliente.uid));
          await (await coleccion.get().toPromise()).docs.forEach(async (cliente) => {
            let clienteEncontrado: any = cliente.data()
            await this.afs.collection('lista-de-espera').doc(cliente.id).delete().catch((err) => {
              this.presentToast('Se produjo un error al asignar', 'danger');
              this.vibration.vibrate(1000);

            }).finally(() => {
              this.presentToast('Se asigno la mesa exitosamente', 'success');
            })
          })
        })
      }
    })
  }

  async desasignarCliente(numeroMesa: number) {
    const coleccion = await this.afs.collection('mesas', (ref) => ref.where('numero', '==', numeroMesa));
    await (await coleccion.get().toPromise()).docs.forEach(async (mesa) => {
      let mesaEncontrada: any = mesa.data()
      if (mesaEncontrada.numero == numeroMesa) {
        this.afs.collection('mesas').doc(mesa.id).update({ clienteActivo: null, ocupada: false }).catch((err) => {
          this.presentToast('Se produjo un error al desasignar', 'danger');
          this.vibration.vibrate(1000);

        }).finally(() => {
          this.presentToast('Se ha desasignado la mesa exitosamente', 'success');
        })
      }
    })
  }

  traerMozos() {
    const coleccion = this.afs.collection('usuarios', (ref) =>
      ref.where('perfil', '==', 'empleado').where('tipo', '==', 'mozo')
    );
    return coleccion.valueChanges();
  }

  traerCocineros() {
    const coleccion = this.afs.collection('usuarios', (ref) =>
      ref.where('perfil', '==', 'empleado').where('tipo', 'in', ['cocinero', "bartender"])
    );
    return coleccion.valueChanges();
  }

  async presentToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });

    await toast.present();
  }
}
