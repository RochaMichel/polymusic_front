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
  urlbuscaTapesNomes = `${environment.API}buscaTapesNomes`;
  urlbuscaTapesGrava = `${environment.API}buscaTapesGrava`;
  urlbuscaTapesEtique = `${environment.API}buscaTapesEtique`;
  urlbuscaTapesTipo = `${environment.API}buscaTapesTipo`;
  urllistaTapesSteam = `${environment.API}listaTapesSteam`;
  urlExcluirTape = `${environment.API}excluirTape`;
  urlBuscarTape = `${environment.API}buscarTape`;
  urlBuscarTapeExato = `${environment.API}buscarTapeExato`;
  urlBuscarTapeExato1 = `${environment.API}buscarTapeExato1`;
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
  listaTapesSteam(): Observable <any> {
    return this.http.get(
      this.urllistaTapesSteam,
      { headers: this.headers }
    );
  }
  buscarTapeNome(nome: any): Observable <any> {
    return this.http.get(
      this.urlbuscaTapesNomes+"?tapes="+nome,
      { headers: this.headers }
    );
  }
  buscarTapeGrava(nome: any): Observable <any> {
    return this.http.get(
      this.urlbuscaTapesGrava+"?tapes="+nome,
      { headers: this.headers }
    );
  }
  buscarTapeEtique(nome: any): Observable <any> {
    return this.http.get(
      this.urlbuscaTapesEtique+"?tapes="+nome,
      { headers: this.headers }
    );
  }
  buscarTapeTipo(nome: any): Observable <any> {
    return this.http.get(
      this.urlbuscaTapesTipo+"?tapes="+nome,
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

  buscarTapeExato(nome: any): Observable <any> {
    return this.http.get(
      this.urlBuscarTapeExato+"?tapes="+nome,
      { headers: this.headers }
    );
  }
  buscarTapeExato1(nome: any): Observable <any> {
    return this.http.get(
      this.urlBuscarTapeExato1+"?tapes="+nome,
      { headers: this.headers }
    );
  }
 
}
