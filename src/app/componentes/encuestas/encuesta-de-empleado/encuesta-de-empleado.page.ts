import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { EncuestasService } from 'src/app/servicios/encuestas.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-encuesta-de-empleado',
  templateUrl: './encuesta-de-empleado.page.html',
  styleUrls: ['./encuesta-de-empleado.page.scss'],
})
export class EncuestaDeEmpleadoPage implements OnInit {


  @ViewChild(IonSlides) slides: IonSlides;
  foto: any;
  public forma!: FormGroup;
  spinner: boolean;
  respuesta: any = {}
  constructor(private fb: FormBuilder,
    private toastController: ToastController,
    public authService: AuthService,
    private router: Router,
    private encuestas: EncuestasService,
    public auth: AuthService,
    public angularFirestore: AngularFirestore) {
    this.forma = this.fb.group({
      'satisfaccion': ['', [Validators.required]],
      'comentario': [''],
      'aTiempo': ['', [Validators.required]],
      'companeros': ['', [Validators.required]],
      'clientes': ['', [Validators.required]]
    });
  }

  src_imagen = "../../../assets/accesos/metre.png"
  si: boolean
  no: boolean
  valorRespuesta: boolean;
  respondio: boolean = false;

  ngOnInit() {

  }

  agregarRespuesta() {
    if (!this.foto) {
      this.presentToast('Agregue una foto para continuar', 'danger')
    }
    else {
      let acomodados;
      this.respuesta =
      {
        satisfaccion: this.forma.get('satisfaccion')!.value,
        comentario: this.forma.get('comentario')!.value,
        aTiempo: this.forma.get('aTiempo')!.value,
        companeros: this.forma.get('companeros')!.value,
        clientes: this.valorRespuesta,
        foto: this.foto,
        empleado: this.authService.UsuarioActivo
      }
      if (this.encuestas.agregarRespuestaEmpleados(this.respuesta)) {
        this.spinner = true;

        setTimeout(() => {
          this.spinner = false;
          this.presentToast('Se ha enviado la encuesta exitosamente', 'success')
          this.encuestas.respondio = true;
          switch (this.authService.UsuarioActivo.tipo) {
            case "mozo":
              this.router.navigate(["home-principal-de-mozo"])
              break;

            case "metre":
              this.router.navigate(["home-principal-de-mestre"])

              break;

            case "bartender":
              this.router.navigate(["home-principal-de-bartender"])
              break;

            case "cocinero":
              this.router.navigate(["home-principal-de-cocinero"])

              break;
          }
        }, 1000)
      }
    }
  }

  Saltear() {
    this.spinner = true;

    setTimeout(() => {
      this.spinner = false;
      this.encuestas.respondio = true;
      switch (this.authService.UsuarioActivo.tipo) {
        case "mozo":
          this.router.navigate(["home-principal-de-mozo"])
          break;

        case "metre":
          this.router.navigate(["home-principal-de-mestre"])

          break;

        case "bartender":
          this.router.navigate(["home-principal-de-bartender"])
          break;

        case "cocinero":
          this.router.navigate(["home-principal-de-cocinero"])

          break;
      }
    }, 1000)
  }

  onValorCapturado(value: any) {
    if (value == 1) {
      this.si = true
      this.no = false;
      this.valorRespuesta = true;
    }
    else {
      this.no = true
      this.si = false;
      this.valorRespuesta = false;
    }
  }

  goToSlides() {
    let indice;
    this.slides.getActiveIndex().then((i) => {
      indice = i;
      if (indice == 0) {
        this.slides.slideTo(1, 500)
      }
      else {
        this.slides.slideTo(0, 500)
      }
    })
  }

  goToSlides1() {
    this.slides.slideTo(0, 500)
  }

  goToSlides2() {
    this.slides.slideTo(1, 500)
  }


  async sacarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      promptLabelPhoto: 'Elegir de la galería',
      promptLabelPicture: 'Sacar foto',
      promptLabelHeader: 'Foto',
      resultType: CameraResultType.DataUrl
    }).then((result) => {
      this.src_imagen = result.dataUrl
      this.foto = result.dataUrl
    }, (err) => {
      this.presentToast('Se produjo un error al intentar sacar una foto', 'danger')
    })
  };

  async presentToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      color: color
    });

    await toast.present();
  }

  cerrarSesion() {
    this.spinner = true;
    this.authService.LogOut().then(() => {
      this.spinner = false;
    })
  }
}