import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { ListaDeMusicaService } from './musicas.service';
import { Exportacao } from '../exportacao/exportacao.service';
import { ListaDeEditorasService } from '../editoras/editoras.service';
import { ListaDeLogService } from '../log/log.service';
import { ListaDeTapesService } from '../tapes/tapes.service';
import { ListaDeNomesService } from '../nomes/nomes.service';
import { ListaDeGravadorasService } from '../gravadoras/gravadoras.service';
import { ListaDeEtiquetasService } from '../etiquetas/etiquetas.service';
import { ListaDeTiposDeTapesService } from '../tipos-de-tapes/tipos-de-tapes.service';
@Component({
  selector: 'app-musicas',
  templateUrl: './musicas.component.html',
  styleUrls: ['./musicas.component.css']
})
export class MusicaComponent {


  constructor(
    private poNotification: PoNotificationService,
    private listaTapesService: ListaDeTapesService,
    private listaNomesService: ListaDeNomesService,
    private listaGravadorasService: ListaDeGravadorasService,
    private listaEtiquetasService: ListaDeEtiquetasService,
    private listaTiposDeTapesService: ListaDeTiposDeTapesService,
    private listaMusicasService: ListaDeMusicaService,
    private listaLogService: ListaDeLogService,
    private exportacao: Exportacao,
    private router: Router
  ) { }

  subiu: string = '';
  midia: string = '';
  tapeId: string = '';
  titulo: string = '';
  artista: string = '';
  gravadoraName: string = '';
  etiquetaName: string = '';
  produtorMusical: string = '';
  qrCodeImage: string = '';
  faixa: string = '';
  lado: string = '';
  numeroTape: string = '';
  genero: string = '';
  tipoExport: string = '';
  tipoCliente!: string;
  imprimeMusica: Array<any> = new Array();
  Editora: Array<any> = new Array();
  Musicas: Array<any> = new Array();
  acoes: Array<any> = new Array();
  criar = sessionStorage.getItem('lcria_musica');
  musica: object | undefined;
  listaMusicas: Array<any> = new Array();
  Musica: any;
  musicaId!: number;
  visuMusica!: number;
  altera: boolean = false;
  nome!: string;
  responsavel!: string;
  cpfCnpj!: string;
  rg!: string;
  nomeMusica!: string;
  autor!: string;
  ano!: Date | undefined;
  categoria!: string;
  editora!: Number;



  @ViewChild("modalMusica", { static: true }) modalMusica!: PoModalComponent;
  @ViewChild("modalMusicaView", { static: true }) modalMusicaView!: PoModalComponent;
  @ViewChild('modalExport', { static: true }) modalExport!: PoModalComponent;
  @ViewChild('modalExibeTape', { static: true }) modalExibeTape!: PoModalComponent;
  @ViewChild("modalQRCode", { static: true }) modalQRCode!: PoModalComponent;

  ngOnInit(): void {
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
    { property: "faixa", label: "Faixa", width: "5%" },
    { property: "lado", label: "Lado", width: "5%" },
    { property: "musica", label: "Musica", width: "30%" },
    { property: "genero", label: "Genero", width: "30%" },
    { property: "autor", label: "Autor", width: "30%" },
    { property: "numeroTape", label: "Numero tape", width: "10%" },
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
    });
    if (sessionStorage.getItem('laltera_musica') === 'true') {
      this.acoes.push({
        action: this.Alterar.bind(this),
        icon: "po-icon po-icon-edit",
        value: "1",
      });
    }
    if (sessionStorage.getItem('lexclui_musica') === 'true') {
      this.acoes.push({
        action: this.excluir.bind(this),
        icon: "po-icon po-icon-delete",
        value: "3"
      });
    }
    return this.acoes;
  }

  criarMusica() {
    this.nomeMusica = '';
    this.autor = '';
    this.faixa = '';
    this.genero = '';
    this.lado = '';
    this.numeroTape = '';
    this.modalMusica.open();
  }



  excluir(Musica: any) {
    if (confirm("Deseja excluir o musica?")) {
      let Log = {
        descricao_log: 'Gravadora: ' + Musica.id + ' alterar pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
        data_log: this.getDataEHoraAtual(),
      }
      this.listaMusicasService
        .excluirMusica(Musica.id)
        .subscribe((res) => {
          this.listaLogService
            .criarLog(Log)
            .subscribe((res) => {
              this.ngOnInit();
            })
          this.poNotification.success(res.retorno);
        },
          (err) => {
            console.log(err);
            this.poNotification.error(err.error.retorno);
            this.ngOnInit();
          })
    }
  }
  getDataEHoraAtual(): string {
    const dataEHora = new Date();
    const dia = String(dataEHora.getDate()).padStart(2, '0');
    const mes = String(dataEHora.getMonth() + 1).padStart(2, '0');
    const ano = dataEHora.getFullYear();
    const hora = String(dataEHora.getHours()).padStart(2, '0');
    const minutos = String(dataEHora.getMinutes()).padStart(2, '0');
    const segundos = String(dataEHora.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;

  }
  async Imprimir(musica: any) {
    this.imprimeMusica = [];
    await this.listaTapesService
      .buscarTapeExato1(musica.numeroTape)
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
        this.tapeId = resposta.id
        this.titulo = resposta.titulo
        this.produtorMusical = resposta.produtor_musical
        this.numeroTape = resposta.numero_tape
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
        this.listaMusicasService.buscarMusicaExata(resposta.numero_tape).subscribe((res) => {
          for (let index = 0; index < res.length; index++) {
            this.imprimeMusica.push(
              {
                id: res[index].id,
                musica: res[index].musica,
                faixa: res[index].faixa,
                lado: res[index].lado,
                autor: res[index].autor,
                acoes: ["1"]
              });
          }
          this.imprimeMusica;
          for (let i = 1; i < dadosSelecionados.length; i++) {
            this.midia += dadosSelecionados[i].label + ' - '
          }
        });

        this.modalExibeTape.open();
      },
        (err) => {
          this.poNotification.error(err.error.retorno)
        });


  }
  Alterar(visuMusica: any) {
    this.musicaId = visuMusica.id;
    this.listaMusicasService
      .carregarMusica(visuMusica.id)
      .subscribe((resposta) => {
        this.faixa = resposta.faixa
        this.lado = resposta.lado
        this.numeroTape = resposta.numero_tape
        this.nomeMusica = resposta.musica
        this.genero = resposta.genero
        this.autor = resposta.autor
        this.altera = true;
        this.modalMusica.open();
      })
  }

  visualizar(visuMusica: any) {
    this.musicaId = visuMusica.id;
    this.listaMusicasService
      .carregarMusica(visuMusica.id)
      .subscribe((resposta) => {
        this.faixa = resposta.faixa
        this.lado = resposta.lado
        this.genero = resposta.genero
        this.numeroTape = resposta.numero_tape
        this.nomeMusica = resposta.musica
        this.autor = resposta.autor

        this.modalMusicaView.open();
      })
  }
  async carregaLista() {
    this.Musicas = [];
    await this.listaMusicasService
      .listarMusica()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          if (resposta[index].bloqueado === 'N') {
            this.Musicas.push(
              {
                id: resposta[index].id,
                faixa: resposta[index].faixa,
                lado: resposta[index].lado,
                musica: resposta[index].musica,
                genero: resposta[index].genero,
                autor: resposta[index].autor,
                numeroTape: resposta[index].numero_tape,
                acoes: ["1", "2", "3", "4"]
              }
            )
          }
        }
        this.listaMusicas = this.Musicas;
      })
  }

  buscaMusica(): void {
    if (this.Musica) {
      this.listaMusicasService
        .buscarMusica(this.Musica)
        .subscribe((resposta) => {
          this.Musicas = [];
          this.listaMusicas = [];
          for (let index = 0; index < resposta.length; index++) {
            if (resposta[index].bloqueado === 'N') {
              this.Musicas.push(
                {
                  id: resposta[index].id,
                  faixa: resposta[index].faixa,
                  lado: resposta[index].lado,
                  musica: resposta[index].musica,
                  autor: resposta[index].autor,
                  numeroTape: resposta[index].numero_tape,
                  acoes: ["1", "2", "3", "4"]
                }
              )
            }
          }
          this.listaMusicas = this.Musicas;
        })
    }
    this.carregaLista();
  }

  confirmaMusica: PoModalAction = {
    action: () => {
      if (this.altera) {
        let Log = {
          descricao_log: 'Musica com ID: ' + this.musicaId + ' alterar pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.musica = {
          id: this.musicaId,
          musica: this.nomeMusica,
          autor: this.autor,
          genero: this.genero,
          faixa: this.faixa,
          lado: this.lado,
          numero_tape: this.numeroTape,
        }
        this.listaMusicasService
          .alteraMusica(this.musica)
          .subscribe(
            (res) => {
              this.listaLogService
                .criarLog(Log)
                .subscribe((res) => {
                  this.ngOnInit();
                  this.altera = false;
                  this.modalMusica.close();
                })
              this.poNotification.success(res.retorno);
            },
            (err) => {
              this.poNotification.error(err.error.retorno);
              this.altera = false;
              this.ngOnInit();
              this.modalMusica.close();
            })
      } else {
        let Log = {
          descricao_log: 'Musica: ' + this.nomeMusica + ' criada pelo usuario: ' + sessionStorage.getItem('usuario') + ', com ID: ' + sessionStorage.getItem('id'),
          data_log: this.getDataEHoraAtual(),
        }
        this.musica = {
          musica: this.nomeMusica,
          autor: this.autor,
          faixa: this.faixa,
          genero: this.genero,
          lado: this.lado,
          numero_tape: this.numeroTape,
        }
        if (this.nomeMusica != '' && this.numeroTape != ' ') {
          this.listaMusicasService
            .criarMusica(this.musica)
            .subscribe(
              (res) => {
                this.listaLogService
                  .criarLog(Log)
                  .subscribe((res) => {
                    this.ngOnInit();
                    this.modalMusica.close();
                  })
                this.poNotification.success(res.retorno);
              },
              (err) => {
                this.poNotification.error(err.error.retorno);
                this.ngOnInit();
                this.modalMusica.close();
              })

        } else {
          this.poNotification.error('Insira o nome do musica');
        }
      }
    },
    label: "Confirmar"
  };
  cancelarMusica: PoModalAction = {
    action: () => {
      this.nomeMusica = '';
      this.autor = '';
      this.ano = undefined;
      this.categoria = '';
      this.editora = 0;
      this.modalMusica.close();
      this.altera = false;
    },
    label: "Cancelar"
  };

  Exportacao() {
    this.modalExport.open();
  }

  confirmaExportacao: PoModalAction = {
    action: () => {
      this.exportacao
        .exportData(this.tipoExport, this.listaMusicas, this.colunas
        );
    },
    label: "Confirma"
  };



}
