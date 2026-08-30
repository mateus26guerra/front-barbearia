import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './page/home/index.component';
import { MainAtividadeComponent } from './page/tela_da_adicionar/main-atividade.component';
import { TelaFiltroComponent } from './page/tela-filtro/tela-filtro.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { CorteDoDiaComponent } from './page/corte-do-dia/corte-do-dia.component';
import { CriarServicoComponent } from './components/criar-servico/criar-servico.component';
const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'home', component: MainAtividadeComponent },
  { path: 'agendar', component: MainAtividadeComponent },
  { path: 'gerenciar-servicos', component: CriarServicoComponent },
  { path: 'pagamento', component: TelaFiltroComponent },
  { path: 'Dashboard', component: DashboardComponent },
  { path: 'cortedia', component: CorteDoDiaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
