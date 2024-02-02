import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableAction, PoTableColumn, PoTableDetail, PoTagType } from '@po-ui/ng-components';
import { ListaDeTapesService } from './tapes.service';
import { Exportacao } from '../exportacao/exportacao.service';
import * as qrcode from 'qrcode-generator';
import { ListaDeNomesService } from '../nomes/nomes.service';
import { ListaDeGravadorasService } from '../gravadoras/gravadoras.service';
import { ListaDeEtiquetasService } from '../etiquetas/etiquetas.service';
import { ListaDeTiposDeTapesService } from '../tipos-de-tapes/tipos-de-tapes.service';
import { PoGridModule } from '@po-ui/ng-components';
import { ListaDeLogService } from '../log/log.service';
import { ListaDeMusicaService } from '../musicas/musicas.service';
import { ListaDeAgregadoresService } from '../agregadores/agregadores.service';
import { ListaDeAcervoMusicalService } from '../acervo-musical/acervo-musical.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-tapes',
  templateUrl: './tapes.component.html',
  styleUrls: ['./tapes.component.css']
})
export class TapesComponent {
  qrCodeImage: string = '';
  sampleAirfare: any;


  constructor(
    private poNotification: PoNotificationService,
    private listaTapesService: ListaDeTapesService,
    private listaNomesService: ListaDeNomesService,
    private listaGravadorasService: ListaDeGravadorasService,
    private listaEtiquetasService: ListaDeEtiquetasService,
    private listaTiposDeTapesService: ListaDeTiposDeTapesService,
    private listaMusicaService: ListaDeMusicaService,
    private listaAgregadorService: ListaDeAgregadoresService,
    private cdr: ChangeDetectorRef,
    private ListaAcervoMusicalService: ListaDeAcervoMusicalService,
    private ListaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }

  tipoExport: string = '';
  etiquetaName: string = '';
  gravadoraName: string = '';
  subiu: string = '';
  midia: string = '';
  nome_artista!: string;
  nome_etiqueta!: string;
  nome_gravadora!: string;
  nome_tpTape!: string;
  nome_musica!: string;
  tiposMidia: Array<any> = new Array();
  tiposDetail: Array<any> = new Array();
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
  mostraTipo: boolean = false;
  isHideLoading: boolean = false;
  stream: boolean | undefined;
  notStream: boolean | undefined;
  midiaDigital: boolean = false;
  musicaAltera: boolean = false;
  percentualArtistico!: number;
  novoNumero!: string;
  titulo!: string;
  Artista: number = 0;
  Gravadora: Array<any> = new Array();
  opcoesMidia: Array<any> = new Array();
  opcoesDetail: Array<any> = new Array();
  agregadoresMarcados: Array<any> = new Array();
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
  quantidadeTape: number = 0;
  etiqueta!: number;
  produtorMusical!: string;
  tipo_tape!: number;
  dataDeLancamento!: Date | undefined;
  observacao!: string;
  smi!: string;
  prateleira!: string;
  descricao!: string;
  detailMidia: string = '';
  genero: string = '';
  detail: any;
  total: number = 0;
  idMusica: number = 0;
  totalExpanded = 0;


  @ViewChild("modalTape", { static: true }) modalTape!: PoModalComponent;
  @ViewChild("modalTapeView", { static: true }) modalTapeView!: PoModalComponent;
  @ViewChild("modalQRCode", { static: true }) modalQRCode!: PoModalComponent;
  @ViewChild('qrcodeImage', { static: false }) qrcodeImage!: ElementRef;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;
  @ViewChild('modalExibeTape', { static: true }) modalExibeTape!: PoModalComponent;
  @ViewChild('modalMusica', { static: true }) modalMusica!: PoModalComponent;
  @ViewChild('modalDetail', { static: true }) modalDetail!: PoModalComponent;

  public auditOptions: Array<any> = [];
  public agregadorOptions: Array<any> = [];
  public columnsTipoMidia: Array<any> = [];
  ngOnInit(): void {
    this.columnsTipoMidia = this.getColumns();
    this.getAgregadores();
    this.tapesGravadora();
    this.tapesEtiqueta();
    this.tapesTipo_tape();
    this.carregaLista();
    this.carregaTape();
    this.buscaMidia();
    // this.buscaAgregadores();
  }


  getColumns(): Array<PoTableColumn> {
    const airfareDetail: PoTableDetail = {
      columns: [
        { property: 'tipo' },
      ],
      typeHeader: 'top'
    };

    return [
      { property: 'value', label: 'Id' },
      { property: 'label', label: 'Midia' },
      { property: 'detail', label: 'Details', type: 'detail', detail: airfareDetail }
    ];
  }
  getAgregadores() {
    this.listaAgregadorService
      .listaAgregadores()
      .subscribe((res) => {
        for (let n = 0; n < res.length; n++) {
          if (res[n].bloqueado === 'N') {
            this.agregadorOptions.push({
              value: res[n].id,
              label: res[n].nomeAgregadores
            });
          }
        }
      });
  }

  async buscaMidia() {
    this.listaTiposDeTapesService
      .listaTiposDeTapes()
      .subscribe((res) => {
        for (let index = 0; index < res.length;) {
          if (res[index].bloqueado === 'N') {
            var varId = res[index].id
            var detail = [];
            var Midia = res[index].descricao;
            if (res[index].Detail) {
              while (res[index].id === varId) {
                detail.push(
                  {
                    id: res[index].Detail.id,
                    tipo: res[index].Detail.tipo,
                  }
                )
                if (index < (res.length - 1)) {
                  index++;
                } else {
                  index++;
                  break;
                }
              }
              this.opcoesMidia.push({
                value: varId,
                label: Midia,
                detail: detail
              });
            } else {
              this.opcoesMidia.push({
                label: Midia,
                value: varId
              });
              index++;
            }
          }
        }
        this.auditOptions = this.opcoesMidia;
        this.isHideLoading = true
      });
  }

  public readonly colunas: Array<PoTableColumn> = [
    { property: "titulo", label: "Titulo", width: "45%" },
    { property: "novoNumero", label: "Numero tape", width: "20%" },
    { property: "artista", label: "Artista", width: "20%" },
    {
      property: 'status',
      type: 'label',
      width: '8%',
      labels: [
        { value: 'off', color: '', label: 'Off Stream' },
        { value: 'on', label: 'On Stream', color: 'green' },
        { value: 'not', label: 'Not Stream', color: 'red' },
        { value: 'digital', label: 'Digitalizada', color: '#fca503' },
      ]
    },
    {
      property: "acoes",
      label: "Ações",
      type: "icon",
      width: "5%",
      icons: this.icons(),
    },
  ];

  icons(): Array<any> {
    this.acoes.push({
      action: this.Imprimir.bind(this),
      icon: "po-icon po-icon-upload",
      value: "4",
      tooltip: "imprimir",
    });
    this.acoes.push({
      action: this.visualizar.bind(this),
      icon: "po-icon po-icon-eye",
      value: "2",
      tooltip: "visualizar",
    });
    if (sessionStorage.getItem('laltera_tapes') === 'true') {
      this.acoes.push({
        action: this.Alterar.bind(this),
        icon: "po-icon po-icon-edit",
        value: "1",
        tooltip: "alterar",
      });
    }
    if (sessionStorage.getItem('lexclui_tapes') === 'true') {
      this.acoes.push({
        action: this.excluir.bind(this),
        icon: "po-icon po-icon-delete",
        value: "3",
        tooltip: "excluir",
      });
    }
    return this.acoes;
  }

  public readonly columns: Array<PoTableColumn> = [
    { property: "faixa", label: "faixa", width: "10%" },
    { property: "lado", label: "lado", width: "10%" },
    { property: "genero", label: "genero", width: "10%" },
    { property: "musica", label: "Musica", width: "80%" },
    { property: "autor", label: "Autor", width: "20%" },
    {
      property: "acoes",
      label: "Ações",
      type: "icon",
      width: "5%",
      icons: this.icones(),
    },
  ];
  onCollapseDetail() {
    this.totalExpanded -= 1;
    this.totalExpanded = this.totalExpanded < 0 ? 0 : this.totalExpanded;
  }

  onExpandDetail() {
    this.totalExpanded += 1;
  }

  sumTotal(row: any) {

    if (row.detail && row.$selected) {
      this.detailMidia += row.value.toString();
      for (let i = 0; i < row.detail.length; i++) {
        if (row.detail[i].$selected) {
          this.detailMidia += ',' + row.detail[i].id.toString();
        }
      }
      this.detailMidia += '/'
      this.total += row.value;
    } else if (row.$selected && row.tipoRow) {

    }

  }
  changeColumnVisible(event: any) {
    localStorage.setItem('initial-columns', event);
  }

  decreaseTotal(row: any) {
    if (!row.$selected && row.detail) {
      this.detailMidia = '';
      this.total -= row.value;
    }
  }
  async carregaTiposMidia(event: string) {
    const dadosSelecionados = this.tiposMidia.map((valor: any) => {
      const opcaoEncontrada = this.auditOptions.find((opcao) => opcao.value === valor);
      return opcaoEncontrada ? opcaoEncontrada : null;
    });
    for (let i = 0; i < dadosSelecionados.length; i++) {
      await this.listaTiposDeTapesService
        .listaDetail(dadosSelecionados[i].value)
        .subscribe((res) => {
          for (let index = 0; index < res.length; index++) {
            if (res[index].bloqueado === 'N') {
              this.opcoesDetail.push(
                { value: res[index].id, label: res[index].tipo }
              );
            }
          }

        });
    }
  }

  icones(): Array<any> {
    this.acoesMusica.push({
      action: this.excluirMusica.bind(this),
      icon: "po-icon po-icon-delete",
      value: "1",
      tooltip: "excluir",
    });
    this.acoesMusica.push({
      action: this.alteraMusica.bind(this),
      icon: "po-icon po-icon-edit",
      value: "2",
      tooltip: "alterar",
    });
    return this.acoesMusica;
  }
  alteraMusica(musica: any) {
    this.faixa = musica.faixa
    this.idMusica = musica.id
    this.lado = musica.lado
    this.nome_musica = musica.musica
    this.genero = musica.genero
    this.autor = musica.autor
    this.musicaAltera = true
    this.modalMusica.open();
  }

  tapesGravadora() {
    this.Gravadora = [];
    this.listaGravadorasService
      .listaGravadoras()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.Gravadora.push(
              {
                label: resposta[index].nome_gravadora,
                value: resposta[index].id,
              }
            )
          }
        }
      })
  }
  tapesEtiqueta() {
    this.Etiqueta = [];
    this.listaEtiquetasService
      .listaEtiqueta()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.Etiqueta.push(
              {
                label: resposta[index].nome_etiqueta,
                value: resposta[index].id,
              }
            )
          }
        }
      })
  }

  tapesTipo_tape() {
    this.Tipo_tape = [];
    this.listaTiposDeTapesService
      .listaTiposDeTapes()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.Tipo_tape.push(
              {
                label: resposta[index].descricao,
                value: resposta[index].id,
              }
            )
          }
        }
      })
  }
  carregaTape() {
    this.quantidadeTape = 0
    this.listaTapesService.listaTapesTotal().subscribe(res => {
      this.quantidadeTape = res.quantidade
    })
  }

  async buscaMusica(musica: any): Promise<void> {
    //if(this.altera === false){
    this.listaMusicas = [];
    this.Music = [];
    if (musica) {
      for (let index = 0; index < musica.length; index++) {
        await this.listaMusicaService
          .buscarMusicaExata(musica[index])
          .subscribe((resposta) => {
            this.Music.push(
              {
                id: resposta.id,
                musica: resposta.musica,
                faixa: '',
                album: resposta.album,
                ano: resposta.ano,
                acoes: ['1']
              }
            );
          });
      }
      this.listaMusicas = this.Music
    }
    //}
  }

  criarTape() {
    this.listaMusicas = [];
    this.Music = [];
    this.musica = 0;
    this.Musica = [];
    this.Artista = 0;
    this.midia = '';
    this.titulo = '';
    this.novoNumero = '';
    this.gravadora = 0;
    this.etiqueta = 0;
    this.percentualArtistico = 0;
    this.produtorMusical = '';
    this.tipo_tape = 0;
    this.dataDeLancamento = undefined;
    this.stream = false;
    this.notStream = false;
    this.observacao = '';
    this.smi = '';
    this.prateleira = '';
    this.descricao = '';
    this.modalTape.open();
  }
  excluirMusica(musica: any) {
    if (confirm("Deseja remover a musica?")) {
      for (let index = 0; index < this.listaMusicas.length; index++) {
        if (musica.id === this.listaMusicas[index].id) {
          this.listaMusicas.splice(index, 1);
          break;
        }
      }
    }
  }

  async excluir(tape: any) {
    if (confirm("Deseja excluir o tape?")) {
      let Log = {
        descricao_log: 'Tape com ID: ' + tape.id + ' excluido pelo usuario: ' + sessionStorage.getItem('usuario') + ', com Id: ' + sessionStorage.getItem('id'),
        data_log: this.getDataEHoraAtual(),
      }
      this.listaTapesService
        .excluirTape(tape.id)
        .subscribe(
          (res) => {
            this.ListaLogService
              .criarLog(Log)
              .subscribe((res) => {
                this.poNotification.success(res.retorno);
                this.ngOnInit();
              }
              );

          },
          (err) => {
            this.poNotification.error(err.error.retorno);
          })
    }
  }

  async Imprimir(tape: any) {
    this.tapeId = tape.id;
    this.listaMusicas = [];
    this.Music = [];
    this.Musica = [];
    this.midia = '';
    this.produtorMusical = '';
    await this.listaTapesService
      .carregarTape(tape.id)
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
        const valoresSeparados = resposta.tipos_midia.split('/').filter(Boolean);
        const dadosSelecionados = valoresSeparados.map((valor: any) => {
          const opcaoEncontrada = this.auditOptions.find((opcao) => opcao.value === valor);
          return opcaoEncontrada ? opcaoEncontrada : null;
        });

        this.titulo = resposta.titulo
        if (resposta.stream) {
          this.subiu = 'Sim';
        } else {
          this.subiu = 'Não';
        }
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
          for (let i = 1; i < dadosSelecionados.length; i++) {
            this.midia += dadosSelecionados[i].label + ' - '
          }
        });

        this.modalExibeTape.open();
      })
  }
  async IncluirMusica() {
    this.modalMusica.open();
  }
  async Alterar(tape: any) {
    this.tapeId = tape.id;
    this.listaMusicas = [];
    this.agregadoresMarcados = [];
    this.Music = [];
    this.ids = [];
    this.Musica = [];
    this.altera = true;
    await this.listaTapesService
      .carregarTape(tape.id)
      .subscribe(async (resposta) => {
        this.percentualArtistico = resposta.percentual_artistico
        this.novoNumero = resposta.numero_tape
        this.titulo = resposta.titulo
        this.gravadora = resposta.gravadora
        if (resposta.tipos_midia.length > 1) {
          let midias = resposta.tipos_midia.split('/')
          for (let i = 0; i < midias.length; i++) {
            let tipos = midias[i].split(',')
            for (let n = 0; n < tipos.length; n++) {
              let indice = this.opcoesMidia.findIndex((objeto) => objeto.value === parseInt(tipos[(tipos.length - 1)]));
              if (indice !== -1) {
                this.opcoesMidia[indice].$selected = true
                if ((tipos.length - 1) > n && this.opcoesMidia[indice].detail) {
                  let indicetipo = this.opcoesMidia[indice].detail.findIndex((objeto: { id: any; }) => objeto.id === parseInt(tipos[n]));
                  this.opcoesMidia[indice].detail[indicetipo].$selected = true
                }
              }
            }
          }
        }
        this.stream = resposta.stream
        if (resposta.stream) {
          let convertAgregadores = resposta.agregadores.split('/')
          this.agregadoresMarcados = convertAgregadores.map(function (elemento: string) {
            return parseInt(elemento, 10);
          });
        }
        this.etiqueta = resposta.etiqueta
        this.midiaDigital = resposta.midiaDigital
        this.produtorMusical = resposta.produtor_musical
        this.tipo_tape = resposta.tipo_tape
        this.Artista = resposta.artista
        this.notStream = resposta.notStream
        this.listaNomesService
          .buscarNomesExato(resposta.artista)
          .subscribe((resposta) => { this.artista = resposta[0].nome })
        this.listaMusicaService
          .buscarMusicaExata(resposta.numero_tape)
          .subscribe((res) => {
            for (let index = 0; index < res.length; index++) {
              this.Music.push(
                {
                  id: res[index].id,
                  musica: res[index].musica,
                  faixa: res[index].faixa,
                  genero: res[index].genero,
                  numero_tape: this.novoNumero,
                  lado: res[index].lado,
                  autor: res[index].autor,
                  acoes: ["2", "1"],
                });
            }
            this.listaMusicas = this.Music;
            this.modalTape.open();
          });
      });
  }
  async visualizar(tape: any) {
    this.tapeId = tape.id;
    this.listaMusicas = [];
    this.agregadoresMarcados = [];
    this.Music = [];
    this.Musica = [];
    await this.listaTapesService
      .carregarTape(tape.id)
      .subscribe((resposta) => {
        this.listaNomesService
          .buscarNomesExato(resposta.artista)
          .subscribe((resposta) => { this.artista = resposta[0].nome })
        this.percentualArtistico = resposta.percentual_artistico
        this.novoNumero = resposta.numero_tape
        this.titulo = resposta.titulo
        this.stream = resposta.stream
        this.notStream = resposta.notStream
        this.gravadora = resposta.gravadora
        this.etiqueta = resposta.etiqueta
        this.midiaDigital = resposta.midiaDigital
        if (resposta.stream) {
          let convertAgregadores = resposta.agregadores.split('/')
          this.agregadoresMarcados = convertAgregadores.map(function (elemento: string) {
            return parseInt(elemento, 10);
          });
        }
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
                genero: res[index].genero,
                autor: res[index].autor,
              });
          }
          this.listaMusicas = this.Music;
        });

        this.modalTapeView.open();
      })
  }

  async carregaLista() {
    this.Tapes = [];
    this.listaTapes = [];
    var status = ''
    var artista = ''
    await this.listaTapesService
      .listaTapes()
      .subscribe(async (resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          status = ''
          artista = ''
          if (resposta[index].bloqueado === 'N') {
            
           await this.listaNomesService
            .buscarNomesExato(resposta[index].artista)
            .subscribe((res) => { 
              if (resposta[index].stream) {
                status = 'on'
              } else if (resposta[index].midiaDigital) {
                status = 'digital'
              } else if (!resposta[index].stream && resposta[index].notStream) {
                status = 'not'
              } else if (!resposta[index].stream && !resposta[index].notStream && !resposta[index].midiaDigital) {
                status = 'off'
              }
              artista = res[0].nome   
              this.Tapes.push(
                {
                  id: resposta[index].id,
                  titulo: resposta[index].titulo,
                  novoNumero: resposta[index].numero_tape,
                  artista: artista,
                  status: status,
                  acoes: ["1", "2", "3", "4"]
                }
              )
            })
            
            
          }
        }
        this.listaTapes = this.Tapes;
      })
  }

  buscaTape(): void {
    if (this.Tape) {
      this.listaTapesService
        .buscarTape(this.Tape)
        .subscribe((resposta) => {
          this.Tapes = [];
          this.listaTapes = [];
          var status = ''
          for (let index = 0; index < resposta.length; index++) {
            status = ''
            if (resposta[index].bloqueado === 'N') {
              if (resposta[index].stream) {
                status = 'on'
              } else if (!resposta[index].stream && resposta[index].notStream) {
                status = 'not'
              } else if (!resposta[index].stream && !resposta[index].notStream) {
                status = 'off'
              }
              this.Tapes.push(
                {
                  id: resposta[index].id,
                  titulo: resposta[index].titulo,
                  tipo_tape: resposta[index].Tipos_de_tape.descricao,
                  novoNumero: resposta[index].numero_tape,
                  status: status,
                  acoes: ["1", "2", "3", "4"]
                }
              )
            }
          }
          this.listaTapes = this.Tapes;
        })
    }
    this.carregaLista();
  }

  confirmaTape: PoModalAction = {
    action: () => {
      if (this.altera) {
        let agregaMark = '';
        let tipomidia = '';
        for (let index = 0; index < this.agregadoresMarcados.length; index++) {
          agregaMark += this.agregadoresMarcados[index] + '/';
        }
        for (let i = 0; i < this.opcoesMidia.length; i++) {
          if (this.opcoesMidia[i].detail) {
            for (let n = 0; n < this.opcoesMidia[i].detail.length; n++) {
              if (this.opcoesMidia[i].detail[n].$selected) {
                tipomidia += this.opcoesMidia[i].detail[n].id + ',';
              }
            }
          }
          if (this.opcoesMidia[i].$selected) {
            tipomidia += this.opcoesMidia[i].value + '/';
          }
        }
        let Log = {
          descricao_log: 'Tape: "' + this.titulo + '" do ID: ' + this.tapeId + ' alterado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com Id: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.listaMusicas.push({ numero_tape: this.novoNumero })
        let tape = {
          id: this.tapeId,
          numero_tape: this.novoNumero.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
          titulo: this.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
          artista: this.Artista,
          gravadora: this.gravadora,
          etiqueta: this.etiqueta,
          stream: this.stream,
          midiaDigital: this.midiaDigital,
          notStream: this.notStream,
          produtor_musical: this.produtorMusical.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
          tipo_tape: this.tipo_tape,
          tipos_midia: tipomidia,
          agregadores: agregaMark,
        }

        let tapeAcer = {
          tape: tape,
          acervo_musical: this.listaMusicas
        }
        if (this.novoNumero != '' && this.titulo != ''
          && this.gravadora != 0 && this.etiqueta != 0 && this.produtorMusical != ''
          && this.tipo_tape != 0) {
          this.listaTapesService
            .alteraTape(tapeAcer)
            .subscribe((res) => {
              this.ListaLogService
                .criarLog(Log)
                .subscribe((res) => {
                  this.titulo = '';
                  this.tipo_tape = 0;
                  this.dataDeLancamento = undefined;
                  this.listaMusicas = [];
                  this.artista = 0;
                  this.Artista = 0;
                  this.titulo = '';
                  this.gravadora = 0;
                  this.musica = 0;
                  this.Musica = [];
                  this.poNotification.success(res.retorno);
                  this.ngOnInit();
                  this.modalTape.close();
                });
            },
              (err) => {
                this.poNotification.error(err.error.retorno);
                this.titulo = '';
                this.tipo_tape = 0;
                this.dataDeLancamento = undefined;
                this.ngOnInit();
                this.modalTape.close();
              })
        } else {
          this.poNotification.error('Algum campo está em branco');
        }
      } else {
        let agregaMark = '';
        let tipomidia = '';
        for (let index = 0; index < this.agregadoresMarcados.length; index++) {
          agregaMark += this.agregadoresMarcados[index] + '/';
        }
        for (let i = 0; i < this.opcoesMidia.length; i++) {
          if (this.opcoesMidia[i].detail) {
            for (let n = 0; n < this.opcoesMidia[i].detail.length; n++) {
              if (this.opcoesMidia[i].detail[n].$selected) {
                tipomidia += this.opcoesMidia[i].detail[n].id + ',';
              }
            }
          }
          if (this.opcoesMidia[i].$selected) {
            tipomidia += this.opcoesMidia[i].value + '/';
          }
        }
        let Log = {
          descricao_log: 'Tape: "' + this.titulo + '" incluido pelo usuario: ' + sessionStorage.getItem('usuario') + ', com Id: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        let tape = {
          numero_tape: this.novoNumero.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
          titulo: this.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
          artista: this.Artista,
          gravadora: this.gravadora,
          tipo_tape: this.tipo_tape,
          etiqueta: this.etiqueta,
          stream: this.stream,
          midiaDigital: this.midiaDigital,
          notStream: this.notStream,
          tipos_midia: tipomidia,
          produtor_musical: this.produtorMusical.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
          agregadores: agregaMark,
        }
        let tapeAcer = {
          tape: tape,
          acervo_musical: this.listaMusicas
        }
        this.listaTapesService
          .buscarTapeExato(this.novoNumero)
          .subscribe((res) => {
            if (this.novoNumero != '' && this.titulo != ''
              && this.gravadora != 0 && this.etiqueta != 0 && this.produtorMusical != ''
              && this.tipo_tape != 0) {
              this.listaTapesService
                .criarTape(tapeAcer)
                .subscribe((res) => {
                  this.ListaLogService
                    .criarLog(Log)
                    .subscribe((res) => {
                      this.titulo = '';
                      this.tipo_tape = 0;
                      this.dataDeLancamento = undefined;
                      this.listaMusicas = [];
                      this.artista = 0;
                      this.Artista = 0;
                      this.titulo = '';
                      this.gravadora = 0;
                      this.musica = 0;
                      this.Musica = [];
                      this.poNotification.success(res.retorno);
                      this.ngOnInit();
                      this.modalTape.close();
                    });
                },
                  (err) => {
                    this.poNotification.error(err.error.retorno);
                    this.titulo = '';
                    this.tipo_tape = 0;
                    this.dataDeLancamento = undefined;
                    this.ngOnInit();
                    this.modalTape.close();
                  })
            } else {
              this.poNotification.error('Preencha todos os campos do tape');
            }
          },
            (err) => {
              this.poNotification.error(err.error.retorno)
            })
      }
    },
    label: "Confirmar"
  };
  getDataEHoraAtual(): string {
    const dataEHora = new Date();
    const dia = String(dataEHora.getDate()).padStart(2, '0');
    const mes = String(dataEHora.getMonth() + 1).padStart(2, '0'); // O mês é contado a partir do zero
    const ano = dataEHora.getFullYear();
    const hora = String(dataEHora.getHours()).padStart(2, '0');
    const minutos = String(dataEHora.getMinutes()).padStart(2, '0');
    const segundos = String(dataEHora.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
  }

  cancelarTape: PoModalAction = {
    action: () => {
      this.listaMusicas = [];
      this.artista = 0;
      this.Artista = 0;
      this.titulo = '';
      this.gravadora = 0;
      this.musica = 0;
      this.Musica = [];
      this.etiqueta = 0;
      this.genero = '';
      this.produtorMusical = '';
      this.tipo_tape = 0;
      this.listaMusicas = [];
      this.dataDeLancamento = undefined;
      this.stream = false;
      this.opcoesMidia = [];
      this.notStream = false;
      this.midiaDigital = false;
      this.agregadoresMarcados = [];
      this.observacao = '';
      this.smi = '';
      this.prateleira = '';
      this.descricao = '';
      this.midia = '';
      this.buscaMidia();
      this.modalTape.close();
      this.altera = false;
    },
    label: "Cancelar"
  };

  generateQRCode(text: string): void {
    const qr = qrcode(0, 'L'); // Cria um objeto QR Code, 'L' é a correção de erro mínima
    qr.addData(text); // Adiciona o texto que você deseja codificar
    qr.make(); // Gera o QR Code

    const qrCodeDataUrl = qr.createDataURL(4); // Gera uma URL de dados (data URL) para o QR Code
    this.qrCodeImage = qrCodeDataUrl;
  }

  async abrirQRCode() {
    const tapeID = this.tapeId
    let texto = 'http://192.168.2.15:4200/lista-tapes/';
    const url = `${texto}${tapeID}`;
    this.generateQRCode(url);
    this.modalQRCode.open();
  }

  confirmaQRCode: PoModalAction = {
    action: () => {
      this.printElement();
    },
    label: "Imprimir"
  };

  printElement(): void {
    const elementToPrint = document.getElementById('elementToPrint');
    if (elementToPrint) {
      const newWin = window.open('', '_blank');
      if (newWin) {
        newWin.document.write('<html><body>');
        newWin.document.write('<style>img { width: 11%; display: block; maartistain: 0 auto; } .tape{ margin-left: 4%}</style>'); // Estilos para a imagem
        newWin.document.write('<div class="qrcode-container">'); // Container para centralizar a imagem
        newWin.document.write(elementToPrint.innerHTML); // Inclui o conteúdo do elemento para impressão
        newWin.document.write('<h4 class="tape">' + this.novoNumero + '</h4>');
        newWin.document.write('</div>');
        newWin.document.write('</body></html>');
        newWin.document.close();
        newWin.print();
        newWin.close();
      } else {
        console.error('Não foi possível abrir a nova janela de impressão.');
      }
    } else {
      console.error('Elemento para impressão não encontrado.');
    }
  }

  Exportacao() {
    this.modalExport.open();
  }
  confirmaMusica: PoModalAction = {
    action: () => {
      if (!this.musicaAltera) {
        this.listaMusicas.push({
          faixa: this.faixa,
          lado: this.lado.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
          musica: this.nome_musica.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
          genero: this.genero.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
          autor: this.autor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
          numero_tape: this.novoNumero,
          acoes: ['1']
        });
        if (confirm("Deseja Incluir outra Musica?")) {
          this.faixa = '';
          this.lado = '';
          this.nome_musica = '';
          this.genero = '';
          this.autor = '';
        } else {
          this.modalMusica.close();
          this.faixa = '';
          this.lado = '';
          this.genero = '';
          this.nome_musica = '';
          this.autor = '';
        }
      } else {
        for (let index = 0; index < this.listaMusicas.length; index++) {
          if (this.idMusica === this.listaMusicas[index].id) {
            this.listaMusicas.splice(index, 1);
            break;
          }
        }
        this.listaMusicas.push({
          id: this.idMusica,
          faixa: this.faixa,
          lado: this.lado,
          musica: this.nome_musica,
          genero: this.genero,
          autor: this.autor,
          numero_tape: this.novoNumero,
          acoes: ['2', '1']
        });
        this.idMusica = 0
        this.faixa = '';
        this.lado = '';
        this.genero = '';
        this.nome_musica = '';
        this.autor = '';
        this.modalMusica.close();


      }
    },
    label: "Confirmar"
  };
  cancelarMusica: PoModalAction = {
    action: () => {
      this.idMusica = 0;
      this.faixa = '';
      this.lado = '';
      this.genero = '';
      this.nome_musica = '';
      this.autor = '';
      this.modalMusica.close();

    },
    label: "Cancelar"
  };

  confirmaExportacao: PoModalAction = {
    action: () => {
      this.exportacao
        .exportData(this.tipoExport, this.listaTapes, this.colunas
        );
    },
    label: "Confirma"
  };

}
