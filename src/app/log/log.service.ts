import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeLogService {

  urlAlteraLog = `${environment.API}alteraLog`;
  urlListaLog = `${environment.API}listaLog`;
  urlExcluirLog = `${environment.API}excluirLog`;
  urlBuscarLog = `${environment.API}buscarLog`;
  urlCarregarLog = `${environment.API}carregarLog`;
  urlCriarLog = `${environment.API}criarLog`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  alteraLog(Log: object): Observable <any> {
    return this.http.put(
      this.urlAlteraLog,
      Log,
      { headers: this.headers }
    );
  }

  listaLog(): Observable <any> {
    return this.http.get(
      this.urlListaLog,
      { headers: this.headers }
    );
  }

  excluirLog(id: Number): Observable <any> {
    return this.http.delete(
      this.urlExcluirLog+"?id="+ id, 
      { headers: this.headers }
    );
  }
  buscarLog(Log: any): Observable <any> {
    return this.http.get(
      this.urlBuscarLog+"?Log="+Log ,
      { headers: this.headers }
    );
  }

  carregarLog(id: Number): Observable <any> {
    return this.http.get(
      this.urlCarregarLog+"?id="+id,
      { headers: this.headers }
    );
  }

  criarLog(Log: object): Observable <any> {
    return this.http.post(
      this.urlCriarLog,
      Log,
      { headers: this.headers }
    );
  }

}