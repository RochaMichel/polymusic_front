import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeArtistasService {

  urlAlteraArtista = `${environment.API}alteraArtista`;
  urlListaArtista = `${environment.API}listaArtista`;
  urlExcluirArtista = `${environment.API}excluirArtista`;
  urlBuscarArtista = `${environment.API}buscarArtista`;
  urlCarregarArtista = `${environment.API}carregarArtista`;
  urlCriarArtista = `${environment.API}criarArtista`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  alteraArtista(artista: object): Observable <any> {
    return this.http.put(
      this.urlAlteraArtista,
      artista,
      { headers: this.headers }
    );
  }

  listaArtista(): Observable <any> {
    return this.http.get(
      this.urlListaArtista,
      { headers: this.headers }
    );
  }

  excluirArtista(id: Number): Observable <any> {
    return this.http.put(
      this.urlExcluirArtista+"?id="+id,
      { headers: this.headers }
    );
  }

  buscarArtista(artista: any): Observable <any> {
    return this.http.get(
      this.urlBuscarArtista+"?artista="+artista,
      { headers: this.headers }
    );
  }

  carregarArtista(id: Number): Observable <any> {
    return this.http.get(
      this.urlCarregarArtista+"?id="+id,
      { headers: this.headers }
    );
  }

  criarArtista(artista: object): Observable <any> {
    return this.http.post(
      this.urlCriarArtista,
      artista,
      { headers: this.headers }
    );
  }

}