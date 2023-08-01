import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosRegistroPage } from './productos-registro.page';

const routes: Routes = [
  {
    path: '',
    component: ProductosRegistroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosRegistroPageRoutingModule {}
