import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { LoadingController, ToastController } from '@ionic/angular';
import { Producto } from 'src/app/clases/producto';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

// SLIDES
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos-registro',
  templateUrl: './productos-registro.page.html',
  styleUrls: ['./productos-registro.page.scss'],
})
export class ProductosRegistroPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  formularioAlta: FormGroup;
  producto: any = {};
  src_imagen = "../../../assets/img/pizza.png";
  numeroImagen: number = 0;
  fotos_urls: any[] = [];
  fotos: any[] = [];
  spinner: boolean = false;

  constructor(public formBuilder: FormBuilder, private toastController: ToastController, private firestore: AngularFirestore, private authService: AuthService, private router: Router, private vibration: Vibration) {
    this.producto = new Producto();
    this.formularioAlta = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tiempoElaboracion: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      precio: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    });
  }

  ngOnInit() {
  }

  get nombre() {
    return this.formularioAlta.get('nombre');
  }
  get descripcion() {
    return this.formularioAlta.get('descripcion');
  }
  get tiempoElaboracion() {
    return this.formularioAlta.get('tiempoElaboracion');
  }
  get precio() {
    return this.formularioAlta.get('precio');
  }

  async registrar() {
    if (!(this.fotos.length === 3)) {
      this.presentToast(
        'Agregue las 3 fotos del producto',
        'danger',
      );
      this.vibration.vibrate(1000);
    }
    else {
      this.presentToast('Registrando el producto...', 'success')
      this.spinner = true;
      for (let index = 0; index < this.fotos.length; index++) {
        var foto_url = await this.authService.subirArchivosString(this.fotos[index]);
        this.fotos_urls.push(foto_url);
      }
      this.spinner = false;
      if (this.fotos_urls.length === 3) {
        this.spinner = true;
        await this.firestore.collection('productos').doc().set({
          nombre: this.formularioAlta.get('nombre')!.value,
          descripcion: this.formularioAlta.get('descripcion')!.value,
          tiempoElaboracion: this.formularioAlta.get('tiempoElaboracion')!.value,
          precio: this.formularioAlta.get('precio')!.value,
          fotos: this.fotos_urls,
          perfil: this.authService.UsuarioActivo.tipo,
        }).then(() => {
          if (this.authService.UsuarioActivo.tipo === 'cocinero') {

            this.numeroImagen = 0;
            this.presentToast('Registro de producto exitoso!', 'success')
            this.router.navigate(['home-principal-de-cocinero'])
            this.spinner = false;
          }
          else {
            this.numeroImagen = 0;
            this.presentToast('Registro de producto exitoso!', 'success')
            this.router.navigate(['home-principal-de-bartender'])
            this.spinner = false;
          }
        }).catch((err) => {
          this.presentToast('Se produjo un error en el registro', 'danger')
          this.vibration.vibrate(1000);

        })
      }

    }

  }

  async sacarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      promptLabelPhoto: 'Elegir de la galeria',
      promptLabelPicture: 'Sacar foto',
      promptLabelHeader: 'Foto',
      resultType: CameraResultType.DataUrl
    }).then((result) => {
      if (this.numeroImagen < 3) {
        this.numeroImagen++;
        this.fotos.push(result.dataUrl);
        console.log(this.numeroImagen);
      }
    }, (err) => {
      this.presentToast('Se produjo un error al sacar la foto', 'danger')
      this.vibration.vibrate(1000);
    })
  };
  async presentToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });

    await toast.present();
  }
  goToSlide() {
    let indice;
    this.slides.getActiveIndex().then((i) => {
      indice = i;
      if (indice == 0) {
        this.slides.slideTo(1, 500);
      } else {
        this.slides.slideTo(0, 500);
      }
      this.presentToast(
        'Complete todos los campos',
        'warning',
      );
    });
  }

  goToSlide2() {
    let indice;
    this.slides.getActiveIndex().then((i) => {
      indice = i;
      if (indice == 0) {
        this.slides.slideTo(1, 500);
      } else {
        this.slides.slideTo(0, 500);
      }
    });
  }

  irAMenuAltas() {
    this.spinner = true;
    if (this.authService.UsuarioActivo.tipo === 'cocinero') {
      setTimeout(() => {
        this.router.navigate(['home-principal-de-cocinero']);
        this.spinner = false;
      }, 1000)
    }
    else {
      setTimeout(() => {
        this.router.navigate(['home-principal-de-bartender']);
        this.spinner = false;
      }, 1000)
    }
  }

}
