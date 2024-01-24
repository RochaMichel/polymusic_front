import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeAgregadoresService {

  urlAlteraAgregadores = `${environment.API}alteraAgregadores`;
  urlListarAgregadores = `${environment.API}listaAgregadores`;
  urlExcluirAgregadores = `${environment.API}excluirAgregadores`;
  urlBuscarAgregadores = `${environment.API}buscarAgregadores`;
  urlCarregarAgregadores = `${environment.API}carregarAgregadores`;
  urlCriarAgregadores = `${environment.API}criarAgregadores`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  alteraAgregadores(agregador: object): Observable <any> {
    return this.http.put(
      this.urlAlteraAgregadores,
      agregador,
      { headers: this.headers }
    );
  }

  listaAgregadores(): Observable <any> {
    return this.http.get(
      this.urlListarAgregadores,
      { headers: this.headers }
    );
  }

  excluirAgregadores(id: Number): Observable <any> {
    return this.http.put(
      this.urlExcluirAgregadores+"?id="+id, 
      { headers: this.headers }
    );
  }

  buscarAgregadores(agregador: any): Observable <any> {
    return this.http.get(
      this.urlBuscarAgregadores+"?agregador="+agregador ,
      { headers: this.headers }
    );
  }

  carregarAgregadores(id: Number): Observable <any> {
    return this.http.get(
      this.urlCarregarAgregadores+"?id="+id ,
      { headers: this.headers }
    );
  }

  criarAgregador(agregador: object): Observable <any> {
    return this.http.post(
      this.urlCriarAgregadores,
      agregador,
      { headers: this.headers }
    );
  }

}