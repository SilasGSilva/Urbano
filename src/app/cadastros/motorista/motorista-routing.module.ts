import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotoristaComponent } from './motorista.component';
import { DetMotoristaComponent } from './det-motorista/det-motorista.component';
import { ViewMotoristaComponent } from './view-motorista/view-motorista.component';

const routes: Routes = [
  { path: '', component: MotoristaComponent },
  { path: './detMotorista', component: DetMotoristaComponent },
  { path: './viewMotorista', component: ViewMotoristaComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MotoristaRoutingModule {}
