import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ListaDeTapesService } from './tapes.service';
import { Exportacao } from '../exportacao/exportacao.service';
import * as qrcode from 'qrcode-generator';
import { ListaDeArtistasService } from '../artistas/artistas.service';
import { ListaDeGravadorasService } from '../gravadoras/gravadoras.service';
import { ListaDeEtiquetasService } from '../etiquetas/etiquetas.service';
import { ListaDeTiposDeTapesService } from '../tipos-de-tapes/tipos-de-tapes.service';
import { PoGridModule } from '@po-ui/ng-components';
import { ListaDeLogService } from '../log/log.service';
import { ListaDeMusicaService } from '../musicas/musicas.service';
import { ListaDeAcervoMusicalService } from '../acervo-musical/acervo-musical.service';

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
    private listaArtistaService: ListaDeArtistasService,
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
  nome_artista!: string;
  nome_etiqueta!: string;
  nome_gravadora!: string;
  nome_tpTape!: string;
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
  artista!: number;
  altera: boolean = false;
  stream: boolean | undefined;
  percentualArtistico!: number;
  novoNumero!: string;
  titulo!: string;
  Artista: Array<any> = new Array();
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

  ngOnInit(): void {
    this.tapesArtista();
    this.tapesGravadora();
    this.tapesEtiqueta();
    this.tapesTipo_tape();
    this.carregaLista();
  }
  public readonly auditOptions: Array<any> = [
    { value: '1', label: 'Functional menu' },
    { value: '2', label: 'Online panel' },
    { value: '3', label: 'Internet browser' },
    { value: '4', label: 'Browser details' },
    { value: '5', label: 'Transparent panel' },
    { value: '6', label: 'Browser refresh' }
  ];

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "10%" },
    { property: "titulo", label: "Titulo", width: "45%" },
    { property: "tipo_tape", label: "Tipo do tape", width: "20%" },
    { property: "data_lancamento", type: "Date", label: "Data de lançamento", width: "15%" },
    { property: "novoNumero", label: "Novo numero", width: "15%" },
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
      action: this.visualizar.bind(this),
      icon: "po-icon po-icon-eye",
      value: "2",
    });
    if (sessionStorage.getItem('laltera_tapes') === 'true') {
      this.acoes.push({
        action: this.Alterar.bind(this),
        icon: "po-icon po-icon-edit",
        value: "1",
      });
    }
    if (sessionStorage.getItem('lexclui_tapes') === 'true') {
      this.acoes.push({
        action: this.excluir.bind(this),
        icon: "po-icon po-icon-delete",
        value: "3"
      });
    }
    return this.acoes;
  }
  public readonly columns: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "10%" },
    { property: "musica", label: "Musica", width: "80%" },
    { property: "album", label: "Album", width: "20%" },
    { property: "ano", label: "Ano", width: "20%" },
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
    });
    return this.acoesMusica;
  }

  tapesArtista() {
    this.Artista = [];
    this.listaArtistaService
      .listaArtista()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.Artista.push(
              {
                label: resposta[index].nome_civil,
                value: resposta[index].id,
              }
            )
          }
        }
      })
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

  async buscaMusica() {
    let music: any[] = [];
    if (this.musica) {
      this.listaMusicaService
        .buscarMusica(this.musica)
        .subscribe((resposta) => {
          for (let index = 0; index < resposta.length; index++) {
            if (resposta[index].bloqueado === 'N') {
               music.push(
                {
                  label: resposta[index].musica,
                  value: resposta[index].id,
                }
              )
            }
            this.Musica = music
          }
        });
      }
  }
  criarTape() {
    this.listaMusicas = [];
    this.musica = 0;
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



  Alterar(tape: any) {
    this.tapeId = tape.id;
    this.listaMusicas = [];
    this.Music = [];
    this.listaTapesService
      .carregarTape(tape.id)
      .subscribe((resposta) => {
        let data = new Date(resposta.data_lancamento.toString())
        this.percentualArtistico = resposta.percentual_artistico
        this.novoNumero = resposta.novo_numero
        this.titulo = resposta.titulo
        this.artista = resposta.artista
        this.gravadora = resposta.gravadora
        this.stream = resposta.stream
        this.etiqueta = resposta.etiqueta
        this.produtorMusical = resposta.produtor_musical
        this.tipo_tape = resposta.tipo_tape
        this.dataDeLancamento = new Date(data.setDate(data.getDate() + 1));
        this.observacao = resposta.observacao
        this.smi = resposta.smi
        this.prateleira = resposta.prateleira
        this.descricao = resposta.descricao
        this.ListaAcervoMusicalService
          .carregarAcervoMusical(tape.id)
          .subscribe((resposta) => {
            this.acervoId = resposta[0].id
            for (let index = 0; index < resposta.length; index++) {
              if (resposta[index].bloqueado === 'N') {
                this.listaMusicaService.buscarMusica(resposta[index].id_musica).subscribe((resposta) => {
                  this.Music.push(
                    {
                      id: resposta[0].id,
                      musica: resposta[0].musica,
                      album: resposta[0].album,
                      ano: resposta[0].ano,
                      acoes: ['1']

                    }
                  );
                });
              }
              this.listaMusicas = this.Music
            }
          });
        this.altera = true;
        this.modalTape.open();
      });
  }
  visualizar(tape: any) {
    this.tapeId = tape.id;
    this.listaMusicas = [];
    this.Music = [];
    this.listaTapesService
      .carregarTape(tape.id)
      .subscribe((resposta) => {
        let data = new Date(resposta.data_lancamento.toString())
        this.percentualArtistico = resposta.percentual_artistico
        this.novoNumero = resposta.novo_numero
        this.titulo = resposta.titulo
        this.artista = resposta.artista
        this.stream = resposta.stream
        this.gravadora = resposta.gravadora
        this.etiqueta = resposta.etiqueta
        this.produtorMusical = resposta.produtor_musical
        this.tipo_tape = resposta.tipo_tape
        this.dataDeLancamento = new Date(data.setDate(data.getDate() + 1));
        this.observacao = resposta.observacao
        this.smi = resposta.smi
        this.prateleira = resposta.prateleira
        this.descricao = resposta.descricao
        this.ListaAcervoMusicalService
          .carregarAcervoMusical(tape.id)
          .subscribe((resposta) => {
            for (let index = 0; index < resposta.length; index++) {
              if (resposta[index].bloqueado === 'N') {
                this.listaMusicaService.buscarMusica(resposta[index].id_musica).subscribe((resposta) => {
                  this.Music.push(
                    {
                      id: resposta[0].id,
                      musica: resposta[0].musica,
                      album: resposta[0].album,
                      ano: resposta[0].ano,
                      acoes: ['1']

                    }
                  );
                });
              }
              this.listaMusicas = this.Music
            }
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
        console.log(resposta)
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            let data = new Date(resposta[index].data_lancamento.toString())
            this.Tapes.push(
              {
                id: resposta[index].id,
                titulo: resposta[index].titulo,
                tipo_tape: resposta[index].Tipos_de_tape.descricao,
                data_lancamento: new Date(data.setDate(data.getDate() + 1)),
                novoNumero: resposta[index].novo_numero,
                percentualArtistico: resposta[index].percentual_artistico,
                observacao: resposta[index].observacao,
                smi: resposta[index].smi,
                prateleira: resposta[index].prateleira,
                descricao: resposta[index].descricao,
                acoes: ["1", "2", "3"]
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
              let data = new Date(resposta[index].data_lancamento.toString())
              this.Tapes.push(
                {
                  id: resposta[index].id,
                  titulo: resposta[index].titulo,
                  tipo_tape: resposta[index].Tipos_de_tape.descricao,
                  data_lancamento: new Date(data.setDate(data.getDate() + 1)),
                  novoNumero: resposta[index].novo_numero,
                  percentualArtistico: resposta[index].percentual_artistico,
                  observacao: resposta[index].observacao,
                  smi: resposta[index].smi,
                  prateleira: resposta[index].prateleira,
                  descricao: resposta[index].descricao,
                  acoes: ["1", "2", "3"]
                }
              )
            }
          }
          this.listaTapes = this.Tapes;
        })
    }
    this.carregaLista();
  }
  async ConfirmaMusica() {
    if (this.musica != 0) {
      await this.listaMusicaService
        .buscarMusica(this.musica)
        .subscribe((resposta) => {
          let retorno
          for (let index = 0; index < this.music.length; index++) {
            if (this.music[index].id === resposta[0].id) {
              retorno = 'ja existe essa musica vinculada ao tape';
            }
          }
          if (!retorno || retorno.length === 0) {
            this.music.push(
              {
                id: resposta[0].id,
                musica: resposta[0].musica,
                album: resposta[0].album,
                ano: resposta[0].ano,
                acoes: ['1'],

              });
          } else {
            this.poNotification.information(retorno)
          }
          this.listaMusicas = this.music
        }
        );
    } else {
      this.poNotification.error('preencha a musica para inserir na tabela');
    }
  }
  confirmaTape: PoModalAction = {
    action: () => {
      if (this.altera) {
        let Log = {
          descricao_log: 'Tape: "' + this.titulo + '" do ID: ' + this.tapeId + ' alterado pelo usuario: ' + sessionStorage.getItem('usuario') + ', com Id: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        let tape = {
          id: this.tapeId,
          percentual_artistico: this.percentualArtistico,
          novo_numero: this.novoNumero,
          titulo: this.titulo,
          artista: this.artista,
          gravadora: this.gravadora,
          etiqueta: this.etiqueta,
          stream: this.stream,
          produtor_musical: this.produtorMusical,
          tipo_tape: this.tipo_tape,
          data_lancamento: this.dataDeLancamento,
          observacao: this.observacao,
          smi: this.smi,
          prateleira: this.prateleira,
          descricao: this.descricao,
        }

        let tapeAcer = {
          tape: tape,
          acervo_musical: this.Music
        }
        if (this.percentualArtistico != 0 && this.novoNumero != '' && this.titulo != ''
          && this.artista != 0 && this.gravadora != 0 && this.etiqueta != 0 && this.produtorMusical != ''
          && this.tipo_tape != 0 && this.dataDeLancamento != undefined && this.observacao != ''
          && this.smi != '' && this.prateleira != '' && this.descricao != '') {
          this.listaTapesService
            .alteraTape(tapeAcer)
            .subscribe((res) => {
              this.ListaLogService
                .criarLog(Log)
                .subscribe((res) => {
                  this.ngOnInit();
                  this.modalTape.close();
                });
              this.poNotification.success(res.retorno);
              this.titulo = '';
              this.tipo_tape = 0;
              this.dataDeLancamento = undefined;
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
        let Log = {
          descricao_log: 'Tape: "' + this.titulo + '" incluido pelo usuario: ' + sessionStorage.getItem('usuario') + ', com Id: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        let tape = {
          percentual_artistico: this.percentualArtistico,
          novo_numero: this.novoNumero,
          titulo: this.titulo,
          artista: this.artista,
          gravadora: this.gravadora,
          etiqueta: this.etiqueta,
          stream: this.stream,
          produtor_musical: this.produtorMusical,
          tipo_tape: this.tipo_tape,
          data_lancamento: this.dataDeLancamento,
          observacao: this.observacao,
          smi: this.smi,
          prateleira: this.prateleira,
          descricao: this.descricao,
        }
        let tapeAcer = {
          tape: tape,
          acervo_musical: this.music
        }
        if (this.percentualArtistico != 0 && this.novoNumero != '' && this.titulo != ''
          && this.artista != 0 && this.gravadora != 0 && this.etiqueta != 0 && this.produtorMusical != ''
          && this.tipo_tape != 0 && this.dataDeLancamento != undefined && this.observacao != ''
          && this.smi != '' && this.prateleira != '' && this.descricao != '') {
          this.listaTapesService
            .criarTape(tapeAcer)
            .subscribe((res) => {
              this.ListaLogService
                .criarLog(Log)
                .subscribe((res) => {
                  this.ngOnInit();
                  this.modalTape.close();
                });
              this.poNotification.success(res.retorno);
              this.titulo = '';
              this.tipo_tape = 0;
              this.dataDeLancamento = undefined;
              this.listaMusicas = [];
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
    await this.listaArtistaService
      .buscarArtista(this.artista)
      .subscribe(resposta => {
        this.nome_artista = resposta[0].nome_civil
        //
        this.listaEtiquetasService
          .buscarEtiqueta(this.etiqueta)
          .subscribe(resposta => {
            this.nome_etiqueta = resposta[0].nome_etiqueta
            //
            this.listaGravadorasService
              .buscarGravadora(this.gravadora)
              .subscribe(resposta => {
                this.nome_gravadora = resposta[0].nome_gravadora
                //
                this.listaTiposDeTapesService
                  .buscarTiposDeTapes(this.tipo_tape)
                  .subscribe(resposta => {
                    this.nome_tpTape = resposta[0].descricao
                    let texto = `
                    Titulo: ${this.titulo}
                    Produtor musical: ${this.produtorMusical}
                    Artista: ${this.nome_artista}
                    Gravadora: ${this.nome_gravadora}
                    Etiqueta: ${this.nome_etiqueta}
                    Produtor Musical: ${this.produtorMusical}
                    Tipo de Tape: ${this.nome_tpTape}
                    Smi: ${this.smi}
                    Prateleira: ${this.prateleira}
                    Descricao: ${this.descricao}
                    Data de Lancamento: ${this.dataDeLancamento}
                    Observacao : ${this.observacao}
                    `;
                    this.generateQRCode(texto);
                    this.modalQRCode.open();
                  }, (error => {
                    this.poNotification.error(error)
                  }));
              }, (error => {
                this.poNotification.error(error)
              }));
          }, (error => {
            this.poNotification.error(error)
          }));
      }, (error => {
        this.poNotification.error(error)
      }));
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
        newWin.document.write('<style>img { width: 80%; display: block; maartistain: 0 auto; }</style>'); // Estilos para a imagem
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

  confirmaExportacao: PoModalAction = {
    action: () => {
      this.exportacao
        .exportData(this.tipoExport, this.listaTapes, this.colunas
        );
    },
    label: "Confirma"
  };

}
