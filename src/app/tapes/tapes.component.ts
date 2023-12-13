import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
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


  constructor(
    private poNotification: PoNotificationService,
    private listaTapesService: ListaDeTapesService,
    private listaNomesService: ListaDeNomesService,
    private listaGravadorasService: ListaDeGravadorasService,
    private listaEtiquetasService: ListaDeEtiquetasService,
    private listaTiposDeTapesService: ListaDeTiposDeTapesService,
    private listaMusicaService: ListaDeMusicaService,
    private ListaAcervoMusicalService: ListaDeAcervoMusicalService,
    private ListaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }

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


  @ViewChild("modalTape", { static: true }) modalTape!: PoModalComponent;
  @ViewChild("modalTapeView", { static: true }) modalTapeView!: PoModalComponent;
  @ViewChild("modalQRCode", { static: true }) modalQRCode!: PoModalComponent;
  @ViewChild('qrcodeImage', { static: false }) qrcodeImage!: ElementRef;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;
  @ViewChild('modalExibeTape', { static: true }) modalExibeTape!: PoModalComponent;
  @ViewChild('modalMusica', { static: true }) modalMusica!: PoModalComponent;

  ngOnInit(): void {
    this.tapesGravadora();
    this.tapesEtiqueta();
    this.tapesTipo_tape();
    this.carregaLista();
  }
  public readonly auditOptions: Array<any> = [
    { value: '1', label: 'Tape 1/4' },
    { value: '2', label: 'Tape 1' },
    { value: '3', label: 'Tape 1/2' },
    { value: '4', label: 'Tape 2' },
    { value: '5', label: 'DAT' },
    { value: '6', label: 'Vinil' },
    { value: '7', label: 'CD' },
    { value: '8', label: 'DVD' },
    { value: '9', label: 'Outros' },
  ];
  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "10%" },
    { property: "titulo", label: "Titulo", width: "45%" },
    { property: "novoNumero", label: "Numero tape", width: "20%" },
    { property: "tipo_tape", label: "Tipo do tape", width: "20%" },

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

  icones(): Array<any> {
    this.acoesMusica.push({
      action: this.excluirMusica.bind(this),
      icon: "po-icon po-icon-delete",
      value: "1",
      tooltip: "excluir",
    });
    return this.acoesMusica;
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
  // async getMusica(event: any): Promise<void> {
  //   this.listaTapesService.getArtista(event)
  // }
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
    this.titulo = '';
    this.novoNumero = '';
    this.gravadora = 0;
    this.etiqueta = 0;
    this.percentualArtistico = 0;
    this.produtorMusical = '';
    this.tipo_tape = 0;
    this.dataDeLancamento = undefined;
    this.stream = false;
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

        this.modalExibeTape.open();
      })
  }
  async IncluirMusica() {
    this.modalMusica.open();
  }
  async Alterar(tape: any) {
    this.tapeId = tape.id;
    this.listaMusicas = [];
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
        this.tiposMidia = resposta.tipos_midia.split('/')
        this.stream = resposta.stream
        this.etiqueta = resposta.etiqueta
        this.produtorMusical = resposta.produtor_musical
        this.tipo_tape = resposta.tipo_tape
        this.Artista = resposta.artista
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
                  numero_tape: this.novoNumero,
                  lado: res[index].lado,
                  autor: res[index].autor,
                  acoes: ["1"],
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
    await this.listaTapesService
      .listaTapes()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.Tapes.push(
              {
                id: resposta[index].id,
                titulo: resposta[index].titulo,
                tipo_tape: resposta[index].Tipos_de_tape.descricao,
                novoNumero: resposta[index].numero_tape,
                acoes: ["1", "2", "3", "4"]
              }
            )
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
          for (let index = 0; index < resposta.length; index++) {
            if (resposta[index].bloqueado === 'N') {
              this.Tapes.push(
                {
                  id: resposta[index].id,
                  titulo: resposta[index].titulo,
                  tipo_tape: resposta[index].Tipos_de_tape.descricao,
                  novoNumero: resposta[index].numero_tape,
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
        let TpMedia = '';
        for (let index = 0; index < this.tiposMidia.length; index++) {
          TpMedia += this.tiposMidia[index] + '/';
        }
        let Log = {
          descricao_log: 'Tape: "' + this.titulo + '" do ID: ' + this.tapeId + ' alterado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com Id: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        let tape = {
          id: this.tapeId,
          numero_tape: this.novoNumero,
          titulo: this.titulo,
          artista: this.Artista,
          gravadora: this.gravadora,
          etiqueta: this.etiqueta,
          stream: this.stream,
          produtor_musical: this.produtorMusical,
          tipo_tape: this.tipo_tape,
          tipos_midia: TpMedia,
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
        let TpMedia = '';
        for (let index = 0; index < this.tiposMidia.length; index++) {
          TpMedia += this.tiposMidia[index] + '/';
        }
        let Log = {
          descricao_log: 'Tape: "' + this.titulo + '" incluido pelo usuario: ' + sessionStorage.getItem('usuario') + ', com Id: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        let tape = {
          numero_tape: this.novoNumero,
          titulo: this.titulo,
          artista: this.Artista,
          gravadora: this.gravadora,
          tipo_tape: this.tipo_tape,
          etiqueta: this.etiqueta,
          stream: this.stream,
          produtor_musical: this.produtorMusical,
          tipos_midia: TpMedia,
        }
        let tapeAcer = {
          tape: tape,
          acervo_musical: this.listaMusicas
        }
        this.listaTapesService
        .buscarTapeExato(this.novoNumero)
        .subscribe((res) => {
          if ( this.novoNumero != '' && this.titulo != ''
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
      this.produtorMusical = '';
      this.tipo_tape = 0;
      this.dataDeLancamento = undefined;
      this.observacao = '';
      this.smi = '';
      this.prateleira = '';
      this.descricao = '';
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
    let texto = 'http://192.168.0.15:4200/lista-tapes/';
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
        newWin.document.write('<style>img { width: 20%; display: block; maartistain: 0 auto; }</style>'); // Estilos para a imagem
        newWin.document.write('<div class="qrcode-container">'); // Container para centralizar a imagem
        newWin.document.write(elementToPrint.innerHTML); // Inclui o conteúdo do elemento para impressão
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
      this.listaMusicas.push({
        faixa: this.faixa,
        lado: this.lado,
        musica: this.nome_musica,
        autor: this.autor,
        numero_tape: this.novoNumero,
      });
      if (confirm("Deseja Incluir outra Musica?")) {
        this.faixa = '';
        this.lado = '';
        this.nome_musica = '';
        this.autor = '';
      } else {
        this.modalMusica.close();
        this.faixa = '';
        this.lado = '';
        this.nome_musica = '';
        this.autor = '';
      }

    },
    label: "Confirmar"
  };
  cancelarMusica: PoModalAction = {
    action: () => {
      this.modalMusica.close();
      this.faixa = '';
      this.lado = '';
      this.nome_musica = '';
      this.autor = '';
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
