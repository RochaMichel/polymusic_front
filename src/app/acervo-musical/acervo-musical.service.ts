import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeAcervoMusicalService {

  urlAlteraAcervoMusical = `${environment.API}alteraAcervoMusical`;
  urlListaAcervoMusical = `${environment.API}listaAcervoMusical`;
  urlExcluirAcervoMusical = `${environment.API}excluirAcervoMusical`;
  urlBuscarAcervoMusical = `${environment.API}buscarAcervoMusical`;
  urlCarregarAcervoMusical = `${environment.API}carregarAcervoMusical`;
  urlCriarAcervoMusical = `${environment.API}criarAcervoMusical`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  alteraAcervoMusical(AcervoMusical: object): Observable <any> {
    return this.http.put(
      this.urlAlteraAcervoMusical,
      AcervoMusical,
      { headers: this.headers }
    );
  }

  listaAcervoMusical(): Observable <any> {
    return this.http.get(
      this.urlListaAcervoMusical,
      { headers: this.headers }
    );
  }

  excluirAcervoMusical(id: Number): Observable <any> {
    return this.http.delete(
      this.urlExcluirAcervoMusical+"?id="+ id, 
      { headers: this.headers }
    );
  }
  buscarAcervoMusical(AcervoMusical: any): Observable <any> {
    return this.http.get(
      this.urlBuscarAcervoMusical+"?AcervoMusical="+AcervoMusical ,
      { headers: this.headers }
    );
  }

  carregarAcervoMusical(id: Number): Observable <any> {
    return this.http.get(
      this.urlCarregarAcervoMusical+"?id="+id,
      { headers: this.headers }
    );
  }

  criarAcervoMusical(AcervoMusical: object): Observable <any> {
    return this.http.post(
      this.urlCriarAcervoMusical,
      AcervoMusical,
      { headers: this.headers }
    );
  }

}