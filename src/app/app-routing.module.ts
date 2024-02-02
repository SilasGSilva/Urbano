import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotoristaComponent } from './cadastros/motorista/motorista.component';
import { LocalidadesComponent } from './cadastros/localidades/localidades.component';
import { TarifasComponent } from './cadastros/tarifas/tarifas.component';
import { DetTarifasComponent } from './cadastros/tarifas/det-tarifas/det-tarifas.component';

const routes: Routes = [
  { path: 'motorista', component: MotoristaComponent },
  { path: 'localidades', component: LocalidadesComponent },
  { path: 'tarifas', component: TarifasComponent },
  {
    path: 'tarifas/detTarifas/:acao/:filial/:id',
    component: DetTarifasComponent,
  },
  { path: 'tarifas/detTarifas/:acao', component: DetTarifasComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
