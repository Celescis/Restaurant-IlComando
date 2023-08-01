import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { EmailService } from 'src/app/servicios/email.service';
import { PushService } from 'src/app/servicios/push.service';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Platform } from '@ionic/angular';
import { MesasService } from 'src/app/servicios/mesas.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public form!: FormGroup;
  logo = '/assets/img/pizza.png';
  foto: any;
  // user: any = {};
  user = null;
  spinner: boolean = false;

  sonidoInicio: any = new Audio('/assets/login.mp3');

  constructor(
    private loadingCtrl: LoadingController,
    public authService: AuthService,
    public angularFirestore: AngularFirestore,
    private fb: FormBuilder,
    private toastController: ToastController,
    private router: Router,
    private vibration: Vibration,
    private platform: Platform,
    private alertController: AlertController,

  ) {
    this.spinner = false;
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.spinner = false;

  }

  login() {
    if (this.form.valid) {
      this.spinner = true;
      const email = this.form.getRawValue().email;
      const password = this.form.getRawValue().password;

      this.authService.userLogin(email, password)
        .then(async (data: any) => {

          this.authService.isLogged = false;
          const usuariosCollection = this.angularFirestore.collection('usuarios');
          const usuarioQuery = usuariosCollection.ref.where('email', '==', email).limit(1);
          console.log(usuarioQuery);
          usuarioQuery.get().then((querySnapshot) => {
            if (querySnapshot.empty) {
              this.spinner = false;
              this.presentToast(
                'El correo y/o la contraseña son incorrectos',
                'danger',
              );
              this.vibration.vibrate(1000);
            } else {
              this.sonidoInicio.play();
              const usuarioLogueado = querySnapshot.docs[0].data() as any;
              console.log(usuarioLogueado);
              if (usuarioLogueado.perfil == 'empleado') {
                this.spinner = false;
                this.presentToast('Se ha iniciado sesión exitosamente!', 'success');
                switch (usuarioLogueado.tipo) {
                  case 'cocinero':
                    this.router.navigate(['home-principal-de-cocinero']);
                    break;

                  case 'metre':
                    this.router.navigate(['home-principal-de-mestre']);
                    break;

                  case 'mozo':
                    this.router.navigate(['home-principal-de-mozo']);
                    break;
                  case 'bartender':
                    this.router.navigate(['home-principal-de-bartender']);
                    break;
                }
              } else if (usuarioLogueado.perfil == 'cliente') {
                if (usuarioLogueado.aprobado) {
                  this.presentToast('Se ha iniciado sesión exitosamente!', 'success');
                  this.spinner = false;
                  this.router.navigate(['home-principal-de-cliente']);
                } else {
                  this.spinner = false;
                  this.presentToast(
                    'Tu cuenta aún no ha sido aprobada',
                    'warning',
                  );
                  this.vibration.vibrate(1000);
                  this.authService.LogOut();
                }
              }
              else if (usuarioLogueado.perfil == 'supervisor' || usuarioLogueado.perfil == 'dueño') {
                this.presentToast('Se ha iniciado sesión exitosamente!', 'success',);
                this.router.navigate(['home-principal-de-supervisor']);
                this.spinner = false;
              } else {
                this.spinner = false;
                this.router.navigate(['home']);
              }
            }
          }).catch((error) => {
            this.spinner = false;
          });
        })
        .catch((error) => {
          this.spinner = false;
        });
    }
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Ingresando',
      spinner: 'bubbles',
      duration: 4000,
      cssClass: 'custom-loading',
    });

    loading.present();
  }

  async presentToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });

    await toast.present();
  }

  //@ts-ignore
  accesoRapidoCliente() {
    //@ts-ignore
    this.form.controls.email.setValue('cliente@cliente.com');
    //@ts-ignore
    this.form.controls.password.setValue('12345678');
    this.login();
  }

  accesoRapidoMetre() {
    //@ts-ignore
    this.form.controls.email.setValue('metre@metre.com');
    //@ts-ignore
    this.form.controls.password.setValue('12345678');
    this.login();
  }

  accesoRapidoCocinero() {
    //@ts-ignore
    this.form.controls.email.setValue('cocinero@cocinero.com');
    //@ts-ignore
    this.form.controls.password.setValue('12345678');
    this.login();
  }

  accesoRapidoMozo() {
    //@ts-ignore
    this.form.controls.email.setValue('mozo@mozo.com');
    //@ts-ignore
    this.form.controls.password.setValue('12345678');
    this.login();
  }

  accesoRapidoBartender() {
    //@ts-ignore
    this.form.controls.email.setValue('bartender@bartender.com');
    //@ts-ignore
    this.form.controls.password.setValue('12345678');
    this.login();
  }

  accesoRapidoSupervisor() {
    //@ts-ignore
    this.form.controls.email.setValue('supervisor@supervisor.com');
    //@ts-ignore
    this.form.controls.password.setValue('12345678');
    this.login();
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
      this.spinner = true;
      if (this.platform.is('android')) {
        const usuario = await this.authService.loginWithGoogleAndroid();

        if (usuario) {
          console.log("entra if")
          switch (usuario.perfil) {
            case 'cliente':
              this.sonidoInicio.play();
              this.spinner = false;
              console.log(usuario);
              if (usuario.aprobado) {
                this.router.navigate(['home-principal-de-cliente']);
              } else {
                this.presentToast(
                  'Tu cuenta debe ser aprobada',
                  'warning'
                );
                this.vibration.vibrate(1000);
              }
              break;
            case 'empleado':
              this.sonidoInicio.play();
              this.spinner = false;
              this.presentToast('Exito!', 'success');
              switch (usuario.tipo) {
                case 'cocinero':
                  this.router.navigate(['home-principal-de-cocinero']);
                  break;

                case 'metre':
                  this.router.navigate(['home-principal-de-mestre']);
                  break;

                case 'mozo':
                  this.router.navigate(['home-principal-de-mozo']);
                  break;
                case 'bartender':
                  this.router.navigate(['home-principal-de-bartender']);
                  break;
              }
              break;
            case 'supervisor':
              this.sonidoInicio.play();
              this.spinner = false;
              this.presentToast('Exito!', 'success');
              this.router.navigate(['home-principal-de-supervisor']);
              break;
            case 'dueño':
              this.sonidoInicio.play();
              this.spinner = false;
              this.presentToast('Exito!', 'success');
              console.log(usuario);
              this.router.navigate(['home-principal-de-supervisor']);
              break;
            default:
              this.spinner = false;
              this.router.navigate(['home']);
              break;
          }
        }
        this.spinner = false;
      }
    } catch (error) {
      this.spinner = false;
      console.error(error);
    }
  }

  //LOGIN CON GOOGLE WEB
  async loginWithGoogleWeb() {
    try {
      this.spinner = true;
      const usuario = await this.authService.loginWithGoogleWeb();

      if (usuario) {
        console.log("entra if")
        switch (usuario.perfil) {
          case 'cliente':
            this.sonidoInicio.play();
            this.spinner = false;
            console.log(usuario);
            if (usuario.aprobado) {
              this.router.navigate(['home-cliente']);
            } else {
              this.presentToast(
                'Tu cuenta debe ser aprobada',
                'warning'
              );
              this.vibration.vibrate(1000);
            }
            break;
          case 'empleado':
            this.sonidoInicio.play();
            this.spinner = false;
            this.presentToast('Exito!', 'success');
            switch (usuario.tipo) {
              case 'cocinero':
                this.router.navigate(['home-principal-de-cocinero']);
                break;

              case 'metre':
                this.router.navigate(['home-principal-de-mestre']);
                break;

              case 'mozo':
                this.router.navigate(['home-principal-de-mozo']);
                break;
              case 'bartender':
                this.router.navigate(['home-principal-de-bartender']);
                break;
            }
            break;
          case 'supervisor':
            this.sonidoInicio.play();
            this.spinner = false;
            this.presentToast('Exito!', 'success');
            this.router.navigate(['home-supervisor']);
            break;
          case 'dueño':
            this.sonidoInicio.play();
            this.spinner = false;
            this.presentToast('Exito!', 'success');
            console.log(usuario);
            this.router.navigate(['home-supervisor']);
            break;
          default:
            this.spinner = false;
            this.router.navigate(['home']);
            break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}