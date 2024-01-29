import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MotoristaComponent } from './motorista.component';
import { DetMotoristaComponent } from './det-motorista/det-motorista.component';

const routes: Routes = [
  { path: '', component: MotoristaComponent },
  { path: './detMotorista', component: DetMotoristaComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotoristaRoutingModule { }
