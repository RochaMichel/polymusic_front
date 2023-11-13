import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeEtiquetasService {

  urlAlteraEtiqueta = `${environment.API}alteraEtiqueta`;
  urlListarEtiqueta = `${environment.API}listaEtiqueta`;
  urlExcluirEtiqueta = `${environment.API}excluirEtiqueta`;
  urlBuscarEtiqueta = `${environment.API}buscarEtiqueta`;
  urlCarregarEtiqueta = `${environment.API}carregarEtiqueta`;
  urlCriarEtiqueta = `${environment.API}criarEtiqueta`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  alteraEtiqueta(etiqueta: object): Observable <any> {
    return this.http.put(
      this.urlAlteraEtiqueta,
      etiqueta,
      { headers: this.headers }
    );
  }

  listaEtiqueta(): Observable <any> {
    return this.http.get(
      this.urlListarEtiqueta,
      { headers: this.headers }
    );
  }

  excluirEtiqueta(id: Number): Observable <any> {
    return this.http.put(
      this.urlExcluirEtiqueta+"?id="+id, 
      { headers: this.headers }
    );
  }

  buscarEtiqueta(etiqueta: any): Observable <any> {
    return this.http.get(
      this.urlBuscarEtiqueta+"?etiqueta="+etiqueta ,
      { headers: this.headers }
    );
  }

  carregarEtiqueta(id: Number): Observable <any> {
    return this.http.get(
      this.urlCarregarEtiqueta+"?id="+id ,
      { headers: this.headers }
    );
  }

  criarEditora(etiqueta: object): Observable <any> {
    return this.http.post(
      this.urlCriarEtiqueta,
      etiqueta,
      { headers: this.headers }
    );
  }

}