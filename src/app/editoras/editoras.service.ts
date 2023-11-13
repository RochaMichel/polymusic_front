import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeEditorasService {

  urlAlteraEditora = `${environment.API}alteraEditora`;
  urlListaEditora = `${environment.API}listaEditora`;
  urlExcluirEditora = `${environment.API}excluirEditora`;
  urlBuscarEditora = `${environment.API}buscarEditora`;
  urlCarregarEditora = `${environment.API}carregarEditora`;
  urlCriarEditora = `${environment.API}criarEditora`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  alteraEditora(editora: object): Observable <any> {
    return this.http.put(
      this.urlAlteraEditora,
      editora,
      { headers: this.headers }
      );
  }

  listaEditora(): Observable <any> {
    return this.http.get(
      this.urlListaEditora,
      { headers: this.headers }
    );
  }

  excluirEditora(id: Number): Observable <any> {
    return this.http.put(
      this.urlExcluirEditora+"?id="+id ,
      { headers: this.headers }
    );
  }

  buscarEditora(editora: any): Observable <any> {
    return this.http.get(
      this.urlBuscarEditora+"?editora="+editora, 
      { headers: this.headers }
    );
  }

  carregarEditora(id: Number): Observable <any> {
    return this.http.get(
      this.urlCarregarEditora+"?id="+id ,
      { headers: this.headers }
    );
  }

  criarEditora(editora: object): Observable <any> {
    return this.http.post(
      this.urlCriarEditora,
      editora,
      { headers: this.headers }
    );
  }

}