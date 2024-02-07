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
import { SecoesComponent } from './cadastros/secoes/secoes.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./nav-menu/nav-menu.module').then(m => m.NavMenuModule),
  },

  // ##### MOTORISTA #####

  { path: 'motorista', component: MotoristaComponent },
  {
    path: 'motorista/detMotorista/:acao/:filial/:id',
    component: DetMotoristaComponent,
  },
  { path: 'motorista/detMotorista/:acao', component: DetMotoristaComponent },
  {
    path: 'motorista/viewMotorista/:acao/:filial/:id',
    component: ViewMotoristaComponent,
  },

  // ##### LOCALIDADE #####
  { path: 'localidades', component: LocalidadesComponent },
  {
    path: 'localidades/detLocalidades/:acao',
    component: DetLocalidadesComponent,
  },
  {
    path: 'localidades/detLocalidades/:acao/:id',
    component: DetLocalidadesComponent,
  },

  // ##### FORMAS DE PAGAMENTO #####
  { path: 'formas-de-pagamento', component: FormasDePagamentoComponent },
  {
    path: 'formas-de-pagamento/det-forma-pagamento/:acao',
    component: DetFormaPagamentoComponent,
  },
  {
    path: 'formas-de-pagamento/det-forma-pagamento/:acao/:id',
    component: DetFormaPagamentoComponent,
  },

  // ##### TARIFAS #####
  { path: 'tarifas', component: TarifasComponent },
  {
    path: 'tarifas/detTarifas/:acao/:filial/:pk',
    component: DetTarifasComponent,
  },
  { path: 'tarifas/detTarifas/:acao', component: DetTarifasComponent },
  { path: 'tarifas/viewTarifas/:filial/:pk', component: ViewTarifasComponent },

  // ##### SECOES #####
  { path: 'secoes', component: SecoesComponent },
  // {
  //   path: 'secoes/detSecoes/:acao/:filial/:pk',
  //   component: DetSecoesComponent,
  // },
  // { path: 'secoes/detSecoes/:acao', component: DetSecoesComponent },
  // { path: 'secoes/viewSecoes/:filial/:pk', component: ViewSecoesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
