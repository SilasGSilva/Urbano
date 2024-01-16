import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotoristaComponent } from './cadastros/motorista/motorista.component';
import { FrotaComponent } from './cadastros/frota/frota.component';

const routes: Routes = [
  { path: 'motorista', component: MotoristaComponent },
  { path: 'frota', component: FrotaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
