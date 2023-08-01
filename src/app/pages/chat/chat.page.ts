import { AuthService } from 'src/app/servicios/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/servicios/chat.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '@angular/fire/auth';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {


  mensajes: any[];
  mensaje: string;
  esCliente: boolean = false;
  spinner: boolean;
  usuarioLogueado: any;
  chatroom = 'mensajes-pps4a';
  constructor(public mesasSrv: MesasService, private toastController: ToastController, public router: Router, public chatService: ChatService, public authService: AuthService, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    window.scrollTo(0, document.body.scrollHeight);
  }

  ngOnInit() {
    if (this.authService.usuarioAnonimo) {

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
              this.authService.isLogged = true;
              console.log(this.usuarioLogueado);
            }
          });
        }
      });
    }
    if (this.authService.UsuarioActivo.perfil == "cliente") {
      this.esCliente = true;
    }
    this.chatService.cargarMensajes();
    this.scrollToTheLastElementByClassName();
  }

  atras() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      if (this.authService.UsuarioActivo.perfil == "cliente") {
        this.router.navigate(['home-principal-mesa'])
      }
      else {
        this.router.navigate(['home-principal-de-mozo'])
      }
    }, 1000)
  }

  enviarMensaje() {
    let nombre = ""
    if (this.authService.UsuarioActivo.perfil == "empleado") {
      nombre = "mozo"
    }
    else {
      nombre = "mesa " + this.mesasSrv.numeroMesa
    }
    console.log(this.authService.UsuarioActivo.uid)
    var nuevoMensaje =
    {
      uid: this.authService.UsuarioActivo.uid,
      nombre: nombre,
      texto: this.mensaje,
    }
    this.chatService.agregarMensaje(nuevoMensaje)
    this.mensaje = '';
    this.scrollToTheLastElementByClassName();
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

  scrollToTheLastElementByClassName() {
    const elements = document.getElementsByClassName('mensajes');
    const lastElement: any = elements[elements.length - 1];
    const contenedorMensajes = document.getElementById('fondo');
    let toppos: any = [];
    if (lastElement != null) {
      toppos = lastElement.offsetTop;
    }
    if (contenedorMensajes != null) {
      contenedorMensajes.scrollTop = toppos;
    }
  }
}