import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { MotoristaComponent } from './cadastros/motorista/motorista.component';
import { DetMotoristaComponent } from './cadastros/motorista/det-motorista/det-motorista.component';
import { ViewMotoristaComponent } from './cadastros/motorista/view-motorista/view-motorista.component';
import { LocalidadesComponent } from './cadastros/localidades/localidades.component';
import { DetLocalidadesComponent } from './cadastros/localidades/det-localidades/det-localidades.component';
import { ViewLocalidadesComponent } from './cadastros/localidades/view-localidades/view-localidades.component';
import { FormasDePagamentoComponent } from './cadastros/formas-de-pagamento/formas-de-pagamento.component';
import { DetFormaPagamentoComponent } from './cadastros/formas-de-pagamento/det-forma-pagamento/det-forma-pagamento.component';
import { TarifasComponent } from './cadastros/tarifas/tarifas.component';
import { DetTarifasComponent } from './cadastros/tarifas/det-tarifas/det-tarifas.component';
import { ViewTarifasComponent } from './cadastros/tarifas/view-tarifas/view-tarifas.component';
import { ValidadoresComponent } from './cadastros/validadores/validadores.component';
import { DetValidadoresComponent } from './cadastros/validadores/det-validadores/det-validadores.component';
import { RoletasComponent } from './cadastros/roletas/roletas.component';
import { DetRoletasComponent } from './cadastros/roletas/det-roletas/det-roletas.component';
import { PedagiosComponent } from './cadastros/pedagios/pedagios.component';
import { DetPedagiosComponent } from './cadastros/pedagios/det-pedagios/det-pedagios.component';
import { ViewPedagiosComponent } from './cadastros/pedagios/view-pedagios/view-pedagios.component';
import { SecoesComponent } from './cadastros/secoes/secoes.component';
import { DetSecoesComponent } from './cadastros/secoes/det-secoes/det-secoes.component';
import { ViewSecoesComponent } from './cadastros/secoes/view-secoes/view-secoes.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        MotoristaComponent,
        DetMotoristaComponent,
        ViewMotoristaComponent,
        LocalidadesComponent,
        DetLocalidadesComponent,
        ViewLocalidadesComponent,
        FormasDePagamentoComponent,
        DetFormaPagamentoComponent,
        TarifasComponent,
        DetTarifasComponent,
        ViewTarifasComponent,
        ValidadoresComponent,
        DetValidadoresComponent,
        RoletasComponent,
        DetRoletasComponent,
        PedagiosComponent,
        DetPedagiosComponent,
        ViewPedagiosComponent,
        SecoesComponent,
        DetSecoesComponent,
        ViewSecoesComponent,
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
