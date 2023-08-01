
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CartaComponent } from './componentes/carta/carta.component';
import { HomeDejarPropinaComponent } from './componentes/home-dejar-propina/home-dejar-propina.component';
import { JuegoDiezDeDescuentoComponent } from './componentes/juegos/juego-diez-de-descuento/juego-diez-de-descuento.component';
import { JuegoQuinceDeDescuentoComponent } from './componentes/juegos/juego-quince-de-descuento/juego-quince-de-descuento.component';

const routes: Routes = [
  {
    path: 'splash',
    loadChildren: () =>
      import('./pages/splash/splash.module').then((m) => m.SplashPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'empleado-registro',
    loadChildren: () => import('./pages/empleado-registro/empleado-registro.module').then(m => m.EmpleadoRegistroPageModule)
  },
  {
    path: 'mesa-registro',
    loadChildren: () => import('./pages/mesa-registro/mesa-registro.module').then(m => m.MesaRegistroPageModule)
  },
  {
    path: "home-dejar-propina", component: HomeDejarPropinaComponent
  },
  {
    path: "carta", component: CartaComponent
  },
  {
    path: 'juego-diez-de-descuento', component: JuegoDiezDeDescuentoComponent
  },
  {
    path: 'juego-quince-de-descuento', component: JuegoQuinceDeDescuentoComponent
  },
  {
    path: 'home-registro-de-usuarios',
    loadChildren: () => import('./pages/home-registro-de-usuarios/home-registro-de-usuarios.module').then(m => m.HomeRegistroDeUsuariosPageModule)
  },
  {
    path: 'mesa-registro',
    loadChildren: () => import('./pages/mesa-registro/mesa-registro.module').then(m => m.MesaRegistroPageModule)
  },
  {
    path: 'home-principal-de-supervisor',
    loadChildren: () => import('./pages/home-principal-de-supervisor/home-principal-de-supervisor.module').then(m => m.HomePrincipalDeSupervisorPageModule)
  },
  {
    path: 'home-principal-de-mozo',
    loadChildren: () => import('./pages/home-principal-de-mozo/home-principal-de-mozo.module').then(m => m.HomePrincipalDeMozoPageModule)
  },
  {
    path: 'home-principal-de-mestre',
    loadChildren: () => import('./pages/home-principal-de-mestre/home-principal-de-mestre.module').then(m => m.HomePrincipalDeMestrePageModule)
  },
  {
    path: 'home-principal-de-cocinero',
    loadChildren: () => import('./pages/home-principal-de-cocinero/home-principal-de-cocinero.module').then(m => m.HomePrincipalDeCocineroPageModule)
  },
  {
    path: 'home-principal-de-cliente',
    loadChildren: () => import('./pages/home-principal-de-cliente/home-principal-de-cliente.module').then(m => m.HomePrincipalDeClientePageModule)
  },
  {
    path: 'productos-registro',
    loadChildren: () => import('./pages/productos-registro/productos-registro.module').then(m => m.ProductosRegistroPageModule)
  },
  {
    path: 'cliente-registro',
    loadChildren: () => import('./pages/cliente-registro/cliente-registro.module').then(m => m.ClienteRegistroPageModule)
  },
  {
    path: 'supervisor-registro',
    loadChildren: () => import('./pages/supervisor-registro/supervisor-registro.module').then(m => m.SupervisorRegistroPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatPageModule)
  },
  {
    path: 'graficos-clientes',
    loadChildren: () => import('./pages/graficos-clientes/graficos-clientes.module').then(m => m.GraficosClientesPageModule)
  },
  {
    path: 'home-principal-mesa',
    loadChildren: () => import('./pages/home-principal-mesa/home-principal-mesa.module').then(m => m.HomePrincipalMesaPageModule)
  },
  {
    path: 'encuesta-de-supervisor',
    loadChildren: () => import('./componentes/encuestas/encuesta-de-supervisor/encuesta-de-supervisor.module').then(m => m.EncuestaDeSupervisorPageModule)
  },
  {
    path: 'encuesta-de-cliente',
    loadChildren: () => import('./componentes/encuestas/encuesta-de-cliente/encuesta-de-cliente.module').then(m => m.EncuestaDeClientePageModule)
  },
  {
    path: 'encuesta-de-empleado',
    loadChildren: () => import('./componentes/encuestas/encuesta-de-empleado/encuesta-de-empleado.module').then(m => m.EncuestaDeEmpleadoPageModule)
  },
  {
    path: 'graficos-empleados',
    loadChildren: () => import('./componentes/encuestas/graficos-empleados/graficos-empleados.module').then(m => m.GraficosEmpleadosPageModule)
  },
  {
    path: 'reservas-cliente',
    loadChildren: () => import('./pages/reservas-cliente/reservas-cliente.module').then(m => m.ReservasClientePageModule)
  },
  {
    path: 'home-principal-de-bartender',
    loadChildren: () => import('./pages/home-principal-de-bartender/home-principal-de-bartender.module').then(m => m.HomePrincipalDeBartenderPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }


