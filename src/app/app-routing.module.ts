import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotoristaComponent } from './cadastros/motorista/motorista.component';
import { DetMotoristaComponent } from './cadastros/motorista/det-motorista/det-motorista.component';
import { LocalidadesComponent } from './cadastros/localidades/localidades.component';
import { DetLocalidadesComponent } from './cadastros/localidades/det-localidades/det-localidades.component';
import { ViewMotoristaComponent } from './cadastros/motorista/view-motorista/view-motorista.component';
import { FormasDePagamentoComponent } from './cadastros/formas-de-pagamento/formas-de-pagamento.component';
import { DetFormaPagamentoComponent } from './cadastros/formas-de-pagamento/det-forma-pagamento/det-forma-pagamento.component';
import { TarifasComponent } from './cadastros/tarifas/tarifas.component';
import { DetTarifasComponent } from './cadastros/tarifas/det-tarifas/det-tarifas.component';
import { ViewTarifasComponent } from './cadastros/tarifas/view-tarifas/view-tarifas.component';
import { ViewLocalidadesComponent } from './cadastros/localidades/view-localidades/view-localidades.component';
import { PedagiosComponent } from './cadastros/pedagios/pedagios.component';
import { DetPedagiosComponent } from './cadastros/pedagios/det-pedagios/det-pedagios.component';
import { ViewPedagiosComponent } from './cadastros/pedagios/view-pedagios/view-pedagios.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./nav-menu/nav-menu.module').then(m => m.NavMenuModule),
  },
  { path: 'motorista', component: MotoristaComponent },
  { path: 'localidades', component: LocalidadesComponent },
  {
    path: 'motorista/detMotorista/:acao/:filial/:id',
    component: DetMotoristaComponent,
  },
  { path: 'motorista/detMotorista/:acao', component: DetMotoristaComponent },
  {
    path: 'motorista/viewMotorista/:acao/:filial/:id',
    component: ViewMotoristaComponent,
  },
  {
    path: 'localidades/detLocalidades/:acao',
    component: DetLocalidadesComponent,
  },
  {
    path: 'localidades/detLocalidades/:acao/:id',
    component: DetLocalidadesComponent,
  },
  {
    path: 'localidades/viewLocalidades/:acao/:id',
    component: ViewLocalidadesComponent,
  },
  { path: 'formas-de-pagamento', component: FormasDePagamentoComponent },
  {
    path: 'formas-de-pagamento/det-forma-pagamento/:acao',
    component: DetFormaPagamentoComponent,
  },
  {
    path: 'formas-de-pagamento/det-forma-pagamento/:acao/:id',
    component: DetFormaPagamentoComponent,
  },
  { path: 'tarifas', component: TarifasComponent },
  {
    path: 'tarifas/detTarifas/:acao/:filial/:pk',
    component: DetTarifasComponent,
  },
  { path: 'tarifas/detTarifas/:acao', component: DetTarifasComponent },
  { path: 'tarifas/viewTarifas/:filial/:pk', component: ViewTarifasComponent },

  { path: 'pedagios', component: PedagiosComponent },
  {
    path: 'pedagios/detPedagios/:acao/:filial/:pk',
    component: DetPedagiosComponent,
  },
  { path: 'pedagios/detPedagios/:acao', component: DetPedagiosComponent },
  {
    path: 'pedagios/viewPedagios/:filial/:pk',
    component: ViewPedagiosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
