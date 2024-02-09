import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalidadesComponent } from './localidades.component';
import { DetLocalidadesComponent } from './det-localidades/det-localidades.component';
import { ViewLocalidadesComponent } from './view-localidades/view-localidades.component';

const routes: Routes = [
    { path: '', component: LocalidadesComponent },
    { path: './detLocalidades', component: DetLocalidadesComponent },
    { path: './viewLocalidades', component: ViewLocalidadesComponent },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LocalidadeRoutingModule {}
