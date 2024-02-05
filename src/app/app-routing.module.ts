import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotoristaComponent } from './cadastros/motorista/motorista.component';
import { DetMotoristaComponent } from './cadastros/motorista/det-motorista/det-motorista.component';
import { LocalidadesComponent } from './cadastros/localidades/localidades.component';
import { DetLocalidadesComponent } from './cadastros/localidades/det-localidades/det-localidades.component';
import { ViewMotoristaComponent } from './cadastros/motorista/view-motorista/view-motorista.component';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./nav-menu/nav-menu.module').then(m => m.NavMenuModule),
    },
    { path: 'motorista', component: MotoristaComponent },
    { path: 'localidades', component: LocalidadesComponent },
    { path: 'motorista/detMotorista/:acao/:filial/:id', component: DetMotoristaComponent },
    { path: 'motorista/detMotorista/:acao', component: DetMotoristaComponent },
    { path: 'motorista/viewMotorista/:acao/:filial/:id',component: ViewMotoristaComponent},
	{ path: 'localidades/detLocalidades/:acao', component: DetLocalidadesComponent },
	{ path: 'localidades/detLocalidades/:acao/:id', component: DetLocalidadesComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
