import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-mesa-registro',
  templateUrl: './mesa-registro.page.html',
  styleUrls: ['./mesa-registro.page.scss'],
})
export class MesaRegistroPage implements OnInit {

  public forma!: FormGroup;
  src_imagen = "../../../assets/img/pizza.png"
  foto: any;
  spinner: boolean = false;

  constructor(public authService: AuthService,
    public afs: AngularFirestore,
    private fb: FormBuilder,
    private toastController: ToastController,
    private router: Router) {
    this.forma = this.fb.group({
      'comensales': ['', [Validators.required, Validators.min(1), Validators.max(12), Validators.pattern("^[0-9]*$")]],
      'numero': ['', [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]],
      'tipo': ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  async registrar() {
    console.log(this.forma.invalid)
    if (!this.foto) {
      this.presentToast('Agrege una foto', 'danger')
    }
    else {
      this.spinner = true
      this.presentToast('Registrando mesa...', 'success')
      var foto_url = await this.authService.subirArchivosString(this.foto)
      if (foto_url) {
        await this.afs.collection('mesas').doc().set({
          comensales: this.forma.get('comensales')!.value,
          numero: this.forma.get('numero')!.value,
          tipo: this.forma.get('tipo')!.value,
          foto: foto_url,
          clienteActivo: null,
          ocupada: false
        }).then(() => {
          this.forma.reset();
          this.presentToast('Se ha registrado la mesa exitosamente', 'success')
        }).catch((err) => {
          this.presentToast('Se produjo un error al registrar la mesa', 'danger')
        })
        this.spinner = false
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
      this.src_imagen = result.dataUrl
      this.foto = result.dataUrl
    }, (err) => {
      this.presentToast('Se produjo un error al sacar la foto', 'danger')
    })
  };


  async presentToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color
    });

    await toast.present();
  }

  irAMenuAltas() {
    this.spinner = true;
    setTimeout(() => {
      this.router.navigate(['home-registro-de-usuarios']);
      this.spinner = false;
    }, 1000)
  }
}
