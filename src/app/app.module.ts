import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AdicionarUsuarioComponent } from './components/adicionar-usuario/adicionar-usuario.component';
import { MainAtividadeComponent } from './page/tela_da_adicionar/main-atividade.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { IndexComponent } from './page/home/index.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { TelaFiltroComponent } from './page/tela-filtro/tela-filtro.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { CorteDoDiaComponent } from './page/corte-do-dia/corte-do-dia.component';
import { CriarServicoComponent } from './components/criar-servico/criar-servico.component';
import { BaseChartDirective } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    AdicionarUsuarioComponent,
    MainAtividadeComponent,
    HeaderComponent,
    FooterComponent,
    IndexComponent,
    TelaFiltroComponent,
    DashboardComponent,
    CorteDoDiaComponent,
    CriarServicoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    BaseChartDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
