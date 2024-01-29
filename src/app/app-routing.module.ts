import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotoristaComponent } from './cadastros/motorista/motorista.component';
import { DetMotoristaComponent } from './cadastros/motorista/det-motorista/det-motorista.component';

const routes: Routes = [
  {
		path: '',
		loadChildren: () => import('./nav-menu/nav-menu.module').then(m => m.NavMenuModule),
	},
  { path: 'motorista', component: MotoristaComponent },
  { path: 'motorista/detMotorista/:acao/:filial/:id',component: DetMotoristaComponent},
  { path: 'motorista/detMotorista/:acao',component: DetMotoristaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
