import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotoristaComponent } from './cadastros/motorista/motorista.component';
import { LocalidadesComponent } from './cadastros/localidades/localidades.component';
import { FormasDePagamentoComponent } from './cadastros/formas-de-pagamento/formas-de-pagamento.component';
import { DetFormaPagamentoComponent } from './cadastros/formas-de-pagamento/det-forma-pagamento/det-forma-pagamento.component';

const routes: Routes = [
  { path: 'motorista', component: MotoristaComponent },
  { path: 'localidades', component: LocalidadesComponent },
  { path: 'formas-de-pagamento', component: FormasDePagamentoComponent },
  { path: 'formas-de-pagamento/det-forma-pagamento/:acao', component: DetFormaPagamentoComponent },
  { path: 'formas-de-pagamento/det-forma-pagamento/:acao/:id', component: DetFormaPagamentoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
