import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QrscannerService } from '../../servicios/qrscanner.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ThisReceiver } from '@angular/compiler';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';


@Component({
  selector: 'app-home-pagar-cuenta',
  templateUrl: './home-pagar-cuenta.component.html',
  styleUrls: ['./home-pagar-cuenta.component.scss'],
})
export class HomePagarCuentaComponent implements OnInit {

  constructor(private vibration: Vibration, public scaner: QrscannerService, public mesasSrv: MesasService, private router: Router, private toastController: ToastController, private alertController: AlertController) { }

  @Input() pedido: any;
  @Output() pago?: EventEmitter<boolean> = new EventEmitter<boolean>();

  MostrarPropina = false;
  MostrarPagar = true;
  scanActivo = false;


  ngOnInit() { }
  async presentAlert(mensaje: any, header: any) {
    const alert = await this.alertController.create({
      header: header,
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();
  }
  agregarPropina() {
    this.MostrarPropina = true;
    this.MostrarPagar = false;
  }

  recibirPropina($event: number) {
    this.pedido.porcentajePropina = $event;
    this.pedido.propina = (this.pedido.total * this.pedido.porcentajePropina) / 100;
    this.MostrarPropina = false;
    this.MostrarPagar = true;
  }

  PagarFinal() {
    this.mesasSrv.CambiarEstadoPedido(this.pedido, "esperando").then(() => {
      this.presentToast(
        `El pago se ha realizado de manera exitosa.`,
        'success',
      );
      this.pago.emit(true);
    })
  }

  async escanear() {
    document.querySelector('body').classList.add('scanner-active');
    this.scanActivo = true;
    this.scaner.startScan().then((result) => {
      if (result == "propina") {
        this.scanActivo = false;
        this.MostrarPagar = false
        this.MostrarPropina = true

      }
      else {
        this.presentToast(
          `El QR escaneado no corresponde al de la propina.`,
          'danger',
        );
        this.vibration.vibrate(1000);

        this.scanActivo = false;
      }
    }).catch((err) => { console.log("Erorr: ", err.message) });
  }

  pararScan() {
    this.scanActivo = false;
    document.querySelector('body').classList.remove('scanner-active');
    this.scaner.stopScanner()
  }


  async presentToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });

    await toast.present();
  }

  agruparProductos(pedido: any[]): any[] {
    const productosAgrupados = [];

    // Iterar sobre el arreglo de productos
    pedido.forEach((producto) => {
      // Verificar si el producto ya está en el arreglo de productos agrupados
      const productoExistente = productosAgrupados.find((p) => p.nombre === producto.nombre);

      if (productoExistente) {
        // Si el producto ya existe, incrementar la cantidad
        productoExistente.cantidad++;
      } else {
        // Si el producto no existe, agregarlo al arreglo de productos agrupados
        productosAgrupados.push({
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
        });
      }
    });

    return productosAgrupados;
  }

}
