import { NgModule } from '@angular/core';
import { AuthService } from './login/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard } from './guards/auth-guard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { FormsModule } from '@angular/forms';
import { perfildeacessoComponent } from './perfil-de-acesso/perfil-de-acesso.component';
import { ArtistasComponent } from './artistas/artistas.component';
import { EditorasComponent } from './editoras/editoras.component';
import { EtiquetasComponent } from './etiquetas/etiquetas.component';
import { GravadorasComponent } from './gravadoras/gravadoras.component';
import { NomesComponent } from './nomes/nomes.component';
import { TapesComponent } from './tapes/tapes.component';
import { TiposDeTapesComponent } from './tipos-de-tapes/tipos-de-tapes.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MusicaComponent } from './musicas/musicas.component';
import { ListaTapesComponent } from './lista-tapes/lista-tapes.component';
import { GraficoComponent } from './grafico/grafico.component';
import { AgregadoresComponent } from './agregadores/agregadores.component';
const ROTAS: Routes = [
  {
    path: "usuarios",
    component: UsuariosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "perfil-de-acesso",
    component: perfildeacessoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "lista-tapes/:id",
    component: ListaTapesComponent
  },
  {
    path: "grafico",
    component: GraficoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "agregadores",
    component: AgregadoresComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "etiquetas",
    component: EtiquetasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "gravadoras",
    component: GravadorasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "nomes",
    component: NomesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "tapes",
    component: TapesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "tipos-de-tapes",
    component: TiposDeTapesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "musicas",
    component: MusicaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "",
    component: LoginComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsuariosComponent,
    LoginComponent,
    perfildeacessoComponent,
    ArtistasComponent,
    EditorasComponent,
    EtiquetasComponent,
    GravadorasComponent,
    NomesComponent,
    TapesComponent,
    TiposDeTapesComponent,
    MusicaComponent,
    ListaTapesComponent,
    GraficoComponent,
    AgregadoresComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    PoTemplatesModule,
    RouterModule.forRoot(ROTAS)
  ],
  providers: [
    AuthGuard,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
