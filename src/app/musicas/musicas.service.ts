import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeMusicaService {

  urlAlteraMusica = `${environment.API}alterarMusica`;
  urlListaMusica = `${environment.API}listarMusica`;
  urlExcluirMusica = `${environment.API}excluirMusica`;
  urlBuscarMusica = `${environment.API}buscarMusica`;
  urlBuscarMusicaExata = `${environment.API}buscarMusicaExata`;
  urlCarregarMusica = `${environment.API}carregarMusica`;
  urlCriarMusica = `${environment.API}criarMusica`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  alteraMusica(musica: object): Observable <any> {
    return this.http.put(
      this.urlAlteraMusica,
      musica,
      { headers: this.headers }
    );
  }

  listarMusica(): Observable <any> {
    return this.http.get(
      this.urlListaMusica,
      { headers: this.headers }
    );
  }

  excluirMusica(id: Number): Observable <any> {
    return this.http.put(
      this.urlExcluirMusica+"?id="+id,
      { headers: this.headers }
    );
  }
  
  buscarMusica(musica: any): Observable <any> {
    return this.http.get(
      this.urlBuscarMusica+"?musica="+musica,
      { headers: this.headers }
    );
  }
  buscarMusicaExata(musica: any): Observable <any> {
    return this.http.get(
      this.urlBuscarMusicaExata+"?musica="+musica,
      { headers: this.headers }
    );
  }

  carregarMusica(id: Number): Observable <any> {
    return this.http.get(
      this.urlCarregarMusica+"?id="+id,
      { headers: this.headers }
    );
  }

  criarMusica(musica: object): Observable <any> {
    return this.http.post(
      this.urlCriarMusica,
      musica,
      { headers: this.headers }
    );
  }

}