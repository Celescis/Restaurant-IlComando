import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home-dejar-propina',
  templateUrl: './home-dejar-propina.component.html',
  styleUrls: ['./home-dejar-propina.component.scss'],
})
export class HomeDejarPropinaComponent implements OnInit {
  @Output() PasamosPropina: EventEmitter<number> =
    new EventEmitter<number>();

  porcentajePropina: number;
  spinner: boolean = false;

  constructor(private toastController: ToastController) { }

  ngOnInit() {

  }

  agregarPropina(opcion: number) {
    this.spinner = true;

    switch (opcion) {
      case 4:
        this.porcentajePropina = 20;
        break;
      case 3:
        this.porcentajePropina = 15;
        break;
      case 2:
        this.porcentajePropina = 10;
        break;
      case 1:
        this.porcentajePropina = 5;
        break;
      case 0:
        this.porcentajePropina = 0;
        break;
    }

    this.PasamosPropina.emit(this.porcentajePropina);
    this.presentToast(
      `Se ha agregado un ${this.porcentajePropina}% de propina`,
      'success',
    );
    this.spinner = false;
  }

  async presentToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      color: color,
    });

    await toast.present();
  }
}
