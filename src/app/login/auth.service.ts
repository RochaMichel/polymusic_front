import { Injectable } from "@angular/core";
import { Usuario } from "./usuario";
import { Router } from "@angular/router";
import { PoNotificationService } from "@po-ui/ng-components";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { AuthGuard } from "../guards/auth-guard";
import { retry, catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { ListaDeperfildeacessoService } from "../perfil-de-acesso/perfil-de-acesso.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  private urlLogin = `${environment.API}sessions`;
  private urlEmail = `${environment.API}emailrecovery`;
  private usuarioAutenticado: boolean = false;

  // mostrarMenuEmitter = new EventEmitter<boolean>();

  constructor(
    private listaDePerfilService: ListaDeperfildeacessoService,
    private router: Router,
    public poNotification: PoNotificationService,
    private http: HttpClient,
    private authGuard: AuthGuard
  ) {
  }

  isHideLoading: boolean = true;

  enviaEmail(email: string): Observable<any> {
    return this.http.post(this.urlEmail, {
      email,
    });
  }

  fazerLogin(usuario: Usuario): Observable<any> {
    return this.http
      .post(this.urlLogin, {
        login: usuario.user,
        password: usuario.senha,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  ClickLogin(usuario: Usuario): Boolean {
    let login = false;
    this.fazerLogin(usuario).subscribe(
      (resposta) => {
        if (resposta.token) {
          usuario.nome = resposta.usuario.nome;
          console.log(resposta.usuario.perfil_acesso);
          sessionStorage.setItem("nome_perfil", resposta.usuario.perfil_acesso.nome_perfil)
          sessionStorage.setItem("laltera_artistas", resposta.usuario.perfil_acesso.laltera_artistas)
          sessionStorage.setItem("lcria_artistas", resposta.usuario.perfil_acesso.lcria_artistas)
          sessionStorage.setItem("lexclui_artistas", resposta.usuario.perfil_acesso.lexclui_artistas)
          sessionStorage.setItem("lvisualiza_artistas", resposta.usuario.perfil_acesso.lvisualiza_artistas)
          sessionStorage.setItem("laltera_etiquetas", resposta.usuario.perfil_acesso.laltera_etiquetas)
          sessionStorage.setItem("lcria_etiquetas", resposta.usuario.perfil_acesso.lcria_etiquetas)
          sessionStorage.setItem("lexclui_etiquetas", resposta.usuario.perfil_acesso.lexclui_etiquetas)
          sessionStorage.setItem("lvisualiza_etiquetas", resposta.usuario.perfil_acesso.lvisualiza_etiquetas)
          sessionStorage.setItem("laltera_editoras", resposta.usuario.perfil_acesso.laltera_editoras)
          sessionStorage.setItem("lcria_editoras", resposta.usuario.perfil_acesso.lcria_editoras)
          sessionStorage.setItem("lexclui_editoras", resposta.usuario.perfil_acesso.lexclui_editoras)
          sessionStorage.setItem("lvisualiza_editoras", resposta.usuario.perfil_acesso.lvisualiza_editoras)
          sessionStorage.setItem("laltera_gravadoras", resposta.usuario.perfil_acesso.laltera_gravadoras)
          sessionStorage.setItem("lcria_gravadoras", resposta.usuario.perfil_acesso.lcria_gravadoras)
          sessionStorage.setItem("lexclui_gravadoras", resposta.usuario.perfil_acesso.lexclui_gravadoras)
          sessionStorage.setItem("lvisualiza_gravadoras", resposta.usuario.perfil_acesso.lvisualiza_gravadoras)
          sessionStorage.setItem("laltera_nomes", resposta.usuario.perfil_acesso.laltera_nomes)
          sessionStorage.setItem("lcria_nomes", resposta.usuario.perfil_acesso.lcria_nomes)
          sessionStorage.setItem("lexclui_nomes", resposta.usuario.perfil_acesso.lexclui_nomes)
          sessionStorage.setItem("lvisualiza_nomes", resposta.usuario.perfil_acesso.lvisualiza_nomes)
          sessionStorage.setItem("laltera_tapes", resposta.usuario.perfil_acesso.laltera_tapes)
          sessionStorage.setItem("lcria_tapes", resposta.usuario.perfil_acesso.lcria_tapes)
          sessionStorage.setItem("lexclui_tapes", resposta.usuario.perfil_acesso.lexclui_tapes)
          sessionStorage.setItem("lvisualiza_tapes", resposta.usuario.perfil_acesso.lvisualiza_tapes)
          sessionStorage.setItem("laltera_tipo_tapes", resposta.usuario.perfil_acesso.laltera_tipo_tapes)
          sessionStorage.setItem("lcria_tipo_tapes", resposta.usuario.perfil_acesso.lcria_tipo_tapes)
          sessionStorage.setItem("lexclui_tipo_tapes", resposta.usuario.perfil_acesso.lexclui_tipo_tapes)
          sessionStorage.setItem("lvisualiza_tipo_tapes", resposta.usuario.perfil_acesso.lvisualiza_tipo_tapes)
          sessionStorage.setItem("laltera_musica", resposta.usuario.perfil_acesso.laltera_musica)
          sessionStorage.setItem("lcria_musica", resposta.usuario.perfil_acesso.lcria_musica)
          sessionStorage.setItem("lexclui_musica", resposta.usuario.perfil_acesso.lexclui_musica)
          sessionStorage.setItem("lvisualiza_musica", resposta.usuario.perfil_acesso.lvisualiza_musica)
          sessionStorage.setItem("laltera_usuario", resposta.usuario.perfil_acesso.laltera_usuario)
          sessionStorage.setItem("lcria_usuario", resposta.usuario.perfil_acesso.lcria_usuario)
          sessionStorage.setItem("lexclui_usuario", resposta.usuario.perfil_acesso.lexclui_usuario)
          sessionStorage.setItem("lvisualiza_usuario", resposta.usuario.perfil_acesso.lvisualiza_usuario)
          sessionStorage.setItem("laltera_perfil_acesso", resposta.usuario.perfil_acesso.laltera_perfil_acesso)
          sessionStorage.setItem("lcria_perfil_acesso", resposta.usuario.perfil_acesso.lcria_perfil_acesso)
          sessionStorage.setItem("lexclui_perfil_acesso", resposta.usuario.perfil_acesso.lexclui_perfil_acesso)
          sessionStorage.setItem("lvisualiza_perfil_acesso", resposta.usuario.perfil_acesso.lvisualiza_perfil_acesso)
          sessionStorage.setItem("token", resposta.token);
          sessionStorage.setItem("id", resposta.usuario.id);
          sessionStorage.setItem("usuario", resposta.usuario.usuario);
          sessionStorage.setItem("nome", resposta.usuario.nome);
          this.usuarioAutenticado = true;
          this.authGuard.mostrarMenuEmitter.emit(true);
          this.poNotification.setDefaultDuration(2500);
          this.poNotification.success(usuario.nome + ", bem-vindo!");
          login = true;
          console.log(sessionStorage.getItem("nome"))
          this.router.navigate(['/tapes']);
          window.location.reload();
        } else {
          //console.log(resposta);
          this.usuarioAutenticado = false;
          this.poNotification.setDefaultDuration(5000);
          this.poNotification.error("Verifique seu usuário!");
          //this.mostrarMenuEmitter.emit(false);
          this.authGuard.mostrarMenuEmitter.emit(false);

        }
      },
      (err) => {
        this.usuarioAutenticado = false;
        this.poNotification.setDefaultDuration(5000);
        this.poNotification.error(err);
        this.authGuard.mostrarMenuEmitter.emit(false);

      }
    );
    return login;
  }

  fazerLogout() {
    sessionStorage.removeItem("nome_perfil");
    sessionStorage.removeItem("laltera_artistas");
    sessionStorage.removeItem("lcria_artistas");
    sessionStorage.removeItem("lexclui_artistas");
    sessionStorage.removeItem("lvisualiza_artistas");
    sessionStorage.removeItem("laltera_etiquetas");
    sessionStorage.removeItem("lcria_etiquetas");
    sessionStorage.removeItem("lexclui_etiquetas");
    sessionStorage.removeItem("lvisualiza_etiquetas");
    sessionStorage.removeItem("laltera_editoras");
    sessionStorage.removeItem("lcria_editoras");
    sessionStorage.removeItem("lexclui_editoras");
    sessionStorage.removeItem("lvisualiza_editoras");
    sessionStorage.removeItem("laltera_gravadoras");
    sessionStorage.removeItem("lcria_gravadoras");
    sessionStorage.removeItem("lexclui_gravadoras");
    sessionStorage.removeItem("lvisualiza_gravadoras");
    sessionStorage.removeItem("laltera_nomes");
    sessionStorage.removeItem("lcria_nomes");
    sessionStorage.removeItem("lexclui_nomes");
    sessionStorage.removeItem("lvisualiza_nomes");
    sessionStorage.removeItem("laltera_tapes");
    sessionStorage.removeItem("lcria_tapes");
    sessionStorage.removeItem("lexclui_tapes");
    sessionStorage.removeItem("lvisualiza_tapes");
    sessionStorage.removeItem("laltera_tipo_tapes");
    sessionStorage.removeItem("lcria_tipo_tapes");
    sessionStorage.removeItem("lexclui_tipo_tapes");
    sessionStorage.removeItem("lvisualiza_tipo_tapes");
    sessionStorage.removeItem("laltera_musica");
    sessionStorage.removeItem("lcria_musica");
    sessionStorage.removeItem("lexclui_musica");
    sessionStorage.removeItem("lvisualiza_musica");
    sessionStorage.removeItem("laltera_usuario");
    sessionStorage.removeItem("lcria_usuario");
    sessionStorage.removeItem("lexclui_usuario");
    sessionStorage.removeItem("lvisualiza_usuario");
    sessionStorage.removeItem("laltera_perfil_acesso");
    sessionStorage.removeItem("lcria_perfil_acesso");
    sessionStorage.removeItem("lexclui_perfil_acesso");
    sessionStorage.removeItem("lvisualiza_perfil_acesso");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("nome");
    sessionStorage.removeItem("empresa");
    sessionStorage.removeItem("tipoUsuario");
    this.usuarioAutenticado = false;
    //this.mostrarMenuEmitter.emit(false);
    this.authGuard.mostrarMenuEmitter.emit(false);
    this.authGuard.usuarioAtivo.emit(false);
    console.log(sessionStorage.getItem("nome"))
    this.router.navigate(["/"]);
  }

  usuarioEstaAutenticado() {
    return this.usuarioAutenticado;
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = error.error.error; //`Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    // this.poNotification.error(errorMessage);
    return throwError(errorMessage);
  }
}
