import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from 'firebase/storage';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { EmailService } from './email.service';
import { FirestoreService } from './firestore.service';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import firebase from 'firebase/compat/app';
// PUSH
import {
  PushNotifications,
} from '@capacitor/push-notifications';
import { environment } from 'src/environments/environment';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { MesasService } from './mesas.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private router: Router,
    private toastController: ToastController,
    private emailService: EmailService,
    private firestoreSevice: FirestoreService,
    private vibration: Vibration,
    private alertController: AlertController,
    private mesaService: MesasService
  ) {
    afAuth.authState.subscribe((user) => (this.isLogged = user));
  }

  public isLogged: any = false;
  UsuarioActivo: any = null;
  usuarioAnonimo: any = null;
  uidUser = '';
  sonidoCerrar: any = new Audio('/assets/logout.mp3');
  isSupervisor: any = false;
  isCliente: any = false;
  isBartender: any = false;
  isCocinero: any = false;
  isMetre: any = false;
  isMozo: any = false;

  async onRegister(user: any, subioFoto: boolean) {
    try {
      if (subioFoto) {
        user.foto = await this.subirArchivosString(user.foto);
      }
      await this.afAuth
        .createUserWithEmailAndPassword(user.email, user.contrasena)
        .then(async (cred) => {
          user.uid = cred.user.uid;
          user.token = '';
          await this.afs.collection('usuarios').doc(cred.user.uid).set(user);
          if (user.perfil == 'cliente' && user.tipo == 'registrado') {
            this.emailService.enviarAvisoPendienteAprobacion(user);
          }
        });

      return true;
    } catch (error) {
      this.presentToast(
        'Se produjo un error',
        'danger',
      );
      this.vibration.vibrate(1000);

      return false;
    }
  }

  async onRegisterAnonimo(user: any, subioFoto: boolean) {
    let id = new Date().getTime().toString();
    user.uid = id;
    try {
      if (subioFoto) {
        user.foto = await this.subirArchivosString(user.foto);
      }

      await this.afs.collection('usuarios').doc(id).set(user);
      this.UsuarioActivo = user;
      this.usuarioAnonimo = user;
      return true;
    } catch (error) {
      this.presentToast(
        'Se produjo un error',
        'danger',
      );
      this.vibration.vibrate(1000);

      return false;
    }
  }

  async userLogin(email: string, password: string) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      ).then(async (ret) => {
        this.uidUser = ret.user.uid;
        this.afs
          .collection('usuarios')
          .doc(this.uidUser)
          .valueChanges()
          .subscribe((usuario) => {
            this.UsuarioActivo = usuario;
          });
      });
    } catch (error: any) {
      console.log(error.code);
      this.presentToast(
        'El correo y/o la contraseña son incorrectos',
        'danger',
      );

      throw error;
    }
  }

  async subirArchivosString(foto: any): Promise<string> {
    var url: string = null;
    const storage = getStorage();

    const storageRef = await ref(
      storage,
      `imagenes/${this.formatDate(
        new Date().getHours() +
        ':' +
        new Date().getMinutes() +
        ':' +
        new Date().getSeconds()
      )}`
    );
    await uploadString(storageRef, foto, 'data_url').then(async (snapshot) => {
      await getDownloadURL(storageRef).then((downloadUrl) => {
        url = downloadUrl;
      });
    });
    return url;
  }

  async ChequearEmail(email: string): Promise<boolean> {
    let flag = false;
    await this.afAuth.fetchSignInMethodsForEmail(email).then((result) => {
      if (result.length != 0) {
        flag = true;
      }
    });
    return flag;
  }


  async LogOut() {
    await this.removeAllListeners();
    const aux: any = { ...this.UsuarioActivo };

    await this.afAuth.signOut();

    await new Promise(resolve => setTimeout(resolve, 1000));
    if (this.usuarioAnonimo) {
      this.BorrarUsuariosAnonimos(this.usuarioAnonimo.uid).then(() => {
        this.usuarioAnonimo = null;
      });
    }
    this.UsuarioActivo = null;
    aux.token = '';

    await this.firestoreSevice
      .actualizarUsuario(aux)
      .then(() => {
        this.sonidoCerrar.play();
        this.router.navigate(['login']);
      })
      .catch((error) => {
        console.log(error.message);
        this.presentAlert(error, "Error en auth:")
      });
  }


  async BorrarUsuariosAnonimos(uid: any) {
    const collection = this.afs.collection('usuarios', ref => ref.where('uid', '==', uid));
    const snapshot = await collection.get().toPromise();

    snapshot.docs.forEach(doc => {
      doc.ref.delete().then(() => {
        console.log(`Documento ${doc.id} eliminado con éxito`);
      }).catch(error => {
        console.log('Error eliminando el documento: ', error);
      });
    });
  }
  async BorrarPedidosAnonimos(uid: any) {
    const collection = this.afs.collection('pedidos', ref => ref.where('cliente.uid', '==', uid));
    const snapshot = await collection.get().toPromise();
    snapshot.docs.forEach((doc: any) => {
      this.mesaService.desasignarCliente(doc.mesa).then(() => {
        doc.ref.delete().then(() => {
          console.log(`Documento ${doc.id} eliminado con éxito`);
        }).catch(error => {
          console.log('Error eliminando el documento: ', error);
        });
      });
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

  formatDate = (date: any) => {
    return date.toLocaleString();
  };

  async removeAllListeners() {
    await PushNotifications.removeAllListeners();
  }

  async presentAlert(mensaje: any, header: any) {
    const alert = await this.alertController.create({
      header: header,
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();
  }
  //LOGIN CON GOOGLE ANDROID
  async loginWithGoogleAndroid() {
    try {
      const googleUser = await GoogleAuth.signIn();

      if (googleUser) {
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);

        // Inicia sesión en Firebase con la credencial
        const firebaseUserCredential = await firebase.auth().signInWithCredential(googleCredential);

        const firebaseUser = firebaseUserCredential.user;

        if (firebaseUser) {
          const usuarioRegistrado = await this.verificarUsuarioRegistrado(firebaseUser.email);

          if (usuarioRegistrado) {
            this.UsuarioActivo = usuarioRegistrado;
            this.uidUser = usuarioRegistrado.uid;
            return usuarioRegistrado;
          } else {
            const usuario = await this.registrarUsuarioGoogleAndroid(firebaseUser);
            this.uidUser = usuario.uid;
            this.UsuarioActivo = usuario;
            return usuario;
          }
        } else {
          console.log('No se pudo obtener el usuario de Firebase.');
        }
      } else {
        console.log('No se pudo iniciar sesión con Google.');
      }
    } catch (error) {
      console.error('Error en loginWithGoogleAndroid:', error);
    }

    return null;
  }


  async registrarUsuarioGoogleAndroid(user: any): Promise<any> {
    const displayNameParts = user.displayName.split(' ');
    const nombre = displayNameParts[0];
    const apellido = displayNameParts.slice(1).join(' ');
    const usuario = {
      uid: user.uid,
      email: user.email,
      apellido: apellido,
      nombre: nombre,
      foto: user.photoURL,
      perfil: "cliente",
      tipo: "registrado",
      aprobado: false,
      token: "",
    };
    await this.afs.collection('usuarios').doc(user.uid).set(usuario);
    return usuario;
  }

  //LOGIN CON GOOGLE WEB
  async loginWithGoogleWeb(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      if (result.user) {
        const user = result.user;
        // Verifico si el UID del usuario existe en la base de datos
        const usuarioRegistrado = await this.verificarUsuarioRegistrado(user.email);

        if (usuarioRegistrado) {
          // El usuario ya está registrado en la base de datos
          this.uidUser = usuarioRegistrado.uid;
          return usuarioRegistrado;
        } else {
          // Se registra
          const usuario = await this.registrarUsuarioGoogle(user);
          this.uidUser = usuario.uid;
          return usuario;
        }
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async verificarUsuarioRegistrado(email: string): Promise<any | null> {
    const querySnapshot = await this.afs.collection('usuarios', ref => ref.where('email', '==', email)).get().toPromise();
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      return null;
    }
  }

  async registrarUsuarioGoogle(user: any): Promise<any> {
    const displayNameParts = user.displayName.split(' ');
    const nombre = displayNameParts[0];
    const apellido = displayNameParts.slice(1).join(' ');
    const usuario = {
      uid: user.uid,
      email: user.email,
      apellido: apellido,
      nombre: nombre,
      foto: user.photoURL,
      perfil: "cliente",
      tipo: "registrado",
      aprobado: false,
      token: "",
    };
    await this.afs.collection('usuarios').doc(user.uid).set(usuario);
    return usuario;
  }
}
