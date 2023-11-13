import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeUsuariosService {

  urlListarUsuarios  = `${environment.API}listaUsuarios` ;
  urlExcluirCliente  = `${environment.API}excluirUsuario` ;
  urlBuscarUsuario  = `${environment.API}buscarUsuario`  ;
  urlCarregarUsuario = `${environment.API}carregarUsuario`;
  urlCriarUsuario    = `${environment.API}criarUsuario`   ;
  urlAlteraUsuario    = `${environment.API}alterarUsuario`   ;

  headers = new HttpHeaders({ authorization: "root" });

  constructor(private http: HttpClient) { }

  listaUsuarios(): Observable <any> {
    return this.http.get(
      this.urlListarUsuarios,
      { headers: this.headers }
    );
  }

  excluirUsuario(id: Number): Observable <any> {
    return this.http.put(
      this.urlExcluirCliente+'?id='+id,
      { headers: this.headers }
    );
  }

  buscarUsuario(usuario: any): Observable <any> {
    return this.http.get(
      this.urlBuscarUsuario+'?usuario='+usuario,
      { headers: this.headers }
    );
  }

  carregarUsuario(id: Number): Observable <any> {
    return this.http.get(
      this.urlCarregarUsuario+'?id='+id,
      { headers: this.headers }
    );
  }

  criarUsuario(usuario: object): Observable <any> {
    return this.http.post(
      this.urlCriarUsuario,
      usuario,
      { headers: this.headers }
    );
  }
  alterarUsuario(usuario: object): Observable <any> {
    return this.http.put(
      this.urlAlteraUsuario,
      usuario,
      { headers: this.headers }
    );
  }


}