import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeTiposDeTapesService {

  urlAlteraTiposDeTapes = `${environment.API}alteraTiposDeTapes`;
  urlListaTiposDeTapes = `${environment.API}listaTiposDeTapes`;
  urlExcluirTiposDeTapes = `${environment.API}excluirTiposDeTapes`;
  urlBuscarTiposDeTapes = `${environment.API}buscarTiposDeTapes`;
  urlCarregarTiposDeTapes = `${environment.API}carregarTiposDeTapes`;
  urlCriarTiposDeTapes = `${environment.API}criarTiposDeTapes`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  alteraTiposDeTapes(tipo_de_tapes: object): Observable <any> {
    return this.http.put(
      this.urlAlteraTiposDeTapes,
      tipo_de_tapes,
      { headers: this.headers }
    );
  }

  listaTiposDeTapes(): Observable <any> {
    return this.http.get(
      this.urlListaTiposDeTapes,
      { headers: this.headers }
    );
  }

  excluirTiposDeTapes(id: Number): Observable <any> {
    return this.http.put(
      this.urlExcluirTiposDeTapes+"?id="+id,
      { headers: this.headers }
    );
  }

  buscarTiposDeTapes(tipo_de_tapes: any): Observable <any> {
    return this.http.get(
      this.urlBuscarTiposDeTapes+"?tipos_de_tapes="+tipo_de_tapes, 
      { headers: this.headers }
    );
  }

  carregarTiposDeTapes(id: Number): Observable <any> {
    return this.http.get(
      this.urlCarregarTiposDeTapes+"?id="+id,
      { headers: this.headers }
    );
  }

  criarTiposDeTapes(tipo_de_tapes: object): Observable <any> {
    return this.http.post(
      this.urlCriarTiposDeTapes,
      tipo_de_tapes,
      { headers: this.headers }
    );
  }

}