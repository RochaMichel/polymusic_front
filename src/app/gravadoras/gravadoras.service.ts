import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeGravadorasService {

  urlAlteraGravadora = `${environment.API}alteraGravadora`;
  urlListaGravadoras = `${environment.API}listaGravadoras`;
  urlExcluirGravadora = `${environment.API}excluirGravadora`;
  urlBuscarGravadora = `${environment.API}buscarGravadora`;
  urlCarregarGravadora = `${environment.API}carregarGravadora`;
  urlCriarGravadora = `${environment.API}criarGravadora`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  alteraGravadora(gravadora: object): Observable <any> {
    return this.http.put(
      this.urlAlteraGravadora,
      gravadora,
      { headers: this.headers }
    );
  }

  listaGravadoras(): Observable <any> {
    return this.http.get(
      this.urlListaGravadoras,
      { headers: this.headers }
    );
  }

  excluirGravadora(id: Number): Observable <any> {
    return this.http.put(
      this.urlExcluirGravadora+"?id="+ id, 
      { headers: this.headers }
    );
  }
  buscarGravadora(gravadora: any): Observable <any> {
    return this.http.get(
      this.urlBuscarGravadora+"?gravadora="+gravadora ,
      { headers: this.headers }
    );
  }

  carregarGravadora(id: Number): Observable <any> {
    return this.http.get(
      this.urlCarregarGravadora+"?id="+id,
      { headers: this.headers }
    );
  }

  criarGravadora(gravadora: object): Observable <any> {
    return this.http.post(
      this.urlCriarGravadora,
      gravadora,
      { headers: this.headers }
    );
  }

}