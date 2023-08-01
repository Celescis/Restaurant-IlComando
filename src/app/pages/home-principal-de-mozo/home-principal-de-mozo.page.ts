import { AuthService } from './../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { PushService } from 'src/app/servicios/push.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-home-principal-de-mozo',
  templateUrl: './home-principal-de-mozo.page.html',
  styleUrls: ['./home-principal-de-mozo.page.scss'],
})
export class HomePrincipalDeMozoPage implements OnInit {
  constructor(
    public mesasSrv: MesasService,
    private pushService: PushService,
    public auth: AuthService,
    public fire: FirestoreService,
    private router: Router,
    private afAuth: AngularFireAuth,
    public afs: AngularFirestore
  ) { }

  listadoPedidosNoAprobados: any[] = [];

  listadoPedidosPreparados: any[] = [];
  listadoPedidosEsperando: any[] = [];
  tokenCocinerosBartenders: string[] = [];

  MostrarPreparados: boolean = false;
  MostrarNoAprobados: boolean = true;
  MostrarConfirmacionPago: boolean = false;
  spinner: boolean;
  screenWidth: any = 0;
  isSideNavCollapsed: any = false;
  collapsed: any = false;
  usuarioLogueado: any;
  verEncuestas: boolean = false;

  ngOnInit() {
    this.afAuth.authState.subscribe((user: any) => {
      if (user) {
        const usuariosCollection: AngularFirestoreCollection<User> = this.afs.collection<User>('usuarios');
        const usuarioQuery = usuariosCollection.ref.where('email', '==', user.email).limit(1);
        usuarioQuery.get().then((querySnapshot) => {
          if (querySnapshot.empty) {
          } else {
            this.usuarioLogueado = querySnapshot.docs[0].data() as User;
            this.auth.isLogged = true;
            console.log(this.usuarioLogueado);
          }
        });
      }
    });
    this.pushService.getUser();
    this.mesasSrv.TraerPedidos('no aceptado').subscribe((pedidos) => {
      this.listadoPedidosNoAprobados = pedidos;
    });

    this.mesasSrv.TraerPedidos('cocinado').subscribe((pedidos) => {
      this.listadoPedidosPreparados = pedidos.filter((pedido: any) => {
        if (pedido.bartenderOk && pedido.cocineroOk) {
          return true;
        }
        if (pedido.bartenderOk && !pedido.cocineroOk && pedido.soloBartender && !pedido.soloCocinero) {
          return true;
        }
        if (!pedido.bartenderOk && pedido.cocineroOk && pedido.soloCocinero && !pedido.soloBartender) {
          return true;
        }
        return false;
      });
    });

    this.mesasSrv.TraerPedidos('esperando').subscribe((pedidos) => {
      this.listadoPedidosEsperando = pedidos;
    });

    this.mesasSrv.traerCocineros().subscribe((mozos: any) => {
      this.tokenCocinerosBartenders = [];
      mozos.forEach((element) => {
        if (element.token != '') {
          this.tokenCocinerosBartenders.push(element.token);
        }
      });
      console.log(this.tokenCocinerosBartenders);
    });
  }

  chatear() {
    this.spinner = true;

    setTimeout(() => {
      this.spinner = false;
      this.router.navigate(['chat'])
    }, 1000)
  }

  MostrarVistaPreparados() {
    this.MostrarPreparados = true;
    this.MostrarNoAprobados = false;
    this.MostrarConfirmacionPago = false;
  }

  MostrarVistaNoAprobados() {
    this.MostrarPreparados = false;
    this.MostrarNoAprobados = true;
    this.MostrarConfirmacionPago = false;
  }

  MostrarVistaAConfirmar() {
    this.MostrarPreparados = false;
    this.MostrarNoAprobados = false;
    this.MostrarConfirmacionPago = true;
  }

  AprobarPedido(pedido: any) {
    this.mesasSrv.CambiarEstadoPedido(pedido, 'aceptado').then(() => {
      this.enviarPushCocineros();
    });
  }

  ConfirmarPago(pedido: any) {
    this.mesasSrv.CambiarEstadoPedido(pedido, 'pagado').then(() => {
    });
  }

  enviarPushCocineros() {
    console.log(this.tokenCocinerosBartenders);
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenCocinerosBartenders,
        notification: {
          title: 'PEDIDO NUEVO',
          body: 'Un nuevo pedido fue aprobado',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  EntregarPedido(pedido: any) {
    this.mesasSrv.CambiarEstadoPedido(pedido, 'entregado');
  }

  RechazarPedido(pedido: any) {
    this.mesasSrv.DesaprobarPedido(pedido);
  }

  cerrarSesion() {
    this.spinner = true;
    this.auth.LogOut().then(() => {
      this.spinner = false;
    })
  }
  mostrarEncuestas() {
    this.verEncuestas = true;
    this.router.navigate(['encuesta-de-empleado']);
  }
  esconderEncuestas() {
    this.verEncuestas = false;
  }
  //NAVBAR
  onToggleSideNav(): void {
    this.screenWidth = 0
    this.isSideNavCollapsed = this.collapsed.collapsed;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  closeSidenav(): void {
    this.collapsed = false;
  }

  agruparProductos(pedido: any): any[] {
    const productosAgrupados = [];

    // Iterar sobre el arreglo de productos dentro del pedido
    pedido.productos.forEach((producto) => {
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