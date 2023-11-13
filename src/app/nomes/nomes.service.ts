import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeNomesService {

  urlAlterarNomes = `${environment.API}alterarNomes`;
  urlListaNomes = `${environment.API}listaNomes`;
  urlExcluirNomes = `${environment.API}excluirNomes`;
  urlBuscarNomes = `${environment.API}buscarNomes`;
  urlCarregarNomes = `${environment.API}carregarNomes`;
  urlCriarNomes = `${environment.API}criarNomes`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  alterarNomes(nomes: object): Observable <any> {
    return this.http.put(
      this.urlAlterarNomes,
      nomes,
      { headers: this.headers }
    );
  }

  listaNomes(): Observable <any> {
    return this.http.get(
      this.urlListaNomes,
      { headers: this.headers }
    );
  }

  excluirNomes(id: Number): Observable <any> {
    return this.http.put(
      this.urlExcluirNomes+"?id="+id, 
      { headers: this.headers }
    );
  }

  buscarNomes(nomes: any): Observable <any> {
    return this.http.get(
      this.urlBuscarNomes+"?nomes="+nomes,
      { headers: this.headers }
    );
  }

  carregarNomes(id: Number): Observable <any> {
    return this.http.get(
      this.urlCarregarNomes+"?id="+id ,
      { headers: this.headers }
    );
  }

  criarNomes(nomes: object): Observable <any> {
    return this.http.post(
      this.urlCriarNomes,
      nomes,
      { headers: this.headers }
    );
  }

}