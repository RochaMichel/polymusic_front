import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';
import { ListaDeAcervoMusicalService } from '../acervo-musical/acervo-musical.service';
import { ListaDeEtiquetasService } from '../etiquetas/etiquetas.service';
import { Exportacao } from '../exportacao/exportacao.service';
import { ListaDeGravadorasService } from '../gravadoras/gravadoras.service';
import { ListaDeLogService } from '../log/log.service';
import { ListaDeMusicaService } from '../musicas/musicas.service';
import { ListaDeNomesService } from '../nomes/nomes.service';
import { ListaDeTapesService } from '../tapes/tapes.service';
import { ListaDeTiposDeTapesService } from '../tipos-de-tapes/tipos-de-tapes.service';

@Component({
  selector: 'app-lista-tapes',
  templateUrl: './lista-tapes.component.html',
  styleUrls: ['./lista-tapes.component.css']
})

export class ListaTapesComponent {
  
  tipoExport: string = '';
  etiquetaName: string = '';
  gravadoraName: string = '';
  nome_artista!: string;
  nome_etiqueta!: string;
  nome_gravadora!: string;
  nome_tpTape!: string;
  nome_musica!: string;
  tiposMidia: Array<any> = new Array();
  faixa!: string;
  lado!: string;
  autor!: string;
  ids: Array<any> = new Array();
  tipoTape!: string;
  usuarios: Array<any> = new Array();
  Tapes: Array<any> = new Array();
  tape: Array<any> = new Array();
  listaTapes: Array<any> = new Array();
  listaMusicas: Array<any> = new Array();
  acervo_musical: object | undefined;
  Tape: any;
  tapeId!: number;
  acervoId!: number;
  artista!: any;
  altera: boolean = false;
  stream: boolean | undefined;
  percentualArtistico!: number;
  novoNumero!: string;
  titulo!: string;
  Artista = 0;
  Gravadora: Array<any> = new Array();
  Musica: Array<any> = new Array();
  music: Array<any> = new Array();
  Music: Array<any> = new Array();
  Etiqueta: Array<any> = new Array();
  Tipo_tape: Array<any> = new Array();
  acoes: Array<any> = new Array();
  acoesMusica: Array<any> = new Array();
  criar = sessionStorage.getItem('lcria_tapes');
  gravadora!: number;
  musica: number = 0;
  etiqueta!: number;
  produtorMusical!: string;
  tipo_tape!: number;
  dataDeLancamento!: Date | undefined;
  observacao!: string;
  smi!: string;
  prateleira!: string;
  descricao!: string;
  constructor(
    private poNotification: PoNotificationService,
    private listaTapesService: ListaDeTapesService,
    private listaNomesService: ListaDeNomesService,
    private listaGravadorasService: ListaDeGravadorasService,
    private listaEtiquetasService: ListaDeEtiquetasService,
    private listaTiposDeTapesService: ListaDeTiposDeTapesService,
    private listaMusicaService: ListaDeMusicaService,
    private ListaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: ActivatedRoute
  ) { 
    this.router.params.subscribe(
      (params) => (this.tapeId = params["id"])
    );
  }
  ngOnInit(): void {
     this.listaTapesService
    .carregarTape(this.tapeId)
    .subscribe((resposta) => {
      this.listaNomesService
        .buscarNomesExato(resposta.artista)
        .subscribe((res) => { this.artista = res[0].nome })
      this.listaEtiquetasService
        .buscarEtiqueta(resposta.etiqueta)
        .subscribe((res) => { this.etiquetaName = res[0].nome_etiqueta })
      this.listaGravadorasService
        .buscarGravadora(resposta.gravadora)
        .subscribe((res) => { this.gravadoraName = res[0].nome_gravadora })
      this.percentualArtistico = resposta.percentual_artistico
      this.novoNumero = resposta.numero_tape
      this.titulo = resposta.titulo
      this.stream = resposta.stream
      this.gravadora = resposta.gravadora
      this.etiqueta = resposta.etiqueta
      this.produtorMusical = resposta.produtor_musical
      this.tipo_tape = resposta.tipo_tape
      this.listaMusicaService.buscarMusicaExata(resposta.numero_tape).subscribe((res) => {
        for (let index = 0; index < res.length; index++) {
          this.Music.push(
            {
              id: res[index].id,
              musica: res[index].musica,
              faixa: res[index].faixa,
              lado: res[index].lado,
              autor: res[index].autor,
              acoes: ["1"]
            });
        }
        this.listaMusicas = this.Music;
      });
    })
  }


}
