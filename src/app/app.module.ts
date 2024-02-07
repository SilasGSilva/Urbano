import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MotoristaComponent } from './cadastros/motorista/motorista.component';
import { LocalidadesComponent } from './cadastros/localidades/localidades.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { DetMotoristaComponent } from './cadastros/motorista/det-motorista/det-motorista.component';
import { DetLocalidadesComponent } from './cadastros/localidades/det-localidades/det-localidades.component';
import { ViewMotoristaComponent } from './cadastros/motorista/view-motorista/view-motorista.component';
import { FormasDePagamentoComponent } from './cadastros/formas-de-pagamento/formas-de-pagamento.component';
import { DetFormaPagamentoComponent } from './cadastros/formas-de-pagamento/det-forma-pagamento/det-forma-pagamento.component';
import { DetTarifasComponent } from './cadastros/tarifas/det-tarifas/det-tarifas.component';
import { ViewTarifasComponent } from './cadastros/tarifas/view-tarifas/view-tarifas.component';
import { ViewLocalidadesComponent } from './cadastros/localidades/view-localidades/view-localidades.component';
import { TarifasComponent } from './cadastros/tarifas/tarifas.component';


@NgModule({
  declarations: [
    AppComponent,
    MotoristaComponent,
    LocalidadesComponent,
    NavMenuComponent,
    DetMotoristaComponent,
    DetLocalidadesComponent,
    ViewMotoristaComponent,
    FormasDePagamentoComponent,
    DetFormaPagamentoComponent,
    TarifasComponent,
    DetTarifasComponent,
    ViewTarifasComponent,
    ViewLocalidadesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
