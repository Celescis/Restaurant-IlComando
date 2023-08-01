import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { PushService } from 'src/app/servicios/push.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-home-principal-de-bartender',
  templateUrl: './home-principal-de-bartender.page.html',
  styleUrls: ['./home-principal-de-bartender.page.scss'],
})
export class HomePrincipalDeBartenderPage implements OnInit {
  constructor(public mesasSrv: MesasService,
    private pushService: PushService,
    public auth: AuthService,
    public fire: FirestoreService,
    private router: Router,
    private afAuth: AngularFireAuth,
    public afs: AngularFirestore) { }

  listadoPedidosAprobados: any[] = [];
  listadoPedidosCocinados: any[] = [];
  tokenMozos: string[] = [];
  spinner: boolean;
  screenWidth: any = 0;
  isSideNavCollapsed: any = false;
  collapsed: any = false;
  usuarioLogueado: any;
  verEncuestas: boolean = false;
  verPedidosAprobados: boolean = false;
  verPedidosCocinados: boolean = false;

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

    this.mesasSrv.TraerPedidos("aceptado").subscribe((pedidos: any) => {
      this.listadoPedidosAprobados = pedidos.map((pedido: any) => {
        const productosFiltrados = pedido.productos.filter((producto: any) => producto.perfil === "bartender");
        if (productosFiltrados.length !== 0) {
          this.verPedidosAprobados = true;
        }
        else {
          return this.listadoPedidosAprobados = [];
        }
        return { ...pedido, productos: productosFiltrados };
      });
    });

    this.mesasSrv.TraerPedidos("cocinado").subscribe((pedidos: any) => {
      this.listadoPedidosCocinados = pedidos.filter((pedido: any) => {
        return pedido.cocineroOk && !pedido.bartenderOk && pedido.productos.some((producto: any) => producto.perfil === "bartender");
      }).map((pedido: any) => {
        const productosFiltrados = pedido.productos.filter((producto: any) => producto.perfil === "bartender");
        return { ...pedido, productos: productosFiltrados };
      });
      if (this.listadoPedidosCocinados.length > 0) {
        this.verPedidosCocinados = true;
      } else {
        this.verPedidosCocinados = false;
      }
      console.log(this.listadoPedidosCocinados.length);
    });

    this.mesasSrv.traerMozos().subscribe((mozos: any) => {
      this.tokenMozos = []
      mozos.forEach(element => {
        if (element.token != '') {
          this.tokenMozos.push(element.token);
        }
      });
    })
  }

  async EntregarPedido(pedido: any) {
    await this.mesasSrv.UpdatearPedidoBartender(pedido, true);
    await this.mesasSrv.CambiarEstadoPedido(pedido, "cocinado");
    this.enviarPushMozos(pedido);
  }

  altaProducto() {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.router.navigate(['productos-registro'])
    }, 2000)
  }

  enviarPushMozos(pedido: any) {
    console.log(this.tokenMozos)
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenMozos,
        notification: {
          title: 'PEDIDO A ENTREGAR',
          body: 'El pedido de la mesa ' + pedido.mesa + ' esta para entregar',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
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
          tiempoElaboracion: producto.tiempoElaboracion,
        });
      }
    });

    return productosAgrupados;
  }
}
