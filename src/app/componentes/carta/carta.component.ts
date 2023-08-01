import { Cliente } from './../../clases/cliente';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MesasService } from 'src/app/servicios/mesas.service';
import { AlertController, ToastController } from '@ionic/angular';
import { PushService } from 'src/app/servicios/push.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '@angular/fire/auth';
import { AuthService } from 'src/app/servicios/auth.service';


@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.scss'],
})
export class CartaComponent implements OnInit {

  listadoProductos: any[] = [];
  pedido: any[] = [];
  total = 0
  MostrarMenu = true
  MostrarPedido = false
  spinner = false
  tiempoMaximo = 0;
  tokenMozos: string[] = [];
  soloCocinero: boolean = false;
  soloBartender: boolean = false;
  usuario: any = null;
  usuarioLogueado: any;
  pedidoFormato: any= {};
  @Input() numeroMesa: any;
  @Output() pedidoFinal?: EventEmitter<any> = new EventEmitter<any>();

  constructor(private alertController: AlertController, private toastController: ToastController, public mesasSrv: MesasService, private pushService: PushService, private afAuth: AngularFireAuth, private afs: AngularFirestore, private auth: AuthService) {
    this.MostrarMenu = true;
    this.MostrarPedido = false;
  }

  ngOnInit() {
    this.MostrarMenu = true;
    this.MostrarPedido = false;
    if (this.auth.usuarioAnonimo) {
      this.usuario = this.auth.usuarioAnonimo;
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
              this.auth.isLogged = true;
              this.usuario = this.usuarioLogueado;
            }
          });
        }
      });
    }
    this.mesasSrv.traerProductos().subscribe((productos) => {
      this.listadoProductos = productos;
    });

    this.spinner = true
    setTimeout(() => {
      this.spinner = false
    }, 2000);

    this.mesasSrv.traerMozos().subscribe((mozos: any) => {
      this.tokenMozos = []
      mozos.forEach(element => {
        if (element.token != '') {
          this.tokenMozos.push(element.token);
        }
      });
    })
  }

  enviarPushMozos() {
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenMozos,
        notification: {
          title: 'PEDIDO NUEVO',
          body: 'En la mesa ' + this.numeroMesa + ' hicieron un pedido',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }



  async hacerPedido() {
    try {
      this.spinner = true;

      const productosCocinero = this.pedido.filter(producto => producto.perfil === "cocinero");
      const productosBartender = this.pedido.filter(producto => producto.perfil === "bartender");

      if (productosBartender.length > 0 && productosCocinero.length > 0) {
        this.soloCocinero = true;
        this.soloBartender = true;
      }
      else if (productosBartender.length > 0 && productosCocinero.length == 0) {
        this.soloBartender = true;
      }
      else {
        this.soloCocinero = true;
      }

      this.pedidoFormato = {
        productos: this.pedido,
        estado: "no aceptado",
        total: this.total,
        mesa: this.numeroMesa,
        tiempoPreparacion: this.tiempoMaximo,
        comienzo: new Date(),
        propina: 0,
        descuentoJuego: 0,
        jugo: false,
        porcentajePropina: 0,
        uid: "",
        soloCocinero: this.soloCocinero,
        soloBartender: this.soloBartender,
        cliente: this.usuario,
      };

      await this.mesasSrv.hacerPedido(this.pedidoFormato);
      this.spinner = false;
      this.pedidoFinal.emit(this.pedidoFormato);
      this.enviarPushMozos();

    } catch (error) {
      console.log('Error en hacerPedido:', error);
    } finally {
    // limpieza
    this.MostrarMenu = true;
    this.MostrarPedido = false;
    this.soloCocinero = false;
    this.soloBartender = false;
    this.pedido = [];
    this.total = 0;
    this.pedidoFormato = {};
    }
  }

  agregarAlPedido(Producto: any) {
    this.pedido.push(Producto);
    this.actualizarTotal();
  }

  quitarDelPedido(Producto: any) {
    let index;
    index = this.pedido.find(prod => prod.uid == Producto.uid)
    if (index) {
      this.pedido.splice(index, 1);
    }
    this.actualizarTotal()
  }

  actualizarTotal() {
    this.total = 0
    let banderaPrime = true;
    this.pedido.forEach(prod => {

      if (banderaPrime) {
        this.tiempoMaximo = prod.tiempoElaboracion
        banderaPrime = false
      }
      else {
        if (prod.tiempoElaboracion > this.tiempoMaximo) { this.tiempoMaximo = prod.tiempoElaboracion }
      }
      this.total = this.total + parseFloat(prod.precio)
    });
  }
  async presentAlert(header: any, mensaje: any) {
    const alert = await this.alertController.create({
      header: header,
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  verPedido() {
    this.MostrarMenu = false;
    this.MostrarPedido = true;
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
