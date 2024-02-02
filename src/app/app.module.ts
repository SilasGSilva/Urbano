import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MotoristaComponent } from './cadastros/motorista/motorista.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LocalidadesComponent } from './cadastros/localidades/localidades.component';
import { DetLocalidadesComponent } from './cadastros/localidades/det-localidades/det-localidades.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MotoristaComponent,
    LocalidadesComponent,
    NavMenuComponent,
    DetLocalidadesComponent
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
  bootstrap: [AppComponent]
})
export class AppModule { }
