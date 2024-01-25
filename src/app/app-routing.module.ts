import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotoristaComponent } from './cadastros/motorista/motorista.component';
import { LocalidadesComponent } from './cadastros/localidades/localidades.component';

const routes: Routes = [
  { path: 'motorista', component: MotoristaComponent },
  { path: 'localidades', component: LocalidadesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
