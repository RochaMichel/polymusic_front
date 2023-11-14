import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable, pluck } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeTapesService {
  
  urlListarTapes = `${environment.API}listarTapes`;
  urlExcluirTape = `${environment.API}excluirTape`;
  urlBuscarTape = `${environment.API}buscarTape`;
  urlCarregarTape = `${environment.API}carregarTape`;
  urlCriarTape = `${environment.API}criarTape`;
  urlAlterarTape = `${environment.API}alterarTape`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  listaTapes(): Observable <any> {
    return this.http.get(
      this.urlListarTapes,
      { headers: this.headers }
    );
  }

  excluirTape(id: Number): Observable <any> {
    return this.http.put(
      this.urlExcluirTape+"?id="+id,
      { headers: this.headers }
    );
  }

  buscarTape(nome: any): Observable <any> {
    return this.http.get(
      this.urlBuscarTape+"?tapes="+nome,
      { headers: this.headers }
    );
  }

  carregarTape(id: Number): Observable <any> {
    return this.http.get(
      this.urlCarregarTape+"?id="+id,
      { headers: this.headers }
    );
  }
 
  criarTape(usuario: Object): Observable <any> {
    return this.http.post(
      this.urlCriarTape,
      usuario ,
      { headers: this.headers }
    );
  }

  alteraTape(tape: Object): Observable <any> {
    return this.http.put(
      this.urlAlterarTape,
      tape,
      { headers: this.headers }
    );
  }

  getHeroes(data: any): Observable<any> {
    const values = data?.length ? data.toString() : data;
    return this.http.get(`https://po-sample-api.onrender.com/v1/heroes?value=${values}`).pipe(pluck('items'));
  }
}