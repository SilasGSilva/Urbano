import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalidadesComponent } from './localidades.component';
import { DetLocalidadesComponent } from './det-localidades/det-localidades.component';

const routes: Routes = [
  { path: '', component: LocalidadesComponent },
  { path: './detLocalidades', component: DetLocalidadesComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalidadeRoutingModule { }
