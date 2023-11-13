import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeperfildeacessoService {

  urlAlterarPerfilDeAcesso  = `${environment.API}alterarPerfilDeAcesso`;
  urlListaPerfilDeAcesso  = `${environment.API}listaPerfilDeAcesso`;
  urlExcluirPerfilDeAcesso  = `${environment.API}excluirPerfilDeAcesso`;
  urlBuscarPerfilDeAcesso   = `${environment.API}buscarPerfilDeAcesso`;
  urlCarregarPerfilDeAcesso = `${environment.API}carregarPerfilDeAcesso`;
  urlCriarPerfilDeAcesso    = `${environment.API}criarPerfilDeAcesso`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  alterarPerfilDeAcesso(perfil_acesso: object): Observable <any> {
    return this.http.put(
      this.urlAlterarPerfilDeAcesso,
      perfil_acesso,
      { headers: this.headers }
    );
  }
 
  listaPerfilDeAcesso(): Observable <any> {
    return this.http.get(
      this.urlListaPerfilDeAcesso,
      { headers: this.headers }
    );
  }

  excluirPerfilDeAcesso(id: Number): Observable <any> {
    return this.http.put(
      this.urlExcluirPerfilDeAcesso+"?id="+id,
      { headers: this.headers }
    );
  }

  buscarPerfilDeAcesso(perfil_acesso: any): Observable <any> {
    return this.http.get(
      this.urlBuscarPerfilDeAcesso+"?perfil_acesso="+perfil_acesso,
      { headers: this.headers }
    );
  }

  carregarPerfilDeAcesso(id: Number): Observable <any> {
    return this.http.get(
      this.urlCarregarPerfilDeAcesso+"?id="+id,
      { headers: this.headers }
    );
  }

  criarPerfilDeAcesso(perfil_acesso: object): Observable <any> {
    return this.http.post(
      this.urlCriarPerfilDeAcesso,
      perfil_acesso,
      { headers: this.headers }
    );
  }

}