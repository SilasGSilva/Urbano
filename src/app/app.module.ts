import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MotoristaComponent } from './cadastros/motorista/motorista.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LocalidadesComponent } from './cadastros/localidades/localidades.component';
import { FormasDePagamentoComponent } from './cadastros/formas-de-pagamento/formas-de-pagamento.component';
import { NovaFormaDePagamentoComponent } from './cadastros/formas-de-pagamento/nova-forma-de-pagamento/nova-forma-de-pagamento.component';

@NgModule({
  declarations: [
    AppComponent,
    MotoristaComponent,
    LocalidadesComponent,
    NavMenuComponent,
    FormasDePagamentoComponent,
    NovaFormaDePagamentoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
